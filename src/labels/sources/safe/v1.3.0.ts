import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';

import { toChainLabelMap } from '../../utils.js';
import { ChainId } from '../index.js';

import addresses from './v1.3.0-addresses.json';

// https://docs.safe.global/advanced/smart-account-supported-networks/v1.3.0
class Source extends BaseSource {
  override getName(): string {
    return 'Safe V1.3.0';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const chainAddresses = (
      addresses as Partial<Record<ChainId, Record<Address, string>>>
    )[chain];
    return toChainLabelMap(chainAddresses, 'Safe');
  }
}

export default Source;
