import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import biconomyV2FactoryAbi from '@/abi/biconomyV2Factory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainLabelMap, LabelMap } from '@/labels/base.js';
import { initLabelMap } from '@/labels/utils.js';
import { CHAINS } from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getEvents } from '@/utils/fetching.js';

interface Account {
  address: Address;
  initialAuthModule: Address;
}

const FACTORY_ADDRESS = '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f';

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
        data: event.data as Hex,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        topics: event.topics,
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
            type: 'biconomy-v2-account',
            namespace: 'Biconomy V2',
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
        data: event.data as Hex,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        topics: event.topics,
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
            type: 'biconomy-v2-account',
            namespace: 'Biconomy V2',
          },
        ];
      }),
    );
  }
}

export default Source;
