import { Address } from 'viem';

import type { ChainId } from '../utils/chains.js';

type LabelTypeId =
  | 'erc20'
  | 'erc721'
  | 'erc1155'
  | 'aave-v2-atoken'
  | 'aave-v2-variable-debt-token'
  | 'aave-v2-stable-debt-token'
  | 'aave-v3-atoken'
  | 'aave-v3-vtoken'
  | 'aave-v3-stoken'
  | 'aerodrome-v1-pool'
  | 'alchemy-v1-multi-owner-modular-account'
  | 'alchemy-v1.0-light-account'
  | 'alchemy-v1.0-light-account'
  | 'alchemy-v1.1-light-account'
  | 'alchemy-v2-light-account'
  | 'alchemy-v2-multi-owner-light-account'
  | 'biconomy-v2-account'
  | 'coinbase-smart-wallet-v1-account'
  | 'daimo-v1-account'
  | 'entry-point-v0.6.0-account'
  | 'entry-point-v0.7.0-account'
  | 'kernel-v1-account'
  | 'kernel-v2-account'
  | 'kernel-v3-account'
  | 'erc7579-module'
  | 'fun-v1-account'
  | 'light-account'
  | 'morpho-vault'
  | 'nani-v0-account'
  | 'nani-v1-account'
  | 'patch-wallet-v1-account'
  | 'rhinestone-v1-module'
  | 'safe7579-v1.0.0-account'
  | 'safe-v1.3.0-account'
  | 'safe-v1.4.1-account'
  | 'thirdweb-v1-managed-account'
  | 'uniswap-v2-pool'
  | 'uniswap-v3-pool';

type LabelNamespaceId =
  | 'aave-v2'
  | 'aave-v3'
  | 'aerodrome-v1'
  | 'alchemy'
  | 'biconomy'
  | 'biconomy-v2'
  | 'blocto'
  | 'candide'
  | 'circle'
  | 'coinbase-smart-wallet'
  | 'daimo'
  | 'ethereum-attestation-service'
  | 'ens'
  | 'etherspot'
  | 'farcaster'
  | 'fun'
  | 'klaster'
  | 'lido'
  | 'light'
  | 'morpho'
  | 'nani'
  | 'openfort'
  | 'opensea-seaport'
  | 'parifi-v1'
  | 'particle'
  | 'patch-wallet'
  | 'pimlico'
  | 'rhinestone-v1'
  | 'safe-core'
  | 'safe'
  | 'stackup'
  | 'thirdweb'
  | 'union'
  | 'unipass'
  | 'uniswap-v2'
  | 'uniswap-v3'
  | 'zerodev'
  | 'zerodev-kernel-v1'
  | 'zerodev-kernel-v2'
  | 'zerodev-kernel-v3';

type ChainSingleLabelMap = Record<Address, Label>;
type ChainLabelMap = Record<Address, Label[]>;
type SingleLabelMap = Record<ChainId, ChainSingleLabelMap>;
type LabelMap = Record<ChainId, ChainLabelMap>;

interface Label {
  value: string;
  indexed: boolean;
  sourceId: string;
  namespace?: LabelNamespaceId;
  type?: LabelTypeId;
  iconUrl?: string;
  metadata?: Record<string, unknown>;
}

interface SourceInterval {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
}

interface SourceInfo {
  name: string;
  id: string;
  interval: SourceInterval;
  fetchType: 'incremental' | 'full';
  requiresErc20?: boolean;
  requiresDeletion?: boolean;
}

abstract class Source {
  abstract getInfo(): SourceInfo;
  abstract fetch(
    chain: ChainId,
    previousLabels: ChainLabelMap,
  ): Promise<ChainSingleLabelMap>;
}

export { Source };
export type {
  ChainSingleLabelMap,
  ChainLabelMap,
  Label,
  LabelTypeId,
  LabelMap,
  SingleLabelMap,
  SourceInfo,
  SourceInterval,
  LabelNamespaceId,
};
