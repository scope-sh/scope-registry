import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';

import fetchDefillama from './defillama.js';
import fetchTokenlists from './tokenlists.js';
import fetchTokens from './tokens.js';
import fetchTrustwallet from './trustwallet.js';
import fetchWrapped from './wrapped.js';

interface Asset {
  address: Address;
  symbol?: string;
  name?: string;
  decimals?: number;
}

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'ERC20',
      id: 'erc20',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const fetchFns = [
      fetchWrapped,
      fetchTokens,
      fetchTokenlists,
      fetchTrustwallet,
      fetchDefillama,
    ];
    const labels: ChainSingleLabelMap = {};
    const tokenValues = new Set<string>();
    for (const fetchFn of fetchFns) {
      const assets = await fetchFn(chain);
      for (const asset of assets) {
        const { address, symbol, name, decimals } = asset;
        // Prevent overwriting existing labels
        if (labels[address]) {
          continue;
        }
        // Prevent using token symbol as a label value for multiple tokens
        const value =
          symbol && !tokenValues.has(symbol)
            ? symbol
            : name && !tokenValues.has(name)
              ? name
              : null;
        if (!value) {
          continue;
        }
        tokenValues.add(value);
        labels[address] = {
          value,
          indexed: true,
          sourceId: this.getInfo().id,
          type: 'erc20',
          metadata: {
            // Only set metadata if it was used as a label value
            symbol: value === symbol ? symbol : undefined,
            decimals,
          },
        };
      }
    }

    return labels;
  }
}

export default Source;
export type { Asset };
