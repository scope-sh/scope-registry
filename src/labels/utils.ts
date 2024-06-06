import { Address } from 'viem';

import type {
  ChainSingleLabelMap,
  LabelId,
  LabelNamespace,
  LabelType,
} from './base.js';

function getLabelNamespaceByValue(value: string): LabelNamespace {
  return {
    id: sluggify(value),
    value,
  };
}

function getLabelTypeById(value: LabelId): LabelType {
  function getLabelTypeValue(value: LabelId): string {
    switch (value) {
      case 'wrapped':
        return 'Wrapped';
      case 'erc20':
        return 'ERC20';
      case 'aave-v2-atoken':
        return 'Aave V2 aToken';
      case 'aave-v2-variable-debt-token':
        return 'Aave V2 Variable Debt Token';
      case 'aave-v2-stable-debt-token':
        return 'Aave V2 Stable Debt Token';
      case 'aave-v3-atoken':
        return 'Aave V3 aToken';
      case 'aave-v3-vtoken':
        return 'Aave V3 vToken';
      case 'aave-v3-stoken':
        return 'Aave V3 sToken';
      case 'biconomy-v2-account':
        return 'Biconomy V2 Account';
      case 'coinbase-smart-wallet-v1-account':
        return 'Coinbase Smart Wallet V1 Account';
      case 'daimo-v1-account':
        return 'Daimo V1 Account';
      case 'kernel-v2-account':
        return 'Kernel V2 Account';
      case 'kernel-v3-account':
        return 'Kernel V3 Account';
      case 'erc7579-module':
        return 'ERC7579 Module';
      case 'fun-v1-account':
        return 'Fun Account';
      case 'light-v0.1-account':
        return 'Light V0.1 Account';
      case 'light-v0.2-account':
        return 'Light V0.2 Account';
      case 'patch-wallet-v1-account':
        return 'Patch Wallet Account';
      case 'rhinestone-v1-module':
        return 'Rhinestone V1 Module';
      case 'safe-v1.3.0-account':
        return 'Safe V1.3.0 Account';
      case 'safe-v1.4.1-account':
        return 'Safe V1.4.1 Account';
      case 'uniswap-v2-pool':
        return 'Uniswap V2 Pool';
      case 'uniswap-v3-pool':
        return 'Uniswap V3 Pool';
    }
  }

  return {
    id: value,
    value: getLabelTypeValue(value),
  };
}

function sluggify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function toChainLabelMap(
  addresses?: Record<Address, string>,
  namespaceValue?: string,
  id?: LabelId,
): ChainSingleLabelMap {
  const map: ChainSingleLabelMap = {};
  if (!addresses) {
    return map;
  }
  for (const addressString in addresses) {
    const address = addressString as Address;
    const value = addresses[address];
    if (!value) {
      continue;
    }
    map[address] = {
      value,
      type: id ? getLabelTypeById(id) : undefined,
      namespace: namespaceValue
        ? getLabelNamespaceByValue(namespaceValue)
        : undefined,
    };
  }
  return map;
}

export { getLabelNamespaceByValue, getLabelTypeById, toChainLabelMap };
