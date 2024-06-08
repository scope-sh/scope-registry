import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Rhinestone V1';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0xe0cde9239d16bef05e62bbf7aa93e420f464c826': 'Module Registry',
      '0xff81c1c2075704d97f6806de6f733d6daf20c9c6':
        'ERC-7579 Reference Factory',
      '0x76104ae8aecfc3aec2aa6587b4790043d3612c47':
        'ERC-7579 Reference Singleton (Advanced)',
      '0x5e9f3feec2aa6706df50de955612d964f115523b':
        'ERC-7579 Reference Bootstrap',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(chainAddresses, 'rhinestone-v1');
  }
}

export default Source;
