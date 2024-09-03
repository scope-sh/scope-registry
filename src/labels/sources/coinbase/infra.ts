import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getInfo(): SourceInfo {
    return {
      name: 'Coinbase Infra',
      id: 'coinbase-infra',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 7,
      },
      fetchType: 'full',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0xa270ef92c1e11f1c1f95753c2e56801e8125fa83': 'Limiting Paymaster',
    };
    const bundlers: Address[] = [
      '0xfbd85a0c200b286ef2d7a08306113669013c39da',
      '0xc4a4e8ae10b82a954519ca2ecc9efc8f77819e86',
      '0x6d10c567db15b40bfb1a162c16cbd7a3e80bb12b',
      '0x1984c070e64e561631a7e20ea3c4cbf4eb198da8',
    ];
    const chainAddresses = await getDeployed(chain, labels);
    for (const bundler of bundlers) {
      chainAddresses[bundler] = 'Bundler';
    }
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'coinbase');
  }
}

export default Source;
