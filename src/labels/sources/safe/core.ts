import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { SingleLabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Safe Core';
  }

  async fetch(): Promise<SingleLabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const labels: Record<Address, string> = {
      '0xa581c4a4db7175302464ff3c06380bc3270b4037': '4337 Module',
      '0x75cf11467937ce3f2f357ce24ffc3dbf8fd5c226': '4337 Module',
      '0xbaca6f74a5549368568f387fd989c279f940f1a5': '7579 Adapter',
      '0xbd3b9ba8162b23bcb0373e265cb07127e5b1b644': '7579 Launchpad',
    };
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, labels);
      addresses[chain] = chainAddresses;
    }
    return toLabelMap(addresses, 'Safe Core');
  }
}

export default Source;
