import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getEntryPoint0_6_0Accounts } from '@/utils/entryPoint.js';

const FACTORY_ADDRESS = '0x000000000000dd366cc2e4432bb998e41dfd47c7';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Nani V0 Accounts',
      id: 'nani-v0-accounts',
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
            type: 'nani-v0-account',
            namespace: 'nani',
          },
        ];
      }),
    );
  }
}

export default Source;
