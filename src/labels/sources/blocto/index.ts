import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { SingleLabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Blocto';
  }

  async fetch(): Promise<SingleLabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const labels: Record<Address, string> = {
      '0xa312d8d37be746bd09cbd9e9ba2ef16bc7da48ff': 'Paymaster',
    };
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, labels);
      addresses[chain] = chainAddresses;
    }
    return toLabelMap(addresses, 'Blocto');
  }
}

export default Source;
