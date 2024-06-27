import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Patch Wallet V1';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0x33ddf684dcc6937ffe59d8405aa80c41fb518c5c': 'Factory',
      '0xde81a259910d029d159c6cfa12a998eb10f2d175': 'Kernel',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(chainAddresses, true, 'patch-wallet');
  }
}

export default Source;
