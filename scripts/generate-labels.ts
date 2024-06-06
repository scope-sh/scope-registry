import 'dotenv/config';

import { fetch as fetchLabels } from '@/labels/sources/index.js';
import { CHAINS } from '@/utils/chains.js';
import { putObject } from '@/utils/storage.js';

for (const chain of CHAINS) {
  const labels = await fetchLabels(chain);
  // Metadata is only used to generate the labels, remove it
  const labelsNoMetadata = Object.fromEntries(
    Object.entries(labels).map(([key, value]) => {
      return [
        key,
        value.map((value) => {
          return {
            type: value.type,
            value: value.value,
            namespace: value.namespace,
          };
        }),
      ];
    }),
  );
  const string = JSON.stringify(labelsNoMetadata, null, 2);
  await putObject(`labels/${chain}.json`, string);
}
