import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Safe V1.4.1';
  }

  async fetch(): Promise<LabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const labels: Record<Address, string> = {
      '0xfd0732dc9e303f09fcef3a7388ad10a83459ec99':
        'V1.4.1 Compatibility Fallback Handler',
      '0x9b35af71d77eaf8d7e40252370304687390a1a52': 'V1.4.1 Create Call',
      '0x38869bf66a61cf6bdb996a6ae40d5853fd43b526': 'V1.4.1 Multi Send',
      '0x9641d764fc13c8b624c04430c7356c1c7c8102e2':
        'V1.4.1 Multi Send Call Only',
      '0x41675c099f32341bf84bfc5382af534df5c7461a': 'V1.4.1 Implementation',
      '0x29fcb43b46531bca003ddc8fcb67ffe91900c762': 'V1.4.1 Implementation L2',
      '0x4e1dcf7ad4e460cfd30791ccc4f9c8a4f820ec67': 'V1.4.1 Proxy Factory',
      '0xd53cd0ab83d845ac265be939c57f53ad838012c9': 'V1.4.1 Sign Message Lib',
      '0x3d4ba2e0884aa488718476ca2fb8efc291a46199':
        'V1.4.1 Simulate Tx Accessor',
    };
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, labels);
      addresses[chain] = chainAddresses;
    }
    return toLabelMap('Safe', addresses);
  }
}

export default Source;
