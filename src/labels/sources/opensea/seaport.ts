import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { SingleLabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'OpenSea Seaport';
  }

  async fetch(): Promise<SingleLabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const contracts: Record<Address, string> = {
      '0x00000000006c3852cbef3e08e8df289169ede581': '1.1',
      '0x00000000000006c7676171937c444f6bde3d6282': '1.2',
      '0x0000000000000ad24e80fd803c6ac37206a45f15': '1.3',
      '0x00000000000001ad428e4906ae43d8f9852d0dd6': '1.4',
      '0x00000000000000adc04c56bf30ac9d3c0aaf14dc': '1.5',
      '0x0000000000000068f116a894984e2db1123eb395': '1.6',
      '0x00000000f9490004c11cef243f5400493c00ad63': 'Conduit Controller',
      '0x00e5f120f500006757e984f1ded400fc00370000': 'Validator',
      '0x0000f00000627d293ab4dfb40082001724db006f': 'Navigator',
    };
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, contracts);
      addresses[chain] = chainAddresses;
    }
    return toLabelMap(addresses, 'OpenSea Seaport');
  }
}

export default Source;
