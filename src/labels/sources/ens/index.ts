import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';

import { toLabelMap } from '../../utils.js';

import addresses from './addresses.json';

// https://docs.ens.domains/ens-deployments
class Source extends BaseSource {
  override getName(): string {
    return 'ENS';
  }

  async fetch(): Promise<LabelMap> {
    return toLabelMap('ENS', addresses);
  }
}

export default Source;
