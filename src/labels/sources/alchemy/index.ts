import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Alchemy';
  }

  async fetch(): Promise<LabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const paymasters: Record<Address, string> = {
      '0x4fd9098af9ddcb41da48a1d78f91f1398965addc': 'Paymaster',
    };
    const bundlers: Address[] = [
      '0x2c929c7e5bb90ffa05c1d156ab6864523597b1be',
      '0x2ce3fb4ea6a849cc49f68bdbeaa4912a920bdfd8',
      '0x34716d493d69b11fd52d3242cf1eeec8585a1491',
      '0x3680e234283e149c859f9c173327676eb31e6f2c',
      '0x4a25d28d10b02bcf13a16068f56d167d8f96d093',
      '0x54af39ebab5d1370b6a74a0ce3134ad06e0cccbc',
      '0x65061d355ae0359ec801e047e40c76051833e78c',
      '0x854d44777720969c18ede7778d1f110c85438eaa',
      '0x91dfdec28a8c2d946d151df2ff9c8dbd543d822e',
      '0x9a68c3b432ec182a53888b9cba8de2a631abf3ee',
    ];
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, paymasters);
      for (const bundler of bundlers) {
        chainAddresses[bundler] = 'Bundler';
      }
      addresses[chain] = chainAddresses;
    }
    return toLabelMap('Alchemy', addresses);
  }
}

export default Source;
