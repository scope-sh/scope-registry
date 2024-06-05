import { Source as BaseSource } from '@/labels/base.js';
import type { SingleLabelMap } from '@/labels/base.js';

import { toLabelMap } from '../../utils.js';

import addresses from './v1.3.0-addresses.json';

// https://docs.safe.global/advanced/smart-account-supported-networks/v1.3.0
class Source extends BaseSource {
  override getName(): string {
    return 'Safe V1.3.0';
  }

  async fetch(): Promise<SingleLabelMap> {
    return toLabelMap(addresses, 'Safe');
  }
}

export default Source;
