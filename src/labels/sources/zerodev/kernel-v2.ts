import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'ZeroDev Kernel V2',
      id: 'zerodev-kernel-v2',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0xd3082872f8b06073a021b4602e022d5a070d7cfc': 'Implementation V2.4',
      '0xd3f582f6b4814e989ee8e96bc3175320b5a540ab': 'Implementation V2.3',
      '0x0da6a956b9488ed4dd761e59f52fdc6c8068e6b5': 'Implementation V2.2',
      '0xf048ad83cb2dfd6037a43902a2a5be04e53cd2eb': 'Implementation V2.1',
      '0xeb8206e02f6ab1884cfea58cc7babda7d55ac957': 'Implementation V2.0',
      '0x5de4839a76cf55d0c90e2061ef4386d962e15ae3': 'Factory',
      '0xb8e3c4beaacad06f6092793012da4a8cb23d6123': 'Session Key Validator',
      '0xd9ab5096a832b9ce79914329daee236f8eea0390': 'ECDSA Validator',
      '0x42085b533b27b9afdaf3864a38c72ef853943dab': 'Fcl WebAuthn Validator',
      '0x738e3257ee928637fe62c37f91d3e722c45dcc7c': 'P256 Verifier Wrapper',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(
      this.getInfo().id,
      chainAddresses,
      true,
      'zerodev-kernel-v2',
    );
  }
}

export default Source;
