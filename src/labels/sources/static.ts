import { Address, zeroAddress } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Static',
      id: 'static',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'full',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const addresses: Record<Address, string> = {
      [zeroAddress]: 'Zero Address',
    };
    const contracts: Record<Address, string> = {
      '0xdc5319815cdaac2d113f7f275bc893ed7d9ca469': 'Entry Point 0.4.0',
      '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789': 'Entry Point 0.6.0',
      '0x0000000071727de22e5e9d8baf0edac6f37da032': 'Entry Point 0.7.0',
      '0xca11bde05977b3631167028862be2a173976ca11': 'Multicall3',
      '0xba5ed099633d3b313e4d5f7bdc1305d3c28ba5ed': 'CreateX',
    };
    const chainAddresses = await getDeployed(chain, contracts);
    return toChainLabelMap(this.getInfo().id, {
      ...addresses,
      ...chainAddresses,
    });
  }
}

export default Source;
