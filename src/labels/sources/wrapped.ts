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

import { Source as BaseSource } from '../base.js';
import type { LabelMap } from '../base.js';
import { getLabelTypeById } from '../utils.js';

class Source extends BaseSource {
  getName(): string {
    return 'Wrapped Native Assets';
  }

  async fetch(): Promise<LabelMap> {
    const type = getLabelTypeById('wrapped');
    const labels: LabelMap = {
      [ETHEREUM]: {
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': {
          value: 'Wrapped Ether',
          type,
          metadata: {
            symbol: 'WETH',
          },
        },
      },
      [OPTIMISM]: {
        '0x4200000000000000000000000000000000000006': {
          value: 'Wrapped Ether',
          type,
          metadata: {
            symbol: 'WETH',
          },
        },
      },
      [BNB]: {
        '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c': {
          value: 'Wrapped BNB',
          type,
          metadata: {
            symbol: 'WBNB',
          },
        },
      },
      [BNB_TESTNET]: {},
      [GNOSIS_CHAIN]: {
        '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d': {
          value: 'Wrapped XDAI',
          type,
          metadata: {
            symbol: 'WXDAI',
          },
        },
      },
      [POLYGON]: {
        '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270': {
          value: 'Wrapped Matic',
          type,
          metadata: {
            symbol: 'WETH',
          },
        },
      },
      [FANTOM]: {
        '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83': {
          value: 'Wrapped Fantom',
          type,
          metadata: {
            symbol: 'WFTM',
          },
        },
      },
      [ZKSYNC]: {
        '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91': {
          value: 'Wrapped Ether',
          type,
          metadata: {
            symbol: 'WETH',
          },
        },
      },
      [KLAYTN_BAOBAB]: {},
      [METIS]: {
        '0x4200000000000000000000000000000000000006': {
          value: 'Wrapped Ether',
          type,
          metadata: {
            symbol: 'WETH',
          },
        },
      },
      [POLYGON_ZKEVM]: {
        '0x4f9a0e7fd2bf6067db6994cf12e4495df938e6e9': {
          value: 'Wrapped Ether',
          type,
          metadata: {
            symbol: 'WETH',
          },
        },
      },
      [MOONBEAM]: {
        '0xAcc15dC74880C9944775448304B263D191c6077F': {
          value: 'Wrapped GLMR',
          type,
          metadata: {
            symbol: 'WGLMR',
          },
        },
      },
      [MOONRIVER]: {},
      [FANTOM_TESTNET]: {},
      [CANTO]: {
        '0x826551890dc65655a0aceca109ab11abdbd7a07b': {
          value: 'Wrapped Canto',
          type,
          metadata: {
            symbol: 'WCANTO',
          },
        },
      },
      [KLAYTN]: {
        '0xfd844c2fca5e595004b17615f891620d1cb9bbb2': {
          value: 'Wrapped Klay',
          type,
          metadata: {
            symbol: 'WKLAY',
          },
        },
      },
      [BASE]: {
        '0x4200000000000000000000000000000000000006': {
          value: 'Wrapped Ether',
          type,
          metadata: {
            symbol: 'WETH',
          },
        },
      },
      [GNOSIS_CHIADO]: {},
      [ARBITRUM]: {
        '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': {
          value: 'Wrapped Ether',
          type,
          metadata: {
            symbol: 'WETH',
          },
        },
      },
      [ARBITRUM_NOVA]: {
        '0x722e8bdd2ce80a4422e880164f2079488e115365': {
          value: 'Wrapped Ether',
          type,
          metadata: {
            symbol: 'WETH',
          },
        },
      },
      [CELO]: {
        '0x471ece3750da237f93b8e339c536989b8978a438': {
          value: 'Celo',
          type,
          metadata: {
            symbol: 'CELO',
          },
        },
      },
      [AVALANCHE_FUJI]: {},
      [AVALANCHE]: {
        '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7': {
          value: 'Wrapped AVAX',
          type,
          metadata: {
            symbol: 'WAVAX',
          },
        },
      },
      [LINEA_SEPOLIA]: {},
      [LINEA]: {
        '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f': {
          value: 'Wrapped Ether',
          type,
          metadata: {
            symbol: 'WETH',
          },
        },
      },
      [POLYGON_AMOY]: {},
      [BASE_SEPOLIA]: {},
      [ARBITRUM_SEPOLIA]: {},
      [SCROLL_SEPOLIA]: {},
      [SCROLL]: {
        '0x5300000000000000000000000000000000000004': {
          value: 'Wrapped Ether',
          type,
          metadata: {
            symbol: 'WETH',
          },
        },
      },
      [ZORA]: {
        '0x4200000000000000000000000000000000000006': {
          value: 'Wrapped Ether',
          type,
          metadata: {
            symbol: 'WETH',
          },
        },
      },
      [SEPOLIA]: {},
      [OPTIMISM_SEPOLIA]: {},
      [ZORA_SEPOLIA]: {},
      [AURORA]: {
        '0xc9bdeed33cd01541e1eed10f90519d2c06fe3feb': {
          value: 'Wrapped Ether',
          type,
          metadata: {
            symbol: 'WETH',
          },
        },
      },
      [BLAST]: {
        '0x4300000000000000000000000000000000000004': {
          value: 'Wrapped Ether',
          type,
          metadata: {
            symbol: 'WETH',
          },
        },
      },
      [BLAST_SEPOLIA]: {},
      [HARMONY_SHARD_0]: {
        '0xcf664087a5bb0237a0bad6742852ec6c8d69a27a': {
          value: 'Wrapped One',
          type,
          metadata: {
            symbol: 'WONE',
          },
        },
      },
    };

    return labels;
  }
}

export default Source;
