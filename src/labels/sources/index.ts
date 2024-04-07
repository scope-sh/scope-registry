import type { ChainId } from '@/utils/chains.js';

import { Source } from '../base.js';
import type { Label, LabelType, LabelMap } from '../base.js';
import { initLabelMap } from '../utils.js';

import AaveV2TokenSource from './aave/v2-tokens.js';
import AaveV2Source from './aave/v2.js';
import AaveV3TokenSource from './aave/v3-tokens.js';
import AaveV3Source from './aave/v3.js';
import BiconomyV2AccountSource from './biconomy/v2-accounts.js';
import BiconomyV2Source from './biconomy/v2.js';
import EasSource from './eas/index.js';
import EnsSource from './ens/index.js';
import FarcasterSource from './farcaster/index.js';
import KernelV2AccountSource from './kernel/v2-accounts.js';
import KernelV2Source from './kernel/v2.js';
import SafeV1_3_0AccountSource from './safe/v1.3.0-accounts.js';
import SafeV1_3_0Source from './safe/v1.3.0.js';
import SafeV1_4_1AccountSource from './safe/v1.4.1-accounts.js';
import SafeV1_4_1Source from './safe/v1.4.1.js';
import TokenlistSource from './tokenlists.js';
import UniswapV2PoolSource from './uniswap/v2-pools.js';
import UniswapV2Source from './uniswap/v2.js';
import UniswapV3PoolSource from './uniswap/v3-pools.js';
import UniswapV3Source from './uniswap/v3.js';
import WrappedSource from './wrapped.js';

async function fetch(): Promise<LabelMap> {
  const allLabels = initLabelMap();
  for (const source of sources) {
    console.log(`Fetching from the "${source.getName()}" source…`);
    const sourceLabels = await source.fetch(allLabels);
    for (const chain in sourceLabels) {
      const chainId = parseInt(chain) as ChainId;
      if (!allLabels[chainId]) {
        continue;
      }
      const chainLabels = sourceLabels[chainId];
      for (const address in chainLabels) {
        const sourceLabel = sourceLabels[chainId][address];
        if (!sourceLabel) {
          continue;
        }
        allLabels[chainId][address] = sourceLabel;
      }
    }
  }
  return allLabels;
}

const sources: Source[] = [
  new TokenlistSource(),
  new WrappedSource(),
  new AaveV2TokenSource(),
  new AaveV2Source(),
  new AaveV3TokenSource(),
  new AaveV3Source(),
  new UniswapV2Source(),
  new UniswapV2PoolSource(),
  new UniswapV3Source(),
  new UniswapV3PoolSource(),
  new FarcasterSource(),
  new EnsSource(),
  new EasSource(),
  new BiconomyV2AccountSource(),
  new BiconomyV2Source(),
  new KernelV2AccountSource(),
  new KernelV2Source(),
  new SafeV1_3_0AccountSource(),
  new SafeV1_3_0Source(),
  new SafeV1_4_1AccountSource(),
  new SafeV1_4_1Source(),
];

export { fetch };
export type { ChainId, Label, LabelType, LabelMap };
