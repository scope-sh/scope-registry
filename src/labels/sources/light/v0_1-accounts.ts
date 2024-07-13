import { Source as BaseSource } from '@/labels/base.js';
import type {
  ChainLabelMap,
  ChainSingleLabelMap,
  SourceInfo,
} from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getEntryPoint0_6_0Accounts } from '@/utils/entryPoint';

const FACTORY_0_1_ADDRESS = '0x0000000000756d3e6464f5efe7e413a0af1c7474';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Light V0.1 Accounts',
      id: 'light-v0_1-accounts',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'full',
    };
  }

  async fetch(
    chain: ChainId,
    previousLabels: ChainLabelMap,
  ): Promise<ChainSingleLabelMap> {
    const accounts = getEntryPoint0_6_0Accounts(
      previousLabels,
      FACTORY_0_1_ADDRESS,
    );

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
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
