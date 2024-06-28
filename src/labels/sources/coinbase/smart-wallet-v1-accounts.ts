import { Source as BaseSource } from '@/labels/base.js';
import type { ChainLabelMap, ChainSingleLabelMap } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getEntryPoint0_6_0Accounts } from '@/utils/entryPoint.js';

const FACTORY_ADDRESS = '0x0ba5ed0c6aa8c49038f819e587e2633c4a9f428a';

class Source extends BaseSource {
  getName(): string {
    return 'Coinbase Smart Wallet V1 Accounts';
  }

  async fetch(
    chain: ChainId,
    previousLabels: ChainLabelMap,
  ): Promise<ChainSingleLabelMap> {
    const accounts = getEntryPoint0_6_0Accounts(
      previousLabels,
      FACTORY_ADDRESS,
    );

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            indexed: false,
            type: 'coinbase-smart-wallet-v1-account',
            namespace: 'coinbase-smart-wallet',
          },
        ];
      }),
    );
  }
}

export default Source;
