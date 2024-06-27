import { Address } from 'viem';

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
  ChainId,
} from '@/utils/chains.js';

import { Source as BaseSource } from '../base.js';
import type { ChainSingleLabelMap } from '../base.js';

interface WrappedAsset {
  address: Address;
  name: string;
  symbol: string;
}

class Source extends BaseSource {
  getName(): string {
    return 'Wrapped Native Assets';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const type = 'erc20';
    const assets: Record<ChainId, WrappedAsset | null> = {
      [ETHEREUM]: {
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        name: 'Wrapped Ether',
        symbol: 'WETH',
      },
      [OPTIMISM]: {
        address: '0x4200000000000000000000000000000000000006',
        name: 'Wrapped Ether',
        symbol: 'WETH',
      },
      [BNB]: {
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        name: 'Wrapped BNB',
        symbol: 'WBNB',
      },
      [BNB_TESTNET]: null,
      [GNOSIS_CHAIN]: {
        address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
        name: 'Wrapped XDAI',
        symbol: 'WXDAI',
      },
      [POLYGON]: {
        address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        name: 'Wrapped Matic',
        symbol: 'WMATIC',
      },
      [FANTOM]: {
        address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
        name: 'Wrapped Fantom',
        symbol: 'WFTM',
      },
      [ZKSYNC]: {
        address: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
        name: 'Wrapped Ether',
        symbol: 'WETH',
      },
      [KLAYTN_BAOBAB]: null,
      [METIS]: {
        address: '0x4200000000000000000000000000000000000006',
        name: 'Wrapped Ether',
        symbol: 'WETH',
      },
      [POLYGON_ZKEVM]: {
        address: '0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9',
        name: 'Wrapped Ether',
        symbol: 'WETH',
      },
      [MOONBEAM]: {
        address: '0xAcc15dC74880C9944775448304B263D191c6077F',
        name: 'Wrapped GLMR',
        symbol: 'WGLMR',
      },
      [MOONRIVER]: null,
      [FANTOM_TESTNET]: null,
      [CANTO]: {
        address: '0x826551890dc65655a0aceca109ab11abdbd7a07b',
        name: 'Wrapped Canto',
        symbol: 'WCANTO',
      },
      [KLAYTN]: {
        address: '0xfd844c2fca5e595004b17615f891620d1cb9bbb2',
        name: 'Wrapped Klay',
        symbol: 'WKLAY',
      },
      [BASE]: {
        address: '0x4200000000000000000000000000000000000006',
        name: 'Wrapped Ether',
        symbol: 'WETH',
      },
      [GNOSIS_CHIADO]: null,
      [ARBITRUM]: {
        address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
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
      [AVALANCHE_FUJI]: null,
      [AVALANCHE]: {
        address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
        name: 'Wrapped AVAX',
        symbol: 'WAVAX',
      },
      [LINEA_SEPOLIA]: null,
      [LINEA]: {
        address: '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f',
        name: 'Wrapped Ether',
        symbol: 'WETH',
      },
      [POLYGON_AMOY]: null,
      [BASE_SEPOLIA]: null,
      [ARBITRUM_SEPOLIA]: null,
      [SCROLL_SEPOLIA]: null,
      [SCROLL]: {
        address: '0x5300000000000000000000000000000000000004',
        name: 'Wrapped Ether',
        symbol: 'WETH',
      },
      [ZORA]: {
        address: '0x4200000000000000000000000000000000000006',
        name: 'Wrapped Ether',
        symbol: 'WETH',
      },
      [SEPOLIA]: null,
      [OPTIMISM_SEPOLIA]: null,
      [ZORA_SEPOLIA]: null,
      [AURORA]: {
        address: '0xc9bdeed33cd01541e1eed10f90519d2c06fe3feb',
        name: 'Wrapped Ether',
        symbol: 'WETH',
      },
      [BLAST]: {
        address: '0x4300000000000000000000000000000000000004',
        name: 'Wrapped Ether',
        symbol: 'WETH',
      },
      [BLAST_SEPOLIA]: null,
      [HARMONY_SHARD_0]: {
        address: '0xcf664087a5bb0237a0bad6742852ec6c8d69a27a',
        name: 'Wrapped One',
        symbol: 'WONE',
      },
    };

    const chainAsset = assets[chain];
    if (!chainAsset) {
      return {};
    }
    return {
      [chainAsset.address]: {
        value: `${chainAsset.name} (${chainAsset.symbol})`,
        type,
        metadata: {
          symbol: chainAsset.symbol,
        },
      },
    };
  }
}

export default Source;
