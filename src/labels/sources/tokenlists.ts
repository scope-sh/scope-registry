import axios from 'axios';
import { Address } from 'viem';

import {
  CHAINS,
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
import { getErc20Metadata } from '@/utils/fetching.js';

import { Source as BaseSource } from '../base.js';
import type { Label, SingleLabelMap } from '../base.js';
import { getLabelTypeById, initSingleLabelMap } from '../utils.js';

interface TokenList {
  name: string;
  tokens: Token[];
}

interface Token {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

interface Metadata {
  address: string;
  name: string;
  symbol: string;
}

interface MetadataWithCount extends Metadata {
  count: number;
}

const listUrls: string[] = [
  'https://tokens.coingecko.com/uniswap/all.json',
  'https://tokens.coingecko.com/polygon-pos/all.json',
  'https://api.coinmarketcap.com/data-api/v3/uniswap/all.json',
  'https://static.optimism.io/optimism.tokenlist.json',
  'https://bridge.arbitrum.io/token-list-42161.json',
  'https://gateway.ipfs.io/ipns/tokens.uniswap.org',
  'https://token-list.sushi.com',
  'https://raw.githubusercontent.com/balancer/assets/master/generated/listed.tokenlist.json',
  'https://raw.githubusercontent.com/balancer/assets/refactor-for-multichain/generated/arbitrum.listed.tokenlist.json',
  'https://raw.githubusercontent.com/balancer/assets/refactor-for-multichain/generated/optimism.listed.json',
  'https://raw.githubusercontent.com/balancer/assets/refactor-for-multichain/generated/polygon.listed.tokenlist.json',
  'https://unpkg.com/quickswap-default-token-list/build/quickswap-default.tokenlist.json',
];

class Source extends BaseSource {
  getName(): string {
    return 'Tokenlists';
  }

  async fetch(): Promise<SingleLabelMap> {
    const labels = initSingleLabelMap();
    const lists: TokenList[] = [];
    for (const listUrl of listUrls) {
      const list = await this.#getList(listUrl);
      if (!list) {
        continue;
      }
      lists.push(list);
    }
    const assets: Record<ChainId, Record<string, MetadataWithCount>> = {
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
    for (const chainId of CHAINS) {
      const chainAssets = assets[chainId];
      if (!chainAssets) {
        continue;
      }
      for (const list of lists) {
        const tokens = list.tokens.filter((token) => token.chainId === chainId);
        for (const token of tokens) {
          const address = token.address.toLowerCase();
          if (!chainAssets[address]) {
            chainAssets[address] = {
              count: 0,
              address,
              name: token.name,
              symbol: token.symbol,
            };
          }
          const asset = chainAssets[address];
          if (!asset) {
            continue;
          }
          asset.count++;
        }
      }
      const chainTokenlistAssets = Object.values(chainAssets);
      chainTokenlistAssets.sort((a, b) =>
        a.count === b.count ? a.name.localeCompare(b.name) : b.count - a.count,
      );
      const chainTokenlistAssetAddresses = chainTokenlistAssets.map(
        (asset) => asset.address,
      );
      const chainMetadata = await getErc20Metadata(
        chainId,
        chainTokenlistAssetAddresses,
      );
      const chainLabelAssets = chainTokenlistAssets.map((asset) => {
        const { address, name, symbol } = asset;
        return {
          address,
          name: chainMetadata[address]?.name || name,
          symbol: chainMetadata[address]?.symbol || symbol,
        };
      });
      for (const asset of chainLabelAssets) {
        const label: Label = {
          value: asset.name,
          type: getLabelTypeById('erc20'),
          metadata: {
            symbol: asset.symbol,
          },
        };
        labels[chainId][asset.address.toLowerCase() as Address] = label;
      }
    }
    return labels;
  }

  async #getList(url: string): Promise<TokenList | null> {
    let tries = 0;
    for (;;) {
      const delay = 1000 * 2 ** tries;
      if (tries > 10) {
        return null;
      }
      await sleep(delay);
      tries++;
      try {
        const listResponse = await axios.get(url);
        if (listResponse.status !== 200) {
          continue;
        }
        return listResponse.data as TokenList;
      } catch (e) {
        continue;
      }
    }
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms, null));
}

export default Source;
