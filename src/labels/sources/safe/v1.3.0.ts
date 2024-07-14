import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';

import { toChainLabelMap } from '../../utils.js';
import { ChainId } from '../index.js';

import addresses from './v1.3.0-addresses.json';

// https://docs.safe.global/advanced/smart-account-supported-networks/v1.3.0
class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Safe V1.3.0',
      id: 'safe-v1.3.0',
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
    const chainAddresses = (
      addresses as Partial<Record<ChainId, Record<Address, string>>>
    )[chain];
    return toChainLabelMap(this.getInfo().id, chainAddresses, true, 'safe');
  }
}

export default Source;
