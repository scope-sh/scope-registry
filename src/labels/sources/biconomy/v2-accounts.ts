import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import biconomyV2FactoryAbi from '@/abi/biconomyV2Factory.js';
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

interface Account {
  address: Address;
  initialAuthModule: Address;
}

const FACTORY_ADDRESS = '0x000000a56aaca3e9a4c479ea6b6cd0dbcb6634f5';
const NAMESPACE = 'Biconomy V2';

class Source extends BaseSource {
  getName(): string {
    return 'Biconomy V2 Accounts';
  }

  async fetch(): Promise<LabelMap> {
    const labels = initLabelMap();
    for (const chain of CHAINS) {
      const creations = await this.fetchCreations(chain);
      const creationsWithoutIndex =
        await this.fetchCreationsWithoutIndex(chain);
      labels[chain] = {
        ...creations,
        ...creationsWithoutIndex,
      };
    }

    return labels;
  }

  private async fetchCreations(chain: ChainId): Promise<ChainLabelMap> {
    const topics = encodeEventTopics({
      abi: biconomyV2FactoryAbi,
      eventName: 'AccountCreation',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, FACTORY_ADDRESS, topic);

    const accounts: Account[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: biconomyV2FactoryAbi,
        data: event.data,
        topics: event.topics as [Hex, ...Hex[]],
      });
      if (decodedEvent.eventName !== 'AccountCreation') {
        throw new Error('Invalid event name');
      }
      return {
        address: decodedEvent.args.account.toLowerCase() as Address,
        initialAuthModule:
          decodedEvent.args.initialAuthModule.toLowerCase() as Address,
      };
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account.address,
          {
            value: 'Account',
            type: getLabelTypeById('biconomy-v2-account'),
            namespace: getLabelNamespaceByValue(NAMESPACE),
          },
        ];
      }),
    );
  }

  private async fetchCreationsWithoutIndex(
    chain: ChainId,
  ): Promise<ChainLabelMap> {
    const topics = encodeEventTopics({
      abi: biconomyV2FactoryAbi,
      eventName: 'AccountCreationWithoutIndex',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, FACTORY_ADDRESS, topic);

    const accounts: Account[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: biconomyV2FactoryAbi,
        data: event.data,
        topics: event.topics as [Hex, ...Hex[]],
      });
      if (decodedEvent.eventName !== 'AccountCreationWithoutIndex') {
        throw new Error('Invalid event name');
      }
      return {
        address: decodedEvent.args.account.toLowerCase() as Address,
        initialAuthModule:
          decodedEvent.args.initialAuthModule.toLowerCase() as Address,
      };
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account.address,
          {
            value: 'Account',
            type: getLabelTypeById('biconomy-v2-account'),
            namespace: getLabelNamespaceByValue(NAMESPACE),
          },
        ];
      }),
    );
  }
}

export default Source;
