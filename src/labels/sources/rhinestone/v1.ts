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
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0x000000000069e2a187aeffb852bf3ccdc95151b2': 'Module Registry',
      '0x000000333034e9f539ce08819e12c1b8cb29084d': 'Attester',
      '0xf0f468571e764664c93308504642af941d9f77f1': 'Resolver',
      '0x86430e19d7d204807bbb8cda997bb57b7ee785dd': 'Schema Validator',
      '0x7579ee8307284f293b1927136486880611f20002': 'Safe7579 Adapter',
      '0x7579011ab74c46090561ea277ba79d510c6c00ff': 'Safe7579 Launchpad',
      '0xdc15682aedba36cf3121507993b50ef22b457053':
        'ERC-7579 Reference Factory',
      '0xa951a1179ba8bd08b8140ab9dc7910af08ae7181':
        'ERC-7579 Reference Singleton (Advanced)',
      '0x1e919660050c68bfef868945cf5f9a26ad7e360b':
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
