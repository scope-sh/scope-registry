import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Ambire',
      id: 'ambire',
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
    const paymasters: Record<Address, string> = {
      '0xa8b267c68715fa1dca055993149f30217b572cf0': 'Paymaster',
    };
    const chainAddresses = await getDeployed(chain, paymasters);
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'ambire');
  }
}

export default Source;
