import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Nani';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0x00000000000009b4ab3f1bc2b029bd7513fbd8ed': 'Paymaster',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(chainAddresses, true, 'nani');
  }
}

export default Source;
