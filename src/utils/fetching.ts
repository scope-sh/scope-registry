import { AlchemyChain, alchemy } from 'evm-providers';
import ky, { KyInstance } from 'ky';
import { Address, Hex, PublicClient, createPublicClient, http } from 'viem';

import erc20Abi from '@/abi/erc20.js';
import { SourceInfo } from '@/labels/base.js';

import {
  ARBITRUM,
  BASE,
  ETHEREUM,
  getChainData,
  OPTIMISM,
  POLYGON,
} from './chains.js';
import type { ChainId } from './chains.js';
import { type Log } from './db.js';
import {
  getMetadata as getSourceMetadata,
  updateLogBlock as updateSourceMetadataBlock,
} from './source.js';
import { getObject, putObject } from './storage.js';

const alchemyKey = process.env.ALCHEMY_KEY as string;

interface LogCacheMetadata {
  count: number;
  lastBlock: number;
}

interface Erc20Metadata {
  name: string | null;
  symbol: string | null;
}

type BlockFieldSelection = 'number' | 'timestamp';
type TransactionFieldSelection =
  | 'block_number'
  | 'transaction_index'
  | 'hash'
  | 'from'
  | 'to'
  | 'input'
  | 'value'
  | 'gas_price'
  | 'status';
type LogFieldSelection =
  | 'log_index'
  | 'transaction_hash'
  | 'block_number'
  | 'address'
  | 'data'
  | 'topic0'
  | 'topic1'
  | 'topic2'
  | 'topic3';

interface Query {
  from_block?: number;
  to_block?: number;
  logs?: {
    address?: Address[];
    topics?: Hex[][];
  }[];
  transactions?: {
    from?: Address[];
    to?: Address[];
  }[];
  max_num_transactions?: number;
  max_num_logs?: number;
  field_selection: {
    block?: BlockFieldSelection[];
    transaction?: TransactionFieldSelection[];
    log?: LogFieldSelection[];
  };
}

interface QueryResponse {
  data: {
    blocks?: QueryBlock[];
    transactions?: QueryTransaction[];
    logs?: QueryLog[];
  }[];
  next_block?: number;
  prev_block?: number;
  archive_height: number;
}

interface QueryBlock {
  number: number;
  timestamp: Hex;
}

interface QueryTransaction {
  block_number: number;
  from: Address;
  gas_price: Hex;
  hash: Hex;
  input: Hex;
  to: Hex | null;
  transaction_index: number;
  value: Hex;
  status: 1;
}

interface QueryLog {
  log_index: number;
  transaction_hash: Hex;
  block_number: number;
  address: Address;
  data: Hex;
  topic0: Hex;
  topic1: Hex;
  topic2: Hex;
  topic3: null;
}

function getClient(chain: ChainId): PublicClient | null {
  const chainData = getChainData(chain);
  if (!chainData) {
    return null;
  }
  const rpcUrl = alchemy(chain as AlchemyChain, alchemyKey);
  if (!rpcUrl) {
    return null;
  }

  return createPublicClient({
    chain: chainData,
    transport: http(rpcUrl),
  });
}

async function getLogs(
  sourceInfo: SourceInfo,
  chain: ChainId,
  address: Address,
  topic0: Hex,
): Promise<Log[]> {
  // Read cache metadata
  const cachePrefix = `events/${chain}/${address}/${topic0}`;
  const cacheMetadata = await getLogCacheMetadata(cachePrefix);
  const { logs, newBlocks, startBlock, nextBlock } = await fetchLogs(
    sourceInfo,
    chain,
    address,
    topic0,
    cachePrefix,
    cacheMetadata,
  );
  if (nextBlock > cacheMetadata.lastBlock) {
    // Update cache metadata
    const metadata = `${cachePrefix}/metadata.json`;
    const newMetadata: LogCacheMetadata = {
      count: cacheMetadata.count + newBlocks,
      lastBlock: nextBlock - 1,
    };
    await putObject(metadata, JSON.stringify(newMetadata));
  }
  // Update the source metadata
  if (sourceInfo.fetchType === 'incremental') {
    await updateSourceMetadataBlock(
      chain,
      sourceInfo,
      address,
      topic0,
      nextBlock - 1,
    );
  }
  return sourceInfo.fetchType !== 'incremental'
    ? logs
    : logs.filter(
        (log) =>
          log.blockNumber >= startBlock && log.blockNumber <= nextBlock - 1,
      );
}

async function fetchLogs(
  sourceInfo: SourceInfo,
  chain: ChainId,
  address: Address,
  topic0: Hex,
  cachePrefix: string,
  cacheMetadata: LogCacheMetadata,
): Promise<{
  logs: Log[];
  newBlocks: number;
  startBlock: number;
  nextBlock: number;
}> {
  const maxLogsPerIncrementalFetch = 1_000_000;
  const chunkSize = 100_000;
  const client = getHyperSyncClient(chain);
  const height = await getChainHeight(client);
  // Read cache chunks one-by-one
  let logs: Log[] = [];
  const chunks = Math.ceil(cacheMetadata.lastBlock / chunkSize);
  // Get the start block from the source metadata
  const sourceMetadata = await getSourceMetadata(chain, sourceInfo);
  const sourceAddressMetadata = sourceMetadata.latestLogBlock[address] || {};
  const sourceLatestBlock = sourceAddressMetadata[topic0] || -1;
  const startBlock =
    sourceInfo.fetchType === 'incremental' ? sourceLatestBlock + 1 : 0;
  const startChunk = Math.floor(startBlock / chunkSize);
  for (let i = startChunk; i < chunks; i++) {
    const cacheKey = `${cachePrefix}/${i}.json`;
    const cacheString = await getObject(cacheKey);
    const cache =
      cacheString === null ? null : (JSON.parse(cacheString) as Log[]);
    if (cache) {
      logs = logs.concat(cache);
    }
    if (
      sourceInfo.fetchType === 'incremental' &&
      logs.length >= maxLogsPerIncrementalFetch
    ) {
      const lastLog = logs.at(-1);
      if (!lastLog) {
        throw new Error('Unable to get the last log');
      }
      return {
        logs,
        newBlocks: 0,
        startBlock,
        nextBlock: lastLog.blockNumber + 1,
      };
    }
  }
  // Fetch new events
  const startingBlock = cacheMetadata ? cacheMetadata.lastBlock + 1 : 0;
  let fromBlock = startingBlock;
  let newBlocks = 0;
  while (fromBlock <= height) {
    const { logs: pageLogs, nextBlock } = await getLogsPaginated(
      client,
      address,
      topic0,
      fromBlock,
    );
    logs = logs.concat(pageLogs);
    newBlocks += pageLogs.length;
    fromBlock = nextBlock;
    if (
      sourceInfo.fetchType === 'incremental' &&
      logs.length >= maxLogsPerIncrementalFetch
    ) {
      break;
    }
  }
  // Write new events to the cache in chunks
  const firstChunk = Math.floor(cacheMetadata.lastBlock / chunkSize);
  const lastChunk = Math.floor((fromBlock - 1) / chunkSize);
  for (let i = firstChunk; i <= lastChunk; i++) {
    const chunkStart = i * chunkSize;
    const chunkEnd = chunkStart + chunkSize;
    const chunkEvents = logs.filter(
      (log) => log.blockNumber >= chunkStart && log.blockNumber < chunkEnd,
    );
    if (chunkEvents.length === 0) {
      continue;
    }
    const cacheKey = `${cachePrefix}/${i}.json`;
    await putObject(cacheKey, JSON.stringify(chunkEvents));
  }

  return {
    logs,
    newBlocks,
    startBlock,
    nextBlock: fromBlock,
  };
}

function getHyperSyncClient(chain: ChainId): KyInstance {
  const endpointUrl = `https://${chain}.hypersync.xyz`;
  const client = ky.create({
    prefixUrl: endpointUrl,
    retry: {
      limit: 100,
      delay: () => 10_000,
    },
    timeout: false,
  });
  return client;
}

async function getChainHeight(client: KyInstance): Promise<number> {
  const response = await client.get('height');
  const data = await response.json<{
    height: number;
  }>();
  return data.height;
}

async function getLogsPaginated(
  client: KyInstance,
  address: Address,
  topic0: Hex,
  startBlock: number,
): Promise<{
  logs: Log[];
  nextBlock: number;
}> {
  const query: Query = {
    from_block: startBlock,
    logs: [
      {
        address: [address],
        topics: [[topic0]],
      },
    ],
    field_selection: {
      log: [
        'block_number',
        'data',
        'log_index',
        'topic0',
        'topic1',
        'topic2',
        'topic3',
      ],
    },
  };

  const response = await client.post('query', {
    json: query,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const queryData = await response.json<QueryResponse>();
  const logs = queryData.data
    .map((dataPage) => {
      const pageLogs = dataPage.logs || [];
      return pageLogs.map((log) => {
        const topics = [log.topic0, log.topic1, log.topic2, log.topic3].filter(
          (topic) => topic !== null,
        );
        const data = log.data as Hex;
        const blockNumber = log.block_number;
        const logIndex = log.log_index;
        return { topics, data, blockNumber, logIndex };
      });
    })
    .flat();
  const nextBlock = queryData.next_block;
  if (!nextBlock) {
    throw new Error('Invalid response');
  }
  return {
    logs,
    nextBlock,
  };
}

async function getLogCacheMetadata(
  cachePrefix: string,
): Promise<LogCacheMetadata> {
  const cacheKey = `${cachePrefix}/metadata.json`;
  const metadataString = await getObject(cacheKey);
  const metadata: LogCacheMetadata =
    metadataString === null
      ? {
          count: 0,
          lastBlock: -1,
        }
      : JSON.parse(metadataString);
  return metadata;
}

async function getDeployed(
  chain: ChainId,
  addresses: Record<Address, string>,
): Promise<Record<Address, string>> {
  const client = getClient(chain);
  if (!client) {
    return {};
  }
  const deployed: Record<Address, string> = {};
  for (const addressString in addresses) {
    const address = addressString as Address;
    const label = addresses[address];
    if (!label) {
      continue;
    }
    const bytecode = await client.getCode({
      address,
    });
    if (!bytecode) {
      continue;
    }
    deployed[address] = label;
  }
  return deployed;
}

async function getErc20Metadata(
  chain: ChainId,
  addresses: string[],
): Promise<Record<string, Erc20Metadata>> {
  const client = getClient(chain);
  if (!client) {
    return {};
  }
  const BATCH_SIZE = 100;
  // Split contract calls into batches
  const batches = addresses.reduce<string[][]>(
    (acc, address, index) => {
      const batchIndex = Math.floor(index / BATCH_SIZE);
      if (!acc[batchIndex]) {
        acc[batchIndex] = [];
      }
      const batch = acc[batchIndex];
      if (!batch) {
        return acc;
      }
      batch.push(address);
      return acc;
    },
    [[]],
  );
  const metadata: Record<string, Erc20Metadata> = {};
  for (const batch of batches) {
    const calls = batch
      .map((address) => {
        return [
          {
            address: address as Address,
            abi: erc20Abi,
            functionName: 'name',
          },
          {
            address: address as Address,
            abi: erc20Abi,
            functionName: 'symbol',
          },
        ] as const;
      })
      .flat();
    const results = await client.multicall({
      contracts: calls,
    });
    for (const [index, address] of batch.entries()) {
      const nameResult = results[2 * index];
      if (!nameResult || nameResult.status === 'failure') {
        continue;
      }
      const name = nameResult.result;
      const symbolResult = results[2 * index + 1];
      if (!symbolResult || symbolResult.status === 'failure') {
        continue;
      }
      const symbol = symbolResult.result;
      metadata[address] = {
        name,
        symbol,
      };
    }
  }

  return metadata;
}

function isErc20Ignored(chain: ChainId, address: Address): boolean {
  const ignoredMap: Partial<Record<ChainId, Set<Address>>> = {
    [ETHEREUM]: new Set(['0xdfe66b14d37c77f4e9b180ceb433d1b164f0281d']),
    [POLYGON]: new Set([
      '0x113f3d54c31ebc71510fd664c8303b34fbc2b355',
      '0xa48ad8b964bbf2c420e964b648146567ceb6d5e1',
      '0x9719d867a500ef117cc201206b8ab51e794d3f82',
      '0xae646817e458c0be890b81e8d880206710e3c44e',
      '0xf93579002dbe8046c43fefe86ec78b1112247bb8',
      '0x625e7708f30ca75bfd92586e17077590c60eb4cd',
      '0x1a13f4ca1d028320a707d99520abfefca3998b7f',
      '0x221836a597948dce8f3568e044ff123108acc42a',
      '0xf25212e676d1f7f89cd72ffee66158f541246445',
      '0xee029120c72b0607344f35b17cdd90025e647b00',
      '0xace2ac58e1e5a7bfe274916c4d82914d490ed4a5',
      '0xda1cd1711743e57dd57102e9e61b75f3587703da',
      '0x178e029173417b1f9c8bc16dcec6f697bc323746',
      '0x82e64f49ed5ec1bc6e43dad4fc8af9bb3a2312ee',
      '0x27f8d03b3a2196956ed754badc28d73be8830a6e',
      '0x7e7ff932fab08a0af569f93ce65e7b8b23698ad8',
      '0x19c60a251e525fa88cd6f3768416a8024e98fc19',
      '0x60d55f02a771d515e077c9c2403a1ef324885cec',
      '0x6ab707aca953edaefbc4fd23ba73294241490620',
      '0xff4ce5aaab5a627bf82f4a571ab1ce94aa365ea6',
      '0x7c82a23b4c48d796dee36a9ca215b641c6a8709d',
      '0x236975da9f0761e9cf3c2b0f705d705e22829886',
    ]),
    [OPTIMISM]: new Set([
      '0x625e7708f30ca75bfd92586e17077590c60eb4cd',
      '0xe3b3a464ee575e8e25d2508918383b89c832f275',
      '0xba7834bb3cd2db888e6a06fb45e82b4225cd0c71',
      '0x82e64f49ed5ec1bc6e43dad4fc8af9bb3a2312ee',
      '0x888a6195d42a95e80d81e1c506172772a80b80bc',
      '0x2218a117083f5b482b0bb821d27056ba9c04b1d3',
      '0x9253d7e1b42fa01ede2c53f3a21b3b4d13239cd4',
      '0x6ab707aca953edaefbc4fd23ba73294241490620',
    ]),
    [BASE]: new Set([
      '0x0c659734f1eef9c63b7ebdf78a164cdd745586db',
      '0x99ac4484e8a1dbd6a185380b3a811913ac884d87',
    ]),
    [ARBITRUM]: new Set([
      '0x5bae72b75caab1f260d21bc028c630140607d6e8',
      '0x9c4ec768c28520b50860ea7a15bd7213a9ff58bf',
      '0xe11508d3e0cf09e6fd6e94fdf41e83836d83ce50',
      '0xaeacf641a0342330ec681b57c0a6af0b71d5cbff',
      '0x4f947b40beeb9d8130437781a560e5c7d089730f',
      '0x625e7708f30ca75bfd92586e17077590c60eb4cd',
      '0x724dc807b04555b71ed48a6896b6f41593b8c637',
      '0x54355cc6913b26a15cca1f820cf17d362fa65db5',
      '0xe66998533a1992ece9ea99cdf47686f4fc8458e0',
      '0xd85e038593d7a098614721eae955ec2022b9b91b',
      '0x12f256109e744081f633a827be80e06d97ff7447',
      '0xf061956612b3dc79fd285d3d51bc128f2ea87740',
      '0x82e64f49ed5ec1bc6e43dad4fc8af9bb3a2312ee',
      '0xe1fb90d0d3b47e551d494d7ebe8f209753526b01',
      '0x117a3d474976274b37b7b94af5dcade5c90c6e85',
      '0x6ab707aca953edaefbc4fd23ba73294241490620',
      '0x0179bac7493a92ac812730a4c64a0b41b7ea0ecf',
      '0x894c82800526e0391e709c0983a5aea3718b7f6d',
      '0x65cd2e7d7bacdac3aa9dae68fb5d548dfe1fefb5',
    ]),
  };
  const ignoredSet = ignoredMap[chain];
  if (!ignoredSet) {
    return false;
  }
  return ignoredSet.has(address);
}

export { getLogs, getErc20Metadata, isErc20Ignored, getDeployed };
export type { Log };
