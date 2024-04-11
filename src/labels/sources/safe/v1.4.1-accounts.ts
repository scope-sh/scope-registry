import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import safeV141FactoryAbi from '@/abi/safeV141Factory.js';
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

const FACTORY_ADDRESS = '0x4e1dcf7ad4e460cfd30791ccc4f9c8a4f820ec67';
const NAMESPACE = 'Safe V1.4.1';

class Source extends BaseSource {
  getName(): string {
    return 'Safe V1.4.1 Accounts';
  }

  async fetch(): Promise<LabelMap> {
    const labels = initLabelMap();
    for (const chain of CHAINS) {
      const chainLabels = await this.fetchLabels(chain);
      labels[chain] = chainLabels;
    }

    return labels;
  }

  private async fetchLabels(chain: ChainId): Promise<ChainLabelMap> {
    const topics = encodeEventTopics({
      abi: safeV141FactoryAbi,
      eventName: 'ProxyCreation',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, FACTORY_ADDRESS, topic);

    const accounts: Address[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: safeV141FactoryAbi,
        data: event.data as Hex,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        topics: event.topics,
      });
      if (decodedEvent.eventName !== 'ProxyCreation') {
        throw new Error('Invalid event name');
      }
      return decodedEvent.args.proxy.toLowerCase() as Address;
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            type: getLabelTypeById('safe-v1.4.1-account'),
            namespace: getLabelNamespaceByValue(NAMESPACE),
          },
        ];
      }),
    );
  }
}

export default Source;
