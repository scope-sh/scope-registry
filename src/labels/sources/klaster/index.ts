import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Klaster',
      id: 'klaster',
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
      '0xc31ad82a88609ee88e87d382509060f3490a8eb2': 'Paymaster',
    };
    const chainAddresses = await getDeployed(chain, paymasters);
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'klaster');
  }
}

export default Source;
