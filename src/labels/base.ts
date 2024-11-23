import { Address } from 'viem';

import type { ChainId } from '../utils/chains.js';

type LabelTypeId = 'erc20' | 'erc721' | 'erc1155' | 'erc7579-module';

type LabelNamespaceId =
  | 'aave-v2'
  | 'aave-v3'
  | 'aerodrome-v1'
  | 'alchemy'
  | 'biconomy'
  | 'biconomy-v2'
  | 'biconomy-nexus'
  | 'blocto'
  | 'candide'
  | 'circle'
  | 'coinbase'
  | 'coinbase-smart-wallet'
  | 'daimo'
  | 'ethereum-attestation-service'
  | 'ens'
  | 'etherspot'
  | 'etherspot-modular-v1'
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
  | 'zerodev-kernel-v3'
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
