import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getEntryPoint0_7_0Accounts } from '@/utils/entryPoint.js';

const FACTORY_0_2_ADDRESS = '0x00000000001269b052c004ffb71b47ab22c898b0';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Light V0.2 Accounts',
      id: 'light-v0_2-accounts',
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
    const accounts = await getEntryPoint0_7_0Accounts(this.getInfo(), chain);
    const factoryAccounts = accounts.filter(
      (account) => account.factory === FACTORY_0_2_ADDRESS,
    );

    return Object.fromEntries(
      factoryAccounts.map((account) => {
        return [
          account.sender,
          {
            value: 'Account',
            sourceId: this.getInfo().id,
            indexed: false,
            type: 'light-account',
            namespace: 'light',
          },
        ];
      }),
    );
  }
}

export default Source;
