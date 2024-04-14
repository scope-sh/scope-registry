import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Stackup';
  }

  async fetch(): Promise<LabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const contracts: Record<Address, string> = {
      '0x474ea64bedde53aad1084210bd60eef2989bf80f': 'Paymaster',
      '0xe93eca6595fe94091dc1af46aac2a8b5d7990770': 'Paymaster',
      '0x9d6ac51b972544251fcc0f2902e633e3f9bd3f29': 'Paymaster',
    };
    const bundlers: Address[] = [
      '0x07660c06338b78eaa9e529fcef5e11ac56b25cdb',
      '0x1331237a04fce5d5d4950109c3a66676315de7f8',
      '0x20e9695f25413f14e5807b530d0698bd4f155074',
      '0x226a22889b7f842fb1426b3e81130b461abda8a5',
      '0x25df024637d4e56c1ae9563987bf3e92c9f534c0',
      '0x26d6440f50dc457735c1f0397b1f29e03d81b7e8',
      '0x305e913df6b3fed488240847759805285992fd3a',
      '0x3b40a0209c75100460f2287c8382c4f00cbc14de',
      '0x41f9ac2e71b4b8fdda46367ddfa834ddab2a1b89',
      '0x481b63894b02bbcab49fabe6af39b8e8f98d3ba8',
      '0x4a28e5ec811a13a11f0a0e3f535472fbed0d4fea',
      '0x4a5f132a89f32cda81f3e8faac3c2d0f993effe2',
      '0x4c2760744564c27717d5e54210044f76d1bcfca6',
      '0x6216a5c3a987c2a441e38d8400da9cbccfcf7f30',
      '0x65c51459258464020e850fba27b427bd708da638',
      '0x6807b9d242e0d25db9a46c57b3f172a915eba759',
      '0x6892bef4ae1b5cb33f9a175ab822518c9025fc3c',
      '0x74d3f755dcd69fb9fca587ae71e7897a2f5a708c',
      '0x758ac3dc8fb6f939adf42bb83e717f94619052f5',
      '0x791b1689526b5560145f99cb9d3b7f24eca2591a',
      '0x7b1b12595d2ebe7b54ddeb6a7768bca9d1e4ebd5',
      '0x7f4d67fbcc3f1c2f7a121d6770bcd99b4a50b87f',
      '0x822ac1fd68e6d6a1d4d08d7e01607cf80dfad32c',
      '0x89381ab6795932eb661544e0f56fddc7a2142bf1',
      '0x8cf905c50f25a481171e7f5936625754d44a9537',
      '0x8f508cef7c94883655751408b9ba80c94937288b',
      '0x9831d6f598729bf41055a0af96396cea91eab18b',
      '0xa5fdfcbceeceb5741ef73f86cf3ed6e80e5e920d',
      '0xa5fdfcbceeceb5741ef73f86cf3ed6e80e5e920d',
      '0xa943d7b5a4770ccbfc2ab02a5e746cf1e882aeca',
      '0xab97d6a3174b8bf60d0f017c8453f543ea835d36',
      '0xb1f6c467a85c6f19e8a8410ecc0fdc66a4c8cdb3',
      '0xb33d31753bac165ab9737272edbd306b22d0c70a',
      '0xb5267734285b9c6d3f04080d75a1dcd084d95cca',
      '0xb5eff699e9dc6933c2461a44fe793ed1c79482a1',
      '0xb9d4765ab7a4a3b3cde74f1f34bcbeeac2753ce1',
      '0xc1546ddf708b22ee9c94e5ef2c5ccfed656c0cfb',
      '0xc321418a6dad4a225fb1cd8e227af69f7288e3ac',
      '0xca7660c437fbc040ae2cf43e30e37a2071ffe940',
      '0xcbd52a23e0e4f166bbe9cdde6c07cfce0fc32ee0',
      '0xd0e02b9b4d6981b546d63c8c4d8094bc3f0cd296',
      '0xd2f01aa76082bb11a2ad0e8ae09410a7675800d8',
      '0xd6eeaf9408c01baf62aae5faa58b5bdec6bf5fa7',
      '0xd7dd5a8f0cae680c0595716351415a44b25e7747',
      '0xd9fadf9430f7f2580768c727cf1b57ce2e8907e8',
      '0xdd9b78180997f042111d94fb1d0b1ebee94051ba',
      '0xe3ce225f0cfed860a8092c714fc254978aff53cf',
      '0xf71a57150bdf4d4ba76211e7b0a90abc2ee87bc0',
      '0xfd72ae8ff5cc18849d83f13a252a0d8fd99eb0ac',
      '0xff5ee952e5444a1b7878f7daf175f8dd6aeb6cf7',
      '0xffa16e0834c31d74a834331c24ac340be1cb27a9',
    ];
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, contracts);
      for (const bundler of bundlers) {
        chainAddresses[bundler] = 'Bundler';
      }
      addresses[chain] = chainAddresses;
    }
    return toLabelMap('Stackup', addresses);
  }
}

export default Source;
