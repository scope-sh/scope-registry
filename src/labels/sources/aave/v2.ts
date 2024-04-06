import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';

import { toLabelMap } from '../../utils.js';

import addresses from './v2-addresses.json';

// https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts
class Source extends BaseSource {
  override getName(): string {
    return 'Aave V2';
  }

  async fetch(): Promise<LabelMap> {
    return toLabelMap('Aave V2', addresses);
  }
}

export default Source;
