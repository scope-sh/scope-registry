import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

const labels = sqliteTable('labels', {
  id: integer('id').primaryKey(),
  address: text('address').notNull(),
  value: text('value').notNull(),
  typeId: text('typeId'),
  namespaceId: text('namespaceId'),
  iconUrl: text('iconUrl'),
});

// eslint-disable-next-line import/prefer-default-export
export { labels };
