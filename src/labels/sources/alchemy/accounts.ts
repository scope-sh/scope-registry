import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type {
  ChainSingleLabelMap,
  LabelTypeId,
  SourceInfo,
} from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import {
  type Account,
  getEntryPoint0_6_0Accounts,
  getEntryPoint0_7_0Accounts,
} from '@/utils/entryPoint.js';

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
        minutes: 1,
        hours: 0,
        days: 0,
      },
      fetchType: 'incremental',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const ep0_6_0accounts = await getEntryPoint0_6_0Accounts(
      this.getInfo(),
      chain,
    );
    const ep0_7_0accounts = await getEntryPoint0_7_0Accounts(
      this.getInfo(),
      chain,
    );
    const multiOwnerModularAccountFactoryV1_0_0Labels = this.#getAccountLabels(
      ep0_6_0accounts,
      MULTI_OWNER_MODULAR_ACCOUNT_FACTORY_V1_0_0_ADDRESS,
      'alchemy-v1-multi-owner-modular-account',
      'Multi Owner Modular Account V1',
    );
    const lightAccountFactoryV1_0_1Labels = this.#getAccountLabels(
      ep0_6_0accounts,
      LIGHT_ACCOUNT_FACTORY_V1_0_1_ADDRESS,
      'alchemy-v1.0-light-account',
      'Light Account V1.0.1',
    );
    const lightAccountFactoryV1_0_2Labels = this.#getAccountLabels(
      ep0_6_0accounts,
      LIGHT_ACCOUNT_FACTORY_V1_0_2_ADDRESS,
      'alchemy-v1.0-light-account',
      'Light Account V1.0.2',
    );
    const lightAccountFactoryV1_1_0Labels = this.#getAccountLabels(
      ep0_6_0accounts,
      LIGHT_ACCOUNT_FACTORY_V1_1_0_ADDRESS,
      'alchemy-v1.1-light-account',
      'Light Account V1.1',
    );
    const lightAccountFactoryV2_0_0Labels = this.#getAccountLabels(
      ep0_7_0accounts,
      LIGHT_ACCOUNT_FACTORY_V2_0_0_ADDRESS,
      'alchemy-v2-light-account',
      'Light Account V2',
    );
    const multiOwnerLightAccountFactoryV2_0_0Labels = this.#getAccountLabels(
      ep0_7_0accounts,
      MULTI_OWNER_LIGHT_ACCOUNT_FACTORY_V2_0_0_ADDRESS,
      'alchemy-v2-multi-owner-light-account',
      'Multi Owner Light Account V2',
    );

    // Join all the labels
    return {
      ...multiOwnerModularAccountFactoryV1_0_0Labels,
      ...lightAccountFactoryV1_0_1Labels,
      ...lightAccountFactoryV1_0_2Labels,
      ...lightAccountFactoryV1_1_0Labels,
      ...lightAccountFactoryV2_0_0Labels,
      ...multiOwnerLightAccountFactoryV2_0_0Labels,
    };
  }

  #getAccountLabels(
    accounts: Account[],
    factory: Address,
    labelType: LabelTypeId,
    labelName: string,
  ): ChainSingleLabelMap {
    const factoryAccounts = accounts.filter(
      (account) => account.factory === factory,
    );

    return Object.fromEntries(
      factoryAccounts.map((account) => {
        return [
          account.sender,
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
