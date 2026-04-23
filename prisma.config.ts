import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL,
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
