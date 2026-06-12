import { pgTable, serial, text, boolean } from "drizzle-orm/pg-core"

// Define the structural blueprint for our production PostgreSQL 'topics' table
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
})