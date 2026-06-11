import { NextResponse } from "next/server"

// Hardcoded collection to simulate a live database payload for Chapter 1
const coreTopics = [
  { id: 1, title: "React Server Components", completed: true },
  { id: 2, title: "Next.js App Router & File Routing", completed: true },
  { id: 3, title: "Drizzle ORM & Postgres Mappings", completed: false },
  { id: 4, title: "NextAuth Stateful Session Control", completed: false }
]

export async function GET() {
  // NextResponse.json automatically sets headers to 'application/json' and returns status 200
  return NextResponse.json(coreTopics)
}