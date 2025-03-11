import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Otim',
      id: 'otim',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const contracts: Record<Address, string> = {
      '0xfb0902c1b39fa8f8a05740edb5432117605ea0e1': '7702 Account',
    };
    const chainAddresses = await getDeployed(chain, contracts);
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'otim');
  }
}

export default Source;
