// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL as string;

export default defineConfig({
  dialect: 'sqlite',
  dbCredentials: {
    url: databaseUrl,
  },
  schema: './src/db/schema.ts',
  out: './drizzle',
});
