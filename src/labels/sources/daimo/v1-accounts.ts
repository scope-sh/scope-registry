import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import daimoV1NameRegistryAbi from '@/abi/daimoV1NameRegistry.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

const REGISTRY_ADDRESS = '0x4430a644b215a187a3daa5b114fa3f3d9debc17d';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Daimo V1 Accounts',
      id: 'daimo-v1-accounts',
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
    const topics = encodeEventTopics({
      abi: daimoV1NameRegistryAbi,
      eventName: 'Registered',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(this.getInfo(), chain, REGISTRY_ADDRESS, topic);

    const accounts: Address[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: daimoV1NameRegistryAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'Registered') {
        throw new Error('Invalid event name');
      }
      return decodedLog.args.addr.toLowerCase() as Address;
    });

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'Account',
            sourceId: this.getInfo().id,
            indexed: false,
            type: 'daimo-v1-account',
            namespace: 'daimo',
          },
        ];
      }),
    );
  }
}

export default Source;
