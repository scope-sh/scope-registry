import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Rhinestone V1',
      id: 'rhinestone-v1',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 7,
      },
      fetchType: 'full',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0x0000000000e23e0033c3e93d9d4ebc2ff2ab2aef': 'Module Registry',
      '0x000000333034e9f539ce08819e12c1b8cb29084d': 'Attester',
      '0xf0f468571e764664c93308504642af941d9f77f1': 'Resolver',
      '0x86430e19d7d204807bbb8cda997bb57b7ee785dd': 'Schema Validator',
      '0x7579f9feedf32331c645828139aff78d517d0001': 'Safe7579 Adapter',
      '0x75796e975bd270d487be50b4e9797780360400ff': 'Safe7579 Launchpad',
      '0xefff0157a29286b1b66f59184e1cc8c95bb69327':
        'ERC-7579 Reference Factory',
      '0xbb1e16b06da368da9d8be8a662e4da092cc80645':
        'ERC-7579 Reference Singleton (Advanced)',
      '0xc33673e6a02ac64b90f2b8fac58f88309db6238b':
        'ERC-7579 Reference Bootstrap',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(
      this.getInfo().id,
      chainAddresses,
      true,
      'rhinestone-v1',
    );
  }
}

export default Source;
