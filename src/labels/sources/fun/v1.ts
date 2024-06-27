import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Fun';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0xbada4b9bdc249b788a6247e4a8a9158ed0b3e504': 'Factory',
      '0xa86096145c4ee02d08aeb434e3125d0d1b442495': 'Checkout Paymaster',
      '0x784deed2f7182e0e92438879bf1cc3cd6542f8f7': 'Checkout Paymaster',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(chainAddresses, true, 'fun');
  }
}

export default Source;
