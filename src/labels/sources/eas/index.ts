import { Source as BaseSource } from '@/labels/base.js';
import type { SingleLabelMap } from '@/labels/base.js';

import { toLabelMap } from '../../utils.js';

import addresses from './addresses.json';

// https://docs.attest.sh/docs/quick--start/contracts
class Source extends BaseSource {
  override getName(): string {
    return 'Ethereum Attestation Service';
  }

  async fetch(): Promise<SingleLabelMap> {
    return toLabelMap(addresses, 'Ethereum Attestation Service');
  }
}

export default Source;
