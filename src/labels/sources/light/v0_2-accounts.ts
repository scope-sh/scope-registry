import { Source as BaseSource } from '@/labels/base.js';
import type { ChainLabelMap, ChainSingleLabelMap } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getEntryPoint0_7_0Accounts } from '@/utils/entryPoint.js';

const FACTORY_0_2_ADDRESS = '0x00000000001269b052c004ffb71b47ab22c898b0';

class Source extends BaseSource {
  getName(): string {
    return 'Light V0.2 Accounts';
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
            indexed: false,
            type: 'light-v0.2-account',
            namespace: 'light-v0.2',
          },
        ];
      }),
    );
  }
}

export default Source;
