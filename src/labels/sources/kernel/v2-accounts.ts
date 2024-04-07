import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import kernelV2FactoryAbi from '@/abi/kernelV2Factory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainLabelMap, LabelMap } from '@/labels/base.js';
import { initLabelMap } from '@/labels/utils.js';
import { CHAINS } from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getEvents } from '@/utils/fetching.js';

const FACTORY_ADDRESS = '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3';

class Source extends BaseSource {
  getName(): string {
    return 'Kernel V2 Pools';
  }

  async fetch(): Promise<LabelMap> {
    const labels = initLabelMap();
    for (const chain of CHAINS) {
      const chainLabels = await this.fetchChain(chain);
      labels[chain] = chainLabels;
    }

    return labels;
  }

  private async fetchChain(chain: ChainId): Promise<ChainLabelMap> {
    const topics = encodeEventTopics({
      abi: kernelV2FactoryAbi,
      eventName: 'Deployed',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, FACTORY_ADDRESS, topic);

    const accounts: Address[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: kernelV2FactoryAbi,
        data: event.data as Hex,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        topics: event.topics,
      });
      if (decodedEvent.eventName !== 'Deployed') {
        throw new Error('Invalid event name');
      }
      return decodedEvent.args.proxy;
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            type: 'kernel-v2-account',
            namespace: 'Kernel V2',
          },
        ];
      }),
    );
  }
}

export default Source;
