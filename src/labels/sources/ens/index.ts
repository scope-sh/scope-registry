import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';

import { toChainLabelMap } from '../../utils.js';
import { ChainId } from '../index.js';

import addresses from './addresses.json';

// https://docs.ens.domains/ens-deployments
class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'ENS',
      id: 'ens',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 30,
      },
      fetchType: 'full',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const chainAddresses = (
      addresses as Partial<Record<ChainId, Record<Address, string>>>
    )[chain];
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'ens');
  }
}

export default Source;
