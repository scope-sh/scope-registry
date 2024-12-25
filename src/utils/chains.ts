import { Chain as ChainData } from 'viem';
import {
  mainnet,
  sepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  polygon,
  polygonAmoy,
  bsc,
  bscTestnet,
  gnosis,
  fantom,
  zkSync,
  klaytnBaobab,
  metis,
  polygonZkEvm,
  moonbeam,
  moonriver,
  fantomTestnet,
  canto,
  klaytn,
  gnosisChiado,
  arbitrum,
  arbitrumNova,
  celo,
  avalancheFuji,
  avalanche,
  lineaSepolia,
  linea,
  arbitrumSepolia,
  scrollSepolia,
  scroll,
  zora,
  zoraSepolia,
  aurora,
  blast,
  blastSepolia,
  harmonyOne,
  mode,
  modeTestnet,
} from 'viem/chains';

const ETHEREUM = mainnet.id;
const OPTIMISM = optimism.id;
const BNB = bsc.id;
const BNB_TESTNET = bscTestnet.id;
const GNOSIS_CHAIN = gnosis.id;
const POLYGON = polygon.id;
const FANTOM = fantom.id;
const ZKSYNC = zkSync.id;
const KLAYTN_BAOBAB = klaytnBaobab.id;
const METIS = metis.id;
const POLYGON_ZKEVM = polygonZkEvm.id;
const MOONBEAM = moonbeam.id;
const MOONRIVER = moonriver.id;
const FANTOM_TESTNET = fantomTestnet.id;
const CANTO = canto.id;
const KLAYTN = klaytn.id;
const BASE = base.id;
const GNOSIS_CHIADO = gnosisChiado.id;
const ARBITRUM = arbitrum.id;
const ARBITRUM_NOVA = arbitrumNova.id;
const CELO = celo.id;
const AVALANCHE_FUJI = avalancheFuji.id;
const AVALANCHE = avalanche.id;
const LINEA_SEPOLIA = lineaSepolia.id;
const LINEA = linea.id;
const POLYGON_AMOY = polygonAmoy.id;
const BASE_SEPOLIA = baseSepolia.id;
const ARBITRUM_SEPOLIA = arbitrumSepolia.id;
const SCROLL_SEPOLIA = scrollSepolia.id;
const SCROLL = scroll.id;
const ZORA = zora.id;
const SEPOLIA = sepolia.id;
const OPTIMISM_SEPOLIA = optimismSepolia.id;
const ZORA_SEPOLIA = zoraSepolia.id;
const AURORA = aurora.id;
const BLAST = blast.id;
const BLAST_SEPOLIA = blastSepolia.id;
const HARMONY_SHARD_0 = harmonyOne.id;
const MODE = mode.id;
const MODE_SEPOLIA = modeTestnet.id;

const CHAINS: ChainId[] = [
  ETHEREUM,
  SEPOLIA,
  OPTIMISM,
  OPTIMISM_SEPOLIA,
  POLYGON,
  POLYGON_AMOY,
  BASE,
  BASE_SEPOLIA,
  ARBITRUM,
  ARBITRUM_SEPOLIA,
  MODE,
  MODE_SEPOLIA,
];

type ChainId =
  | typeof ETHEREUM
  | typeof OPTIMISM
  | typeof BNB
  | typeof BNB_TESTNET
  | typeof GNOSIS_CHAIN
  | typeof POLYGON
  | typeof FANTOM
  | typeof ZKSYNC
  | typeof KLAYTN_BAOBAB
  | typeof METIS
  | typeof POLYGON_ZKEVM
  | typeof MOONBEAM
  | typeof MOONRIVER
  | typeof FANTOM_TESTNET
  | typeof CANTO
  | typeof KLAYTN
  | typeof BASE
  | typeof GNOSIS_CHIADO
  | typeof ARBITRUM
  | typeof ARBITRUM_NOVA
  | typeof CELO
  | typeof AVALANCHE_FUJI
  | typeof AVALANCHE
  | typeof LINEA_SEPOLIA
  | typeof LINEA
  | typeof POLYGON_AMOY
  | typeof BASE_SEPOLIA
  | typeof ARBITRUM_SEPOLIA
  | typeof SCROLL_SEPOLIA
  | typeof SCROLL
  | typeof ZORA
  | typeof SEPOLIA
  | typeof OPTIMISM_SEPOLIA
  | typeof ZORA_SEPOLIA
  | typeof AURORA
  | typeof BLAST
  | typeof BLAST_SEPOLIA
  | typeof HARMONY_SHARD_0
  | typeof MODE
  | typeof MODE_SEPOLIA;

function getChainData(chain: ChainId): ChainData {
  switch (chain) {
    case ETHEREUM:
      return mainnet;
    case OPTIMISM:
      return optimism;
    case BNB:
      return bsc;
    case BNB_TESTNET:
      return bscTestnet;
    case GNOSIS_CHAIN:
      return gnosis;
    case POLYGON:
      return polygon;
    case FANTOM:
      return fantom;
    case ZKSYNC:
      return zkSync;
    case KLAYTN_BAOBAB:
      return klaytnBaobab;
    case METIS:
      return metis;
    case POLYGON_ZKEVM:
      return polygonZkEvm;
    case MOONBEAM:
      return moonbeam;
    case MOONRIVER:
      return moonriver;
    case FANTOM_TESTNET:
      return fantomTestnet;
    case CANTO:
      return canto;
    case KLAYTN:
      return klaytn;
    case BASE:
      return base;
    case GNOSIS_CHIADO:
      return gnosisChiado;
    case ARBITRUM:
      return arbitrum;
    case ARBITRUM_NOVA:
      return arbitrumNova;
    case CELO:
      return celo;
    case AVALANCHE_FUJI:
      return avalancheFuji;
    case AVALANCHE:
      return avalanche;
    case LINEA_SEPOLIA:
      return lineaSepolia;
    case LINEA:
      return linea;
    case POLYGON_AMOY:
      return polygonAmoy;
    case BASE_SEPOLIA:
      return baseSepolia;
    case ARBITRUM_SEPOLIA:
      return arbitrumSepolia;
    case SCROLL_SEPOLIA:
      return scrollSepolia;
    case SCROLL:
      return scroll;
    case ZORA:
      return zora;
    case SEPOLIA:
      return sepolia;
    case OPTIMISM_SEPOLIA:
      return optimismSepolia;
    case ZORA_SEPOLIA:
      return zoraSepolia;
    case AURORA:
      return aurora;
    case BLAST:
      return blast;
    case BLAST_SEPOLIA:
      return blastSepolia;
    case HARMONY_SHARD_0:
      return harmonyOne;
    case MODE:
      return mode;
    case MODE_SEPOLIA:
      return modeTestnet;
  }
}

export {
  CHAINS,
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
  BLAST,
  BLAST_SEPOLIA,
  HARMONY_SHARD_0,
  MODE,
  MODE_SEPOLIA,
  getChainData,
};
export type { ChainId };
