import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import rhinestoneV1RegistryAbi from '@/abi/rhinestoneV1Registry.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

interface Module {
  address: Address;
  sender: Address;
  resolver: Hex;
}

const REGISTRY_ADDRESS = '0xe0cde9239d16bef05e62bbf7aa93e420f464c826';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Rhinestone V1 Registry',
      id: 'rhinestone-v1-registry',
      interval: {
        seconds: 0,
        minutes: 1,
        hours: 0,
        days: 0,
      },
      fetchType: 'incremental',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const topics = encodeEventTopics({
      abi: rhinestoneV1RegistryAbi,
      eventName: 'ModuleRegistration',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(this.getInfo(), chain, REGISTRY_ADDRESS, topic);

    const modules: Module[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: rhinestoneV1RegistryAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'ModuleRegistration') {
        throw new Error('Invalid event name');
      }
      return {
        address: decodedLog.args.implementation.toLowerCase() as Address,
        sender: decodedLog.args.sender.toLowerCase() as Address,
        resolver: decodedLog.args.resolver as Hex,
      };
    });

    return Object.fromEntries(
      modules.map((module) => {
        return [
          module.address,
          {
            value: 'Module',
            sourceId: this.getInfo().id,
            indexed: false,
            type: 'rhinestone-v1-module',
            namespace: 'rhinestone-v1',
          },
        ];
      }),
    );
  }
}

export default Source;
