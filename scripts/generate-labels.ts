import 'dotenv/config';

import { Address } from 'viem';

import { ChainLabelMap } from '@/labels/base';
import { SOURCES } from '@/labels/sources/index.js';
import { ChainId, CHAINS } from '@/utils/chains.js';
import { addLabels, disconnect, type LabelWithAddress } from '@/utils/db.js';
import {
  getMetadata,
  isTimeToFetch as isTimeToFetchSources,
  updateFetchTimestamp as updateSourceFetchTimestamp,
  validate as validateSources,
} from '@/utils/source';

for (const chain of CHAINS) {
  await fetchLabels(chain);
}

async function fetchLabels(chain: ChainId): Promise<void> {
  const labels: ChainLabelMap = {};
  const isValid = validateSources(SOURCES);
  if (!isValid) {
    throw new Error('Invalid sources');
  }
  for (const source of SOURCES) {
    const sourceLabelsWithAddress: LabelWithAddress[] = [];
    const info = source.getInfo();
    const metadata = await getMetadata(chain, info);
    const isTimeToFetch = isTimeToFetchSources(
      metadata,
      info.interval,
      Date.now(),
    );
    if (!isTimeToFetch) {
      continue;
    }
    console.info(`Fetching from the "${info.name}" source…`);
    const sourceLabels = await source.fetch(chain, labels);
    for (const addressString in sourceLabels) {
      const address = addressString as Address;
      const sourceLabel = sourceLabels[address];
      if (!sourceLabel) {
        continue;
      }
      const addressLabels = labels[address] || [];
      // Append a label if there is no label with the same type
      const hasSameType = addressLabels.some(
        (label) =>
          label.type && sourceLabel.type && label.type === sourceLabel.type,
      );
      if (!hasSameType) {
        addressLabels.push(sourceLabel);
        sourceLabelsWithAddress.push({
          address,
          ...sourceLabel,
          // Metadata is used to generate the labels, remove it
          metadata: undefined,
        });
      }
      labels[address] = addressLabels;
    }
    await addLabels(chain, sourceLabelsWithAddress);
    await updateSourceFetchTimestamp(chain, info);
  }
}

await disconnect();
