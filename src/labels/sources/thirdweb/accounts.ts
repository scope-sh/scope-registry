import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import thirdwebV1ManagedAccountFactoryAbi from '@/abi/thirdwebV1ManagedAccountFactory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

const FACTORY_ADDRESS = '0x463effb51873c7720c810ac7fb2e145ec2f8cc60';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Thirdweb Accounts',
      id: 'thirdweb-accounts',
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
    const topics = encodeEventTopics({
      abi: thirdwebV1ManagedAccountFactoryAbi,
      eventName: 'AccountCreated',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(this.getInfo(), chain, FACTORY_ADDRESS, topic);

    const accounts: Address[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: thirdwebV1ManagedAccountFactoryAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'AccountCreated') {
        throw new Error('Invalid event name');
      }
      return decodedLog.args.account.toLowerCase() as Address;
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Managed Account',
            sourceId: this.getInfo().id,
            indexed: false,
            type: 'thirdweb-v1-managed-account',
            namespace: 'thirdweb',
          },
        ];
      }),
    );
  }
}

export default Source;
