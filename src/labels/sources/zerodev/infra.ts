import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'ZeroDev Infra';
  }

  async fetch(): Promise<LabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const bundlers: Address[] = ['0x3cfeb8b4b35bd5093990798b30a8610c80809bd8'];
    for (const chain of CHAINS) {
      const chainAddresses: Record<Address, string> = {};
      for (const bundler of bundlers) {
        chainAddresses[bundler] = 'Bundler';
      }
      addresses[chain] = chainAddresses;
    }
    return toLabelMap(addresses, 'ZeroDev');
  }
}

export default Source;
