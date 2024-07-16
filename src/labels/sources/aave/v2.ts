import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';

import { toChainLabelMap } from '../../utils.js';
import { ChainId } from '../index.js';

import addresses from './v2-addresses.json';

// https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts
class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Aave V2',
      id: 'aave-v2',
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
    const chainAddresses = (
      addresses as Partial<Record<ChainId, Record<Address, string>>>
    )[chain];
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'aave-v2');
  }
}

export default Source;
