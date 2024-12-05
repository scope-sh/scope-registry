import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Nani',
      id: 'nani',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0x00000000000009b4ab3f1bc2b029bd7513fbd8ed': 'Paymaster',
      '0x0000000000001c05075915622130c16f6febc541': 'Implementation V0.0.0',
      '0x0000000000009909e101c0daa5337332b01d38c6': 'Implementation V1.1.1',
      '0x000000000000dd366cc2e4432bb998e41dfd47c7': 'Factory V0.0.0',
      '0x0000000000008dd2574908774527fd6da397d75b': 'Factory V1.1.1',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'nani');
  }
}

export default Source;
