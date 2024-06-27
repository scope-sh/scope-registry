import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Safe Core';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0xa581c4a4db7175302464ff3c06380bc3270b4037': '4337 Module',
      '0x75cf11467937ce3f2f357ce24ffc3dbf8fd5c226': '4337 Module',
      '0xbaca6f74a5549368568f387fd989c279f940f1a5': '7579 Adapter',
      '0xbd3b9ba8162b23bcb0373e265cb07127e5b1b644': '7579 Launchpad',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(chainAddresses, true, 'safe-core');
  }
}

export default Source;
