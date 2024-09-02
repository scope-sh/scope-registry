import { Address } from 'viem';

import type { ChainId } from '@/utils/chains.js';
import { getErc20Metadata, isErc20Ignored } from '@/utils/fetching.js';

import tokenMap from './defillama.json';

import { Asset } from './index.js';

interface TokenMapValue {
  address: Address;
  name: string;
  symbol: string;
  logoURI: string;
  logoURI2: string | null;
  decimals: number;
}

type TokenMap = Partial<Record<ChainId, TokenMapValue[]>>;

async function fetch(chain: ChainId): Promise<Asset[]> {
  const chainTokenList = (tokenMap as TokenMap)[chain];
  if (!chainTokenList) {
    return [];
  }
  const chainAssetAddresses = chainTokenList.map((token) => token.address);
  const chainMetadata = await getErc20Metadata(chain, chainAssetAddresses);
  const labelAssets = chainTokenList
    .map((asset) => {
      const { address, name, symbol, decimals } = asset;
      return {
        address,
        name: chainMetadata[address]?.name || name,
        symbol: chainMetadata[address]?.symbol || symbol,
        decimals: chainMetadata[address]?.decimals || decimals,
      };
    })
    .filter((asset) => isErc20Ignored(chain, asset.address));
  return labelAssets;
}

export default fetch;
