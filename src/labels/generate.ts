import 'dotenv/config';

import type { ChainId } from '@/utils/chains.js';
import { putObject } from '@/utils/storage.js';

import { fetch as fetchLabels } from './sources/index.js';

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

await sleep(10 * 1000);
const labels = await fetchLabels();
for (const chainIdString in labels) {
  const chainId = parseInt(chainIdString) as ChainId;
  // Metadata is only used to generate the labels, remove it
  const labelsNoMetadata = Object.fromEntries(
    Object.entries(labels[chainId]).map(([key, value]) => {
      return [
        key,
        { type: value.type, value: value.value, namespace: value.namespace },
      ];
    }),
  );
  const string = JSON.stringify(labelsNoMetadata, null, 2);
  await putObject(`labels/${chainId}.json`, string);
}
