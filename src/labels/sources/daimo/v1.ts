import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';
import { ChainId } from '../index.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Daimo V1',
      id: 'daimo-v1',
      interval: {
        seconds: 0,
        minutes: 1,
        hours: 0,
        days: 0,
      },
      fetchType: 'incremental',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      '0x4adca7cb84497c9c4c308063d2f219c7b6041183': 'Notes V1',
      '0xfbdb4f1172aadaddfe4233550e9cd5e4aa1dae00': 'Notes V1',
      '0x594bc666500faed35dc741f45a35c571399560d8': 'Notes V2',
      '0xf823d42b543ec9785f973e9aa3187e42248f4874': 'Notes V2',
      '0xf9d643f5645c6140b8eeb7ef42878b71ebfee40b': 'Factory',
      '0xf0fc94dcdc04b2400e5eeac6aba35cc87d1954d0':
        'Name Registry Implementation',
      '0x4430a644b215a187a3daa5b114fa3f3d9debc17d': 'Name Registry',
      '0xa9e1ccb08053e4f5dabb506718352389c1547462': 'Paymaster V2',
      '0xa728b16cba81772fa881dc569ad4c7f1de360869': 'Request',
      '0x652d07389ac2ead07222e7965d30ec0b2700b388': 'Account Implementation',
      '0x8abd51a785160481db9e638ee71a3f4ec4b996d8': 'Daimo Op Inflator',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'daimo');
  }
}

export default Source;
