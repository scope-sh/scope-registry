import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Pimlico';
  }

  async fetch(): Promise<LabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const labels: Record<Address, string> = {
      '0x000000000091a1f34f51ce866bed8983db51a97e': 'Bundle Bulker',
      '0x0000000000dd00d61091435b84d1371a1000de9a': 'Per UserOp Inflator',
      '0x564c7dc50f8293d070f490fc31fec3a0a091b9bb': 'Simple Inflator',
      '0x000000000041f3afe8892b48d88b6862efe0ec8d': 'USDC Paymaster',
      '0xe3dc822d77f8ca7ac74c30b0dffea9fcdcaaa321': 'Verifying Paymaster',
    };
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, labels);
      addresses[chain] = chainAddresses;
    }
    return toLabelMap('Pimlico', addresses);
  }
}

export default Source;
