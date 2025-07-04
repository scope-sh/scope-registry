import { Address } from 'viem';

import type {
  ChainSingleLabelMap,
  LabelTypeId,
  LabelNamespaceId,
} from './base.js';

function toChainLabelMap(
  sourceId: string,
  addresses?: Record<Address, string>,
  indexed = true,
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
      sourceId,
      indexed,
      type: typeId,
      namespace: namespaceId,
    };
  }
  return map;
}

// eslint-disable-next-line import-x/prefer-default-export
export { toChainLabelMap };
