import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'UniPass',
      id: 'unipass',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'incremental',
    };
  }

  async fetch(): Promise<ChainSingleLabelMap> {
    const bundlers: Address[] = ['0xfa19fb4d871af87cc737499bceee041453f2fb6b'];
    const chainAddresses: Record<Address, string> = {};
    for (const bundler of bundlers) {
      chainAddresses[bundler] = 'Bundler';
    }
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'unipass');
  }
}

export default Source;
