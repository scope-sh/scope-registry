import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getEntryPoint0_6_0Accounts } from '@/utils/entryPoint.js';

const FACTORY_ADDRESS = '0x0ba5ed0c6aa8c49038f819e587e2633c4a9f428a';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Coinbase Smart Wallet V1 Accounts',
      id: 'coinbase-smart-wallet-v1-accounts',
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
    const accounts = await getEntryPoint0_6_0Accounts(this.getInfo(), chain);
    const factoryAccounts = accounts.filter(
      (account) => account.factory === FACTORY_ADDRESS,
    );

    return Object.fromEntries(
      factoryAccounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            sourceId: this.getInfo().id,
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
