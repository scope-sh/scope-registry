import { createClient } from '@libsql/client';
import { eq } from 'drizzle-orm';
import { LibSQLDatabase, drizzle } from 'drizzle-orm/libsql';
import { Address, Hex } from 'viem';

import { type Label as LabelValues, labels as tableLabels } from '@/db/schema';
import { Label } from '@/index.js';

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
    await db.insert(tableLabels).values(labelBatch).execute();
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
