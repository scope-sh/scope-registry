import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import uniswapV3FactoryAbi from '@/abi/uniswapV3Factory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type {
  ChainLabelMap,
  ChainSingleLabelMap,
  LabelMap,
  SingleLabelMap,
} from '@/labels/base.js';
import {
  getLabelNamespaceByValue,
  getLabelTypeById,
  initSingleLabelMap,
} from '@/labels/utils.js';
import {
  CHAINS,
  ETHEREUM,
  OPTIMISM,
  BNB,
  POLYGON,
  BASE,
  ARBITRUM,
  CELO,
  OPTIMISM_SEPOLIA,
  BLAST,
  BASE_SEPOLIA,
  AVALANCHE,
  ARBITRUM_SEPOLIA,
  SEPOLIA,
} from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getEvents } from '@/utils/fetching.js';

interface Pool {
  address: Address;
  token0: Address;
  token1: Address;
  fee: number;
}

const NAMESPACE = 'Uniswap V3';

class Source extends BaseSource {
  getName(): string {
    return 'Uniswap V3 Pools';
  }

  async fetch(previousLabels: LabelMap): Promise<SingleLabelMap> {
    const labels = initSingleLabelMap();
    for (const chain of CHAINS) {
      const chainPreviousLabels = previousLabels[chain];
      const chainLabels = await this.fetchChain(chain, chainPreviousLabels);
      labels[chain] = chainLabels;
    }

    return labels;
  }

  private async fetchChain(
    chain: ChainId,
    previousLabels: ChainLabelMap,
  ): Promise<ChainSingleLabelMap> {
    const address = this.getFactoryAddress(chain);
    if (!address) {
      return {};
    }
    const topics = encodeEventTopics({
      abi: uniswapV3FactoryAbi,
      eventName: 'PoolCreated',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, address, topic);

    const pools: Pool[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: uniswapV3FactoryAbi,
        data: event.data,
        topics: event.topics as [Hex, ...Hex[]],
      });
      if (decodedEvent.eventName !== 'PoolCreated') {
        throw new Error('Invalid event name');
      }
      return {
        address: decodedEvent.args.pool.toLowerCase() as Address,
        token0: decodedEvent.args.token0.toLowerCase() as Address,
        token1: decodedEvent.args.token1.toLowerCase() as Address,
        fee: decodedEvent.args.fee / 1000000,
      };
    });

    return Object.fromEntries(
      pools.map((pool) => {
        const value = getPoolLabel(pool, previousLabels);
        return [
          pool.address,
          {
            value,
            type: getLabelTypeById('uniswap-v3-pool'),
            namespace: getLabelNamespaceByValue(NAMESPACE),
          },
        ];
      }),
    );
  }

  private getFactoryAddress(chain: ChainId): Address | null {
    switch (chain) {
      case ETHEREUM:
        return '0x1f98431c8ad98523631ae4a59f267346ea31f984';
      case OPTIMISM:
        return '0x1f98431c8ad98523631ae4a59f267346ea31f984';
      case BNB:
        return '0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7';
      case POLYGON:
        return '0x1f98431c8ad98523631ae4a59f267346ea31f984';
      case OPTIMISM_SEPOLIA:
        return '0x8ce191193d15ea94e11d327b4c7ad8bbe520f6af';
      case BASE:
        return '0x33128a8fc17869897dce68ed026d694621f6fdfd';
      case BLAST:
        return '0x792edade80af5fc680d96a2ed80a44247d2cf6fd';
      case BASE_SEPOLIA:
        return '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24';
      case ARBITRUM:
        return '0x1f98431c8ad98523631ae4a59f267346ea31f984';
      case CELO:
        return '0xafe208a311b21f13ef87e33a90049fc17a7acdec';
      case AVALANCHE:
        return '0x740b1c1de25031c31ff4fc9a62f554a55cdc1bad';
      case ARBITRUM_SEPOLIA:
        return '0x248ab79bbb9bc29bb72f7cd42f17e054fc40188e';
      case SEPOLIA:
        return '0x0227628f3F023bb0B980b67D528571c95c6DaC1c';
      default:
        return null;
    }
  }
}

function getPoolLabel(pool: Pool, previousLabels: ChainLabelMap): string {
  const token0Labels = previousLabels[pool.token0];
  const token1Labels = previousLabels[pool.token1];
  if (!token0Labels || !token1Labels) {
    return 'Pool';
  }
  const token0Label = token0Labels.find(
    (label) => label.type && ['wrapped', 'erc20'].includes(label.type.id),
  );
  const token1Label = token1Labels.find(
    (label) => label.type && ['wrapped', 'erc20'].includes(label.type.id),
  );

  if (
    !token0Label ||
    !token1Label ||
    !token0Label.metadata ||
    !token1Label.metadata
  ) {
    return 'Pool';
  }
  const token0Symbol = token0Label.metadata.symbol as string;
  const token1Symbol = token1Label.metadata.symbol as string;
  const feeLabel = `${100 * pool.fee}%`;
  return `${token0Symbol}/${token1Symbol} ${feeLabel} Pool`;
}

export default Source;
