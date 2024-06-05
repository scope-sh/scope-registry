import 'dotenv/config';

import { fetch as fetchLabels } from '@/labels/sources/index.js';
import type { ChainId } from '@/utils/chains.js';
import { putObject } from '@/utils/storage.js';

const labels = await fetchLabels();
for (const chainIdString in labels) {
  const chainId = parseInt(chainIdString) as ChainId;
  // Metadata is only used to generate the labels, remove it
  const labelsNoMetadata = Object.fromEntries(
    Object.entries(labels[chainId]).map(([key, value]) => {
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
  await putObject(`labels/${chainId}.json`, string);
}
