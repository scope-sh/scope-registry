import {
  ETHEREUM,
  OPTIMISM,
  BNB,
  BNB_TESTNET,
  GNOSIS_CHAIN,
  POLYGON,
  FANTOM,
  ZKSYNC,
  KLAYTN_BAOBAB,
  METIS,
  POLYGON_ZKEVM,
  MOONBEAM,
  MOONRIVER,
  FANTOM_TESTNET,
  CANTO,
  KLAYTN,
  BASE,
  GNOSIS_CHIADO,
  ARBITRUM,
  ARBITRUM_NOVA,
  CELO,
  AVALANCHE_FUJI,
  AVALANCHE,
  LINEA_SEPOLIA,
  LINEA,
  POLYGON_AMOY,
  BASE_SEPOLIA,
  ARBITRUM_SEPOLIA,
  SCROLL_SEPOLIA,
  SCROLL,
  ZORA,
  SEPOLIA,
  OPTIMISM_SEPOLIA,
  ZORA_SEPOLIA,
  AURORA,
  BLAST,
  BLAST_SEPOLIA,
  HARMONY_SHARD_0,
} from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';

import type {
  ChainLabelMap,
  LabelId,
  LabelMap,
  LabelNamespace,
  LabelType,
} from './base.js';

function initLabelMap(): LabelMap {
  return {
    [ETHEREUM]: {},
    [OPTIMISM]: {},
    [BNB]: {},
    [BNB_TESTNET]: {},
    [GNOSIS_CHAIN]: {},
    [POLYGON]: {},
    [FANTOM]: {},
    [ZKSYNC]: {},
    [KLAYTN_BAOBAB]: {},
    [METIS]: {},
    [POLYGON_ZKEVM]: {},
    [MOONBEAM]: {},
    [MOONRIVER]: {},
    [FANTOM_TESTNET]: {},
    [CANTO]: {},
    [KLAYTN]: {},
    [BASE]: {},
    [GNOSIS_CHIADO]: {},
    [ARBITRUM]: {},
    [ARBITRUM_NOVA]: {},
    [CELO]: {},
    [AVALANCHE_FUJI]: {},
    [AVALANCHE]: {},
    [LINEA_SEPOLIA]: {},
    [LINEA]: {},
    [POLYGON_AMOY]: {},
    [BASE_SEPOLIA]: {},
    [ARBITRUM_SEPOLIA]: {},
    [SCROLL_SEPOLIA]: {},
    [SCROLL]: {},
    [ZORA]: {},
    [SEPOLIA]: {},
    [OPTIMISM_SEPOLIA]: {},
    [ZORA_SEPOLIA]: {},
    [AURORA]: {},
    [BLAST]: {},
    [BLAST_SEPOLIA]: {},
    [HARMONY_SHARD_0]: {},
  };
}

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

function toLabelMap(
  addresses: Record<string, Record<string, string>>,
  namespaceValue?: string,
  id?: LabelId,
): LabelMap {
  const labelMap = {} as LabelMap;
  for (const chainString in addresses) {
    const chainLabelMap: ChainLabelMap = {};
    const chain = parseInt(chainString) as ChainId;
    const chainAddresses = addresses[chainString];
    if (!chainAddresses) {
      continue;
    }
    for (const address in chainAddresses) {
      const value = chainAddresses[address];
      if (!value) {
        continue;
      }
      chainLabelMap[address] = {
        value,
        type: id ? getLabelTypeById(id) : undefined,
        namespace: namespaceValue
          ? getLabelNamespaceByValue(namespaceValue)
          : undefined,
      };
    }
    labelMap[chain] = chainLabelMap;
  }
  return labelMap;
}

export { getLabelNamespaceByValue, getLabelTypeById, initLabelMap, toLabelMap };
