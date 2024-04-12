import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Candide';
  }

  async fetch(): Promise<LabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const paymasters: Record<Address, string> = {
      '0x769f68e4ba8f53f3092eef34a42a811ab6365b05': 'USDC.e Paymaster',
    };
    const bundlers: Address[] = ['0x3cfdc212769c890907bce93d3d8c2c53de6a7a89'];
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, paymasters);
      for (const bundler of bundlers) {
        chainAddresses[bundler] = 'Bundler';
      }
      addresses[chain] = chainAddresses;
    }
    return toLabelMap('Candide', addresses);
  }
}

export default Source;
