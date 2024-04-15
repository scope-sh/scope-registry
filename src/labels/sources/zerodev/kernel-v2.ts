import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'ZeroDev Kernel V2';
  }

  async fetch(): Promise<LabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const labels: Record<Address, string> = {
      '0xd3082872f8b06073a021b4602e022d5a070d7cfc': 'Implementation',
      '0x5de4839a76cf55d0c90e2061ef4386d962e15ae3': 'Factory',
      '0xb8e3c4beaacad06f6092793012da4a8cb23d6123': 'Session Key Validator',
      '0xd9ab5096a832b9ce79914329daee236f8eea0390': 'ECDSA Validator',
      '0x42085b533b27b9afdaf3864a38c72ef853943dab': 'Fcl WebAuthn Validator',
      '0x738e3257ee928637fe62c37f91d3e722c45dcc7c': 'P256 Verifier Wrapper',
    };
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, labels);
      addresses[chain] = chainAddresses;
    }
    return toLabelMap(addresses, 'ZeroDev Kernel V2');
  }
}

export default Source;
