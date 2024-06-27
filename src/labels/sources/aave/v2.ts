import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';

import { toChainLabelMap } from '../../utils.js';
import { ChainId } from '../index.js';

import addresses from './v2-addresses.json';

// https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts
class Source extends BaseSource {
  override getName(): string {
    return 'Aave V2';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const chainAddresses = (
      addresses as Partial<Record<ChainId, Record<Address, string>>>
    )[chain];
    return toChainLabelMap(chainAddresses, true, 'aave-v2');
  }
}

export default Source;
