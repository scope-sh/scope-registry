import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import entryPointV0_6_0Abi from '@/abi/entryPointV0_6_0.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { ENTRYPOINT_0_6_0_ADDRESS } from '@/utils/entryPoint.js';
import { getLogs } from '@/utils/fetching.js';

interface Account {
  sender: Address;
  factory: Address;
}

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Entry Point V0.6.0 Accounts',
      id: 'entry-point-v0.6.0-accounts',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'incremental',
    };
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
      this.getInfo(),
      chain,
      ENTRYPOINT_0_6_0_ADDRESS,
      topic,
    );

    const accounts: Account[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: entryPointV0_6_0Abi,
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
            value: 'Entry Point V0.6.0 Account',
            sourceId: this.getInfo().id,
            indexed: false,
            type: 'entry-point-v0.6.0-account',
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
