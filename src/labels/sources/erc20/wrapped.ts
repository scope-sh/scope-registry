import { Address } from 'viem';

import {
  type ChainId,
  ETHEREUM,
  SEPOLIA,
  OPTIMISM,
  OPTIMISM_SEPOLIA,
  BASE,
  BASE_SEPOLIA,
  POLYGON,
  POLYGON_AMOY,
  ARBITRUM,
  ARBITRUM_SEPOLIA,
  MODE,
  LINEA,
  ARBITRUM_NOVA,
  CELO,
  AVALANCHE,
  AVALANCHE_FUJI,
  GNOSIS,
  BSC,
} from '@/utils/chains.js';

import { type Asset } from './index.js';

interface WrappedAsset {
  address: Address;
  name: string;
  symbol: string;
}

async function fetch(chain: ChainId): Promise<Asset[]> {
  const assets: Record<ChainId, WrappedAsset | null> = {
    [ETHEREUM]: {
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      name: 'Wrapped Ether',
      symbol: 'WETH',
    },
    [SEPOLIA]: null,
    [OPTIMISM]: {
      address: '0x4200000000000000000000000000000000000006',
      name: 'Wrapped Ether',
      symbol: 'WETH',
    },
    [OPTIMISM_SEPOLIA]: null,
    [BASE]: {
      address: '0x4200000000000000000000000000000000000006',
      name: 'Wrapped Ether',
      symbol: 'WETH',
    },
    [BASE_SEPOLIA]: null,
    [POLYGON]: {
      address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      name: 'Wrapped Matic',
      symbol: 'WMATIC',
    },
    [POLYGON_AMOY]: null,
    [ARBITRUM]: {
      address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      name: 'Wrapped Ether',
      symbol: 'WETH',
    },
    [ARBITRUM_SEPOLIA]: null,
    [MODE]: {
      address: '0x4200000000000000000000000000000000000006',
      name: 'Wrapped Ether',
      symbol: 'WETH',
    },
    [LINEA]: {
      address: '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f',
      name: 'Wrapped Ether',
      symbol: 'WETH',
    },
    [ARBITRUM_NOVA]: {
      address: '0x722e8bdd2ce80a4422e880164f2079488e115365',
      name: 'Wrapped Ether',
      symbol: 'WETH',
    },
    [CELO]: {
      address: '0x471ece3750da237f93b8e339c536989b8978a438',
      name: 'Celo',
      symbol: 'CELO',
    },
    [AVALANCHE]: {
      address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
      name: 'Wrapped AVAX',
      symbol: 'WAVAX',
    },
    [AVALANCHE_FUJI]: null,
    [GNOSIS]: {
      address: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
      name: 'Wrapped XDAI',
      symbol: 'WXDAI',
    },
    [BSC]: {
      address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      name: 'Wrapped BNB',
      symbol: 'WBNB',
    },
  };

  const chainAsset = assets[chain];
  if (!chainAsset) {
    return [];
  }
  return chainAsset
    ? [
        {
          address: chainAsset.address,
          name: chainAsset.name,
          symbol: chainAsset.symbol,
          decimals: 18,
        },
      ]
    : [];
}

export default fetch;
