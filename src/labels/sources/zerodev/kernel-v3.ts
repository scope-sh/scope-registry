import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'ZeroDev Kernel V3';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0xd703aae79538628d27099b8c4f621be4ccd142d5': 'Meta Factory',
      '0x94f097e1ebeb4eca3aae54cabb08905b239a7d27': 'Implementation V3.0',
      '0x6723b44abeec4e71ebe3232bd5b455805badd22f': 'Factory V3.0',
      '0xbac849bb641841b44e965fb01a4bf5f074f84b4d': 'Implementation V3.1',
      '0xaac5d4240af87249b3f71bc8e4a2cae074a3e419': 'Factory V3.1',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(chainAddresses, true, 'zerodev-kernel-v3');
  }
}

export default Source;
