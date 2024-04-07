import { decodeEventLog, encodeEventTopics } from 'viem';

import aaveV2LendingPoolConfiguratorAbi from '@/abi/aaveV2LendingPoolConfigurator.js';
import { Source as BaseSource } from '@/labels/base.js';
import type { ChainLabelMap, Label, LabelMap } from '@/labels/base.js';
import { initLabelMap } from '@/labels/utils.js';
import {
  AVALANCHE,
  AVALANCHE_FUJI,
  CHAINS,
  ETHEREUM,
  POLYGON,
} from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getEvents } from '@/utils/fetching.js';

interface Token {
  underlying: string;
  aToken: string;
  stableDebtToken: string;
  variableDebtToken: string;
}

class Source extends BaseSource {
  getName(): string {
    return 'Aave V2 Tokens';
  }

  async fetch(previousLabels: LabelMap): Promise<LabelMap> {
    const labels: LabelMap = initLabelMap();
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
      abi: aaveV2LendingPoolConfiguratorAbi,
      eventName: 'ReserveInitialized',
    });
    const topic = topics[0];
    if (!topic) {
      return {};
    }
    const events = await getEvents(chain, address, topic);

    const tokens: Token[] = events.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: aaveV2LendingPoolConfiguratorAbi,
        data: event.data,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        topics: event.topics,
      });
      if (decodedEvent.eventName !== 'ReserveInitialized') {
        throw new Error('Invalid event name');
      }
      return {
        underlying: decodedEvent.args.asset.toLowerCase(),
        aToken: decodedEvent.args.aToken.toLowerCase(),
        stableDebtToken: decodedEvent.args.stableDebtToken.toLowerCase(),
        variableDebtToken: decodedEvent.args.variableDebtToken.toLowerCase(),
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
                type: 'aave-v2-atoken',
                namespace: 'Aave V2',
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
                type: 'aave-v2-stable-debt-token',
                namespace: 'Aave V2',
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
                type: 'aave-v2-variable-debt-token',
                namespace: 'Aave V2',
              },
            ],
          ];
          return labelEntries;
        })
        .flat(),
    );
  }

  private getPoolConfiguratorAddress(chain: ChainId): string | null {
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
  if (
    !underlyingLabel.type ||
    !['wrapped', 'erc20'].includes(underlyingLabel.type)
  ) {
    return kindName;
  }
  const tokenSymbol = underlyingLabel.metadata?.symbol;
  return `${tokenSymbol} ${kindName}`;
}

export default Source;
