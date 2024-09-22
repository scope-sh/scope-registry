import { Address, Hex, decodeEventLog, encodeEventTopics } from 'viem';

import aaveV3PoolConfiguratorAbi from '@/abi/aaveV3PoolConfigurator.js';
import { Source as BaseSource } from '@/labels/base.js';
import type {
  ChainLabelMap,
  ChainSingleLabelMap,
  Label,
  SourceInfo,
} from '@/labels/base.js';
import {
  ARBITRUM,
  AVALANCHE_FUJI,
  AVALANCHE,
  BASE,
  BNB,
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
import { getLogs } from '@/utils/fetching.js';

interface Token {
  underlying: Address;
  aToken: Address;
  sToken: Address;
  vToken: Address;
}

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Aave V3 Tokens',
      id: 'aave-v3-tokens',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'full',
      requiresErc20: true,
    };
  }

  async fetch(
    chain: ChainId,
    previousLabels: ChainLabelMap,
  ): Promise<ChainSingleLabelMap> {
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
    const logs = await getLogs(this.getInfo(), chain, address, topic);

    const tokens: Token[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: aaveV3PoolConfiguratorAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'ReserveInitialized') {
        throw new Error('Invalid event name');
      }
      return {
        underlying: decodedLog.args.asset.toLowerCase() as Address,
        aToken: decodedLog.args.aToken.toLowerCase() as Address,
        sToken: decodedLog.args.stableDebtToken.toLowerCase() as Address,
        vToken: decodedLog.args.variableDebtToken.toLowerCase() as Address,
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
                sourceId: this.getInfo().id,
                indexed: true,
                type: 'aave-v3-atoken',
                namespace: 'aave-v3',
                metadata: {
                  underlying: token.underlying,
                },
              },
            ],
            [
              token.sToken,
              {
                value: getTokenLabel(token, 's-token', previousLabels),
                sourceId: this.getInfo().id,
                indexed: true,
                type: 'aave-v3-stoken',
                namespace: 'aave-v3',
                metadata: {
                  underlying: token.underlying,
                },
              },
            ],
            [
              token.vToken,
              {
                value: getTokenLabel(token, 'v-token', previousLabels),
                sourceId: this.getInfo().id,
                indexed: true,
                type: 'aave-v3-vtoken',
                namespace: 'aave-v3',
                metadata: {
                  underlying: token.underlying,
                },
              },
            ],
          ];
          return entries;
        })
        .flat(),
    );
  }

  private getPoolConfiguratorAddress(chain: ChainId): Address | null {
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
  const label = underlyingLabel.find(
    (label) => label.type && label.type === 'erc20',
  );
  if (!label) {
    return kindName;
  }
  if (!label.metadata) {
    return kindName;
  }
  const tokenSymbol = label.metadata.symbol;
  if (!tokenSymbol) {
    return kindName;
  }
  return `${tokenSymbol} ${kindName}`;
}

export default Source;
