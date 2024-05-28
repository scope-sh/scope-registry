import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Rhinestone V1 Modules';
  }

  async fetch(): Promise<LabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const labels: Record<Address, string> = {
      '0xbf2137a23f439ca5aa4360cc6970d70b24d07ea2': 'Ownable Validator',
      '0x1c936be884ce91ecfbdd10c7898c22b473eab81a': 'Webauthn Validator',
      '0x3b48f49a55de3adfb7aba5ede084d4555d687b0e': 'Multi Factor Validator',
      '0x38a1deabbb1a0ea05ee05c780217a138c7138c31': 'Auto Savings Executor',
      '0x5341b4e7b347b7db9e124b15eba10a5c236ec3bb': 'Scheduled Orders Executor',
      '0xf1ae317941efeb1ffb103d959ef58170f1e577e0':
        'ScheduledTransfers Executor',
      '0xc98b026383885f41d9a995f85fc480e9bb8bb891': 'Ownable Executor',
      '0xbf77ce9a552857f8c01b8f00f2d71e04276ce764': 'Cold Storage Hook',
      '0x944e786244f367f16ae038cbcfca7119fa266949': 'Cold Storage Flashloan',
      '0xc5409e364bed768facd8ce3e534a9c7787c0ec3b': 'Session Key Manager',
      '0x0ecd5e6721bb885a68b4cba52b74827994abd66c': 'Social Recovery',
      '0x34dedac925c00d63bd91800ff821e535fe59d6f5': 'Registry Hook',
      '0xab614e4a5398bb2a2a0bf73f9c913ec7ff47d81f': 'Deadman Switch',
      '0x6d561a8aee519807b7bf1313d59fd6d41372ed7f': 'Hook Multiplexer',
    };
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, labels);
      addresses[chain] = chainAddresses;
    }
    return toLabelMap(addresses, 'Rhinestone V1', 'erc7579-module');
  }
}

export default Source;
