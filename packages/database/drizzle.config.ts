import { type Config } from "drizzle-kit";
const stage = process.env.STAGE || "dev";

export default {
  dialect: "postgresql",
  schema: "./db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: [`8hourrelay_${stage}_*`],
} satisfies Config;
