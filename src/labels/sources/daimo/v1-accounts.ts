import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import daimoV1NameRegistryAbi from '@/abi/daimoV1NameRegistry.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { getLabelNamespaceByValue, getLabelTypeById } from '@/labels/utils.js';
import type { ChainId } from '@/utils/chains.js';
import { getEvents } from '@/utils/fetching.js';

const REGISTRY_ADDRESS = '0x4430a644b215a187a3daa5b114fa3f3d9debc17d';
const NAMESPACE = 'Daimo';

class Source extends BaseSource {
  getName(): string {
    return 'Daimo V1 Accounts';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const topics = encodeEventTopics({
      abi: daimoV1NameRegistryAbi,
      eventName: 'Registered',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, REGISTRY_ADDRESS, topic);

    const accounts: Address[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: daimoV1NameRegistryAbi,
        data: event.data,
        topics: event.topics as [Hex, ...Hex[]],
      });
      if (decodedEvent.eventName !== 'Registered') {
        throw new Error('Invalid event name');
      }
      return decodedEvent.args.addr.toLowerCase() as Address;
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            type: getLabelTypeById('daimo-v1-account'),
            namespace: getLabelNamespaceByValue(NAMESPACE),
          },
        ];
      }),
    );
  }
}

export default Source;
