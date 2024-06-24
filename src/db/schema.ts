import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

const labels = sqliteTable('labels', {
  id: integer('id').primaryKey(),
  chain: integer('chain').notNull(),
  address: text('address').notNull(),
  value: text('value').notNull(),
  typeId: text('typeId'),
  namespaceId: text('namespaceId'),
  iconUrl: text('iconUrl'),
});

const logs = sqliteTable('logs', {
  id: integer('id').primaryKey(),
  chain: integer('chain').notNull(),
  address: text('address').notNull(),
  blockNumber: integer('blockNumber').notNull(),
  logIndex: integer('logIndex').notNull(),
  topic0: text('topics'),
  topic1: text('topics'),
  topic2: text('topics'),
  topic3: text('topics'),
  data: text('data'),
});

const logsMetadata = sqliteTable('logs_metadata', {
  id: integer('id').primaryKey(),
  chain: integer('chain').notNull(),
  address: text('address').notNull(),
  topic0: text('topics'),
  latestBlockNumber: integer('latestBlockNumber').notNull(),
});

type Label = typeof labels.$inferInsert;

export { labels, logs, logsMetadata };
export type { Label };
