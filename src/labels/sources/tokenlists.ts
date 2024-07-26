import ky from 'ky';
import { Address } from 'viem';

import type { ChainId } from '@/utils/chains.js';
import { getErc20Metadata } from '@/utils/fetching.js';

import { Source as BaseSource } from '../base.js';
import type {
  ChainLabelMap,
  ChainSingleLabelMap,
  Label,
  SourceInfo,
} from '../base.js';

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
  getInfo(): SourceInfo {
    return {
      name: 'Tokenlists',
      id: 'tokenlists',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'full',
    };
  }

  async fetch(
    chain: ChainId,
    previousLabels: ChainLabelMap,
  ): Promise<ChainSingleLabelMap> {
    const labels = {} as ChainSingleLabelMap;
    const lists: TokenList[] = [];
    for (const listUrl of listUrls) {
      const list = await this.#getList(listUrl);
      if (!list) {
        continue;
      }
      lists.push(list);
    }
    const assets: Record<Address, MetadataWithCount> = {};
    for (const list of lists) {
      const tokens = list.tokens.filter((token) => token.chainId === chain);
      for (const token of tokens) {
        const address = token.address.toLowerCase() as Address;
        if (!assets[address]) {
          assets[address] = {
            count: 0,
            address,
            name: token.name,
            symbol: token.symbol,
          };
        }
        const asset = assets[address];
        if (!asset) {
          continue;
        }
        asset.count++;
      }
    }
    const chainTokenlistAssets = Object.values(assets);
    chainTokenlistAssets.sort((a, b) =>
      a.count === b.count ? a.name.localeCompare(b.name) : b.count - a.count,
    );
    const chainTokenlistAssetAddresses = chainTokenlistAssets.map(
      (asset) => asset.address,
    );
    const chainMetadata = await getErc20Metadata(
      chain,
      chainTokenlistAssetAddresses,
    );
    const labelAssets = chainTokenlistAssets.map((asset) => {
      const { address, name, symbol } = asset;
      return {
        address,
        name: chainMetadata[address]?.name || name,
        symbol: chainMetadata[address]?.symbol || symbol,
      };
    });
    const tokenValues = new Set<string>();
    for (const addressLabels of Object.values(previousLabels)) {
      const erc20Labels = addressLabels.filter(
        (label) => label.type === 'erc20',
      );
      for (const label of erc20Labels) {
        tokenValues.add(label.value);
      }
    }
    for (const asset of labelAssets) {
      // Prevent using token symbol as a label value for multiple tokens
      const value = !tokenValues.has(asset.symbol)
        ? asset.symbol
        : !tokenValues.has(asset.name)
          ? asset.name
          : null;
      if (!value) {
        continue;
      }
      tokenValues.add(value);
      const label: Label = {
        value,
        sourceId: this.getInfo().id,
        indexed: true,
        type: 'erc20',
        metadata: {
          symbol: asset.symbol,
        },
      };
      labels[asset.address.toLowerCase() as Address] = label;
    }
    return labels;
  }

  async #getList(url: string): Promise<TokenList | null> {
    const response = await ky.get(url, {
      retry: {
        limit: 15,
      },
      timeout: false,
    });
    return response.json<TokenList>();
  }
}

export default Source;
