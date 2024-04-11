import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Hex } from 'viem';

import uniswapV2FactoryAbi from '@/abi/uniswapV2Factory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainLabelMap, LabelMap } from '@/labels/base.js';
import {
  getLabelNamespaceByValue,
  getLabelTypeById,
  initLabelMap,
} from '@/labels/utils.js';
import { CHAINS, ETHEREUM } from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getEvents } from '@/utils/fetching.js';

interface Pool {
  address: string;
  token0: string;
  token1: string;
}

const NAMESPACE = 'Uniswap V2';

class Source extends BaseSource {
  getName(): string {
    return 'Uniswap V2 Pools';
  }

  async fetch(previousLabels: LabelMap): Promise<LabelMap> {
    const labels = initLabelMap();
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
  ): Promise<ChainLabelMap> {
    const address = this.getFactoryAddress(chain);
    if (!address) {
      return {};
    }
    const topics = encodeEventTopics({
      abi: uniswapV2FactoryAbi,
      eventName: 'PairCreated',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, address, topic);

    const pools: Pool[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: uniswapV2FactoryAbi,
        data: event.data as Hex,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        topics: event.topics,
      });
      if (decodedEvent.eventName !== 'PairCreated') {
        throw new Error('Invalid event name');
      }
      return {
        address: decodedEvent.args.pair.toLowerCase(),
        token0: decodedEvent.args.token0.toLowerCase(),
        token1: decodedEvent.args.token1.toLowerCase(),
      };
    });

    return Object.fromEntries(
      pools.map((pool) => {
        const value = getPoolLabel(pool, previousLabels);
        return [
          pool.address,
          {
            value,
            type: getLabelTypeById('uniswap-v2-pool'),
            namespace: getLabelNamespaceByValue(NAMESPACE),
          },
        ];
      }),
    );
  }

  private getFactoryAddress(chain: ChainId): string | null {
    switch (chain) {
      case ETHEREUM:
        return '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f';
      default:
        return null;
    }
  }
}

function getPoolLabel(pool: Pool, previousLabels: ChainLabelMap): string {
  const token0Label = previousLabels[pool.token0];
  const token1Label = previousLabels[pool.token1];
  if (!token0Label || !token1Label) {
    return 'Pool';
  }
  if (
    !token0Label.type ||
    !token1Label.type ||
    !token0Label.metadata ||
    !token1Label.metadata ||
    !['wrapped', 'erc20'].includes(token0Label.type.id) ||
    !['wrapped', 'erc20'].includes(token1Label.type.id)
  ) {
    return 'Pool';
  }
  const token0Symbol = token0Label.metadata.symbol as string;
  const token1Symbol = token1Label.metadata.symbol as string;
  return `${token0Symbol}/${token1Symbol} `;
}

export default Source;
