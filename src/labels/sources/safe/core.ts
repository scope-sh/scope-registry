import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Safe Core',
      id: 'safe-core',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0xa581c4a4db7175302464ff3c06380bc3270b4037': '4337 Module',
      '0x75cf11467937ce3f2f357ce24ffc3dbf8fd5c226': '4337 Module',
      '0x7579f9feedf32331c645828139aff78d517d0001': '7579 Adapter',
      '0x7579011ab74c46090561ea277ba79d510c6c00ff': '7579 Launchpad',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(
      this.getInfo().id,
      chainAddresses,
      true,
      'safe-core',
    );
  }
}

export default Source;
