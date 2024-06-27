import { Address } from 'viem';

import type {
  ChainSingleLabelMap,
  LabelTypeId,
  LabelNamespaceId,
} from './base.js';

function toChainLabelMap(
  addresses?: Record<Address, string>,
  namespaceId?: LabelNamespaceId,
  typeId?: LabelTypeId,
): ChainSingleLabelMap {
  const map: ChainSingleLabelMap = {};
  if (!addresses) {
    return map;
  }
  for (const addressString in addresses) {
    const address = addressString as Address;
    const value = addresses[address];
    if (!value) {
      continue;
    }
    map[address] = {
      value,
      type: typeId,
      namespace: namespaceId,
    };
  }
  return map;
}

// eslint-disable-next-line import/prefer-default-export
export { toChainLabelMap };
