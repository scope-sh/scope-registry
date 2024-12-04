import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  override getInfo(): SourceInfo {
    return {
      name: 'Coinbase Infra',
      id: 'coinbase-infra',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 7,
      },
      fetchType: 'full',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0xa270ef92c1e11f1c1f95753c2e56801e8125fa83': 'Limiting Paymaster',
      '0x2faeb0760d4230ef2ac21496bb4f0b47d634fd4c': 'Verifying Paymaster',
    };
    const bundlers: Address[] = [
      '0x04bf493b56108ae20fc01918b7eaaeb5c4220d0e',
      '0x0b7ebfeecdeb9ce5b9100187fe699722fc77f08e',
      '0x1984c070e64e561631a7e20ea3c4cbf4eb198da8',
      '0x2d05c65c1fea1df46c3837fd72b418d0216a53d0',
      '0x33d4df9ebf7add6f7756454c11faf181ac0a5037',
      '0x37bf001dc6cfcbe6343cbf0e0be2da463b8e71af',
      '0x4184ba1c2acef4736c5cea1ec2eb84029130789b',
      '0x4263874f7f492ca5593558ed73cda1fcc8395fe5',
      '0x4f6a625c19b8eea0ddb9e7a4cb9ba495cd77d2f6',
      '0x6d10c567db15b40bfb1a162c16cbd7a3e80bb12b',
      '0x79e1519a797bdd5c7f986aac90a0b230e8d72ea7',
      '0x7cf5dcc019b9a7741fc05e6f03c7b2ac8d412407',
      '0x8516875d303e54b2c07ea2aaa6eeaa9b71d60883',
      '0x99d934c6eb73a993d932a79d20b5d4f4de9bec9d',
      '0xaa2ed8d04d150a546e4de73b77795c5962d9f044',
      '0xb834f1ea0be0fc39595d7352702721278bf755bc',
      '0xb8593a01e6564b87b199f79c7e90e689ad05c367',
      '0xc366a91abad8f569ea43d3cf19bd987e992a284e',
      '0xc3b9358feffbfbbe8d4f1f30a8b7bd76104f7b36',
      '0xc4a4e8ae10b82a954519ca2ecc9efc8f77819e86',
      '0xcdee1d7b87e126d51c2aa45ea439942fd335aa24',
      '0xd2235f9dce74a8a29e8b8463574dbf3e14a27d28',
      '0xdfb47a66a2d75fe2f614e30322d86ae999babf93',
      '0xfbd85a0c200b286ef2d7a08306113669013c39da',
    ];
    const chainAddresses = await getDeployed(chain, labels);
    for (const bundler of bundlers) {
      chainAddresses[bundler] = 'Bundler';
    }
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'coinbase');
  }
}

export default Source;
