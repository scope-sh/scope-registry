import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Parifi V1',
      id: 'parifi-v1',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'full',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const contracts: Record<Address, string> = {
      '0xe9976ab03ae60d092ca18009991231fa6b4d68f9': 'Order Manager',
    };
    const chainAddresses = await getDeployed(chain, contracts);
    return toChainLabelMap(
      this.getInfo().id,
      chainAddresses,
      true,
      'parifi-v1',
    );
  }
}

export default Source;
