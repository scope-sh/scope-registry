import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Biconomy Nexus',
      id: 'biconomy-nexus',
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
      '0x000000039dfcad030719b07296710f045f0558f7': 'Implementation',
      '0x00000004171351c442b202678c48d8ab5b321e8f': 'K1 Validator',
      '0x00000008c901d8871b6f6942de0b5d9ccf3873d3': 'Bootstrap',
      '0x00000bb19a3579f4d779215def97afbd0e30db55': 'K1 Validator Factory',
      '0x0000006087310897e0bffcb3f0ed3704f7146852': 'Sponsorship Paymaster',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(
      this.getInfo().id,
      chainAddresses,
      true,
      'biconomy-nexus',
    );
  }
}

export default Source;
