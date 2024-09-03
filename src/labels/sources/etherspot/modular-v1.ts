import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Etherspot Modular V1',
      id: 'etherspot-modular-v1',
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
      '0x202a5598bdba2ce62bffa13ecccb04969719fad9': 'Implementation',
      '0x93fb56a4a0b7160fbf8903d251cc7a3fb9ba0933': 'Factory',
      '0x1bacb2f1ef4fd02f02e32ccf70888d9caeb5f066': 'Bootstrap',
      '0x8c4496ba340afe5ac4148cfea9ccbbcd54093143':
        'Multiple Owner ECDSA Validator',
      '0x1417adc5308a32265e0fa0690ea1408ffa62f37c':
        'ERC20 Session Key Validator',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(
      this.getInfo().id,
      chainAddresses,
      true,
      'etherspot-modular-v1',
    );
  }
}

export default Source;
