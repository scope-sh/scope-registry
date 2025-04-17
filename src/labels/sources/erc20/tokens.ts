import { Address } from 'viem';

import {
  ChainId,
  ETHEREUM,
  SEPOLIA,
  OPTIMISM,
  OPTIMISM_SEPOLIA,
  BASE,
  BASE_SEPOLIA,
  POLYGON,
  POLYGON_AMOY,
  ARBITRUM,
  ARBITRUM_SEPOLIA,
  MODE,
  LINEA,
  ARBITRUM_NOVA,
  CELO,
  AVALANCHE,
  AVALANCHE_FUJI,
  GNOSIS,
  BSC,
  MONAD_TESTNET,
  MEGAETH_TESTNET,
} from '@/utils/chains.js';

import { Asset } from '.';

interface Token {
  name: string;
  symbol?: string;
  decimals: number;
}

async function fetch(chain: ChainId): Promise<Asset[]> {
  const tokens: Record<ChainId, Record<Address, Token | null>> = {
    [ETHEREUM]: {
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      '0xde60adfddaabaaac3dafa57b26acc91cb63728c4': {
        name: 'Wormhole Tether USD',
        symbol: 'wormholeUSDT',
        decimals: 18,
      },
      '0x1cdd2eab61112697626f7b4bb0e23da4febf7b7c': {
        name: 'Wormhole Tether USD 2',
        decimals: 6,
      },
      '0x41f7b8b9b897276b7aae926a9016935280b44e97': {
        name: 'Wormhole USDC',
        decimals: 6,
      },
      '0x7cd167b101d2808cfd2c45d17b2e7ea9f46b74b6': {
        name: 'Wormhole USDC 2',
        decimals: 18,
      },
      '0xdd974d5c2e2928dea5f71b9825b8b646686bd200': {
        name: 'Kyber Network Crystal',
        decimals: 18,
      },
      '0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202': {
        name: 'Kyber Network Crystal v2',
        symbol: 'KNC',
        decimals: 18,
      },
      '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0': {
        name: 'Wrapped Staked Ether',
        symbol: 'wstETH',
        decimals: 18,
      },
      '0xbe9895146f7af43049ca1c1ae358b0541ea49704': {
        name: 'Coinbase Staked Ether',
        symbol: 'cbETH',
        decimals: 18,
      },
      '0xae78736cd615f374d3085123a210448e74fc6393': {
        name: 'Rocket Pool Staked Ether',
        symbol: 'rETH',
        decimals: 18,
      },
      '0xd533a949740bb3306d119cc777fa900ba034cd52': {
        name: 'Curve DAO Token',
        symbol: 'CRV',
        decimals: 18,
      },
      '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': {
        name: 'Maker',
        symbol: 'MKR',
        decimals: 18,
      },
      '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': {
        name: 'Uniswap',
        symbol: 'UNI',
        decimals: 18,
      },
      '0x853d955acef822db058eb8505911ed77f175b99e': {
        name: 'Frax Finance',
        symbol: 'FRAX',
        decimals: 18,
      },
      '0xd33526068d116ce69f19a9ee46f0bd304f21a51f': {
        name: 'Rocket Pool',
        symbol: 'RPL',
        decimals: 18,
      },
      '0x6c3ea9036406852006290770bedfcaba0e23a0e8': {
        name: 'Paypal USD Coin',
        symbol: 'PYUSD',
        decimals: 6,
      },
      '0xf1c9acdc66974dfb6decb12aa385b9cd01190e38': {
        name: 'StakeWise Staked Ether',
        symbol: 'osETH',
        decimals: 18,
      },
      '0x4c9edd5852cd905f086c759e8383e09bff1e68b3': {
        name: 'Ethena USD',
        symbol: 'USDe',
        decimals: 18,
      },
      '0xa35b1b31ce002fbf2058d22f30f95d405200a15b': {
        name: 'Stader Ether',
        symbol: 'ETHx',
        decimals: 18,
      },
    },
    [SEPOLIA]: {},
    [OPTIMISM]: {
      '0x0b2c639c533813f4aa9d7837caf62653d097ff85': {
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
      },
      '0x7f5c764cbc14f9669b88837ca1490cca17c31607': {
        name: 'Bridged USDC',
        symbol: 'USDC.e',
        decimals: 6,
      },
      '0xeb466342c4d449bc9f53a865d5cb90586f405215': {
        name: 'Axelar USDC',
        decimals: 6,
      },
      '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': {
        name: 'Bridged Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
      '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58': {
        name: 'Bridged Tether USD',
        symbol: 'USDT',
        decimals: 6,
      },
      '0x7f5373ae26c3e8ffc4c77b7255df7ec1a9af52a6': {
        name: 'Axelar Tether USD',
        decimals: 6,
      },
      '0x1f32b1c2345538c0c6f582fcb022739c4a194ebb': {
        name: 'Wrapped liquid staked Ether',
        symbol: 'wstETH',
        decimals: 18,
      },
      '0x81c9a7b55a4df39a9b7b5f781ec0e53539694873': {
        name: 'Exacly USDC',
        decimals: 6,
      },
      '0x2416092f143378750bb29b79ed961ab195cceea5': {
        name: 'Renzo Restaked ETH',
        symbol: 'ezETH',
        decimals: 18,
      },
      '0x99c59acebfef3bbfb7129dc90d1a11db0e91187f': {
        name: 'Pyth Network',
        symbol: 'PYTH',
        decimals: 6,
      },
      '0xb0ffa8000886e57f86dd5264b9582b2ad87b2b91': {
        name: 'Wormhole Token',
        symbol: 'W',
        decimals: 18,
      },
      '0x58b9cb810a68a7f3e1e4f8cb45d1b9b3c79705e8': {
        name: 'Everclear',
        symbol: 'NEXT',
        decimals: 18,
      },
      '0x68f180fcce6836688e9084f035309e29bf0a2095': {
        name: 'Wrapped Bitcoin',
        symbol: 'WBTC',
        decimals: 8,
      },
      '0x76fb31fb4af56892a25e32cfc43de717950c9278': {
        name: 'Aave Token',
        symbol: 'AAVE',
        decimals: 18,
      },
      '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9': {
        name: 'Synth USD',
        symbol: 'sUSD',
        decimals: 18,
      },
      '0xc40f949f8a4e094d1b49a23ea9241d289b7b2819': {
        name: 'Liquity USD Stablecoin',
        symbol: 'LUSD',
        decimals: 18,
      },
    },
    [OPTIMISM_SEPOLIA]: {},
    [BASE]: {
      '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': {
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
      },
      '0xeb466342c4d449bc9f53a865d5cb90586f405215': {
        name: 'Axelar USDC',
        decimals: 6,
      },
      '0x50c5725949a6f0c72e6c4a641f24049a917db0cb': {
        name: 'Bridged Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
      '0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452': {
        name: 'Wrapped liquid staked Ether',
        symbol: 'wstETH',
        decimals: 18,
      },
      '0x5c7e299cf531eb66f2a1df637d37abb78e6200c7': {
        name: 'Axelar Dai Stablecoin',
        decimals: 18,
      },
      '0x7f5373ae26c3e8ffc4c77b7255df7ec1a9af52a6': {
        name: 'Axelar Tether USD',
        decimals: 6,
      },
      '0x04c0599ae5a44757c0af6f9ec3b93da8976c150a': {
        name: 'Wrapped eETH',
        symbol: 'weETH',
        decimals: 18,
      },
    },
    [BASE_SEPOLIA]: {},
    [POLYGON]: {
      '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359': {
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
      },
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': {
        name: 'Bridged USDC',
        symbol: 'USDC.e',
        decimals: 6,
      },
      '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619': {
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18,
      },
      '0x11cd37bb86f65419713f30673a480ea33c826872': {
        name: 'Wormhole Wrapped Ether',
        decimals: 18,
      },
      '0x4318cb63a2b8edf2de971e2f17f77097e499459d': {
        name: 'Wormhole USDC',
        decimals: 6,
      },
      '0x576cf361711cd940cd9c397bb98c4c896cbd38de': {
        name: 'Wormhole USDC 2',
        decimals: 6,
      },
      '0x750e4c4984a9e0f12978ea6742bc1c5d248f40ed': {
        name: 'Axelar USDC',
        decimals: 6,
      },
      '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063': {
        name: 'Bridged Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f': {
        name: 'Bridged Tether USD',
        symbol: 'USDT',
        decimals: 6,
      },
      '0x9417669fbf23357d2774e9d421307bd5ea1006d2': {
        name: 'Wormhole Tether USD 2',
        decimals: 6,
      },
      '0x3553f861dec0257bada9f8ed268bf0d74e45e89c': {
        name: 'Wormhole Tether USD',
        decimals: 6,
      },
      '0xceed2671d8634e3ee65000edbbee66139b132fbf': {
        name: 'Axelar Tether USD',
        decimals: 6,
      },
      '0x03b54a6e9a984069379fae1a4fc4dbae93b3bccd': {
        name: 'Wrapped liquid staked Ether',
        symbol: 'wstETH',
        decimals: 18,
      },
      '0xd7bb095a60d7666d4a6f236423b47ddd6ae6cfa7': {
        name: 'Axelar wstETH',
        decimals: 18,
      },
      '0x1ddcaa4ed761428ae348befc6718bcb12e63bfaa': {
        name: 'deBridge USDC',
        decimals: 6,
      },
      '0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7': {
        name: 'Aavegochi',
        symbol: 'GHST',
        decimals: 18,
      },
      '0x85955046df4668e1dd369d2de9f3aeb98dd2a369': {
        name: 'DefiPulse Index',
        symbol: 'DPI',
        decimals: 18,
      },
      '0xe111178a87a3bff0c8d18decba5798827539ae99': {
        name: 'STASIS Euro',
        symbol: 'EURS',
        decimals: 2,
      },
      '0x4e3decbb3645551b8a19f0ea1678079fcb33fb4c': {
        name: 'Jarvis Synthetic Euro',
        symbol: 'jEUR',
        decimals: 18,
      },
      '0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4': {
        name: 'Lido Staked MATIC',
        symbol: 'stMATIC',
        decimals: 18,
      },
      '0xfa68fb4628dff1028cfec22b4162fccd0d45efb6': {
        name: 'Stader Staked MATIC',
        symbol: 'MaticX',
        decimals: 18,
      },
    },
    [POLYGON_AMOY]: {},
    [ARBITRUM]: {
      '0xaf88d065e77c8cc2239327c5edb3a432268e5831': {
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
      },
      '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': {
        name: 'Bridged USDC',
        symbol: 'USDC.e',
        decimals: 6,
      },
      '0x4cfa50b7ce747e2d61724fcac57f24b748ff2b2a': {
        name: 'Fluid USDC',
        decimals: 6,
      },
      '0xeb466342c4d449bc9f53a865d5cb90586f405215': {
        name: 'Axelar USDC',
        decimals: 6,
      },
      '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': {
        name: 'Bridged Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
      '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': {
        name: 'Bridged Tether USD',
        symbol: 'USDT',
        decimals: 6,
      },
      '0x7f5373ae26c3e8ffc4c77b7255df7ec1a9af52a6': {
        name: 'Axelar Tether USD',
        decimals: 6,
      },
      '0x5979d7b546e38e414f7e9822514be443a4800529': {
        name: 'Wrapped liquid staked Ether',
        symbol: 'wstETH',
        decimals: 18,
      },
      '0x1ddcaa4ed761428ae348befc6718bcb12e63bfaa': {
        name: 'deBridge USDC',
        decimals: 6,
      },
      '0xd22a58f79e9481d1a88e00c343885a588b34b68b': {
        name: 'Stasis Euro',
        symbol: 'EURS',
        decimals: 2,
      },
      '0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8': {
        name: 'Rocket Pool ETH',
        symbol: 'rETH',
        decimals: 18,
      },
      '0x35751007a407ca6feffe80b3cb397736d2cf4dbe': {
        name: 'Wrapped eETH',
        symbol: 'weETH',
        decimals: 18,
      },
      '0x7dff72693f6a4149b17e7c6314655f6a9f7c8b33': {
        name: 'Gho Token',
        symbol: 'GHO',
        decimals: 18,
      },
      '0xe4d5c6ae46adfaf04313081e8c0052a30b6dd724': {
        name: 'Pyth Network',
        symbol: 'PYTH',
        decimals: 6,
      },
      '0x680447595e8b7b3Aa1B43beB9f6098C79ac2Ab3f': {
        name: 'Decentralized USD',
        symbol: 'USDD',
        decimals: 18,
      },
      '0xb0ffa8000886e57f86dd5264b9582b2ad87b2b91': {
        name: 'Wormhole Token',
        symbol: 'W',
        decimals: 18,
      },
      '0x178412e79c25968a32e89b11f63b33f733770c2a': {
        name: 'Frax Ether',
        symbol: 'frxETH',
        decimals: 18,
      },
      '0xba5ddd1f9d7f570dc94a51479a000e3bce967196': {
        name: 'Aave Token',
        symbol: 'AAVE',
        decimals: 18,
      },
      '0x93b346b6bc2548da6a1e7d98e9a421b42541425b': {
        name: 'Liquity USD Stablecoin',
        symbol: 'LUSD',
        decimals: 18,
      },
    },
    [ARBITRUM_SEPOLIA]: {},
    [MODE]: {},
    [LINEA]: {},
    [ARBITRUM_NOVA]: {},
    [CELO]: {},
    [AVALANCHE]: {},
    [AVALANCHE_FUJI]: {},
    [GNOSIS]: {},
    [BSC]: {},
    [MONAD_TESTNET]: {},
    [MEGAETH_TESTNET]: {},
  };
  const chainTokens = tokens[chain] || {};
  const chainAssets = Object.entries(chainTokens)
    .map(([address, token]) => {
      if (!token) {
        return null;
      }
      return {
        address: address as Address,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
      };
    })
    .filter((entry) => !!entry);
  return chainAssets;
}

export default fetch;
