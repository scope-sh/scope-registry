import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';
import { ETHEREUM } from '@/utils/chains.js';

import { toLabelMap } from '../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Overwrite';
  }

  async fetch(): Promise<LabelMap> {
    const addresses: Record<string, Record<Address, string>> = {
      [ETHEREUM]: {
        '0x0000000000000000000000000000000000000000': 'Zero Address',
      },
    };
    return toLabelMap(addresses);
  }
}

export default Source;
