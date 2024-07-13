import 'dotenv/config';

import { Address } from 'viem';

import { fetch as fetchLabels } from '@/labels/sources/index.js';
import { CHAINS } from '@/utils/chains.js';
import { type LabelWithAddress, addLabels, disconnect } from '@/utils/db.js';

for (const chain of CHAINS) {
  const labels = await fetchLabels(chain);
  const labelsWithAddress: LabelWithAddress[] = Object.entries(labels)
    .map(([address, labels]) => {
      return labels.map((label) => {
        return {
          address: address as Address,
          ...label,
          // Metadata is used to generate the labels, remove it
          metadata: undefined,
          // Priority is used to sort the list, remove it
          priority: undefined,
        };
      });
    })
    .flat();
  await addLabels(chain, labelsWithAddress);
}
await disconnect();
