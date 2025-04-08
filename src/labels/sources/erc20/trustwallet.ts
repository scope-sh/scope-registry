import ky from 'ky';
import { Address } from 'viem';

import {
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
  MONAD_TESTNET,
} from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getErc20Metadata, isErc20Ignored } from '@/utils/fetching.js';

import { Asset } from '.';

const githubToken = process.env.GITHUB_TOKEN as string;

interface TreeResponse {
  sha: string;
  url: string;
  tree: Tree[];
}

interface Tree {
  path: string;
  sha: string;
}

const githubClient = ky.create({
  prefixUrl: 'https://api.github.com/repos/trustwallet/assets/git/trees/',
  headers: {
    Authorization: `Bearer ${githubToken}`,
  },
  timeout: false,
  retry: {
    limit: 10,
  },
});

async function fetch(chain: ChainId): Promise<Asset[]> {
  const assetList: Asset[] = [];
  const assets = await getAssets(chain);
  const chainMetadata = await getErc20Metadata(chain, assets);
  for (const addressString in chainMetadata) {
    const address = addressString as Address;
    if (isErc20Ignored(chain, address)) {
      continue;
    }
    const addressMetadata = chainMetadata[address];
    if (!addressMetadata) {
      continue;
    }
    const { name, symbol, decimals } = addressMetadata;
    if (!name || !symbol) {
      continue;
    }
    const asset: Asset = {
      address,
      name,
      symbol,
      decimals: decimals || undefined,
    };
    assetList.push(asset);
  }
  return assetList;
}

async function getAssets(chainId: ChainId): Promise<string[]> {
  function getChainName(chainId: ChainId): string | null {
    switch (chainId) {
      case ETHEREUM:
        return 'ethereum';
      case SEPOLIA:
        return null;
      case OPTIMISM:
        return 'optimism';
      case OPTIMISM_SEPOLIA:
        return null;
      case BASE:
        return 'base';
      case BASE_SEPOLIA:
        return null;
      case ARBITRUM:
        return 'arbitrum';
      case ARBITRUM_SEPOLIA:
        return null;
      case POLYGON:
        return 'polygon';
      case POLYGON_AMOY:
        return null;
      case MODE:
        return null;
      case LINEA:
        return 'linea';
      case ARBITRUM_NOVA:
        return null;
      case CELO:
        return 'celo';
      case AVALANCHE:
        return 'avalanchec';
      case AVALANCHE_FUJI:
        return 'avalanchecfuji';
      case GNOSIS:
        return 'xdai';
      case BSC:
        return 'binance';
      case MONAD_TESTNET:
        return null;
    }
  }

  const rootDir = await githubClient.get('master').json<TreeResponse>();
  const blockchainsSha = rootDir.tree.find(
    (item) => item.path === 'blockchains',
  )?.sha;
  if (!blockchainsSha) {
    return [];
  }
  const blockchainsDirResponse = await githubClient.get(blockchainsSha);
  const blockchainsDir = await blockchainsDirResponse.json<TreeResponse>();
  const chainName = getChainName(chainId);
  if (!chainName) {
    return [];
  }
  const chainSha = blockchainsDir.tree.find(
    (item) => item.path === chainName,
  )?.sha;
  if (!chainSha) {
    return [];
  }
  const chainDirResponse = await githubClient.get(chainSha);
  const chainDir = await chainDirResponse.json<TreeResponse>();
  const assetsSha = chainDir.tree.find((item) => item.path === 'assets')?.sha;
  if (!assetsSha) {
    return [];
  }
  const assetsDirResponse = await githubClient.get(assetsSha);
  const assetsDir = await assetsDirResponse.json<TreeResponse>();
  return assetsDir.tree.map((item) => item.path.toLowerCase());
}

export default fetch;
