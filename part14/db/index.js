import { pgPool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema"

// Instantiate a persistent connection pool using environment variables or fallback defaults
const pool = new pgPool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/fullstackopen",
})

export const db = drizzle(pool, { schema })