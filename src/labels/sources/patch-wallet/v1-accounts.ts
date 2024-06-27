import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import patchWalletV1FactoryAbi from '@/abi/patchWalletV1Factory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

const FACTORY_ADDRESS = '0x33ddf684dcc6937ffe59d8405aa80c41fb518c5c';

class Source extends BaseSource {
  getName(): string {
    return 'Patch Wallet V1 Accounts';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const topics = encodeEventTopics({
      abi: patchWalletV1FactoryAbi,
      eventName: 'Deployed',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(chain, FACTORY_ADDRESS, topic);

    const accounts: Address[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: patchWalletV1FactoryAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'Deployed') {
        throw new Error('Invalid event name');
      }
      return decodedLog.args.proxy.toLowerCase() as Address;
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            type: 'patch-wallet-v1-account',
            namespace: 'patch-wallet',
          },
        ];
      }),
    );
  }
}

export default Source;
