import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Parifi V1';
  }

  async fetch(): Promise<LabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const contracts: Record<Address, string> = {
      '0xe9976ab03ae60d092ca18009991231fa6b4d68f9': 'Order Manager',
    };
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, contracts);
      addresses[chain] = chainAddresses;
    }
    return toLabelMap(addresses, 'Parifi V1');
  }
}

export default Source;
