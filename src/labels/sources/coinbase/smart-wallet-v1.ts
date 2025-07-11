import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Coinbase Smart Wallet V1',
      id: 'coinbase-smart-wallet-v1',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0x0ba5ed0c6aa8c49038f819e587e2633c4a9f428a': 'Factory',
      '0x000100abaad02f1cfc8bbe32bd5a564817339e72': 'Implementation',
      '0x011a61c07dbf256a68256b1cb51a5e246730ab92': 'Magic Spend',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(
      this.getInfo().id,
      chainAddresses,
      true,
      'coinbase-smart-wallet',
    );
  }
}

export default Source;
