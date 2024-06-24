import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import entryPointV0_7_0Abi from '@/abi/entryPointV0_7_0.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { getLabelTypeById, getNamespaceById } from '@/labels/utils.js';
import type { ChainId } from '@/utils/chains.js';
import {
  ENTRYPOINT_0_7_0_ADDRESS,
  getEntryPoint0_7_0Predicate,
} from '@/utils/entryPoint.js';
import { getLogs } from '@/utils/fetching.js';

const KERNEL_V3_FACTORY_STAKER_ADDRESS =
  '0xd703aae79538628d27099b8c4f621be4ccd142d5';

class Source extends BaseSource {
  getName(): string {
    return 'ZeroDev Kernel V3 Accounts';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const topics = encodeEventTopics({
      abi: entryPointV0_7_0Abi,
      eventName: 'AccountDeployed',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(
      chain,
      ENTRYPOINT_0_7_0_ADDRESS,
      topic,
      getEntryPoint0_7_0Predicate(KERNEL_V3_FACTORY_STAKER_ADDRESS),
    );

    const accounts: Address[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: entryPointV0_7_0Abi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'AccountDeployed') {
        throw new Error('Invalid event name');
      }
      return decodedLog.args.sender.toLowerCase() as Address;
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            type: getLabelTypeById('kernel-v3-account'),
            namespace: getNamespaceById('zerodev-kernel-v3'),
          },
        ];
      }),
    );
  }
}

export default Source;
