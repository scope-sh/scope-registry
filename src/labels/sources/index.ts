import { Address } from 'viem';

import type { ChainId } from '@/utils/chains.js';
import {
  getMetadata,
  validate as validateSources,
  isTimeToFetch as isTimeToFetchSource,
  updateFetchTimestamp as updateSourceFetchTimestamp,
} from '@/utils/source.js';

import { Source } from '../base.js';
import type { Label, LabelMap, ChainLabelMap } from '../base.js';

import AaveV2TokenSource from './aave/v2-tokens.js';
import AaveV2Source from './aave/v2.js';
import AaveV3TokenSource from './aave/v3-tokens.js';
import AaveV3Source from './aave/v3.js';
import AerodromeSource from './aerodrome/index.js';
import AerodromePoolSource from './aerodrome/pools.js';
import AlchemyAccountSource from './alchemy/accounts.js';
import AlchemyInfraSource from './alchemy/infra.js';
import BiconomyInfraSource from './biconomy/infra.js';
import BiconomyV2AccountSource from './biconomy/v2-accounts.js';
import BiconomyV2Source from './biconomy/v2.js';
import BloctoSource from './blocto/index.js';
import CandideSource from './candide/index.js';
import CircleSource from './circle/index.js';
import CoinbaseSmartWalletV1Accounts from './coinbase/smart-wallet-v1-accounts.js';
import CoinbaseSmartWalletV1 from './coinbase/smart-wallet-v1.js';
import DaimoV1AccountSource from './daimo/v1-accounts.js';
import DaimoV1Source from './daimo/v1.js';
import DefillamaTokensSource from './defillama/tokens.js';
import EasSource from './eas/index.js';
import EnsSource from './ens/index.js';
import EnsNamesSource from './ens/names.js';
import EntryPointV0_6_0Source from './entry-point/v0.6.0-accounts.js';
import EntryPointV0_7_0Source from './entry-point/v0.7.0-accounts.js';
import EtherspotSource from './etherspot/index.js';
import FarcasterSource from './farcaster/index.js';
import FunV1AccountSource from './fun/v1-accounts.js';
import FunV1Source from './fun/v1.js';
import KlasterSource from './klaster/index.js';
import LightV0_1AccountSource from './light/v0.1-accounts.js';
import LightV0_1Source from './light/v0.1.js';
import LightV0_2AccountSource from './light/v0.2-accounts.js';
import LightV0_2Source from './light/v0.2.js';
import MorphoSource from './morpho/index.js';
import MorphoVaultSource from './morpho/vaults.js';
import NaniSource from './nani/index.js';
import NaniV0AccountSource from './nani/v0-accounts.js';
import NaniV1AccountSource from './nani/v1-accounts.js';
import OpenfortSource from './openfort/index.js';
import OpenseaCollectionSource from './opensea/collections.js';
import OpenseaSeaportSource from './opensea/seaport.js';
import ParifiV1Source from './parifi/v1.js';
import ParticleSource from './particle/index.js';
import PatchWalletV1AccountSource from './patch-wallet/v1-accounts.js';
import PatchWalletV1Source from './patch-wallet/v1.js';
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
import ThirdwebAccountSource from './thirdweb/accounts.js';
import ThirdwebSource from './thirdweb/index.js';
import TokenlistSource from './tokenlists.js';
import TokensSource from './tokens.js';
import TrustwalletSource from './trustwallet.js';
import UniPassSource from './unipass/index.js';
import UniswapV2PoolSource from './uniswap/v2-pools.js';
import UniswapV2Source from './uniswap/v2.js';
import UniswapV3PoolSource from './uniswap/v3-pools.js';
import UniswapV3Source from './uniswap/v3.js';
import WrappedSource from './wrapped.js';
import ZeroDevInfraSource from './zerodev/infra.js';
import ZeroDevKernelV1AccountSource from './zerodev/kernel-v1-accounts.js';
import ZeroDevKernelV1Source from './zerodev/kernel-v1.js';
import ZeroDevKernelV2AccountSource from './zerodev/kernel-v2-accounts.js';
import ZeroDevKernelV2Source from './zerodev/kernel-v2.js';
import ZeroDevKernelV3AccountSource from './zerodev/kernel-v3-accounts.js';
import ZeroDevKernelV3ModuleSource from './zerodev/kernel-v3-modules.js';
import ZeroDevKernelV3Source from './zerodev/kernel-v3.js';

async function fetch(chain: ChainId): Promise<ChainLabelMap> {
  const labels: ChainLabelMap = {};
  const isValid = validateSources(sources);
  if (!isValid) {
    throw new Error('Invalid sources');
  }
  for (const source of sources) {
    const info = source.getInfo();
    const metadata = await getMetadata(chain, info);
    const isTimeToFetch = isTimeToFetchSource(
      metadata,
      info.interval,
      Date.now(),
    );
    if (!isTimeToFetch) {
      continue;
    }
    console.info(`Fetching from the "${info.name}" source…`);
    const sourceLabels = await source.fetch(chain, labels);
    for (const addressString in sourceLabels) {
      const address = addressString as Address;
      const sourceLabel = sourceLabels[address];
      if (!sourceLabel) {
        continue;
      }
      const addressLabels = labels[address] || [];
      // Append a label if there is no label with the same type
      const hasSameType = addressLabels.some(
        (label) =>
          label.type && sourceLabel.type && label.type === sourceLabel.type,
      );
      if (!hasSameType) {
        addressLabels.push(sourceLabel);
      }
      labels[address] = addressLabels;
    }
    await updateSourceFetchTimestamp(chain, info);
  }
  return labels;
}

const sources: Source[] = [
  // Default
  new StaticSource(),
  // ERC20
  new WrappedSource(),
  new TokensSource(),
  new TokenlistSource(),
  new TrustwalletSource(),
  new DefillamaTokensSource(),
  // DeFi
  new AaveV2Source(),
  new AaveV2TokenSource(),
  new AaveV3Source(),
  new AaveV3TokenSource(),
  new MorphoSource(),
  new MorphoVaultSource(),
  new ParifiV1Source(),
  new UniswapV2PoolSource(),
  new UniswapV2Source(),
  new UniswapV3PoolSource(),
  new UniswapV3Source(),
  new AerodromePoolSource(),
  new AerodromeSource(),
  // NFT
  new OpenseaSeaportSource(),
  new OpenseaCollectionSource(),
  // Social
  new EasSource(),
  new EnsSource(),
  new EnsNamesSource(),
  new FarcasterSource(),
  // Account Abstraction
  new AlchemyInfraSource(),
  new AlchemyAccountSource(),
  new BiconomyInfraSource(),
  new BiconomyV2AccountSource(),
  new BiconomyV2Source(),
  new BloctoSource(),
  new CandideSource(),
  new CircleSource(),
  new CoinbaseSmartWalletV1(),
  new CoinbaseSmartWalletV1Accounts(),
  new DaimoV1AccountSource(),
  new DaimoV1Source(),
  new EtherspotSource(),
  new FunV1AccountSource(),
  new FunV1Source(),
  new KlasterSource(),
  new LightV0_1AccountSource(),
  new LightV0_1Source(),
  new LightV0_2AccountSource(),
  new LightV0_2Source(),
  new NaniSource(),
  new NaniV0AccountSource(),
  new NaniV1AccountSource(),
  new OpenfortSource(),
  new ParticleSource(),
  new PatchWalletV1AccountSource(),
  new PatchWalletV1Source(),
  new PimlicoSource(),
  new RhinestoneV1ModuleSource(),
  new RhinestoneV1RegistrySource(),
  new RhinestoneV1Source(),
  new SafeCoreSource(),
  new SafeV1_3_0Source(),
  new SafeV1_4_1AccountSource(),
  new SafeV1_4_1Source(),
  new StackupSource(),
  new ThirdwebSource(),
  new ThirdwebAccountSource(),
  new UniPassSource(),
  new ZeroDevInfraSource(),
  new ZeroDevKernelV1AccountSource(),
  new ZeroDevKernelV1Source(),
  new ZeroDevKernelV2AccountSource(),
  new ZeroDevKernelV2Source(),
  new ZeroDevKernelV3AccountSource(),
  new ZeroDevKernelV3ModuleSource(),
  new ZeroDevKernelV3Source(),
  new EntryPointV0_6_0Source(),
  new EntryPointV0_7_0Source(),
];

export { fetch };
export type { ChainId, Label, LabelMap };
