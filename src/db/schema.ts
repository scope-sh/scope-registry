import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

const labels = sqliteTable('labels', {
  id: integer('id').primaryKey(),
  address: text('address').notNull(),
  value: text('value').notNull(),
  typeId: text('typeId'),
  namespaceId: text('namespaceId'),
  iconUrl: text('iconUrl'),
});

const logs = sqliteTable('logs', {
  id: integer('id').primaryKey(),
  address: text('address').notNull(),
  blockNumber: integer('blockNumber').notNull(),
  logIndex: integer('logIndex').notNull(),
  topic0: text('topics'),
  topic1: text('topics'),
  topic2: text('topics'),
  topic3: text('topics'),
  data: text('data'),
});

export { labels, logs };
