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
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0x000000039dfcad030719b07296710f045f0558f7': 'Implementation',
      '0x00000004171351c442b202678c48d8ab5b321e8f': 'K1 Validator Module',
      '0x00000008c901d8871b6f6942de0b5d9ccf3873d3': 'Bootstrap',
      '0x00000bb19a3579f4d779215def97afbd0e30db55': 'K1 Validator Factory',
      '0x0000006087310897e0bffcb3f0ed3704f7146852': 'Sponsorship Paymaster',
      '0x000000004f43c49e93c970e84001853a70923b03': 'Implementation v1.2.0',
      '0x00000000d3254452a909e4eed47455af7e27c289': 'Bootstrap v1.2.0',
      '0x000000001d1d5004a02bafab9de2d6ce5b7b13de': 'Factory v1.2.0',
      '0x000000ac74357bfea72bbd0781833631f732cf19': 'Implementation v1.0.2',
      '0x000000c3a93d2c5e02cb053ac675665b1c4217f9': 'Factory v1.0.2',
      '0x879fa30248eeb693dcce3ea94a743622170a3658': 'Bootstrap v1.0.2',
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
