import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { SingleLabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Coinbase Smart Wallet V1';
  }

  async fetch(): Promise<SingleLabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const labels: Record<Address, string> = {
      '0x0ba5ed0c6aa8c49038f819e587e2633c4a9f428a': 'Factory',
      '0x000100abaad02f1cfc8bbe32bd5a564817339e72': 'Implementation',
      '0x011a61c07dbf256a68256b1cb51a5e246730ab92': 'Magic Spend',
    };
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, labels);
      addresses[chain] = chainAddresses;
    }
    return toLabelMap(addresses, 'Coinbase Smart Wallet');
  }
}

export default Source;
