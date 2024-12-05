import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Alchemy Infra',
      id: 'alchemy-infra',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const paymasters: Record<Address, string> = {
      '0x4fd9098af9ddcb41da48a1d78f91f1398965addc': 'Paymaster',
    };
    const bundlers: Address[] = [
      '0x0cd73c6191906b6f5795efd525f77e65d6aa7561',
      '0x2c929c7e5bb90ffa05c1d156ab6864523597b1be',
      '0x2ce3fb4ea6a849cc49f68bdbeaa4912a920bdfd8',
      '0x31b722d418ae5492cf6b4f4650243767f0652de0',
      '0x34716d493d69b11fd52d3242cf1eeec8585a1491',
      '0x3680e234283e149c859f9c173327676eb31e6f2c',
      '0x426031b9c8efa7b7e505644c1364cd35c238aa8f',
      '0x4a25d28d10b02bcf13a16068f56d167d8f96d093',
      '0x54af39ebab5d1370b6a74a0ce3134ad06e0cccbc',
      '0x5f0557d8a449102845b9145a947758da1a2d3d25',
      '0x65061d355ae0359ec801e047e40c76051833e78c',
      '0x854d44777720969c18ede7778d1f110c85438eaa',
      '0x91dfdec28a8c2d946d151df2ff9c8dbd543d822e',
      '0x9a68c3b432ec182a53888b9cba8de2a631abf3ee',
      '0xafd8d3e6c38558414b22379203ebadf28c9b12b9',
      '0xb56966352f6cd5aeb9f60fbe5e4561e63c6bfa93',
      '0xdf1201013a767f48c5901d8904b900790e71ea20',
      '0xf5734d930bc268dd1d1875cf56eab94ce636cab0',
    ];
    const chainAddresses = await getDeployed(chain, paymasters);
    for (const bundler of bundlers) {
      chainAddresses[bundler] = 'Bundler';
    }
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'alchemy');
  }
}

export default Source;
