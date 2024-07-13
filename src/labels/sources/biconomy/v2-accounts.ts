import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import biconomyV2FactoryAbi from '@/abi/biconomyV2Factory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

interface Account {
  address: Address;
  initialAuthModule: Address;
}

const FACTORY_ADDRESS = '0x000000a56aaca3e9a4c479ea6b6cd0dbcb6634f5';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Biconomy V2 Accounts',
      id: 'biconomy-v2-accounts',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'full',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const creations = await this.fetchCreations(chain);
    const creationsWithoutIndex = await this.fetchCreationsWithoutIndex(chain);
    const labels = {
      ...creations,
      ...creationsWithoutIndex,
    };
    return labels;
  }

  private async fetchCreations(chain: ChainId): Promise<ChainSingleLabelMap> {
    const topics = encodeEventTopics({
      abi: biconomyV2FactoryAbi,
      eventName: 'AccountCreation',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(this.getInfo(), chain, FACTORY_ADDRESS, topic);

    const accounts: Account[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: biconomyV2FactoryAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'AccountCreation') {
        throw new Error('Invalid event name');
      }
      return {
        address: decodedLog.args.account.toLowerCase() as Address,
        initialAuthModule:
          decodedLog.args.initialAuthModule.toLowerCase() as Address,
      };
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account.address,
          {
            value: 'Account',
            sourceId: this.getInfo().id,
            indexed: false,
            type: 'biconomy-v2-account',
            namespace: 'biconomy-v2',
          },
        ];
      }),
    );
  }

  private async fetchCreationsWithoutIndex(
    chain: ChainId,
  ): Promise<ChainSingleLabelMap> {
    const topics = encodeEventTopics({
      abi: biconomyV2FactoryAbi,
      eventName: 'AccountCreationWithoutIndex',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(this.getInfo(), chain, FACTORY_ADDRESS, topic);

    const accounts: Account[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: biconomyV2FactoryAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'AccountCreationWithoutIndex') {
        throw new Error('Invalid event name');
      }
      return {
        address: decodedLog.args.account.toLowerCase() as Address,
        initialAuthModule:
          decodedLog.args.initialAuthModule.toLowerCase() as Address,
      };
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account.address,
          {
            value: 'Account',
            sourceId: this.getInfo().id,
            indexed: false,
            type: 'biconomy-v2-account',
            namespace: 'biconomy-v2',
          },
        ];
      }),
    );
  }
}

export default Source;
