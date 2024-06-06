import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';

import { toChainLabelMap } from '../../utils.js';
import { ChainId } from '../index.js';

import addresses from './v3-addresses.json';

// https://docs.aave.com/developers/deployed-contracts/v3-mainnet
class Source extends BaseSource {
  override getName(): string {
    return 'Aave V3';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const chainAddresses = (
      addresses as Partial<Record<ChainId, Record<Address, string>>>
    )[chain];
    return toChainLabelMap(chainAddresses, 'Aave V3');
  }
}

export default Source;
