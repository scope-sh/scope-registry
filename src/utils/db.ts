import { createClient } from '@libsql/client';
import { and, asc, eq } from 'drizzle-orm';
import { LibSQLDatabase, drizzle } from 'drizzle-orm/libsql';
import { Address, Hex } from 'viem';

import { type Label as LabelValues, labels, logs } from '@/db/schema';
import { Label } from '@/index.js';

import { ChainId } from './chains';

const databaseUrl = process.env.DATABASE_URL as string;

interface Log {
  data: Hex;
  topics: Hex[];
  blockNumber: number;
  logIndex: number;
}

async function getLogCache(
  chain: ChainId,
  address: Address,
  topic0: Hex,
): Promise<Log[]> {
  const db = getDb();
  const rows = await db
    .select({
      data: logs.data,
      topic0: logs.topic0,
      topic1: logs.topic1,
      topic2: logs.topic2,
      topic3: logs.topic3,
      blockNumber: logs.blockNumber,
      logIndex: logs.logIndex,
    })
    .from(logs)
    .where(
      and(
        eq(logs.chain, chain),
        eq(logs.address, address),
        eq(logs.topic0, topic0),
      ),
    )
    .orderBy(asc(logs.blockNumber), asc(logs.logIndex))
    .all();
  return rows.map((row) => {
    return {
      data: row.data as Hex,
      topics: [row.topic0, row.topic1, row.topic2, row.topic3].filter(
        (topic) => topic !== null,
      ) as Hex[],
      blockNumber: row.blockNumber,
      logIndex: row.logIndex,
    };
  });
}

async function setLogCache(
  chain: ChainId,
  address: Address,
  topic0: Hex,
  cache: Log[],
): Promise<void> {
  const db = getDb();
  await db
    .delete(logs)
    .where(
      and(
        eq(logs.chain, chain),
        eq(logs.address, address),
        eq(logs.topic0, topic0),
      ),
    )
    .execute();
  for (const log of cache) {
    await db
      .insert(logs)
      .values({
        chain,
        address,
        topic0,
        data: log.data,
        topic1: log.topics[0],
        topic2: log.topics[1],
        topic3: log.topics[2],
        blockNumber: log.blockNumber,
        logIndex: log.logIndex,
      })
      .execute();
  }
}

async function removeLabels(chain: ChainId): Promise<void> {
  const db = getDb();
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
  await db.insert(labels).values(values);
}

function getDb(): LibSQLDatabase {
  const client = createClient({
    url: databaseUrl,
  });
  return drizzle(client);
}

export { getLogCache, setLogCache, removeLabels, setLabel };
