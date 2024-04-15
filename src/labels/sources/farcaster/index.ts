import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';

import { toLabelMap } from '../../utils.js';

import addresses from './addresses.json';

class Source extends BaseSource {
  override getName(): string {
    return 'Farcaster';
  }

  async fetch(): Promise<LabelMap> {
    return toLabelMap(addresses, 'Farcaster');
  }
}

export default Source;
