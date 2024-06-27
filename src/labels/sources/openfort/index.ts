import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Openfort';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const paymasters: Record<Address, string> = {
      '0xd71e61dde321dcde58886479a47f1142bbf0c6d6': 'Paymaster V2',
    };
    const chainAddresses = await getDeployed(chain, paymasters);
    return toChainLabelMap(chainAddresses, 'openfort');
  }
}

export default Source;
