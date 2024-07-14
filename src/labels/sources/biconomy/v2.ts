import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Biconomy V2',
      id: 'biconomy-v2',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'incremental',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0x0000002512019dafb59528b82cb92d3c5d2423ac':
        'Smart Account Implementation V2',
      '0x000000a56aaca3e9a4c479ea6b6cd0dbcb6634f5': 'Smart Account Factory V2',
      '0x0000001c5b32f37f5bea87bdd5374eb2ac54ea8e': 'ECDSA Ownership Module',
      '0x000000824dc138db84fd9109fc154bdad332aa8e':
        'Multichain Validation Module',
      '0x000008da71757c0e1d83ce56c823e25aa49bc058':
        'Batched Session Router Module',
      '0x000002fbffedd9b33f4e7156f2de8d48945e7489': 'Session Key Manager V1',
      '0x000031dd6d9d3a133e663660b959162870d755d4': 'Verifying Paymaster V1',
      '0x00000f79b7faf42eebadba19acc07cd08af44789':
        'Verifying Paymaster V1.1.0',
      '0x00000f7365ca6c59a2c93719ad53d567ed49c14c': 'Token Paymaster',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(
      this.getInfo().id,
      chainAddresses,
      true,
      'biconomy-v2',
    );
  }
}

export default Source;
