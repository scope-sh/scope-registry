import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Blocto';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0xa312d8d37be746bd09cbd9e9ba2ef16bc7da48ff': 'Paymaster',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(chainAddresses, true, 'blocto');
  }
}

export default Source;
