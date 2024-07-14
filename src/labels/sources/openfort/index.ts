import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Openfort',
      id: 'openfort',
      interval: {
        seconds: 0,
        minutes: 1,
        hours: 0,
        days: 0,
      },
      fetchType: 'incremental',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const paymasters: Record<Address, string> = {
      '0xd71e61dde321dcde58886479a47f1142bbf0c6d6': 'Paymaster V2',
    };
    const chainAddresses = await getDeployed(chain, paymasters);
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'openfort');
  }
}

export default Source;
