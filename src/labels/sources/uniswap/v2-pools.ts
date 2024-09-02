import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import uniswapV2FactoryAbi from '@/abi/uniswapV2Factory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type {
  ChainLabelMap,
  ChainSingleLabelMap,
  SourceInfo,
} from '@/labels/base.js';
import { ETHEREUM } from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

interface Pool {
  address: Address;
  token0: Address;
  token1: Address;
}

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Uniswap V2 Pools',
      id: 'uniswap-v2-pools',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'full',
      requiresErc20: true,
    };
  }

  async fetch(
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
    const logs = await getLogs(this.getInfo(), chain, address, topic);

    const pools: Pool[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: uniswapV2FactoryAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'PairCreated') {
        throw new Error('Invalid event name');
      }
      return {
        address: decodedLog.args.pair.toLowerCase() as Address,
        token0: decodedLog.args.token0.toLowerCase() as Address,
        token1: decodedLog.args.token1.toLowerCase() as Address,
      };
    });

    return Object.fromEntries(
      pools.map((pool) => {
        const value = getPoolLabel(pool, previousLabels);
        return [
          pool.address,
          {
            value,
            sourceId: this.getInfo().id,
            indexed: true,
            type: 'uniswap-v2-pool',
            namespace: 'uniswap-v2',
            metadata: {
              tokens: [pool.token0, pool.token1],
            },
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
    (label) => label.type && label.type === 'erc20',
  );
  const token1Label = token1Labels.find(
    (label) => label.type && label.type === 'erc20',
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
