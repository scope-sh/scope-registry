import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';

import { toChainLabelMap } from '../../utils.js';
import { ChainId } from '../index.js';

import addresses from './v1-addresses.json';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Union V1',
      id: 'union-v1',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const chainAddresses = (
      addresses as Partial<Record<ChainId, Record<Address, string>>>
    )[chain];
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'union');
  }
}

export default Source;
