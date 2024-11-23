import type { ChainId } from '@/utils/chains.js';

import { Source } from '../base.js';
import type { Label, LabelMap } from '../base.js';

import AaveV2Source from './aave/v2.js';
import AaveV3Source from './aave/v3.js';
import AerodromeV1Source from './aerodrome/v1.js';
import AlchemySource from './alchemy/index.js';
import AlchemyInfraSource from './alchemy/infra.js';
import BiconomyInfraSource from './biconomy/infra.js';
import BiconomyV2Source from './biconomy/v2.js';
import BloctoSource from './blocto/index.js';
import CandideSource from './candide/index.js';
import CircleSource from './circle/index.js';
import CoinbaseInfra from './coinbase/infra.js';
import CoinbaseSmartWalletV1 from './coinbase/smart-wallet-v1.js';
import DaimoV1Source from './daimo/v1.js';
import EasSource from './eas/index.js';
import Erc20Source from './erc20/index.js';
import EtherspotSource from './etherspot/index.js';
import EtherspotModularV1Source from './etherspot/modular-v1.js';
import FarcasterSource from './farcaster/index.js';
import FunV1Source from './fun/v1.js';
import KlasterSource from './klaster/index.js';
import LidoSource from './lido/index.js';
import LightV0_1Source from './light/v0.1.js';
import LightV0_2Source from './light/v0.2.js';
import MorphoSource from './morpho/index.js';
import NaniSource from './nani/index.js';
import OpenfortSource from './openfort/index.js';
import OpenseaCollectionSource from './opensea/collections.js';
import OpenseaSeaportSource from './opensea/seaport.js';
import ParifiV1Source from './parifi/v1.js';
import ParticleSource from './particle/index.js';
import PatchWalletV1Source from './patch-wallet/v1.js';
import PimlicoSource from './pimlico/index.js';
import RhinestoneV1ModuleSource from './rhinestone/v1-modules.js';
import RhinestoneV1Source from './rhinestone/v1.js';
import SafeCoreSource from './safe/core.js';
import SafeV1_3_0Source from './safe/v1.3.0.js';
import SafeV1_4_1Source from './safe/v1.4.1.js';
import StackupSource from './stackup/index.js';
import StaticSource from './static.js';
import ThirdwebSource from './thirdweb/index.js';
import UnionV1Source from './union/v1.js';
import UniPassSource from './unipass/index.js';
import UniswapV2Source from './uniswap/v2.js';
import UniswapV3Source from './uniswap/v3.js';
import ZeroDevInfraSource from './zerodev/infra.js';
import ZeroDevKernelV1Source from './zerodev/kernel-v1.js';
import ZeroDevKernelV2Source from './zerodev/kernel-v2.js';
import ZeroDevKernelV3ModuleSource from './zerodev/kernel-v3-modules.js';
import ZeroDevKernelV3Source from './zerodev/kernel-v3.js';
import ZoraSource from './zora/index.js';

const SOURCES: Source[] = [
  // Default
  new StaticSource(),
  // ERC20
  new Erc20Source(),
  // Messaging
  new UnionV1Source(),
  // DeFi
  new AaveV2Source(),
  new AaveV3Source(),
  new MorphoSource(),
  new ParifiV1Source(),
  new UniswapV2Source(),
  new UniswapV3Source(),
  new AerodromeV1Source(),
  new LidoSource(),
  // NFT
  new OpenseaSeaportSource(),
  new OpenseaCollectionSource(),
  new ZoraSource(),
  // Social
  new EasSource(),
  new FarcasterSource(),
  // Account Abstraction
  new AlchemySource(),
  new AlchemyInfraSource(),
  new BiconomyInfraSource(),
  new BiconomyV2Source(),
  new BloctoSource(),
  new CandideSource(),
  new CircleSource(),
  new CoinbaseSmartWalletV1(),
  new CoinbaseInfra(),
  new DaimoV1Source(),
  new EtherspotSource(),
  new EtherspotModularV1Source(),
  new FunV1Source(),
  new KlasterSource(),
  new LightV0_1Source(),
  new LightV0_2Source(),
  new NaniSource(),
  new OpenfortSource(),
  new ParticleSource(),
  new PatchWalletV1Source(),
  new PimlicoSource(),
  new RhinestoneV1ModuleSource(),
  new RhinestoneV1Source(),
  new SafeCoreSource(),
  new SafeV1_3_0Source(),
  new SafeV1_4_1Source(),
  new StackupSource(),
  new ThirdwebSource(),
  new UniPassSource(),
  new ZeroDevInfraSource(),
  new ZeroDevKernelV1Source(),
  new ZeroDevKernelV2Source(),
  new ZeroDevKernelV3ModuleSource(),
  new ZeroDevKernelV3Source(),
];

export { SOURCES };
export type { ChainId, Label, LabelMap };
