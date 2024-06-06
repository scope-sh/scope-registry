import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { ChainId, ETHEREUM } from '@/utils/chains.js';

import { toChainLabelMap } from '../utils';

class Source extends BaseSource {
  override getName(): string {
    return 'Overwrite';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const addresses: Record<string, Record<Address, string>> = {
      [ETHEREUM]: {
        '0x0000000000000000000000000000000000000000': 'Zero Address',
      },
    };
    const chainAddresses = addresses[chain];
    return toChainLabelMap(chainAddresses);
  }
}

export default Source;
