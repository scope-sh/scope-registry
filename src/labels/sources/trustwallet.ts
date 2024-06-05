import axios from 'axios';
import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { Label, SingleLabelMap } from '@/labels/base.js';
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
  CHAINS,
  BLAST,
  BLAST_SEPOLIA,
} from '@/utils/chains.js';
import type { ChainId } from '@/utils/chains.js';
import { getErc20Metadata } from '@/utils/fetching.js';

import { getLabelTypeById, initSingleLabelMap } from '../utils.js';

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

const githubClient = axios.create({
  baseURL: 'https://api.github.com/repos/trustwallet/assets/git/trees/',
  headers: {
    Authorization: `Bearer ${githubToken}`,
  },
});

class Source extends BaseSource {
  getName(): string {
    return 'Trustwallet';
  }

  async fetch(): Promise<SingleLabelMap> {
    const labels = initSingleLabelMap();
    for (const chainId of CHAINS) {
      const assets = await this.#getAssets(chainId);
      const chainMetadata = await getErc20Metadata(chainId, assets);
      for (const addressString in chainMetadata) {
        const address = addressString as Address;
        const addressMetadata = chainMetadata[address];
        if (!addressMetadata) {
          continue;
        }
        const { name, symbol } = addressMetadata;
        if (!name || !symbol) {
          continue;
        }
        const label: Label = {
          value: name,
          type: getLabelTypeById('erc20'),
          metadata: {
            symbol,
          },
        };
        labels[chainId][address] = label;
      }
    }
    return labels;
  }

  async #getAssets(chainId: ChainId): Promise<string[]> {
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

    const rootDir = await githubClient.get<TreeResponse>('master');
    const blockchainsSha = rootDir.data.tree.find(
      (item) => item.path === 'blockchains',
    )?.sha;
    if (!blockchainsSha) {
      return [];
    }
    const blockchainsDir = await githubClient.get<TreeResponse>(blockchainsSha);
    const chainName = getChainName(chainId);
    if (!chainName) {
      return [];
    }
    const chainSha = blockchainsDir.data.tree.find(
      (item) => item.path === chainName,
    )?.sha;
    if (!chainSha) {
      return [];
    }
    const chainDir = await githubClient.get<TreeResponse>(chainSha);
    const assetsSha = chainDir.data.tree.find(
      (item) => item.path === 'assets',
    )?.sha;
    if (!assetsSha) {
      return [];
    }
    const assetsDir = await githubClient.get<TreeResponse>(assetsSha);
    return assetsDir.data.tree.map((item) => item.path.toLowerCase());
  }
}

export default Source;
