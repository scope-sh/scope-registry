import { Address } from 'viem';

import type { ChainId } from '@/utils/chains.js';
import { getErc20Metadata } from '@/utils/fetching.js';

import { Source as BaseSource } from '../../base.js';
import type {
  ChainLabelMap,
  ChainSingleLabelMap,
  Label,
  SourceInfo,
} from '../../base.js';

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
  getInfo(): SourceInfo {
    return {
      name: 'DefiLlama Tokens',
      id: 'defillama-tokens',
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
      const value = tokenValues.has(asset.symbol) ? asset.name : asset.symbol;
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
}

export default Source;
