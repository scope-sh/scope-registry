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
  | 'alchemy-v1-multi-owner-modular-account'
  | 'alchemy-v1.0-light-account'
  | 'alchemy-v1.0-light-account'
  | 'alchemy-v1.1-light-account'
  | 'alchemy-v2-light-account'
  | 'alchemy-v2-multi-owner-light-account'
  | 'biconomy-v2-account'
  | 'coinbase-smart-wallet-v1-account'
  | 'daimo-v1-account'
  | 'kernel-v1-account'
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
  | 'thirdweb-v1-managed-account'
  | 'uniswap-v2-pool'
  | 'uniswap-v3-pool';

type LabelNamespaceId =
  | 'aave-v2'
  | 'aave-v3'
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
  | 'light-v0.1'
  | 'light-v0.2'
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
  namespace?: LabelNamespaceId;
  type?: LabelTypeId;
  iconUrl?: string;
  metadata?: Record<string, unknown>;
}

abstract class Source {
  abstract getName(): string;
  abstract fetch(
    chain: ChainId,
    previousLabels: ChainLabelMap,
  ): Promise<ChainSingleLabelMap>;
}

function getNamespaceValue(id: LabelNamespaceId): string {
  switch (id) {
    case 'aave-v2':
      return 'Aave V2';
    case 'aave-v3':
      return 'Aave V3';
    case 'alchemy':
      return 'Alchemy';
    case 'biconomy':
      return 'Biconomy';
    case 'biconomy-v2':
      return 'Biconomy V2';
    case 'blocto':
      return 'Blocto';
    case 'candide':
      return 'Candide';
    case 'circle':
      return 'Circle';
    case 'coinbase-smart-wallet':
      return 'Coinbase Smart Wallet';
    case 'daimo':
      return 'Daimo';
    case 'ethereum-attestation-service':
      return 'Ethereum Attestation Service';
    case 'ens':
      return 'ENS';
    case 'etherspot':
      return 'Etherspot';
    case 'farcaster':
      return 'Farcaster';
    case 'fun':
      return 'Fun';
    case 'light-v0.1':
      return 'Light V0.1';
    case 'light-v0.2':
      return 'Light V0.2';
    case 'nani':
      return 'Nani';
    case 'openfort':
      return 'Openfort';
    case 'opensea-seaport':
      return 'OpenSea Seaport';
    case 'parifi-v1':
      return 'Parifi V1';
    case 'particle':
      return 'Particle';
    case 'patch-wallet':
      return 'Patch Wallet';
    case 'pimlico':
      return 'Pimlico';
    case 'rhinestone-v1':
      return 'Rhinestone V1';
    case 'safe-core':
      return 'Safe Core';
    case 'safe':
      return 'Safe';
    case 'stackup':
      return 'Stackup';
    case 'thirdweb':
      return 'Thirdweb';
    case 'unipass':
      return 'UniPass';
    case 'uniswap-v2':
      return 'Uniswap V2';
    case 'uniswap-v3':
      return 'Uniswap V3';
    case 'zerodev':
      return 'ZeroDev';
    case 'zerodev-kernel-v1':
      return 'ZeroDev Kernel V1';
    case 'zerodev-kernel-v2':
      return 'ZeroDev Kernel V2';
    case 'zerodev-kernel-v3':
      return 'ZeroDev Kernel V3';
  }
}

export { Source, getNamespaceValue };
export type {
  ChainSingleLabelMap,
  ChainLabelMap,
  Label,
  LabelTypeId,
  LabelMap,
  SingleLabelMap,
  LabelNamespaceId,
};
