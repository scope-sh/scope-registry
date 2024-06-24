import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import funV1FactoryAbi from '@/abi/funV1Factory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { getLabelTypeById, getNamespaceById } from '@/labels/utils.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

const FACTORY_ADDRESS = '0xbada4b9bdc249b788a6247e4a8a9158ed0b3e504';

class Source extends BaseSource {
  getName(): string {
    return 'Fun V1 Accounts';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const topics = encodeEventTopics({
      abi: funV1FactoryAbi,
      eventName: 'AccountCreated',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(chain, FACTORY_ADDRESS, topic);

    const accounts: Address[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: funV1FactoryAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'AccountCreated') {
        throw new Error('Invalid event name');
      }
      return decodedLog.args.funWallet.toLowerCase() as Address;
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            type: getLabelTypeById('fun-v1-account'),
            namespace: getNamespaceById('fun'),
          },
        ];
      }),
    );
  }
}

export default Source;
