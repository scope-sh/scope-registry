import ky from 'ky';
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
  HARMONY_SHARD_0,
  BLAST,
  BLAST_SEPOLIA,
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
    const { name, symbol } = addressMetadata;
    if (!name || !symbol) {
      continue;
    }
    const asset: Asset = {
      address,
      name,
      symbol,
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
      case OPTIMISM:
        return 'optimism';
      case BNB:
        return 'binance';
      case BNB_TESTNET:
        return null;
      case GNOSIS_CHAIN:
        return 'xdai';
      case POLYGON:
        return 'polygon';
      case FANTOM:
        return 'fantom';
      case ZKSYNC:
        return 'zksync';
      case KLAYTN_BAOBAB:
        return null;
      case METIS:
        return 'metis';
      case POLYGON_ZKEVM:
        return 'polygonzkevm';
      case MOONBEAM:
        return 'moonbeam';
      case MOONRIVER:
        return 'moonriver';
      case FANTOM_TESTNET:
        return null;
      case CANTO:
        return null;
      case KLAYTN:
        return 'klaytn';
      case BASE:
        return 'base';
      case GNOSIS_CHIADO:
        return null;
      case ARBITRUM:
        return 'arbitrum';
      case ARBITRUM_NOVA:
        return null;
      case CELO:
        return 'celo';
      case AVALANCHE_FUJI:
        return 'avalanchecfuji';
      case AVALANCHE:
        return 'avalanchec';
      case LINEA_SEPOLIA:
        return null;
      case LINEA:
        return 'linea';
      case POLYGON_AMOY:
        return null;
      case BASE_SEPOLIA:
        return null;
      case ARBITRUM_SEPOLIA:
        return null;
      case SCROLL_SEPOLIA:
        return null;
      case SCROLL:
        return 'scroll';
      case ZORA:
        return null;
      case SEPOLIA:
        return 'sepolia';
      case OPTIMISM_SEPOLIA:
        return null;
      case ZORA_SEPOLIA:
        return null;
      case AURORA:
        return 'aurora';
      case BLAST:
        return 'blast';
      case BLAST_SEPOLIA:
        return null;
      case HARMONY_SHARD_0:
        return 'harmony';
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
