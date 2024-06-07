import { HypersyncClient, Query } from '@envio-dev/hypersync-client';
import { Address } from 'viem';

import {
  ARBITRUM,
  ARBITRUM_SEPOLIA,
  BASE,
  BASE_SEPOLIA,
  CHAINS,
  ChainId,
  ETHEREUM,
  OPTIMISM,
  OPTIMISM_SEPOLIA,
  POLYGON,
  POLYGON_AMOY,
  SEPOLIA,
  getChainData,
} from '@/utils/chains.js';

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Service {
  chainId: ChainId;
  endpoint: string;

  constructor(chainId: ChainId) {
    this.chainId = chainId;
    this.endpoint = 'https://api.scope.sh';
  }

  public async getContractSource(address: Address): Promise<unknown> {
    try {
      const params: Record<string, string> = {
        chain: this.chainId.toString(),
        address,
      };
      const url = new URL(`${this.endpoint}/contract/source`);
      url.search = new URLSearchParams(params).toString();
      const response = await fetch(url);
      const source = await response.json();
      return source;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

function getEndpoint(chain: ChainId): string | null {
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
  }
  return null;
}

async function getTransactionTargets(
  client: HypersyncClient,
  fromBlock: number,
  toBlock: number,
): Promise<Address[]> {
  let targets: Address[] = [];
  let nextBlock = fromBlock;
  while (nextBlock < toBlock) {
    const { targets: newTargets, nextBlock: newNextBlock } =
      await getTransactionTargetsPaginated(client, nextBlock, toBlock);
    targets = targets.concat(newTargets);
    nextBlock = newNextBlock;
  }
  return targets;
}

async function getTransactionTargetsPaginated(
  client: HypersyncClient,
  fromBlock: number,
  toBlock: number,
): Promise<{
  targets: Address[];
  nextBlock: number;
}> {
  const query: Query = {
    fromBlock,
    toBlock,
    transactions: [
      {
        status: 1,
      },
    ],
    fieldSelection: {
      transaction: ['to'],
    },
  };
  const res = await client.sendReq(query);
  const targets = res.data.transactions
    .map((tx) => tx.to)
    .filter((addr): addr is Address => !!addr);
  return {
    targets,
    nextBlock: res.nextBlock,
  };
}

async function getLogTargets(
  client: HypersyncClient,
  fromBlock: number,
  toBlock: number,
): Promise<Address[]> {
  let targets: Address[] = [];
  let nextBlock = fromBlock;
  while (nextBlock < toBlock) {
    const { targets: newTargets, nextBlock: newNextBlock } =
      await getLogTargetsPaginated(client, nextBlock, toBlock);
    targets = targets.concat(newTargets);
    nextBlock = newNextBlock;
  }
  return targets;
}

async function getLogTargetsPaginated(
  client: HypersyncClient,
  fromBlock: number,
  toBlock: number,
): Promise<{
  targets: Address[];
  nextBlock: number;
}> {
  const query: Query = {
    fromBlock,
    toBlock,
    logs: [
      {
        address: [],
      },
    ],
    fieldSelection: {
      log: ['address'],
    },
  };
  const res = await client.sendReq(query);
  const targets = res.data.logs
    .map((log) => log.address)
    .filter((addr): addr is Address => !!addr);
  return {
    targets,
    nextBlock: res.nextBlock,
  };
}

function getTopTargets(allTargets: Address[], count: number): Address[] {
  const targetsByCount = allTargets.reduce((acc, target) => {
    acc.set(target, (acc.get(target) || 0) + 1);
    return acc;
  }, new Map<Address, number>());
  const topContracts = Array.from(targetsByCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([address]) => address);
  return topContracts;
}

const blockMap: Partial<Record<ChainId, number>> = {
  [ETHEREUM]: 10_000,
  [SEPOLIA]: 10_000,
  [OPTIMISM]: 100_000,
  [OPTIMISM_SEPOLIA]: 100_000,
  [POLYGON]: 30_000,
  [POLYGON_AMOY]: 30_000,
  [BASE]: 50_000,
  [BASE_SEPOLIA]: 50_000,
  [ARBITRUM]: 200_000,
  [ARBITRUM_SEPOLIA]: 200_000,
};
const contractMap: Partial<Record<ChainId, number>> = {
  [ETHEREUM]: 10_000,
  [SEPOLIA]: 1_000,
  [OPTIMISM]: 2_000,
  [OPTIMISM_SEPOLIA]: 200,
  [POLYGON]: 3_000,
  [POLYGON_AMOY]: 300,
  [BASE]: 1_000,
  [BASE_SEPOLIA]: 100,
  [ARBITRUM]: 1_000,
  [ARBITRUM_SEPOLIA]: 100,
};
for (const chain of CHAINS) {
  const blockCount = blockMap[chain];
  if (!blockCount) {
    continue;
  }
  const contractCount = contractMap[chain];
  if (!contractCount) {
    continue;
  }
  const service = new Service(chain);
  console.info(`Processing chain ${chain}`);
  const chainData = getChainData(chain);
  if (chainData === null) {
    continue;
  }
  const endpointUrl = getEndpoint(chain);
  if (endpointUrl === null) {
    continue;
  }
  const client = HypersyncClient.new({
    url: endpointUrl,
  });
  const height = await client.getHeight();
  // query last X blocks of data
  const transactionTargets = await getTransactionTargets(
    client,
    height - blockCount,
    height,
  );
  const topTransactionContracts = getTopTargets(
    transactionTargets,
    contractCount,
  );
  const logTargets = await getLogTargets(client, height - blockCount, height);
  const topLogContracts = getTopTargets(logTargets, contractCount);
  const topContracts = Array.from(
    new Set([...topTransactionContracts, ...topLogContracts]),
  );
  // find top Y contracts by transaction count
  // query their sources via API
  for (const contract of topContracts) {
    const contractIndex = topContracts.indexOf(contract);
    if (contractIndex % 10 === 0) {
      console.info(`${contractIndex} / ${topContracts.length}`);
    }
    await service.getContractSource(contract);
    await sleep(3000);
  }
}
