import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'ZeroDev Kernel V3',
      id: 'zerodev-kernel-v3',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0xd703aae79538628d27099b8c4f621be4ccd142d5': 'Meta Factory',
      '0x94f097e1ebeb4eca3aae54cabb08905b239a7d27': 'Implementation V3.0',
      '0x6723b44abeec4e71ebe3232bd5b455805badd22f': 'Factory V3.0',
      '0xbac849bb641841b44e965fb01a4bf5f074f84b4d': 'Implementation V3.1',
      '0xaac5d4240af87249b3f71bc8e4a2cae074a3e419': 'Factory V3.1',
      '0x97ebdca9c606d493dad1be10188dd78cadb2a139': 'Implementation V3.2',
      '0x4600a1e70fb9e4c9a3fec6d9105f6807adeacbe2': 'Factory V3.2',
      '0xd6cedde84be40893d153be9d467cd6ad37875b28': 'Implementation V3.3',
      '0x2577507b78c2008ff367261cb6285d44ba5ef2e9': 'Factory V3.3',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(
      this.getInfo().id,
      chainAddresses,
      true,
      'zerodev-kernel-v3',
    );
  }
}

export default Source;
