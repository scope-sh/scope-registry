import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getEntryPoint0_6_0Accounts } from '@/utils/entryPoint.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Entry Point V0.6.0 Accounts',
      id: 'entry-point-v0.6.0-accounts',
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

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Entry Point V0.6.0 Account',
            sourceId: this.getInfo().id,
            indexed: false,
            type: 'entry-point-v0.6.0-account',
            priority: 10,
          },
        ];
      }),
    );
  }
}

export default Source;
