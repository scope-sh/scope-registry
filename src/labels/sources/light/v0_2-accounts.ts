import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import entryPointV0_6_0Abi from '@/abi/entryPointV0_6_0.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainLabelMap, LabelMap } from '@/labels/base.js';
import {
  getLabelNamespaceByValue,
  getLabelTypeById,
  initLabelMap,
} from '@/labels/utils.js';
import { CHAINS } from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import {
  ENTRYPOINT_0_6_0_ADDRESS,
  getEntryPoint0_6_0Predicate,
} from '@/utils/entryPoint.js';
import { getEvents } from '@/utils/fetching.js';

const FACTORY_0_2_ADDRESS = '0x00000000001269b052c004ffb71b47ab22c898b0';
const NAMESPACE = 'Light V0.2';

class Source extends BaseSource {
  getName(): string {
    return 'Light V0.2 Accounts';
  }

  async fetch(): Promise<LabelMap> {
    const labels = initLabelMap();
    for (const chain of CHAINS) {
      const accounts = await this.fetchAccounts(chain);
      labels[chain] = accounts;
    }

    return labels;
  }

  private async fetchAccounts(chain: ChainId): Promise<ChainLabelMap> {
    const topics = encodeEventTopics({
      abi: entryPointV0_6_0Abi,
      eventName: 'AccountDeployed',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(
      chain,
      ENTRYPOINT_0_6_0_ADDRESS,
      topic,
      getEntryPoint0_6_0Predicate(FACTORY_0_2_ADDRESS),
    );

    const accounts: Address[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: entryPointV0_6_0Abi,
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
            type: getLabelTypeById('light-v0.2-account'),
            namespace: getLabelNamespaceByValue(NAMESPACE),
          },
        ];
      }),
    );
  }
}

export default Source;
