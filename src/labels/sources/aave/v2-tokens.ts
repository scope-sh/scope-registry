import { Address, Hex, decodeEventLog, encodeEventTopics } from 'viem';

import aaveV2LendingPoolConfiguratorAbi from '@/abi/aaveV2LendingPoolConfigurator.js';
import { Source as BaseSource } from '@/labels/base.js';
import type {
  ChainLabelMap,
  ChainSingleLabelMap,
  Label,
} from '@/labels/base.js';
import { getLabelTypeById, getNamespaceById } from '@/labels/utils.js';
import {
  AVALANCHE,
  AVALANCHE_FUJI,
  ETHEREUM,
  POLYGON,
} from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getLogs } from '@/utils/fetching.js';

interface Token {
  underlying: Address;
  aToken: Address;
  stableDebtToken: Address;
  variableDebtToken: Address;
}

class Source extends BaseSource {
  getName(): string {
    return 'Aave V2 Tokens';
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
      abi: aaveV2LendingPoolConfiguratorAbi,
      eventName: 'ReserveInitialized',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const logs = await getLogs(chain, address, topic);

    const tokens: Token[] = logs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: aaveV2LendingPoolConfiguratorAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'ReserveInitialized') {
        throw new Error('Invalid event name');
      }
      return {
        underlying: decodedLog.args.asset.toLowerCase() as Address,
        aToken: decodedLog.args.aToken.toLowerCase() as Address,
        stableDebtToken:
          decodedLog.args.stableDebtToken.toLowerCase() as Address,
        variableDebtToken:
          decodedLog.args.variableDebtToken.toLowerCase() as Address,
      };
    });

    return Object.fromEntries(
      tokens
        .map((token) => {
          const labelEntries: [string, Label][] = [
            [
              token.aToken,
              {
                value: getTokenLabel(token, 'a-token', previousLabels),
                type: getLabelTypeById('aave-v2-atoken'),
                namespace: getNamespaceById('aave-v2'),
              },
            ],
            [
              token.stableDebtToken,
              {
                value: getTokenLabel(
                  token,
                  'stable-debt-token',
                  previousLabels,
                ),
                type: getLabelTypeById('aave-v2-stable-debt-token'),
                namespace: getNamespaceById('aave-v2'),
              },
            ],
            [
              token.variableDebtToken,
              {
                value: getTokenLabel(
                  token,
                  'variable-debt-token',
                  previousLabels,
                ),
                type: getLabelTypeById('aave-v2-variable-debt-token'),
                namespace: getNamespaceById('aave-v2'),
              },
            ],
          ];
          return labelEntries;
        })
        .flat(),
    );
  }

  private getPoolConfiguratorAddress(chain: ChainId): Address | null {
    switch (chain) {
      case ETHEREUM:
        return '0x311bb771e4f8952e6da169b425e7e92d6ac45756';
      case POLYGON:
        return '0x26db2b833021583566323e3b8985999981b9f1f3';
      case AVALANCHE_FUJI:
        return '0x4cebafaacc6cb26fd90e4cde138eb812442bb5f3';
      case AVALANCHE:
        return '0x230b618ad4c475393a7239ae03630042281bd86e';
      default:
        return null;
    }
  }
}

type Kind = 'a-token' | 'stable-debt-token' | 'variable-debt-token';

function getTokenLabel(
  token: Token,
  kind: Kind,
  previousLabels: ChainLabelMap,
): string {
  function getKindName(kind: Kind): string {
    switch (kind) {
      case 'a-token':
        return 'aToken';
      case 'stable-debt-token':
        return 'Stable Debt Token';
      case 'variable-debt-token':
        return 'Variable Debt Token';
    }
  }

  const underlyingLabel = previousLabels[token.underlying];
  const kindName = getKindName(kind);
  if (!underlyingLabel) {
    return kindName;
  }
  const label = underlyingLabel.find(
    (label) => label.type && label.type.id === 'erc20',
  );
  if (!label) {
    return kindName;
  }
  if (!label.metadata) {
    return kindName;
  }
  const tokenSymbol = label.metadata.symbol;
  return `${tokenSymbol} ${kindName}`;
}

export default Source;
