import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'ZeroDev Infra';
  }

  async fetch(): Promise<ChainSingleLabelMap> {
    const bundlers: Address[] = ['0x3cfeb8b4b35bd5093990798b30a8610c80809bd8'];
    const chainAddresses: Record<Address, string> = {};
    for (const bundler of bundlers) {
      chainAddresses[bundler] = 'Bundler';
    }
    return toChainLabelMap(chainAddresses, true, 'zerodev');
  }
}

export default Source;
