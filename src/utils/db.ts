import { createClient } from '@libsql/client';
import { eq } from 'drizzle-orm';
import { LibSQLDatabase, drizzle } from 'drizzle-orm/libsql';
import { Address, Hex } from 'viem';

import {
  type Label as LabelValues,
  type LabelSearch as LabelSearchValues,
  labels as tableLabels,
  labelSearch as tableLabelSearch,
} from '@/db/schema';
import { Label } from '@/index.js';
import { getNamespaceValue } from '@/labels/base';

import { ChainId } from './chains';

const databaseUrl = process.env.DATABASE_URL as string;

interface Log {
  data: Hex;
  topics: Hex[];
  blockNumber: number;
  logIndex: number;
}

type LabelWithAddress = Label & {
  address: Address;
};

async function removeLabels(chain: ChainId): Promise<void> {
  const db = getDb();
  await db
    .delete(tableLabelSearch)
    .where(eq(tableLabelSearch.chain, chain))
    .execute();
  await db.delete(tableLabels).where(eq(tableLabels.chain, chain)).execute();
}

async function addLabels(
  chain: ChainId,
  labels: LabelWithAddress[],
): Promise<void> {
  const db = getDb();
  const batchSize = 1_000;
  const batchCount = Math.ceil(labels.length / batchSize);
  for (let i = 0; i < batchCount; i++) {
    const batch = labels.slice(i * batchSize, (i + 1) * batchSize);
    const labelBatch: LabelValues[] = batch.map((label) => {
      return {
        chain,
        address: label.address,
        value: label.value,
        indexed: label.indexed,
        typeId: label.type,
        namespaceId: label.namespace,
        iconUrl: label.iconUrl,
      };
    });
    const rows = await db
      .insert(tableLabels)
      .values(labelBatch)
      .returning({ id: tableLabels.id });
    const rowIds = rows.map((row) => row.id as number);
    // Add indexed labels to the search index table
    const labelSearchBatch: LabelSearchValues[] = batch
      .map((label, index) => {
        return {
          rowid: rowIds[index],
          chain,
          value: label.namespace
            ? `${getNamespaceValue(label.namespace)}: ${label.value}`
            : label.value,
          indexed: label.indexed,
        };
      })
      .filter((label) => label.indexed)
      .map((label) => {
        const { rowid, chain, value } = label;
        return {
          rowid,
          chain,
          value,
        };
      });
    if (labelSearchBatch.length > 0) {
      await db.insert(tableLabelSearch).values(labelSearchBatch).execute();
    }
  }
}

function getDb(): LibSQLDatabase {
  const client = createClient({
    url: databaseUrl,
  });
  return drizzle(client);
}

export { removeLabels, addLabels };
export type { LabelWithAddress, Log };
