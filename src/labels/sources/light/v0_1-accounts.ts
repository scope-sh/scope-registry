import { Source as BaseSource } from '@/labels/base.js';
import type { ChainLabelMap, ChainSingleLabelMap } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getEntryPoint0_6_0Accounts } from '@/utils/entryPoint';

const FACTORY_0_1_ADDRESS = '0x0000000000756d3e6464f5efe7e413a0af1c7474';

class Source extends BaseSource {
  getName(): string {
    return 'Light V0.1 Accounts';
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
            indexed: false,
            type: 'light-v0.1-account',
            namespace: 'light-v0.1',
          },
        ];
      }),
    );
  }
}

export default Source;
