import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./db/schema.js",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // 👇 We pasted the URL directly here and removed the channel_binding tag!
    url: "postgresql://neondb_owner:npg_a5TkYxqgtv8i@ep-dry-fog-ap7a5o5u-pooler.c-7.us-east-1.aws.neon.tech/part14?sslmode=require",
  },
})