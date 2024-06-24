import 'dotenv/config';

import { Address } from 'viem';

import { fetch as fetchLabels } from '@/labels/sources/index.js';
import { CHAINS } from '@/utils/chains.js';
import { removeLabels, setLabel } from '@/utils/db.js';

for (const chain of CHAINS) {
  const labels = await fetchLabels(chain);
  // Metadata is only used to generate the labels, remove it
  const labelsNoMetadata = Object.fromEntries(
    Object.entries(labels).map(([key, value]) => {
      return [
        key,
        value.map((value) => {
          return {
            ...value,
            metadata: undefined,
          };
        }),
      ];
    }),
  );
  await removeLabels(chain);
  for (const [addressString, labels] of Object.entries(labelsNoMetadata)) {
    const address = addressString as Address;
    for (const label of labels) {
      await setLabel(chain, address, label);
    }
  }
}
