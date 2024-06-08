import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'ZeroDev Kernel V2';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0xd3082872f8b06073a021b4602e022d5a070d7cfc': 'Implementation',
      '0x5de4839a76cf55d0c90e2061ef4386d962e15ae3': 'Factory',
      '0xb8e3c4beaacad06f6092793012da4a8cb23d6123': 'Session Key Validator',
      '0xd9ab5096a832b9ce79914329daee236f8eea0390': 'ECDSA Validator',
      '0x42085b533b27b9afdaf3864a38c72ef853943dab': 'Fcl WebAuthn Validator',
      '0x738e3257ee928637fe62c37f91d3e722c45dcc7c': 'P256 Verifier Wrapper',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(chainAddresses, 'zerodev-kernel-v2');
  }
}

export default Source;
