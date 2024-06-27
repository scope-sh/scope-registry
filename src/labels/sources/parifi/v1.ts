import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Parifi V1';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const contracts: Record<Address, string> = {
      '0xe9976ab03ae60d092ca18009991231fa6b4d68f9': 'Order Manager',
    };
    const chainAddresses = await getDeployed(chain, contracts);
    return toChainLabelMap(chainAddresses, true, 'parifi-v1');
  }
}

export default Source;
