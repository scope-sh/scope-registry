import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Fun V1',
      id: 'fun-v1',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0xbada4b9bdc249b788a6247e4a8a9158ed0b3e504': 'Factory',
      '0xa86096145c4ee02d08aeb434e3125d0d1b442495': 'Checkout Paymaster',
      '0x784deed2f7182e0e92438879bf1cc3cd6542f8f7': 'Checkout Paymaster',
      '0xb3dea1dd1d9ac323041850c0a15c578c883f3f6f': 'User Authentication',
      '0x996eacbd74d94c77bd6eda46dabf99608dbb336e': 'Role Based Access Control',
      '0xe65d63a9b4842c0dc0916ae5368356ca0212f2cb': 'Approve and Swap',
      '0xd953eda57eab69f2eb0103bffa9acc66ea98e0ab': 'Approve and Exec',
      '0x16f0623a6a9e0f9992a5c5589c98f2607cb6af51': 'Uniswap V3 Limit Order',
      '0x973e8345610829b4b7a9c7b10dcef8a4a728ba39': 'Uniswap V3 Limit Order',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'fun');
  }
}

export default Source;
