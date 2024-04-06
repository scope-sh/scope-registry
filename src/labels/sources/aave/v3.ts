import { Source as BaseSource } from '@/labels/base.js';
import type { LabelMap } from '@/labels/base.js';

import { toLabelMap } from '../../utils.js';

import addresses from './v3-addresses.json';

// https://docs.aave.com/developers/deployed-contracts/v3-mainnet
class Source extends BaseSource {
  override getName(): string {
    return 'Aave V3';
  }

  async fetch(): Promise<LabelMap> {
    return toLabelMap('Aave V3', addresses);
  }
}

export default Source;
