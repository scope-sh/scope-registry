import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import entryPointV0_7_0Abi from '@/abi/entryPointV0_7_0.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainLabelMap, LabelMap } from '@/labels/base.js';
import {
  getLabelNamespaceByValue,
  getLabelTypeById,
  initLabelMap,
} from '@/labels/utils.js';
import { CHAINS } from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getEvents } from '@/utils/fetching.js';

const ENTRYPOINT_0_7_0_ADDRESS = '0x0000000071727de22e5e9d8baf0edac6f37da032';
const KERNEL_V3_FACTORY_STAKER_ADDRESS =
  '0xd703aae79538628d27099b8c4f621be4ccd142d5';
const NAMESPACE = 'ZeroDev Kernel V3';

class Source extends BaseSource {
  getName(): string {
    return 'ZeroDev Kernel V3 Accounts';
  }

  async fetch(): Promise<LabelMap> {
    const labels = initLabelMap();
    for (const chain of CHAINS) {
      const chainLabels = await this.fetchChain(chain);
      labels[chain] = chainLabels;
    }

    return labels;
  }

  private async fetchChain(chain: ChainId): Promise<ChainLabelMap> {
    const topics = encodeEventTopics({
      abi: entryPointV0_7_0Abi,
      eventName: 'AccountDeployed',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, ENTRYPOINT_0_7_0_ADDRESS, topic);

    const accounts: Address[] = events
      .map((event) => {
        const decodedEvent = decodeEventLog({
          abi: entryPointV0_7_0Abi,
          data: event.data,
          topics: event.topics as [Hex, ...Hex[]],
        });
        if (decodedEvent.eventName !== 'AccountDeployed') {
          throw new Error('Invalid event name');
        }
        return {
          factory: decodedEvent.args.factory,
          sender: decodedEvent.args.sender,
        };
      })
      .filter(
        (account) =>
          account.factory.toLowerCase() === KERNEL_V3_FACTORY_STAKER_ADDRESS,
      )
      .map((account) => account.sender.toLowerCase() as Address);

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
