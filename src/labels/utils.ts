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
  HARMONY_SHARD_0,
} from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';

import type { ChainLabelMap, LabelMap } from './base.js';

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
    [HARMONY_SHARD_0]: {},
  };
}

function toLabelMap(
  namespace: string | undefined,
  addresses: Record<string, Record<string, string>>,
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
        namespace,
      };
    }
    labelMap[chain] = chainLabelMap;
  }
  return labelMap;
}

// eslint-disable-next-line import/prefer-default-export
export { initLabelMap, toLabelMap };
