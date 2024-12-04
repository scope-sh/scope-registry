import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Cometh',
      id: 'cometh',
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
    const paymasters: Record<Address, string> = {
      '0x6a6b7f6012ee5bef1cdf95df25e5045c7727c739': 'Paymaster',
    };
    const bundlers: Address[] = [
      '0x6d34bfbc85a29ccd377da82a0d1f07deb763c910',
      '0x79c02f38dba39da361b4a0484c40351d50d55a94',
      '0xb11febe816d2157d8efa83404d37447abc41366f',
      '0xf03ddbe5b9b4ddec66009d94dc5d33dd719f34e1',
      '0xf0f772fa5f01bc19064a8ba323a4f53505586ce1',
    ];
    const chainAddresses = await getDeployed(chain, paymasters);
    for (const bundler of bundlers) {
      chainAddresses[bundler] = 'Bundler';
    }
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'cometh');
  }
}

export default Source;
