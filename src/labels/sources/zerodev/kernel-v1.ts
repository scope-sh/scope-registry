import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'ZeroDev Kernel V1',
      id: 'zerodev-kernel-v1',
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
    const labels: Record<Address, string> = {
      '0x4e4946298614fc299b50c947289f4ad0572cb9ce': 'Factory',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(
      this.getInfo().id,
      chainAddresses,
      true,
      'zerodev-kernel-v1',
    );
  }
}

export default Source;
