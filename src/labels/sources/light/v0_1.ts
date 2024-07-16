import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Light V0.1',
      id: 'light-v0_1',
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
    const labels: Record<Address, string> = {
      '0x0000000000756d3e6464f5efe7e413a0af1c7474': 'Factory V0.1',
      '0x8fb3cfdf2082c2be7d3205d361067748ea1abf63': 'Implementation V0.1',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'light');
  }
}

export default Source;
