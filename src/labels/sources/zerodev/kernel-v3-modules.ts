import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';
import { ChainId } from '../index.js';

class Source extends BaseSource {
  override getName(): string {
    return 'ZeroDev Kernel V3 Modules';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0x8104e3ad430ea6d354d013a6789fdfc71e671c43': 'ECDSA Validator',
      '0x6a6f069e2a08c2468e7724ab3250cdbfba14d4ff': 'ECDSA Signer',
      '0x8aa55d4bfae101609078681a69b5bc3181516612': 'WebAuthn Signer',
      '0xe4fec84b7b002273ecc86baa65a831ddb92d30a8': 'Call Policy',
      '0xaefc5abc67ffd258abd0a3e54f65e70326f84b23': 'Gas Policy',
      '0xf63d4139b25c836334edd76641356c6b74c86873': 'Rate Limit Policy',
      '0xf6a936c88d97e6fad13b98d2fd731ff17eed591d': 'Signature Policy',
      '0x67b436cad8a6d025df6c82c5bb43fbf11fc5b9b7': 'Sudo Policy',
      '0xb9f8f524be6ecd8c945b1b87f9ae5c192fdce20f': 'Timestamp Policy',
      '0xd990393c670dcce8b4d8f858fb98c9912dbfaa06': 'WebAuthn Validator',
      '0xe884c2868cc82c16177ec73a93f7d9e6f3a5dc6e': 'Recovery Action',
      '0xb230f0a1c7c95fa11001647383c8c7a8f316b900': 'Only EntryPoint Hook',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(
      chainAddresses,
      true,
      'zerodev-kernel-v3',
      'erc7579-module',
    );
  }
}

export default Source;
