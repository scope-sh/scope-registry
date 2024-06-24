import axios, { AxiosInstance } from 'axios';
import axiosRetry, { exponentialDelay } from 'axios-retry';
import { AlchemyChain, alchemy } from 'evm-providers';
import { Address, Hex, PublicClient, createPublicClient, http } from 'viem';

import erc20Abi from '@/abi/erc20.js';

import {
  ETHEREUM,
  OPTIMISM,
  POLYGON,
  ARBITRUM,
  getChainData,
} from './chains.js';
import type { ChainId } from './chains.js';
import {
  type Log,
  getLogMetadata,
  setLogMetadata,
  getLogCache,
  setLogCache,
} from './db.js';

// Bun doesn't support brotli yet
axios.defaults.headers.common['Accept-Encoding'] = 'gzip';

const alchemyKey = process.env.ALCHEMY_KEY as string;

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
  chain: ChainId,
  address: Address,
  topic0: Hex,
  predicate?: (log: Log) => boolean,
): Promise<Log[]> {
  const client = getHyperSyncClient(chain);
  const latestBlock = await getChainHeight(client);
  let logs = await getLogCache(chain, address, topic0);
  // // Read cache metadata
  const logMetadata = await getLogMetadata(chain, address, topic0);
  // Fetch new events
  let fromBlock = logMetadata ? logMetadata.latestBlockNumber + 1 : 0;
  while (fromBlock <= latestBlock) {
    const { logs: pageLogs, nextBlock } = await getLogsPaginated(
      client,
      address,
      topic0,
      fromBlock,
    );
    logs = logs.concat(pageLogs);
    fromBlock = nextBlock;
  }
  await setLogMetadata(chain, address, topic0, {
    latestBlockNumber: latestBlock,
  });
  await setLogCache(chain, address, topic0, logs);
  // Filter events if needed
  return predicate ? logs.filter(predicate) : logs;
}

function getHyperSyncClient(chain: ChainId): AxiosInstance {
  const endpointUrl = `https://${chain}.hypersync.xyz`;
  const client = axios.create({
    baseURL: endpointUrl,
  });
  axiosRetry(client, {
    retries: 20,
    retryDelay: exponentialDelay,
  });
  return client;
}

async function getChainHeight(client: AxiosInstance): Promise<number> {
  const response = await client.get<{
    height: number;
  }>('height');
  return response.data.height;
}

async function getLogsPaginated(
  client: AxiosInstance,
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

  const response = await client.post<QueryResponse>('query', query, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const logs = response.data.data
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
  const nextBlock = response.data.next_block;
  if (!nextBlock) {
    throw new Error('Invalid response');
  }
  return {
    logs,
    nextBlock,
  };
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
    const bytecode = await client.getBytecode({
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
  const overwrite = getErc20Overwrite(chain);
  for (const address in overwrite) {
    const addressOverwrite = overwrite[address as Address];
    if (!addressOverwrite) {
      continue;
    }
    metadata[address] = addressOverwrite;
  }

  return metadata;
}

function getErc20Overwrite(chain: ChainId): Record<Address, Erc20Metadata> {
  const overwrites: Partial<Record<ChainId, Record<Address, Erc20Metadata>>> = {
    [ETHEREUM]: {
      '0x41f7b8b9b897276b7aae926a9016935280b44e97': {
        name: 'Wormhole USD Coin',
        symbol: 'wormholeUSDC',
      },
      '0x7cd167b101d2808cfd2c45d17b2e7ea9f46b74b6': {
        name: 'Wormhole USD Coin',
        symbol: 'wormholeUSDC',
      },
      '0x1cdd2eab61112697626f7b4bb0e23da4febf7b7c': {
        name: 'Wormhole Tether',
        symbol: 'wormholeUSDT',
      },
    },
    [OPTIMISM]: {
      '0x7f5c764cbc14f9669b88837ca1490cca17c31607': {
        name: 'Bridged USD Coin',
        symbol: 'USDC.e',
      },
    },
    [POLYGON]: {
      '0x576cf361711cd940cd9c397bb98c4c896cbd38de': {
        name: 'Wormhole USD Coin',
        symbol: 'wormholeUSDC',
      },
      '0x4318cb63a2b8edf2de971e2f17f77097e499459d': {
        name: 'Wormhole USD Coin',
        symbol: 'wormholeUSDC',
      },
    },
    [ARBITRUM]: {
      '0xe11508d3e0cf09e6fd6e94fdf41e83836d83ce50': {
        name: 'Parifi USDC Vault',
        symbol: 'pfUSDC',
      },
    },
  };
  const chainOverwrite = overwrites[chain];
  if (!chainOverwrite) {
    return {};
  }
  return chainOverwrite;
}

export { getLogs, getErc20Metadata, getDeployed };
export type { Log };
