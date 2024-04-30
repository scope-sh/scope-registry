import type { ChainId } from '@/utils/chains.js';

import { Source } from '../base.js';
import type { Label, LabelType, LabelMap } from '../base.js';
import { initLabelMap } from '../utils.js';

import AaveV2TokenSource from './aave/v2-tokens.js';
import AaveV2Source from './aave/v2.js';
import AaveV3TokenSource from './aave/v3-tokens.js';
import AaveV3Source from './aave/v3.js';
import AlchemySource from './alchemy/index.js';
import BiconomyInfraSource from './biconomy/infra.js';
import BiconomyV2AccountSource from './biconomy/v2-accounts.js';
import BiconomyV2Source from './biconomy/v2.js';
import BloctoSource from './blocto/index.js';
import CandideSource from './candide/index.js';
import CircleSource from './circle/index.js';
import EasSource from './eas/index.js';
import EnsSource from './ens/index.js';
import EtherspotSource from './etherspot/index.js';
import FarcasterSource from './farcaster/index.js';
import FunV1AccountSource from './fun/v1-accounts.js';
import FunV1Source from './fun/v1.js';
import NaniSource from './nani/index.js';
import OverwriteSource from './overwrite.js';
import ParifiV1Source from './parifi/v1.js';
import ParticleSource from './particle/index.js';
import PimlicoSource from './pimlico/index.js';
import RhinestoneV1ModuleSource from './rhinestone/v1-modules.js';
import RhinestoneV1RegistrySource from './rhinestone/v1-registry.js';
import RhinestoneV1Source from './rhinestone/v1.js';
import SafeCoreSource from './safe/core.js';
import SafeV1_3_0Source from './safe/v1.3.0.js';
import SafeV1_4_1AccountSource from './safe/v1.4.1-accounts.js';
import SafeV1_4_1Source from './safe/v1.4.1.js';
import StackupSource from './stackup/index.js';
import StaticSource from './static.js';
import TokenlistSource from './tokenlists.js';
import TrustwalletSource from './trustwallet.js';
import UniPassSource from './unipass/index.js';
import UniswapV2PoolSource from './uniswap/v2-pools.js';
import UniswapV2Source from './uniswap/v2.js';
import UniswapV3PoolSource from './uniswap/v3-pools.js';
import UniswapV3Source from './uniswap/v3.js';
import WrappedSource from './wrapped.js';
import ZeroDevInfraSource from './zerodev/infra.js';
import ZeroDevKernelV2AccountSource from './zerodev/kernel-v2-accounts.js';
import ZeroDevKernelV2Source from './zerodev/kernel-v2.js';
import ZeroDevKernelV3AccountSource from './zerodev/kernel-v3-accounts.js';
import ZeroDevKernelV3ModuleSource from './zerodev/kernel-v3-modules.js';
import ZeroDevKernelV3Source from './zerodev/kernel-v3.js';

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
  new TrustwalletSource(),
  new StaticSource(),
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
  new ParifiV1Source(),
  new FarcasterSource(),
  new EnsSource(),
  new EasSource(),
  new BiconomyV2AccountSource(),
  new BiconomyV2Source(),
  new SafeV1_3_0Source(),
  new SafeV1_4_1AccountSource(),
  new SafeV1_4_1Source(),
  new SafeCoreSource(),
  new RhinestoneV1RegistrySource(),
  new RhinestoneV1ModuleSource(),
  new RhinestoneV1Source(),
  new AlchemySource(),
  new BiconomyInfraSource(),
  new BloctoSource(),
  new CandideSource(),
  new CircleSource(),
  new EtherspotSource(),
  new FunV1Source(),
  new FunV1AccountSource(),
  new NaniSource(),
  new ParticleSource(),
  new PimlicoSource(),
  new StackupSource(),
  new UniPassSource(),
  new ZeroDevInfraSource(),
  new ZeroDevKernelV2AccountSource(),
  new ZeroDevKernelV2Source(),
  new ZeroDevKernelV3AccountSource(),
  new ZeroDevKernelV3ModuleSource(),
  new ZeroDevKernelV3Source(),
  new OverwriteSource(),
];

export { fetch };
export type { ChainId, Label, LabelType, LabelMap };
