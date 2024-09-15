import { decodeEventLog, encodeEventTopics } from 'viem';
import type { Address, Hex } from 'viem';

import zora721FactoryAbi from '@/abi/zora721Factory.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import {
  ARBITRUM,
  ARBITRUM_SEPOLIA,
  BASE,
  BASE_SEPOLIA,
  BLAST,
  BLAST_SEPOLIA,
  ETHEREUM,
  OPTIMISM,
  SEPOLIA,
  ZORA,
  ZORA_SEPOLIA,
} from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Zora 721 Tokens',
      id: 'zora-721-tokens',
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
    const address = this.getFactoryAddress(chain);
    if (!address) {
      return {};
    }
    const topics = encodeEventTopics({
      abi: zora721FactoryAbi,
      eventName: 'CreatedDrop',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(this.getInfo(), chain, address, topic);

    const tokens: Address[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: zora721FactoryAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'CreatedDrop') {
        throw new Error('Invalid event name');
      }
      return decodedLog.args.editionContractAddress.toLowerCase() as Address;
    });

    return Object.fromEntries(
      tokens.map((address) => {
        return [
          address,
          {
            value: '721 Drop',
            sourceId: this.getInfo().id,
            indexed: true,
            type: 'zora-721-token',
            namespace: 'zora',
          },
        ];
      }),
    );
  }

  private getFactoryAddress(chain: ChainId): Address | null {
    switch (chain) {
      case ETHEREUM:
        return '0xf74b146ce44cc162b601dec3be331784db111dc1';
      case OPTIMISM:
        return '0x7d1a46c6e614a0091c39e102f2798c27c1fa8892';
      case SEPOLIA:
        return '0x87cfd516c5ea86e50b950678ca970a8a28de27ac';
      case BLAST_SEPOLIA:
        return '0x3c1ebcf36ca9dd9371c9aa99c274e4988906c6e3';
      case ARBITRUM:
        return '0xa5f8577cca2ee9d5577e76385db1af51517c76bb';
      case ARBITRUM_SEPOLIA:
        return '0x765fbff9e400c55035a1180b78a9cbe12ac25414';
      case ZORA:
        return '0xa2c2a96a232113dd4993e8b048eebc3371ae8d85';
      case BLAST:
        return '0x53a85fbd2955ef713aa489ae0c48523e727a0c07';
      case BASE:
        return '0x899ce31df6c6af81203acaad285bf539234ef4b8';
      case BASE_SEPOLIA:
        return '0xb0c56317e9cebc6e0f7a59458a83d0a9ccc3e955';
      case ZORA_SEPOLIA:
        return '0x6b28d7c2f8b2c2189e95b89b67886eeb16489a97';
      default:
        return null;
    }
  }
}

export default Source;
