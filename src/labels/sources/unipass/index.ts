import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'UniPass';
  }

  async fetch(): Promise<ChainSingleLabelMap> {
    const bundlers: Address[] = ['0xfa19fb4d871af87cc737499bceee041453f2fb6b'];
    const chainAddresses: Record<Address, string> = {};
    for (const bundler of bundlers) {
      chainAddresses[bundler] = 'Bundler';
    }
    return toChainLabelMap(chainAddresses, 'unipass');
  }
}

export default Source;
