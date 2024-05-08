import type { ChainId } from '../utils/chains.js';

type LabelId =
  | 'wrapped'
  | 'erc20'
  | 'aave-v2-atoken'
  | 'aave-v2-variable-debt-token'
  | 'aave-v2-stable-debt-token'
  | 'aave-v3-atoken'
  | 'aave-v3-vtoken'
  | 'aave-v3-stoken'
  | 'biconomy-v2-account'
  | 'coinbase-smart-wallet-v1-account'
  | 'daimo-v1-account'
  | 'kernel-v2-account'
  | 'kernel-v3-account'
  | 'erc7579-module'
  | 'fun-v1-account'
  | 'light-v0.1-account'
  | 'light-v0.2-account'
  | 'patch-wallet-v1-account'
  | 'rhinestone-v1-module'
  | 'safe-v1.3.0-account'
  | 'safe-v1.4.1-account'
  | 'uniswap-v2-pool'
  | 'uniswap-v3-pool';

type ChainLabelMap = Record<string, Label>;
type LabelMap = Record<ChainId, ChainLabelMap>;

interface LabelType {
  id: LabelId;
  value: string;
}

interface LabelNamespace {
  id: string;
  value: string;
}

interface Label {
  value: string;
  namespace?: LabelNamespace;
  type?: LabelType;
  iconUrl?: string;
  metadata?: Record<string, unknown>;
}

abstract class Source {
  abstract getName(): string;
  abstract fetch(previousLabels: LabelMap): Promise<LabelMap>;
}

export { Source };
export type {
  ChainLabelMap,
  Label,
  LabelId,
  LabelMap,
  LabelNamespace,
  LabelType,
};
