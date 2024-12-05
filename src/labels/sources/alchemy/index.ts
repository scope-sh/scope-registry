import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

const MULTI_OWNER_MODULAR_ACCOUNT_FACTORY_V1_0_0_ADDRESS =
  '0x000000e92d78d90000007f0082006fda09bd5f11';
const LIGHT_ACCOUNT_FACTORY_V1_0_1_ADDRESS =
  '0x000000893a26168158fbeadd9335be5bc96592e2';
const LIGHT_ACCOUNT_FACTORY_V1_0_2_ADDRESS =
  '0x00000055c0b4fa41dde26a74435ff03692292fbd';
const LIGHT_ACCOUNT_FACTORY_V1_1_0_ADDRESS =
  '0x00004ec70002a32400f8ae005a26081065620d20';
const LIGHT_ACCOUNT_FACTORY_V2_0_0_ADDRESS =
  '0x0000000000400cdfef5e2714e63d8040b700bc24';
const MULTI_OWNER_LIGHT_ACCOUNT_FACTORY_V2_0_0_ADDRESS =
  '0x000000000019d2ee9f2729a65afe20bb0020aefc';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Alchemy',
      id: 'alchemy',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const contracts: Record<Address, string> = {
      [MULTI_OWNER_MODULAR_ACCOUNT_FACTORY_V1_0_0_ADDRESS]:
        'Multi Owner Modular Account Factory V1.0.0',
      '0x0046000000000151008789797b54fdb500e2a61e':
        'Upgradeable Modular Account V1.0.0',
      '0xce0000007b008f50d762d155002600004cd6c647': 'Multi Owner Plugin V1.0.0',
      '0x000000e30a00f600823700e975f1b1ac387f0017': 'Session Key Plugin V1.0.0',
      '0x0000003e0000a96de4058e1e02a62faaecf23d8d': 'Session Key Plugin V1.0.1',
      [LIGHT_ACCOUNT_FACTORY_V2_0_0_ADDRESS]: 'Light Account Factory v2.0.0',
      '0x8e8e658e22b12ada97b402ff0b044d6a325013c7': 'Light Account v2.0.0',
      [LIGHT_ACCOUNT_FACTORY_V1_1_0_ADDRESS]: 'Light Account Factory v1.1.0',
      '0xae8c656ad28f2b59a196ab61815c16a0ae1c3cba': 'Light Account v1.1.0',
      [LIGHT_ACCOUNT_FACTORY_V1_0_2_ADDRESS]: 'Light Account Factory v1.0.2',
      '0x5467b1947f47d0646704eb801e075e72aeae8113': 'Light Account v1.0.2',
      [LIGHT_ACCOUNT_FACTORY_V1_0_1_ADDRESS]: 'Light Account Factory v1.0.1',
      '0xc1b2fc4197c9187853243e6e4eb5a4af8879a1c0': 'Light Account v1.0.1',
      [MULTI_OWNER_LIGHT_ACCOUNT_FACTORY_V2_0_0_ADDRESS]:
        'Multi Owner Light Account Factory v2.0.0',
      '0xd2c27f9ee8e4355f71915ffd5568cb3433b6823d':
        'Multi Owner Light Account v2.0.0',
    };
    const chainContracts = await getDeployed(chain, contracts);
    const contractLabels = toChainLabelMap(
      this.getInfo().id,
      chainContracts,
      true,
      'alchemy',
    );

    return contractLabels;
  }
}

export default Source;
