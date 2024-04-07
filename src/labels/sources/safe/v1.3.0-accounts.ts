import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import safeV130FactoryAbi from '@/abi/safeV130Factory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainLabelMap, LabelMap } from '@/labels/base.js';
import { initLabelMap } from '@/labels/utils.js';
import { CHAINS, LINEA_SEPOLIA, POLYGON_AMOY } from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getEvents } from '@/utils/fetching.js';

import addresses from './v1.3.0-addresses.json';

class Source extends BaseSource {
  getName(): string {
    return 'Safe V1.3.0 Accounts';
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
    if (chain === LINEA_SEPOLIA) {
      return {};
    }
    if (chain === POLYGON_AMOY) {
      return {};
    }
    const chainAddresses = addresses[chain];
    if (!chainAddresses) {
      return {};
    }
    const factoryAddress = chainAddresses['Proxy Factory'];
    if (!factoryAddress) {
      return {};
    }
    const topics = encodeEventTopics({
      abi: safeV130FactoryAbi,
      eventName: 'ProxyCreation',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, factoryAddress, topic);

    const accounts: Address[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: safeV130FactoryAbi,
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
            type: 'safe-v1.3.0-account',
            namespace: 'Safe V1.3.0',
          },
        ];
      }),
    );
  }
}

export default Source;
