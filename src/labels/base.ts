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
  | 'uniswap-v2-pool';

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
