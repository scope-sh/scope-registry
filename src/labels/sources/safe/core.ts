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
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'full',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0xa581c4a4db7175302464ff3c06380bc3270b4037': '4337 Module',
      '0x75cf11467937ce3f2f357ce24ffc3dbf8fd5c226': '4337 Module',
      '0xbaca6f74a5549368568f387fd989c279f940f1a5': '7579 Adapter',
      '0xbd3b9ba8162b23bcb0373e265cb07127e5b1b644': '7579 Launchpad',
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
