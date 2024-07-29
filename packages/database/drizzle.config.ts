import { type Config } from 'drizzle-kit';
const stage = process.env.STAGE || 'dev';

export default {
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? process.env.POSTGRES_URL!,
  },
  tablesFilter: [`8hourrelay_${stage}_*`],
} satisfies Config;
