import type { ChainId } from '@/utils/chains.js';

type LabelType =
  | 'wrapped'
  | 'erc20'
  | 'aave-v2-atoken'
  | 'aave-v2-variable-debt-token'
  | 'aave-v2-stable-debt-token'
  | 'aave-v3-atoken'
  | 'aave-v3-vtoken'
  | 'aave-v3-stoken'
  | 'biconomy-v2-account'
  | 'kernel-v2-account'
  | 'rhinestone-v1-module'
  | 'safe-v1.3.0-account'
  | 'safe-v1.4.1-account'
  | 'uniswap-v2-pool'
  | 'uniswap-v3-pool';

type ChainLabelMap = Record<string, Label>;
type LabelMap = Record<ChainId, ChainLabelMap>;

interface Label {
  value: string;
  namespace?: string;
  type?: LabelType;
  metadata?: Record<string, unknown>;
}

abstract class Source {
  abstract getName(): string;
  abstract fetch(previousLabels: LabelMap): Promise<LabelMap>;
}

export { Source };
export type { ChainLabelMap, LabelType, LabelMap, Label };
