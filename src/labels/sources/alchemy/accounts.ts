import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type {
  ChainLabelMap,
  ChainSingleLabelMap,
  LabelTypeId,
  SourceInfo,
} from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getEntryPoint0_6_0Accounts } from '@/utils/entryPoint.js';
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
      name: 'Alchemy Accounts',
      id: 'alchemy-accounts',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'incremental',
    };
  }

  async fetch(
    chain: ChainId,
    previousLabels: ChainLabelMap,
  ): Promise<ChainSingleLabelMap> {
    const contracts: Record<Address, string> = {
      '0x000000e92d78d90000007f0082006fda09bd5f11':
        'Multi Owner Modular Account Factory V1.0.0',
      '0x0046000000000151008789797b54fdb500e2a61e':
        'Upgradeable Modular Account V1.0.0',
      '0xce0000007b008f50d762d155002600004cd6c647': 'Multi Owner Plugin V1.0.0',
      '0x000000e30a00f600823700e975f1b1ac387f0017': 'Session Key Plugin V1.0.0',
      '0x0000003e0000a96de4058e1e02a62faaecf23d8d': 'Session Key Plugin V1.0.1',
      '0x0000000000400cdfef5e2714e63d8040b700bc24':
        'Light Account Factory v2.0.0',
      '0x00004ec70002a32400f8ae005a26081065620d20':
        'Light Account Factory v1.1.0',
      '0x00000055c0b4fa41dde26a74435ff03692292fbd':
        'Light Account Factory v1.0.2',
      '0x000000893a26168158fbeadd9335be5bc96592e2':
        'Light Account Factory v1.0.1',
      '0x8e8e658e22b12ada97b402ff0b044d6a325013c7': 'Light Account v2.0.0',
      '0xae8c656ad28f2b59a196ab61815c16a0ae1c3cba': 'Light Account v1.1.0',
      '0x5467b1947f47d0646704eb801e075e72aeae8113': 'Light Account v1.0.2',
      '0xc1b2fc4197c9187853243e6e4eb5a4af8879a1c0': 'Light Account v1.0.1',
      '0x000000000019d2ee9f2729a65afe20bb0020aefc':
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

    const multiOwnerModularAccountFactoryV1_0_0Labels = this.#getAccountLabels(
      previousLabels,
      MULTI_OWNER_MODULAR_ACCOUNT_FACTORY_V1_0_0_ADDRESS,
      'alchemy-v1-multi-owner-modular-account',
      'Multi Owner Modular Account V1',
    );
    const lightAccountFactoryV1_0_1Labels = this.#getAccountLabels(
      previousLabels,
      LIGHT_ACCOUNT_FACTORY_V1_0_1_ADDRESS,
      'alchemy-v1.0-light-account',
      'Light Account V1.0.1',
    );
    const lightAccountFactoryV1_0_2Labels = this.#getAccountLabels(
      previousLabels,
      LIGHT_ACCOUNT_FACTORY_V1_0_2_ADDRESS,
      'alchemy-v1.0-light-account',
      'Light Account V1.0.2',
    );
    const lightAccountFactoryV1_1_0Labels = this.#getAccountLabels(
      previousLabels,
      LIGHT_ACCOUNT_FACTORY_V1_1_0_ADDRESS,
      'alchemy-v1.1-light-account',
      'Light Account V1.1',
    );
    const lightAccountFactoryV2_0_0Labels = this.#getAccountLabels(
      previousLabels,
      LIGHT_ACCOUNT_FACTORY_V2_0_0_ADDRESS,
      'alchemy-v2-light-account',
      'Light Account V2',
    );
    const multiOwnerLightAccountFactoryV2_0_0Labels = this.#getAccountLabels(
      previousLabels,
      MULTI_OWNER_LIGHT_ACCOUNT_FACTORY_V2_0_0_ADDRESS,
      'alchemy-v2-multi-owner-light-account',
      'Multi Owner Light Account V2',
    );

    // Join all the labels
    return {
      ...contractLabels,
      ...multiOwnerModularAccountFactoryV1_0_0Labels,
      ...lightAccountFactoryV1_0_1Labels,
      ...lightAccountFactoryV1_0_2Labels,
      ...lightAccountFactoryV1_1_0Labels,
      ...lightAccountFactoryV2_0_0Labels,
      ...multiOwnerLightAccountFactoryV2_0_0Labels,
    };
  }

  #getAccountLabels(
    previousLabels: ChainLabelMap,
    factory: Address,
    labelType: LabelTypeId,
    labelName: string,
  ): ChainSingleLabelMap {
    const factoryAccounts = getEntryPoint0_6_0Accounts(previousLabels, factory);

    return Object.fromEntries(
      factoryAccounts.map((account) => {
        return [
          account,
          {
            value: labelName,
            sourceId: this.getInfo().id,
            indexed: false,
            type: labelType,
            namespace: 'alchemy',
          },
        ];
      }),
    );
  }
}

export default Source;
