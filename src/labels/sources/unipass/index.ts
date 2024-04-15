import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'UniPass';
  }

  async fetch(): Promise<LabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const bundlers: Address[] = ['0xfa19fb4d871af87cc737499bceee041453f2fb6b'];
    for (const chain of CHAINS) {
      const chainAddresses: Record<Address, string> = {};
      for (const bundler of bundlers) {
        chainAddresses[bundler] = 'Bundler';
      }
      addresses[chain] = chainAddresses;
    }
    return toLabelMap(addresses, 'UniPass');
  }
}

export default Source;
