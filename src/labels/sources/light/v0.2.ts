import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Light V0.2',
      id: 'light-v0.2',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0x00000000001269b052c004ffb71b47ab22c898b0': 'Factory V0.2',
      '0x040d53c5dde1762f7cac48d5467e88236d4873d7': 'Implementation V0.2',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'light');
  }
}

export default Source;
