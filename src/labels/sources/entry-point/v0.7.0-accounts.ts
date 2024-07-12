import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import entryPointV0_7_0Abi from '@/abi/entryPointV0_7_0.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { ENTRYPOINT_0_7_0_ADDRESS } from '@/utils/entryPoint.js';
import { getLogs } from '@/utils/fetching.js';

interface Account {
  sender: Address;
  factory: Address;
}

class Source extends BaseSource {
  getName(): string {
    return 'Entry Point V0.7.0 Accounts';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const topics = encodeEventTopics({
      abi: entryPointV0_7_0Abi,
      eventName: 'AccountDeployed',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(chain, ENTRYPOINT_0_7_0_ADDRESS, topic);

    const accounts: Account[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: entryPointV0_7_0Abi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'AccountDeployed') {
        throw new Error('Invalid event name');
      }
      return {
        sender: decodedLog.args.sender.toLowerCase() as Address,
        factory: decodedLog.args.factory.toLowerCase() as Address,
      };
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account.sender,
          {
            value: 'Entry Point V0.7.0 Account',
            indexed: false,
            type: 'entry-point-v0.7.0-account',
            metadata: {
              factory: account.factory,
            },
            priority: 10,
          },
        ];
      }),
    );
  }
}

export default Source;
