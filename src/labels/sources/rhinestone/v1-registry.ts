import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import rhinestoneV1RegistryAbi from '@/abi/rhinestoneV1Registry.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

interface Module {
  address: Address;
  sender: Address;
  resolver: Hex;
}

const REGISTRY_ADDRESS = '0xe0cde9239d16bef05e62bbf7aa93e420f464c826';

class Source extends BaseSource {
  getName(): string {
    return 'Rhinestone V1 Registry';
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
    const logs = await getLogs(chain, REGISTRY_ADDRESS, topic);

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
            type: 'rhinestone-v1-module',
            namespace: 'rhinestone-v1',
          },
        ];
      }),
    );
  }
}

export default Source;
