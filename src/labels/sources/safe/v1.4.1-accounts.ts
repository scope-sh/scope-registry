import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import safeV141FactoryAbi from '@/abi/safeV141Factory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

const VALID_SINGLETONS = [
  '0x41675c099f32341bf84bfc5382af534df5c7461a',
  '0x29fcb43b46531bca003ddc8fcb67ffe91900c762',
];
const FACTORY_ADDRESS = '0x4e1dcf7ad4e460cfd30791ccc4f9c8a4f820ec67';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Safe V1.4.1 Accounts',
      id: 'safe-v1.4.1-accounts',
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
      abi: safeV141FactoryAbi,
      eventName: 'ProxyCreation',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(this.getInfo(), chain, FACTORY_ADDRESS, topic);

    const factoryDeployments = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: safeV141FactoryAbi,
        data: log.data as Hex,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'ProxyCreation') {
        throw new Error('Invalid event name');
      }
      return {
        proxy: decodedLog.args.proxy.toLowerCase() as Address,
        singleton: decodedLog.args.singleton.toLowerCase() as Address,
      };
    });
    const accounts = factoryDeployments
      .filter((deployment) => VALID_SINGLETONS.includes(deployment.singleton))
      .map((deployment) => deployment.proxy);

    return Object.fromEntries(
      accounts.map((account) => {
        return [
          account,
          {
            value: 'V1.4.1 Account',
            sourceId: this.getInfo().id,
            indexed: false,
            type: 'safe-v1.4.1-account',
            namespace: 'safe',
          },
        ];
      }),
    );
  }
}

export default Source;
