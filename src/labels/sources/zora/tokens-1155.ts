import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import zora1155FactoryAbi from '@/abi/zora1155Factory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

const FACTORY_ADDRESS = '0x777777c338d93e2c7adf08d102d45ca7cc4ed021';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Zora 1155 Tokens',
      id: 'zora-1155-tokens',
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
      abi: zora1155FactoryAbi,
      eventName: 'SetupNewContract',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(this.getInfo(), chain, FACTORY_ADDRESS, topic);

    const tokens: Address[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: zora1155FactoryAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'SetupNewContract') {
        throw new Error('Invalid event name');
      }
      return decodedLog.args.newContract.toLowerCase() as Address;
    });

    return Object.fromEntries(
      tokens.map((address) => {
        return [
          address,
          {
            value: '1155 Drop',
            sourceId: this.getInfo().id,
            indexed: true,
            type: 'zora-1155-token',
            namespace: 'zora',
          },
        ];
      }),
    );
  }
}

export default Source;
