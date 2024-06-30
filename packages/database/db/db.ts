// import { drizzle } from 'drizzle-orm/vercel-postgres';
// import { sql } from '@vercel/postgres';
import * as schema from './schema';
// import postgres from 'postgres';

// import dotenv from 'dotenv';

// dotenv.config();

// Use this object to send drizzle queries to your DB
// export const db = drizzle(sql, { schema });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString!, { prepare: false });
export const db = drizzle(client, { schema });
