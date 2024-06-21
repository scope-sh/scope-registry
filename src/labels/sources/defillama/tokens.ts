import { Address } from 'viem';

import type { ChainId } from '@/utils/chains.js';
import { getErc20Metadata } from '@/utils/fetching.js';

import { Source as BaseSource } from '../../base.js';
import type { ChainSingleLabelMap, Label } from '../../base.js';
import { getLabelTypeById } from '../../utils.js';

import tokenMap from './tokens.json';

interface TokenMapValue {
  address: Address;
  name: string;
  symbol: string;
  logoURI: string;
  logoURI2: string | null;
}

type TokenMap = Partial<Record<ChainId, TokenMapValue[]>>;

// Source: DefiLlama Swap page
class Source extends BaseSource {
  getName(): string {
    return 'DefiLlama tokens';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels = {} as ChainSingleLabelMap;
    const chainTokenList = (tokenMap as TokenMap)[chain];
    if (!chainTokenList) {
      return labels;
    }
    const chainAssetAddresses = chainTokenList.map((token) => token.address);
    const chainMetadata = await getErc20Metadata(chain, chainAssetAddresses);
    const labelAssets = chainTokenList.map((asset) => {
      const { address, name, symbol } = asset;
      return {
        address,
        name: chainMetadata[address]?.name || name,
        symbol: chainMetadata[address]?.symbol || symbol,
      };
    });
    for (const asset of labelAssets) {
      const label: Label = {
        value: asset.name,
        type: getLabelTypeById('erc20'),
        metadata: {
          symbol: asset.symbol,
        },
      };
      labels[asset.address.toLowerCase() as Address] = label;
    }
    return labels;
  }
}

export default Source;
