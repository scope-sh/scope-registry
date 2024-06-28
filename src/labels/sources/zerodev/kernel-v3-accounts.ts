import { Source as BaseSource } from '@/labels/base.js';
import type { ChainLabelMap, ChainSingleLabelMap } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getEntryPoint0_7_0Accounts } from '@/utils/entryPoint.js';

const KERNEL_V3_FACTORY_STAKER_ADDRESS =
  '0xd703aae79538628d27099b8c4f621be4ccd142d5';

class Source extends BaseSource {
  getName(): string {
    return 'ZeroDev Kernel V3 Accounts';
  }

  async fetch(
    chain: ChainId,
    previousLabels: ChainLabelMap,
  ): Promise<ChainSingleLabelMap> {
    const accounts = getEntryPoint0_7_0Accounts(
      previousLabels,
      KERNEL_V3_FACTORY_STAKER_ADDRESS,
    );

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            indexed: false,
            type: 'kernel-v3-account',
            namespace: 'zerodev-kernel-v3',
          },
        ];
      }),
    );
  }
}

export default Source;
