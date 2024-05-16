import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import entryPointV0_6_0Abi from '@/abi/entryPointV0_6_0.js';
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

const ENTRYPOINT_0_6_0_ADDRESS = '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789';
const FACTORY_ADDRESS = '0x0ba5ed0c6aa8c49038f819e587e2633c4a9f428a';
const NAMESPACE = 'Coinbase Smart Wallet';

class Source extends BaseSource {
  getName(): string {
    return 'Coinbase Smart Wallet V1 Accounts';
  }

  async fetch(): Promise<LabelMap> {
    const labels = initLabelMap();
    for (const chain of CHAINS) {
      const accounts = await this.fetchAccounts(chain);
      labels[chain] = accounts;
    }

    return labels;
  }

  private async fetchAccounts(chain: ChainId): Promise<ChainLabelMap> {
    const topics = encodeEventTopics({
      abi: entryPointV0_6_0Abi,
      eventName: 'AccountDeployed',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, ENTRYPOINT_0_6_0_ADDRESS, topic);

    const accounts: Address[] = events
      .map((event) => {
        const decodedEvent = decodeEventLog({
          abi: entryPointV0_6_0Abi,
          data: event.data,
          topics: event.topics as [Hex, ...Hex[]],
        });
        if (decodedEvent.eventName !== 'AccountDeployed') {
          throw new Error('Invalid event name');
        }
        return decodedEvent;
      })
      .filter((log) => log.args.factory.toLowerCase() === FACTORY_ADDRESS)
      .map((log) => log.args.sender.toLowerCase() as Address);

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            type: getLabelTypeById('coinbase-smart-wallet-v1-account'),
            namespace: getLabelNamespaceByValue(NAMESPACE),
          },
        ];
      }),
    );
  }
}

export default Source;
