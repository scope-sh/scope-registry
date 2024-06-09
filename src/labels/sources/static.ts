import { Address, zeroAddress } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Static';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const addresses: Record<Address, string> = {
      [zeroAddress]: 'Zero Address',
    };
    const contracts: Record<Address, string> = {
      '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789': 'Entry Point 0.6.0',
      '0x0000000071727de22e5e9d8baf0edac6f37da032': 'Entry Point 0.7.0',
      '0xca11bde05977b3631167028862be2a173976ca11': 'Multicall3',
      '0xba5ed099633d3b313e4d5f7bdc1305d3c28ba5ed': 'CreateX',
    };
    const chainAddresses = await getDeployed(chain, contracts);
    return toChainLabelMap({
      ...addresses,
      ...chainAddresses,
    });
  }
}

export default Source;
