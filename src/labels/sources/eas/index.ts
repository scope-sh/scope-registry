import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap } from '@/labels/base.js';

import { toChainLabelMap } from '../../utils.js';
import { ChainId } from '../index.js';

import addresses from './addresses.json';

// https://docs.attest.sh/docs/quick--start/contracts
class Source extends BaseSource {
  override getName(): string {
    return 'Ethereum Attestation Service';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const chainAddresses = (
      addresses as Partial<Record<ChainId, Record<string, string>>>
    )[chain];
    return toChainLabelMap(
      chainAddresses,
      true,
      'ethereum-attestation-service',
    );
  }
}

export default Source;
