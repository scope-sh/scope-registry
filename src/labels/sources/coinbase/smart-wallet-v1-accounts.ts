import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import entryPointV0_6_0Abi from '@/abi/entryPointV0_6_0.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import {
  ENTRYPOINT_0_6_0_ADDRESS,
  getEntryPoint0_6_0Predicate,
} from '@/utils/entryPoint.js';
import { getLogs } from '@/utils/fetching.js';

const FACTORY_ADDRESS = '0x0ba5ed0c6aa8c49038f819e587e2633c4a9f428a';

class Source extends BaseSource {
  getName(): string {
    return 'Coinbase Smart Wallet V1 Accounts';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const topics = encodeEventTopics({
      abi: entryPointV0_6_0Abi,
      eventName: 'AccountDeployed',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(
      chain,
      ENTRYPOINT_0_6_0_ADDRESS,
      topic,
      getEntryPoint0_6_0Predicate(FACTORY_ADDRESS),
    );

    const accounts: Address[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: entryPointV0_6_0Abi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'AccountDeployed') {
        throw new Error('Invalid event name');
      }
      return decodedLog.args.sender.toLowerCase() as Address;
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            type: 'coinbase-smart-wallet-v1-account',
            namespace: 'coinbase-smart-wallet',
          },
        ];
      }),
    );
  }
}

export default Source;
