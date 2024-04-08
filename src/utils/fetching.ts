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

interface EventCache {
  events: Event[];
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
        return null;
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
  const client = getHypersyncClient(chain);
  if (!client) {
    return [];
  }
  const latestBlock = await client.getHeight();
  const cacheKey = `events/${chain}/${address}/${topic0}.json`;
  // Read events from the cache
  const cacheString = await getObject(cacheKey);
  const cache =
    cacheString === null ? null : (JSON.parse(cacheString) as EventCache);
  const events: Event[] = cache ? cache.events : [];
  let fromBlock = cache ? cache.lastBlock + 1 : 0;
  while (fromBlock < latestBlock) {
    const { events: pageEvents, nextBlock } = await getEventsPaginated(
      client,
      address,
      topic0,
      fromBlock,
    );
    events.push(...pageEvents);
    fromBlock = nextBlock;
  }
  // Write new events to the cache
  const lastEvent = events.at(-1);
  const updatedEventCache: EventCache = {
    events,
    lastBlock: lastEvent ? lastEvent.blockNumber : -1,
  };
  await putObject(cacheKey, JSON.stringify(updatedEventCache));
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
      if (!nameResult) {
        continue;
      }
      const name = nameResult.result as string;
      const symbolResult = results[2 * index + 1];
      if (!symbolResult) {
        continue;
      }
      const symbol = symbolResult.result as string;
      metadata[address] = {
        name,
        symbol,
      };
    }
  }

  return metadata;
}

export { getEvents, getErc20Metadata, getDeployed };
export type { Event };
