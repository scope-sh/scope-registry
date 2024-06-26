import { createClient } from '@libsql/client';
import { eq } from 'drizzle-orm';
import { LibSQLDatabase, drizzle } from 'drizzle-orm/libsql';
import { Address, Hex } from 'viem';

import {
  type Label as LabelValues,
  type LabelSearch as LabelSearchValues,
  labels,
  labelSearch,
} from '@/db/schema';
import { Label } from '@/index.js';

import { ChainId } from './chains';

const databaseUrl = process.env.DATABASE_URL as string;

interface Log {
  data: Hex;
  topics: Hex[];
  blockNumber: number;
  logIndex: number;
}

async function removeLabels(chain: ChainId): Promise<void> {
  const db = getDb();
  await db.delete(labelSearch).where(eq(labelSearch.chain, chain)).execute();
  await db.delete(labels).where(eq(labels.chain, chain)).execute();
}

async function setLabel(
  chain: ChainId,
  address: Address,
  label: Label,
): Promise<void> {
  const db = getDb();
  const values: LabelValues = {
    chain,
    address,
    value: label.value,
    typeId: label.type?.id,
    namespaceId: label.namespace?.id,
    iconUrl: label.iconUrl,
  };
  const searchValues: LabelSearchValues = {
    chain,
    value: label.namespace
      ? `${label.namespace.value}: ${label.value}`
      : label.value,
  };
  await db.transaction(async (tx) => {
    await tx.insert(labels).values(values).execute();
    await tx.insert(labelSearch).values(searchValues).execute();
  });
}

function getDb(): LibSQLDatabase {
  const client = createClient({
    url: databaseUrl,
  });
  return drizzle(client);
}

export { removeLabels, setLabel };
export type { Log };
