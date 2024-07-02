import {
  integer,
  serial,
  text,
  pgTable,
  index,
  boolean,
} from 'drizzle-orm/pg-core';

const labels = pgTable(
  'labels',
  {
    id: serial('id').primaryKey(),
    chain: integer('chain').notNull(),
    address: text('address').notNull(),
    value: text('value').notNull(),
    indexed: boolean('indexed').notNull(),
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

type Label = typeof labels.$inferInsert;

export { labels };
export type { Label };
