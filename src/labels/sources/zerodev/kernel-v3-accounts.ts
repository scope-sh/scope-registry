import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import entryPointV0_7_0Abi from '@/abi/entryPointV0_7_0.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { getLabelNamespaceByValue, getLabelTypeById } from '@/labels/utils.js';
import type { ChainId } from '@/utils/chains.js';
import {
  ENTRYPOINT_0_7_0_ADDRESS,
  getEntryPoint0_7_0Predicate,
} from '@/utils/entryPoint.js';
import { getEvents } from '@/utils/fetching.js';

const KERNEL_V3_FACTORY_STAKER_ADDRESS =
  '0xd703aae79538628d27099b8c4f621be4ccd142d5';
const NAMESPACE = 'ZeroDev Kernel V3';

class Source extends BaseSource {
  getName(): string {
    return 'ZeroDev Kernel V3 Accounts';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const topics = encodeEventTopics({
      abi: entryPointV0_7_0Abi,
      eventName: 'AccountDeployed',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(
      chain,
      ENTRYPOINT_0_7_0_ADDRESS,
      topic,
      getEntryPoint0_7_0Predicate(KERNEL_V3_FACTORY_STAKER_ADDRESS),
    );

    const accounts: Address[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: entryPointV0_7_0Abi,
        data: event.data,
        topics: event.topics as [Hex, ...Hex[]],
      });
      if (decodedEvent.eventName !== 'AccountDeployed') {
        throw new Error('Invalid event name');
      }
      return decodedEvent.args.sender.toLowerCase() as Address;
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            type: getLabelTypeById('kernel-v3-account'),
            namespace: getLabelNamespaceByValue(NAMESPACE),
          },
        ];
      }),
    );
  }
}

export default Source;
