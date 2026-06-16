import { Pool } from "pg" 
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema"

// Force the connection strictly to the Neon cloud database
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_a5TkYxqgtv8i@ep-dry-fog-ap7a5o5u-pooler.c-7.us-east-1.aws.neon.tech/part14?sslmode=require",
})

export const db = drizzle(pool, { schema })