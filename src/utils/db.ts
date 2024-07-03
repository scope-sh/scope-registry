import { eq } from 'drizzle-orm';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
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

// eslint-disable-next-line import/no-named-as-default-member
const client = new pg.Client({
  connectionString: databaseUrl,
});
await client.connect();

async function removeLabels(chain: ChainId): Promise<void> {
  const db = getDb();
  await db.delete(tableLabels).where(eq(tableLabels.chain, chain));
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

async function disconnect(): Promise<void> {
  await client.end();
}

function getDb(): NodePgDatabase {
  return drizzle(client);
}

export { removeLabels, addLabels, disconnect };
export type { LabelWithAddress, Log };
