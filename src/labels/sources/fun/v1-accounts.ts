import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import funV1FactoryAbi from '@/abi/funV1Factory.js';
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

const FACTORY_ADDRESS = '0xbada4b9bdc249b788a6247e4a8a9158ed0b3e504';
const NAMESPACE = 'Fun';

class Source extends BaseSource {
  getName(): string {
    return 'Fun V1 Accounts';
  }

  async fetch(): Promise<SingleLabelMap> {
    const labels = initSingleLabelMap();
    for (const chain of CHAINS) {
      const accounts = await this.fetchAccounts(chain);
      labels[chain] = accounts;
    }

    return labels;
  }

  private async fetchAccounts(chain: ChainId): Promise<ChainSingleLabelMap> {
    const topics = encodeEventTopics({
      abi: funV1FactoryAbi,
      eventName: 'AccountCreated',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, FACTORY_ADDRESS, topic);

    const accounts: Address[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: funV1FactoryAbi,
        data: event.data,
        topics: event.topics as [Hex, ...Hex[]],
      });
      if (decodedEvent.eventName !== 'AccountCreated') {
        throw new Error('Invalid event name');
      }
      return decodedEvent.args.funWallet.toLowerCase() as Address;
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            type: getLabelTypeById('fun-v1-account'),
            namespace: getLabelNamespaceByValue(NAMESPACE),
          },
        ];
      }),
    );
  }
}

export default Source;
