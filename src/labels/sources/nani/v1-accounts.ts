import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getEntryPoint0_7_0Accounts } from '@/utils/entryPoint.js';

const FACTORY_ADDRESS = '0x0000000000008dd2574908774527fd6da397d75b';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Nani V1 Accounts',
      id: 'nani-v1-accounts',
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
      (account) => account.factory === FACTORY_ADDRESS,
    );

    return Object.fromEntries(
      factoryAccounts.map((account) => {
        return [
          account.sender,
          {
            value: 'Account',
            sourceId: this.getInfo().id,
            indexed: false,
            type: 'nani-v1-account',
            namespace: 'nani',
          },
        ];
      }),
    );
  }
}

export default Source;
