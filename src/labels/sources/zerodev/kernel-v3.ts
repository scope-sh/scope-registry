import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'ZeroDev Kernel V3';
  }

  async fetch(): Promise<LabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const labels: Record<Address, string> = {
      '0xd703aae79538628d27099b8c4f621be4ccd142d5': 'Meta Factory',
      '0x94f097e1ebeb4eca3aae54cabb08905b239a7d27': 'Implementation',
      '0x6723b44abeec4e71ebe3232bd5b455805badd22f': 'Factory',
    };
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, labels);
      addresses[chain] = chainAddresses;
    }
    return toLabelMap(addresses, 'ZeroDev Kernel V3');
  }
}

export default Source;
