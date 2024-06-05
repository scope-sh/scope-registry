import { Source as BaseSource } from '@/labels/base.js';
import type { SingleLabelMap } from '@/labels/base.js';

import { toLabelMap } from '../../utils.js';

import addresses from './v3-addresses.json';

class Source extends BaseSource {
  getName(): string {
    return 'Uniswap V3';
  }

  async fetch(): Promise<SingleLabelMap> {
    return toLabelMap(addresses, 'Uniswap V3');
  }
}

export default Source;
