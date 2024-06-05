import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import rhinestoneV1RegistryAbi from '@/abi/rhinestoneV1Registry.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SingleLabelMap } from '@/labels/base.js';
import {
  getLabelNamespaceByValue,
  getLabelTypeById,
  initSingleLabelMap,
} from '@/labels/utils.js';
import { CHAINS } from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getEvents } from '@/utils/fetching.js';

interface Module {
  address: Address;
  sender: Address;
  resolver: Hex;
}

const REGISTRY_ADDRESS = '0xe0cde9239d16bef05e62bbf7aa93e420f464c826';
const NAMESPACE = 'Rhinestone V1';

class Source extends BaseSource {
  getName(): string {
    return 'Rhinestone V1 Registry';
  }

  async fetch(): Promise<SingleLabelMap> {
    const labels = initSingleLabelMap();
    for (const chain of CHAINS) {
      const chainLabels = await this.fetchLabels(chain);
      labels[chain] = chainLabels;
    }

    return labels;
  }

  private async fetchLabels(chain: ChainId): Promise<ChainSingleLabelMap> {
    const topics = encodeEventTopics({
      abi: rhinestoneV1RegistryAbi,
      eventName: 'ModuleRegistration',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, REGISTRY_ADDRESS, topic);

    const modules: Module[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: rhinestoneV1RegistryAbi,
        data: event.data,
        topics: event.topics as [Hex, ...Hex[]],
      });
      if (decodedEvent.eventName !== 'ModuleRegistration') {
        throw new Error('Invalid event name');
      }
      return {
        address: decodedEvent.args.implementation.toLowerCase() as Address,
        sender: decodedEvent.args.sender.toLowerCase() as Address,
        resolver: decodedEvent.args.resolver as Hex,
      };
    });

    return Object.fromEntries(
      modules.map((module) => {
        return [
          module.address,
          {
            value: 'Module',
            type: getLabelTypeById('rhinestone-v1-module'),
            namespace: getLabelNamespaceByValue(NAMESPACE),
          },
        ];
      }),
    );
  }
}

export default Source;
