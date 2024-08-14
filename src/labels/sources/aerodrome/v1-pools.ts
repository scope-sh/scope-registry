import { Address, Hex, decodeEventLog, encodeEventTopics } from 'viem';

import aerodromeFactoryAbi from '@/abi/aerodromeFactory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type {
  ChainLabelMap,
  ChainSingleLabelMap,
  SourceInfo,
} from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

interface Pool {
  address: Address;
  stable: boolean;
  token0: Address;
  token1: Address;
}

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Aerodrome Pools',
      id: 'aerodrome-v1-pools',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'full',
    };
  }

  async fetch(
    chain: ChainId,
    previousLabels: ChainLabelMap,
  ): Promise<ChainSingleLabelMap> {
    const address = '0x420dd381b31aef6683db6b902084cb0ffece40da';
    if (!address) {
      return {};
    }
    const topics = encodeEventTopics({
      abi: aerodromeFactoryAbi,
      eventName: 'PoolCreated',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(this.getInfo(), chain, address, topic);

    const pools: Pool[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: aerodromeFactoryAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'PoolCreated') {
        throw new Error('Invalid event name');
      }
      const token0 = decodedLog.args[0].toLowerCase() as Address;
      const token1 = decodedLog.args[1].toLowerCase() as Address;
      const stable = decodedLog.args[2];
      const pool = decodedLog.args[3].toLowerCase() as Address;
      return {
        address: pool,
        stable,
        token0,
        token1,
      };
    });

    return Object.fromEntries(
      pools.map((pool) => [
        pool.address,
        {
          value: getPoolLabel(pool, previousLabels),
          sourceId: this.getInfo().id,
          indexed: true,
          type: 'aerodrome-v1-pool',
          namespace: 'aerodrome-v1',
        },
      ]),
    );
  }
}

function getPoolLabel(pool: Pool, previousLabels: ChainLabelMap): string {
  const token0Labels = previousLabels[pool.token0];
  const token1Labels = previousLabels[pool.token1];
  const poolType = pool.stable ? 'Stable Pool' : 'Volatile Pool';
  if (!token0Labels || !token1Labels) {
    return poolType;
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
    return poolType;
  }
  const token0Symbol = token0Label.metadata.symbol as string;
  const token1Symbol = token1Label.metadata.symbol as string;
  return `${token0Symbol}/${token1Symbol} ${poolType}`;
}

export default Source;
