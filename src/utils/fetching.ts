import {
  HypersyncClient,
  Query as HypersyncQuery,
} from '@envio-dev/hypersync-client';
import axios from 'axios';
import { AlchemyChain, alchemy } from 'evm-providers';
import { Address, Hex, PublicClient, createPublicClient, http } from 'viem';

import erc20Abi from '@/abi/erc20.js';

import {
  BASE,
  BASE_SEPOLIA,
  ETHEREUM,
  OPTIMISM,
  OPTIMISM_SEPOLIA,
  POLYGON,
  POLYGON_AMOY,
  SEPOLIA,
  ARBITRUM,
  ARBITRUM_SEPOLIA,
  getChainData,
} from './chains.js';
import type { ChainId } from './chains.js';
import { getObject, putObject } from './storage.js';

// Bun doesn't support brotli yet
axios.defaults.headers.common['Accept-Encoding'] = 'gzip';

const alchemyKey = process.env.ALCHEMY_KEY as string;

interface Erc20Metadata {
  name: string | null;
  symbol: string | null;
}

interface Event {
  data: Hex;
  topics: Hex[];
  blockNumber: number;
}

interface EventCacheMetadata {
  count: number;
  lastBlock: number;
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

function getHypersyncClient(chain: ChainId): HypersyncClient | null {
  function getUrl(chain: ChainId): string | null {
    switch (chain) {
      case ETHEREUM:
        return 'https://eth.hypersync.xyz';
      case SEPOLIA:
        return 'https://sepolia.hypersync.xyz';
      case OPTIMISM:
        return 'https://optimism.hypersync.xyz';
      case OPTIMISM_SEPOLIA:
        return 'https://optimism-sepolia.hypersync.xyz';
      case BASE:
        return 'https://base.hypersync.xyz';
      case BASE_SEPOLIA:
        return 'https://base-sepolia.hypersync.xyz';
      case POLYGON:
        return 'https://polygon.hypersync.xyz';
      case POLYGON_AMOY:
        return 'https://amoy.hypersync.xyz';
      case ARBITRUM:
        return 'https://arbitrum.hypersync.xyz';
      case ARBITRUM_SEPOLIA:
        return 'https://arbitrum-sepolia.hypersync.xyz';
      default:
        return null;
    }
  }

  const url = getUrl(chain);
  if (!url) {
    return null;
  }
  return HypersyncClient.new({ url });
}

async function getEvents(
  chain: ChainId,
  address: string,
  topic0: Hex,
): Promise<Event[]> {
  // Note: changing this would require cleaning up the cache
  const CHUNK_BLOCKS = 1_000_000;
  const client = getHypersyncClient(chain);
  if (!client) {
    return [];
  }
  const latestBlock = await client.getHeight();
  // Read cache metadata
  const cachePrefix = `events/${chain}/${address}/${topic0}`;
  const cacheMetadata = await getEventCacheMetadata(cachePrefix);
  // Read cache chunks one-by-one
  let events: Event[] = [];
  const chunks = Math.ceil(cacheMetadata.lastBlock / CHUNK_BLOCKS);
  for (let i = 0; i < chunks; i++) {
    const cacheKey = `${cachePrefix}/${i}.json`;
    const cacheString = await getObject(cacheKey);
    const cache =
      cacheString === null ? null : (JSON.parse(cacheString) as Event[]);
    if (cache) {
      events = events.concat(cache);
    }
  }
  // Fetch new events
  let fromBlock = cacheMetadata.lastBlock + 1;
  while (fromBlock <= latestBlock) {
    const { events: pageEvents, nextBlock } = await getEventsPaginated(
      client,
      address,
      topic0,
      fromBlock,
    );
    events = events.concat(pageEvents);
    fromBlock = nextBlock;
  }
  // Write new events to the cache in chunks
  const firstChunk = Math.floor(cacheMetadata.lastBlock / CHUNK_BLOCKS);
  const lastChunk = Math.floor(latestBlock / CHUNK_BLOCKS);
  for (let i = firstChunk; i <= lastChunk; i++) {
    const chunkStart = i * CHUNK_BLOCKS;
    const chunkEnd = chunkStart + CHUNK_BLOCKS;
    const chunkEvents = events.filter(
      (event) =>
        event.blockNumber >= chunkStart && event.blockNumber < chunkEnd,
    );
    if (chunkEvents.length === 0) {
      continue;
    }
    const cacheKey = `${cachePrefix}/${i}.json`;
    await putObject(cacheKey, JSON.stringify(chunkEvents));
  }
  // Update cache metadata
  const metadata = `${cachePrefix}/metadata.json`;
  const newMetadata: EventCacheMetadata = {
    count: events.length,
    lastBlock: latestBlock,
  };
  await putObject(metadata, JSON.stringify(newMetadata));
  // Return all events
  return events;
}

async function getEventsPaginated(
  client: HypersyncClient,
  address: string,
  topic0: Hex,
  fromBlock: number,
): Promise<{
  events: Event[];
  nextBlock: number;
}> {
  const query: HypersyncQuery = {
    fromBlock,
    logs: [
      {
        address: [address],
        topics: [[topic0]],
      },
    ],
    fieldSelection: {
      log: ['block_number', 'data', 'topic0', 'topic1', 'topic2', 'topic3'],
    },
  };

  const response = await client.sendReq(query);
  const events = response.data.logs.map((log) => {
    const topics = log.topics as Address[];
    const data = log.data as Hex;
    const blockNumber = log.blockNumber;
    return { topics, data, blockNumber };
  });
  const nextBlock = response.nextBlock;
  return {
    events,
    nextBlock,
  };
}

async function getEventCacheMetadata(
  cachePrefix: string,
): Promise<EventCacheMetadata> {
  const cacheKey = `${cachePrefix}/metadata.json`;
  const metadataString = await getObject(cacheKey);
  const metadata: EventCacheMetadata =
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

export { getEvents, getErc20Metadata, getDeployed };
export type { Event };
