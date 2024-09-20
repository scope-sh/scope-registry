import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

import erc721Addresses from './addresses-721.json';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Zora',
      id: 'zora',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 7,
      },
      fetchType: 'full',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const erc721ChainAddresses = (
      erc721Addresses as Partial<Record<ChainId, Record<Address, string>>>
    )[chain];
    const contracts: Record<Address, string> = {
      '0xabcdefed93200601e1dfe26d6644758801d732e8': 'JSON Extension Registry',
      '0x7777777f279eba3d3ad8f4e708545291a6fdba8b': 'Protocol Rewards',
      '0x777777c338d93e2c7adf08d102d45ca7cc4ed021': 'ERC-1155 Factory',
      '0x7777773606e7e46c8ba8b98c08f5cd218e31d340': '1155 Preminter',
      '0x777777722d078c97c6ad07d9f36801e653e356ae': 'Timed Sell Strategy',
    };
    if (erc721ChainAddresses) {
      Object.assign(contracts, erc721ChainAddresses);
    }
    const chainAddresses = await getDeployed(chain, contracts);
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'zora');
  }
}

export default Source;
