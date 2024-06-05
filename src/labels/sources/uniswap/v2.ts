import { Source as BaseSource } from '@/labels/base.js';
import type { SingleLabelMap } from '@/labels/base.js';

import { toLabelMap } from '../../utils.js';

import addresses from './v2-addresses.json';

class Source extends BaseSource {
  override getName(): string {
    return 'Uniswap V2';
  }

  async fetch(): Promise<SingleLabelMap> {
    return toLabelMap(addresses, 'Uniswap V2');
  }
}

export default Source;
