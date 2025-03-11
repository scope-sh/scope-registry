import { Address } from 'viem';

import type { ChainId } from '../utils/chains.js';

type LabelTypeId = 'erc20' | 'erc721' | 'erc1155' | 'erc7579-module';

type LabelNamespaceId =
  | 'aave-v2'
  | 'aave-v3'
  | 'aerodrome-v1'
  | 'alchemy'
  | 'ambire'
  | 'biconomy-nexus'
  | 'biconomy-v2'
  | 'biconomy'
  | 'blocto'
  | 'candide'
  | 'circle'
  | 'coinbase-smart-wallet'
  | 'coinbase'
  | 'cometh'
  | 'daimo'
  | 'ens'
  | 'ethereum-attestation-service'
  | 'etherspot-modular-v1'
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
  | 'otim'
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
  | 'zerodev-kernel-v1'
  | 'zerodev-kernel-v2'
  | 'zerodev-kernel-v3'
  | 'zerodev'
  | 'zora';

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
