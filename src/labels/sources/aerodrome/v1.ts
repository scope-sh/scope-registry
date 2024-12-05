import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';

import { toChainLabelMap } from '../../utils.js';
import { ChainId } from '../index.js';

import addresses from './v1-addresses.json';

// https://docs.morpho.org/addresses
class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Aerodrome',
      id: 'aerodrome-v1',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const chainAddresses = (
      addresses as Partial<Record<ChainId, Record<Address, string>>>
    )[chain];
    return toChainLabelMap(
      this.getInfo().id,
      chainAddresses,
      true,
      'aerodrome-v1',
    );
  }
}

export default Source;
