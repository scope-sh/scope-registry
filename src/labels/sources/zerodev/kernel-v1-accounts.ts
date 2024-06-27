import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import kernelV1FactoryAbi from '@/abi/kernelV1Factory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

const FACTORY_ADDRESS = '0x4e4946298614fc299b50c947289f4ad0572cb9ce';

class Source extends BaseSource {
  getName(): string {
    return 'ZeroDev Kernel V1 Accounts';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const topics = encodeEventTopics({
      abi: kernelV1FactoryAbi,
      eventName: 'AccountCreated',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(chain, FACTORY_ADDRESS, topic);

    const accounts: Address[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: kernelV1FactoryAbi,
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
            value: 'Account',
            indexed: false,
            type: 'kernel-v1-account',
            namespace: 'zerodev-kernel-v1',
          },
        ];
      }),
    );
  }
}

export default Source;
