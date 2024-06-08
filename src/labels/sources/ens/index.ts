import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';

import { toChainLabelMap } from '../../utils.js';
import { ChainId } from '../index.js';

import addresses from './addresses.json';

// https://docs.ens.domains/ens-deployments
class Source extends BaseSource {
  override getName(): string {
    return 'ENS';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const chainAddresses = (
      addresses as Partial<Record<ChainId, Record<Address, string>>>
    )[chain];
    return toChainLabelMap(chainAddresses, 'ens');
  }
}

export default Source;
