import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import kernelV2FactoryAbi from '@/abi/kernelV2Factory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { getLabelTypeById, getNamespaceById } from '@/labels/utils.js';
import type { ChainId } from '@/utils/chains.js';
import { getEvents } from '@/utils/fetching.js';

const FACTORY_ADDRESS = '0x5de4839a76cf55d0c90e2061ef4386d962e15ae3';

class Source extends BaseSource {
  getName(): string {
    return 'ZeroDev Kernel V2 Accounts';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const topics = encodeEventTopics({
      abi: kernelV2FactoryAbi,
      eventName: 'Deployed',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, FACTORY_ADDRESS, topic);

    const accounts: Address[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: kernelV2FactoryAbi,
        data: event.data,
        topics: event.topics as [Hex, ...Hex[]],
      });
      if (decodedEvent.eventName !== 'Deployed') {
        throw new Error('Invalid event name');
      }
      return decodedEvent.args.proxy.toLowerCase() as Address;
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            type: getLabelTypeById('kernel-v2-account'),
            namespace: getNamespaceById('zerodev-kernel-v2'),
          },
        ];
      }),
    );
  }
}

export default Source;
