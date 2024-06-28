import { integer, text, sqliteTable, index } from 'drizzle-orm/sqlite-core';

const labels = sqliteTable(
  'labels',
  {
    id: integer('id').primaryKey(),
    chain: integer('chain').notNull(),
    address: text('address').notNull(),
    value: text('value').notNull(),
    indexed: integer('indexed', { mode: 'boolean' }).notNull(),
    typeId: text('type_id'),
    namespaceId: text('namespace_id'),
    iconUrl: text('icon_url'),
  },
  (table) => {
    return {
      idx: index('idx_labels').on(table.chain, table.address),
    };
  },
);

const labelSearch = sqliteTable('label_search', {
  rowid: integer('rowid').primaryKey(),
  chain: integer('chain').notNull(),
  value: text('value').notNull(),
});

type Label = typeof labels.$inferInsert;
type LabelSearch = typeof labelSearch.$inferInsert;

export { labels, labelSearch };
export type { Label, LabelSearch };
