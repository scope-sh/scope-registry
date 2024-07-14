import { Source as BaseSource } from '@/labels/base.js';
import type {
  ChainLabelMap,
  ChainSingleLabelMap,
  SourceInfo,
} from '@/labels/base.js';
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
    const accounts = getEntryPoint0_7_0Accounts(
      previousLabels,
      FACTORY_0_2_ADDRESS,
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
