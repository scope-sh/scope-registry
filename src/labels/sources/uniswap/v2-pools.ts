import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import uniswapV2FactoryAbi from '@/abi/uniswapV2Factory.js';
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
import { CHAINS, ETHEREUM } from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getEvents } from '@/utils/fetching.js';

interface Pool {
  address: Address;
  token0: Address;
  token1: Address;
}

const NAMESPACE = 'Uniswap V2';

class Source extends BaseSource {
  getName(): string {
    return 'Uniswap V2 Pools';
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
        data: event.data,
        topics: event.topics as [Hex, ...Hex[]],
      });
      if (decodedEvent.eventName !== 'PairCreated') {
        throw new Error('Invalid event name');
      }
      return {
        address: decodedEvent.args.pair.toLowerCase() as Address,
        token0: decodedEvent.args.token0.toLowerCase() as Address,
        token1: decodedEvent.args.token1.toLowerCase() as Address,
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

  private getFactoryAddress(chain: ChainId): Address | null {
    switch (chain) {
      case ETHEREUM:
        return '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f';
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
  return `${token0Symbol}/${token1Symbol} Pool`;
}

export default Source;
