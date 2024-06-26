import 'dotenv/config';

import { Address } from 'viem';

import { fetch as fetchLabels } from '@/labels/sources/index.js';
import { CHAINS } from '@/utils/chains.js';
import { removeLabels, addLabels, LabelWithAddress } from '@/utils/db.js';

for (const chain of CHAINS) {
  const labels = await fetchLabels(chain);
  const labelsWithAddress: LabelWithAddress[] = Object.entries(labels)
    .map(([address, labels]) => {
      return labels.map((label) => {
        return {
          address: address as Address,
          ...label,
          // Metadata is only used to generate the labels, remove it
          metadata: undefined,
        };
      });
    })
    .flat();
  await removeLabels(chain);
  await addLabels(chain, labelsWithAddress);
}
