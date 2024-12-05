import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'ZeroDev Infra',
      id: 'zerodev-infra',
    };
  }

  async fetch(): Promise<ChainSingleLabelMap> {
    const bundlers: Address[] = ['0x3cfeb8b4b35bd5093990798b30a8610c80809bd8'];
    const chainAddresses: Record<Address, string> = {};
    for (const bundler of bundlers) {
      chainAddresses[bundler] = 'Bundler';
    }
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'zerodev');
  }
}

export default Source;
