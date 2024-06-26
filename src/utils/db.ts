import { createClient } from '@libsql/client';
import { and, asc, eq } from 'drizzle-orm';
import { LibSQLDatabase, drizzle } from 'drizzle-orm/libsql';
import { Address, Hex } from 'viem';

import {
  type Label as LabelValues,
  type LabelSearch as LabelSearchValues,
  labels,
  labelSearch,
  logs,
  logsMetadata,
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

interface LogMetadata {
  latestBlockNumber: number;
}

async function getLogMetadata(
  chain: ChainId,
  address: Address,
  topic0: Hex,
): Promise<LogMetadata | null> {
  const db = getDb();
  const rows = await db
    .select({
      latestBlockNumber: logsMetadata.latestBlockNumber,
    })
    .from(logsMetadata)
    .where(
      and(
        eq(logsMetadata.chain, chain),
        eq(logsMetadata.address, address),
        eq(logsMetadata.topic0, topic0),
      ),
    )
    .limit(1);
  const row = rows[0];
  if (!row) {
    return null;
  }
  return {
    latestBlockNumber: row.latestBlockNumber,
  };
}

async function setLogMetadata(
  chain: ChainId,
  address: Address,
  topic0: Hex,
  metadata: LogMetadata,
): Promise<void> {
  const db = getDb();
  await db
    .delete(logsMetadata)
    .where(
      and(
        eq(logsMetadata.chain, chain),
        eq(logsMetadata.address, address),
        eq(logsMetadata.topic0, topic0),
      ),
    )
    .execute();
  await db
    .insert(logsMetadata)
    .values({
      chain,
      address,
      topic0,
      latestBlockNumber: metadata.latestBlockNumber,
    })
    .execute();
}

async function getLogCache(
  chain: ChainId,
  address: Address,
  topic0: Hex,
): Promise<Log[]> {
  const PER_PAGE = 10_000;

  const db = getDb();
  let page = 0;
  let cache: Log[] = [];
  while (cache.length === page * PER_PAGE) {
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
      .limit(PER_PAGE)
      .offset(page * PER_PAGE)
      .all();
    const pageLogs = rows.map((row) => {
      return {
        data: row.data as Hex,
        topics: [row.topic0, row.topic1, row.topic2, row.topic3].filter(
          (topic) => topic !== null,
        ) as Hex[],
        blockNumber: row.blockNumber,
        logIndex: row.logIndex,
      };
    });
    cache = cache.concat(pageLogs);
    page++;
  }
  return cache;
}

async function appendLogCache(
  chain: ChainId,
  address: Address,
  topic0: Hex,
  newLogs: Log[],
): Promise<void> {
  const db = getDb();
  // Insert logs in batches
  const batchSize = 1000;
  const batchCount = Math.ceil(newLogs.length / batchSize);
  for (let i = 0; i < batchCount; i++) {
    const batch = newLogs.slice(i * batchSize, (i + 1) * batchSize);
    const batchRows = batch.map((log) => {
      return {
        chain,
        address,
        topic0,
        data: log.data,
        topic1: log.topics[1],
        topic2: log.topics[2],
        topic3: log.topics[3],
        blockNumber: log.blockNumber,
        logIndex: log.logIndex,
      };
    });
    await db.insert(logs).values(batchRows).execute();
  }
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

export {
  getLogMetadata,
  setLogMetadata,
  getLogCache,
  appendLogCache,
  removeLabels,
  setLabel,
};
export type { Log };
