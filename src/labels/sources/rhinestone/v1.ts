import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Rhinestone V1';
  }

  async fetch(): Promise<LabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const labels: Record<Address, string> = {
      '0xe0cde9239d16bef05e62bbf7aa93e420f464c826': 'Module Registry',
      '0xff81c1c2075704d97f6806de6f733d6daf20c9c6':
        'ERC-7579 Reference Factory',
      '0x76104ae8aecfc3aec2aa6587b4790043d3612c47':
        'ERC-7579 Reference Singleton (Advanced)',
      '0x5e9f3feec2aa6706df50de955612d964f115523b':
        'ERC-7579 Reference Bootstrap',
      '0xf83d07238a7c8814a48535035602123ad6dbfa63': 'Ownable Validator',
      '0x1c936be884ce91ecfbdd10c7898c22b473eab81a': 'Webauthn Validator',
      '0x2f28bcd0f3de8845409b947d9de45ca5ed776767': 'Multi Factor Validator',
      '0x9fc07b42b4e13cbea040f4f3f80223c9adf4005e': 'Auto Savings Executor',
      '0x506a89d85a9733225fdb54d9e7e76d017c21e1c1': 'Scheduled Orders Executor',
      '0xad6330089d9a1fe89f4020292e1afe9969a5a2fc':
        'Scheduled Transfers Executor',
      '0xba313f2beee4118b97dd565ed451f722219851be': 'Cold Storage Executor',
      '0xdfe507ad4035256e586f9e8b7d0e82184d5b8cb4': 'Cold Storage Hook',
      '0x71181a93753d489a10927fa747eefd8425ff40de': 'Flashloan Callback',
      '0x10a734a2c140a3d8e7919ad19c4d2f15f2f5f36b': 'Flashloan Lender',
      '0xc5409e364bed768facd8ce3e534a9c7787c0ec3b': 'Session Key Manager',
    };
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, labels);
      addresses[chain] = chainAddresses;
    }
    return toLabelMap('Rhinestone V1', addresses);
  }
}

export default Source;
