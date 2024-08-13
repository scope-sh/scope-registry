import { Address, Hex, decodeEventLog, encodeEventTopics } from 'viem';

import morphoFactoryAbi from '@/abi/morphoFactory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

import namedVaults from './vaults.json';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Morpho Vaults',
      id: 'morpho-blue-vaults',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'full',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const chainNamedVaults =
      (namedVaults as Partial<Record<ChainId, Record<Address, string>>>)[
        chain
      ] || {};
    const address = '0xa9c3d3a366466fa809d1ae982fb2c46e5fc41101';
    if (!address) {
      return {};
    }
    const topics = encodeEventTopics({
      abi: morphoFactoryAbi,
      eventName: 'CreateMetaMorpho',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(this.getInfo(), chain, address, topic);

    const vaults: Address[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: morphoFactoryAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'CreateMetaMorpho') {
        throw new Error('Invalid event name');
      }
      return decodedLog.args.metaMorpho.toLowerCase() as Address;
    });

    return Object.fromEntries(
      vaults.map((vault) => [
        vault,
        {
          value: chainNamedVaults[vault] || 'Vault',
          sourceId: this.getInfo().id,
          indexed: true,
          type: 'morpho-vault',
          namespace: 'morpho',
        },
      ]),
    );
  }
}

export default Source;
