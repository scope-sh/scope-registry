import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';

import collections from './collections.json';

interface Collection {
  value: string;
  type: 'erc721' | 'erc1155';
  iconUrl?: string;
}

// Source: OpenSea API (get collections)
class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'OpenSea Collection',
      id: 'opensea-collections',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'full',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const chainAddresses = (
      collections as Partial<Record<ChainId, Record<Address, Collection>>>
    )[chain];
    if (!chainAddresses) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(chainAddresses).map(([address, collection]) => {
        return [
          address,
          {
            value: collection.value,
            sourceId: this.getInfo().id,
            indexed: true,
            type: collection.type,
            iconUrl: collection.iconUrl,
          },
        ];
      }),
    );
  }
}

export default Source;
