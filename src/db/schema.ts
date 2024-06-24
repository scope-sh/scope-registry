import { integer, text, sqliteTable, index } from 'drizzle-orm/sqlite-core';

const labels = sqliteTable(
  'labels',
  {
    id: integer('id').primaryKey(),
    chain: integer('chain').notNull(),
    address: text('address').notNull(),
    value: text('value').notNull(),
    typeId: text('typeId'),
    namespaceId: text('namespaceId'),
    iconUrl: text('iconUrl'),
  },
  (table) => {
    return {
      idx: index('idx_labels').on(table.chain, table.address, table.typeId),
    };
  },
);

const labelSearch = sqliteTable('label_search', {
  rowid: integer('rowid').primaryKey(),
  chain: integer('chain').notNull(),
  value: text('value').notNull(),
});

const logs = sqliteTable(
  'logs',
  {
    id: integer('id').primaryKey(),
    chain: integer('chain').notNull(),
    address: text('address').notNull(),
    blockNumber: integer('blockNumber').notNull(),
    logIndex: integer('logIndex').notNull(),
    topic0: text('topic0'),
    topic1: text('topic1'),
    topic2: text('topic2'),
    topic3: text('topic3'),
    data: text('data'),
  },
  (table) => {
    return {
      idx: index('idx_logs').on(table.chain, table.address, table.topic0),
    };
  },
);

const logsMetadata = sqliteTable(
  'logs_metadata',
  {
    id: integer('id').primaryKey(),
    chain: integer('chain').notNull(),
    address: text('address').notNull(),
    topic0: text('topic0'),
    latestBlockNumber: integer('latestBlockNumber').notNull(),
  },
  (table) => {
    return {
      idx: index('idx_logs_metadata').on(
        table.chain,
        table.address,
        table.topic0,
      ),
    };
  },
);

type Label = typeof labels.$inferInsert;
type LabelSearch = typeof labelSearch.$inferInsert;

export { labels, labelSearch, logs, logsMetadata };
export type { Label, LabelSearch };
