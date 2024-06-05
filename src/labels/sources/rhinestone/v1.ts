import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { SingleLabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Rhinestone V1';
  }

  async fetch(): Promise<SingleLabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const labels: Record<Address, string> = {
      '0xe0cde9239d16bef05e62bbf7aa93e420f464c826': 'Module Registry',
      '0xff81c1c2075704d97f6806de6f733d6daf20c9c6':
        'ERC-7579 Reference Factory',
      '0x76104ae8aecfc3aec2aa6587b4790043d3612c47':
        'ERC-7579 Reference Singleton (Advanced)',
      '0x5e9f3feec2aa6706df50de955612d964f115523b':
        'ERC-7579 Reference Bootstrap',
    };
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, labels);
      addresses[chain] = chainAddresses;
    }
    return toLabelMap(addresses, 'Rhinestone V1');
  }
}

export default Source;
