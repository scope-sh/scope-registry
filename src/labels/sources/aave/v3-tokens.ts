import { Hex, decodeEventLog, encodeEventTopics } from 'viem';

import aaveV3PoolConfiguratorAbi from '@/abi/aaveV3PoolConfigurator.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainLabelMap, Label, LabelMap } from '@/labels/base.js';
import {
  getLabelNamespaceByValue,
  getLabelTypeById,
  initLabelMap,
} from '@/labels/utils.js';
import {
  ARBITRUM,
  AVALANCHE_FUJI,
  AVALANCHE,
  BASE,
  BNB,
  CHAINS,
  ETHEREUM,
  FANTOM_TESTNET,
  FANTOM,
  GNOSIS_CHAIN,
  HARMONY_SHARD_0,
  METIS,
  OPTIMISM,
  POLYGON_ZKEVM,
  POLYGON,
  SCROLL_SEPOLIA,
  SCROLL,
  SEPOLIA,
} from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getEvents } from '@/utils/fetching.js';

interface Token {
  underlying: string;
  aToken: string;
  sToken: string;
  vToken: string;
}

const NAMESPACE = 'Aave V3';

class Source extends BaseSource {
  getName(): string {
    return 'Aave V3 Tokens';
  }

  async fetch(previousLabels: LabelMap): Promise<LabelMap> {
    const labels = initLabelMap();
    for (const chain of CHAINS) {
      const chainPreviousLabels = previousLabels[chain];
      const chainLabels = await this.fetchChain(chain, chainPreviousLabels);
      labels[chain] = chainLabels;
    }

    return labels;
  }

  private async fetchChain(
    chain: ChainId,
    previousLabels: ChainLabelMap,
  ): Promise<ChainLabelMap> {
    const address = this.getPoolConfiguratorAddress(chain);
    if (!address) {
      return {};
    }
    const topics = encodeEventTopics({
      abi: aaveV3PoolConfiguratorAbi,
      eventName: 'ReserveInitialized',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, address, topic);

    const tokens: Token[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: aaveV3PoolConfiguratorAbi,
        data: event.data,
        topics: event.topics as [Hex, ...Hex[]],
      });
      if (decodedEvent.eventName !== 'ReserveInitialized') {
        throw new Error('Invalid event name');
      }
      return {
        underlying: decodedEvent.args.asset.toLowerCase(),
        aToken: decodedEvent.args.aToken.toLowerCase(),
        sToken: decodedEvent.args.stableDebtToken.toLowerCase(),
        vToken: decodedEvent.args.variableDebtToken.toLowerCase(),
      };
    });

    return Object.fromEntries(
      tokens
        .map((token) => {
          const entries: [string, Label][] = [
            [
              token.aToken,
              {
                value: getTokenLabel(token, 'a-token', previousLabels),
                type: getLabelTypeById('aave-v3-atoken'),
                namespace: getLabelNamespaceByValue(NAMESPACE),
              },
            ],
            [
              token.sToken,
              {
                value: getTokenLabel(token, 's-token', previousLabels),
                type: getLabelTypeById('aave-v3-stoken'),
                namespace: getLabelNamespaceByValue(NAMESPACE),
              },
            ],
            [
              token.vToken,
              {
                value: getTokenLabel(token, 'v-token', previousLabels),
                type: getLabelTypeById('aave-v3-vtoken'),
                namespace: getLabelNamespaceByValue(NAMESPACE),
              },
            ],
          ];
          return entries;
        })
        .flat(),
    );
  }

  private getPoolConfiguratorAddress(chain: ChainId): string | null {
    switch (chain) {
      case ETHEREUM:
        return '0x64b761d848206f447fe2dd461b0c635ec39ebb27';
      case OPTIMISM:
        return '0x8145edddf43f50276641b55bd3ad95944510021e';
      case BNB:
        return '0x67bdf23c7fce7c65ff7415ba3f2520b45d6f9584';
      case GNOSIS_CHAIN:
        return '0x7304979ec9e4eaa0273b6a037a31c4e9e5a75d16';
      case POLYGON:
        return '0x8145edddf43f50276641b55bd3ad95944510021e';
      case FANTOM:
        return '0x8145edddf43f50276641b55bd3ad95944510021e';
      case METIS:
        return '0x69fee8f261e004453be0800bc9039717528645a6';
      case POLYGON_ZKEVM:
        return '0x7304979ec9e4eaa0273b6a037a31c4e9e5a75d16';
      case FANTOM_TESTNET:
        return '0x257a6f06192d532e40f66b3ddfe2cbbaf8373822';
      case BASE:
        return '0x5731a04b1e775f0fdd454bf70f3335886e9a96be';
      case ARBITRUM:
        return '0x8145edddf43f50276641b55bd3ad95944510021e';
      case AVALANCHE_FUJI:
        return '0x34b80e82dfa833d65ef7618cfc22bb1f359adce7';
      case AVALANCHE:
        return '0x8145edddf43f50276641b55bd3ad95944510021e';
      case SCROLL_SEPOLIA:
        return '0x63bb78fbac521998bd6e33f1a960677c7a1d4f10';
      case SCROLL:
        return '0x81b161773ce43781a3e67d71f652e0e22f21e170';
      case SEPOLIA:
        return '0x7ee60d184c24ef7afc1ec7be59a0f448a0abd138';
      case HARMONY_SHARD_0:
        return '0x8145edddf43f50276641b55bd3ad95944510021e';
      default:
        return null;
    }
  }
}

type Kind = 'a-token' | 's-token' | 'v-token';

function getTokenLabel(
  token: Token,
  kind: Kind,
  previousLabels: ChainLabelMap,
): string {
  function getKindName(kind: Kind): string {
    switch (kind) {
      case 'a-token':
        return 'aToken';
      case 's-token':
        return 'sToken';
      case 'v-token':
        return 'vToken';
    }
  }

  const underlyingLabel = previousLabels[token.underlying];
  const kindName = getKindName(kind);
  if (!underlyingLabel) {
    return kindName;
  }
  if (
    !underlyingLabel.type ||
    !['wrapped', 'erc20'].includes(underlyingLabel.type.id)
  ) {
    return kindName;
  }
  const tokenSymbol = underlyingLabel.metadata?.symbol;
  return `${tokenSymbol} ${kindName}`;
}

export default Source;
