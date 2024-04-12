import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';
import { CHAINS } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getName(): string {
    return 'Particle';
  }

  async fetch(): Promise<LabelMap> {
    const addresses: Record<string, Record<Address, string>> = {};
    const paymasters: Record<Address, string> = {
      '0x23b944a93020a9c7c414b1adecdb2fd4cd4e8184': 'Paymaster',
    };
    const bundlers: Address[] = [
      '0x007113d2a4f56a64bd3822e4746badefb8e89830',
      '0x027037e2d7199c856f78a22e6c5bd60188c6034e',
      '0x032160d97a923a3b55c98e04c871212ac8a48974',
      '0x042d15997e8c1e03f0abb43ce2f4b6617d73780c',
      '0x138ff91d402f6a54ce159f63c87721e385e7ac7f',
      '0x19903192ea0128d9af2bc3db15cc6900bd605eb0',
      '0x1a1c0ad7be7760f40e0bb5ab78fc7288c40a6c2b',
      '0x1c91af3c1851c529644c59eeadfcc7e359879e05',
      '0x204a72835ed0ce927a5a663adebad3d86445d477',
      '0x25918a864efafec281173ae90cbcdb9da850fee8',
      '0x432c961e222fc3522fd31af85e84c6240ff0b46f',
      '0x4574e1c02b90e1ac12bab6944a24d83a1eded5b4',
      '0x529565b3fe0a03ff81f52f8e53b9fa8812f436d9',
      '0x596680f2ea1bdb041570c74fb5fc8c0c0a9fad80',
      '0x5a32928b135c86e58b3f7abb47a2f720f49d0909',
      '0x5f64df785fbe01bf97a69da6ee3a48b8aea36f46',
      '0x5ff6c7732548cd2c1f3bc6b7c0b084748498de6f',
      '0x6d40c3f90371b6d2a2a7d336947d417c11aaed2a',
      '0x6db893a14498270a3cdea2dbcc0bb34593dea71a',
      '0x6eef4af735027cfeb3cd3628201cd5fc5f51914a',
      '0x71320c9382addb244ced08db58ef761186a63cc3',
      '0x722606eb3bda03e80c5ed747732dac00b8cde824',
      '0x74bf7407dd5fa033e51120f87246ace3b75b32d0',
      '0x75727f24665a23f862161297870798056eb61db1',
      '0x7782e0b536f1835e192434dfe6f4c3a6633664fd',
      '0x7f0fa0bab21c6749f12116aa8cbab7bbae8f50f2',
      '0x85a582a123d2ac79f143d9c0a5b2bad1c7d8b1af',
      '0x9e375d31a8d0ed88d0ede9c7a3f775965d9442f2',
      '0x9e63dbb321e950aa128383596ace54a4ec67ae9e',
      '0xa23c9035afd3e34690d80804b33bdf1b93c0a604',
      '0xa8a4afbbfcf08b46249a48bd73d2c85cce525190',
      '0xac16076b48e197d7dbc733ab7c5dc1002108720e',
      '0xb0c58be75936250b2b14c8437614ff780e902f57',
      '0xb0e113fc2e9740e33538acff1f08df9ebcc24280',
      '0xb41c03f8457cbd9d12f34dc449b50d8244076cbf',
      '0xb9aefac2e20d2c63b2beccf8bc85c68f81c82f1c',
      '0xc389179b875d3e0586d8e7903fe1e8de474c44da',
      '0xc6cdf744c7b40e71c16ca7e5286e8c5e39fa6caf',
      '0xc89d07ecb919103e37945c22474e982cb2616ba3',
      '0xcb4e642d7d26f82efd73020436a4b1e983f4dbfa',
      '0xcfa706659d0bbe85ebb5c145a2d9f1c89c76b1c4',
      '0xd1b3d51ead4b0880ed37448e393873cc67d77641',
      '0xd44a59e1e333430ab20d330cad9c5800a3317d2b',
      '0xdffbb5b47704896ea9017d7003a1f75cd62ea4f2',
      '0xe26b72ebc3738df3f5b6258d16e1cb32afd1e848',
      '0xe58b318d8a37c53f86534a33bfaeefea4bba1111',
      '0xe60767079edd05d31cf5bb60dc6885418f4350e9',
      '0xed1be395cea4f25f2786c4664a6c0d7f2ef95c6c',
      '0xed1f8fa2e386a74a6e88be2800cd5a1829fbc923',
      '0xf7d644ad4cf2c1d1ed924556385522e530367bf1',
      '0xf7e017b3f61bd3410a3b03d7dad7699fd6780584',
      '0xf801672ed1c5c26e99879296058c31765aeb40ae',
      '0xfb2f1eee510f12f8e72f55c56d6f12a7183993ee',
    ];
    for (const chain of CHAINS) {
      const chainAddresses = await getDeployed(chain, paymasters);
      for (const bundler of bundlers) {
        chainAddresses[bundler] = 'Bundler';
      }
      addresses[chain] = chainAddresses;
    }
    return toLabelMap('Particle', addresses);
  }
}

export default Source;
