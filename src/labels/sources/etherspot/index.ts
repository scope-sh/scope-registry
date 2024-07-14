import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { toChainLabelMap } from '@/labels/utils';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Etherspot',
      id: 'etherspot',
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
    const paymasters: Record<Address, string> = {
      '0x7f690e93cecfca5a31e6e1df50a33f6d3059048c': 'Paymaster',
      '0x26fec24b0d467c9de105217b483931e8f944ff50': 'Paymaster',
      '0xec2ee24e79c73db13dd9bc782856a5296626b7eb': 'Paymaster',
      '0x805650ce74561c85baa44a8bd13e19633fd0f79d': 'Paymaster',
    };
    const bundlers: Address[] = [
      '0x175a9777c6cf26e26947210bd8bab324d60dcf3c',
      '0x29830065d28765e34c19eb774794f010e7b50cf9',
      '0x4e0df48f7584ad9ae9978c60178ef726345cc48a',
      '0x6baad70fc330c22cf26b51897b84fd3281d283a2',
      '0x7c1c87d06f88786d4da52a0e81f82aea9d90e1ec',
      '0x9776cab4a2dce3dc96db55c919eee822c40b94ee',
      '0xc360e1da5b9bdb9a8879a0cfa1180556426e2305',
      '0xc85a109221d6b3593b01b36d5b2b6719d2ab7518',
      '0xdcdd0ddeaa0407c26dfcd481de9a34e1c55f8d54',
      '0xfb925186f787694009ab6404b9caab95bc7ae377',
    ];
    const chainAddresses = await getDeployed(chain, paymasters);
    for (const bundler of bundlers) {
      chainAddresses[bundler] = 'Bundler';
    }
    return toChainLabelMap(
      this.getInfo().id,
      chainAddresses,
      true,
      'etherspot',
    );
  }
}

export default Source;
