import ky from 'ky';
import { Address } from 'viem';

import type { ChainId } from '@/utils/chains.js';
import { getErc20Metadata, isErc20Ignored } from '@/utils/fetching.js';

import { Asset } from '.';

interface TokenList {
  name: string;
  tokens: Token[];
}

interface Token {
  chainId: number;
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
}

interface Metadata {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

interface MetadataWithCount extends Metadata {
  count: number;
}

const listUrls: string[] = [
  'https://tokens.1inch.eth.link',
  'https://tokens.coingecko.com/uniswap/all.json',
  'https://tokens.coingecko.com/polygon-pos/all.json',
  'https://api.coinmarketcap.com/data-api/v3/uniswap/all.json',
  'https://static.optimism.io/optimism.tokenlist.json',
  'https://bridge.arbitrum.io/token-list-42161.json',
  'https://gateway.ipfs.io/ipns/tokens.uniswap.org',
  'https://raw.githubusercontent.com/balancer/assets/master/generated/listed.tokenlist.json',
  'https://raw.githubusercontent.com/balancer/assets/refactor-for-multichain/generated/arbitrum.listed.tokenlist.json',
  'https://raw.githubusercontent.com/balancer/assets/refactor-for-multichain/generated/optimism.listed.json',
  'https://raw.githubusercontent.com/balancer/assets/refactor-for-multichain/generated/polygon.listed.tokenlist.json',
  'https://unpkg.com/quickswap-default-token-list@latest/build/quickswap-default.tokenlist.json',
  'https://unpkg.com/@ubeswap/default-token-list@latest/ubeswap.token-list.json',
  'https://api-polygon-tokens.polygon.technology/tokenlists/polygon.tokenlist.json',
];

async function fetch(chain: ChainId): Promise<Asset[]> {
  const lists: TokenList[] = [];
  for (const listUrl of listUrls) {
    const list = await getList(listUrl);
    if (!list) {
      continue;
    }
    lists.push(list);
  }
  const assets: Record<Address, MetadataWithCount> = {};
  for (const list of lists) {
    const tokens = (list.tokens || []).filter(
      (token) => token.chainId === chain,
    );
    for (const token of tokens) {
      if (isErc20Ignored(chain, token.address)) {
        continue;
      }
      const address = token.address.toLowerCase() as Address;
      if (!assets[address]) {
        assets[address] = {
          count: 0,
          address,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
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
  const labelAssets = chainTokenlistAssets
    .map((asset) => {
      const { address, name, symbol, decimals } = asset;
      return {
        address: address as Address,
        name: chainMetadata[address]?.name || name,
        symbol: chainMetadata[address]?.symbol || symbol,
        decimals: chainMetadata[address]?.decimals || decimals,
      };
    })
    .filter((asset) => isErc20Ignored(chain, asset.address));
  return labelAssets;
}

async function getList(url: string): Promise<TokenList | null> {
  const response = await ky.get(url, {
    retry: {
      limit: 15,
    },
    timeout: false,
  });
  return response.json<TokenList>();
}

export default fetch;
