import { NextResponse } from "next/server"

// Kept in global runtime cache memory for Chapter 2
const coreTopics = [
  { id: 1, title: "React Server Components", completed: true },
  { id: 2, title: "Next.js App Router & File Routing", completed: true },
  { id: 3, title: "Drizzle ORM & Postgres Mappings", completed: false },
  { id: 4, title: "NextAuth Stateful Session Control", completed: false }
]

export async function GET() {
  return NextResponse.json(coreTopics)
}

// NEW: Accept incoming JSON data payloads to create fresh topic items
export async function POST(request) {
  try {
    const body = await request.json()
    
    if (!body.title) {
      return NextResponse.json({ error: "Title parameter is strictly required" }, { status: 400 })
    }

    const newTopic = {
      id: coreTopics.length + 1,
      title: body.title,
      completed: false
    }

    coreTopics.push(newTopic)
    return NextResponse.json(newTopic, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Malformed request payload body" }, { status: 400 })
  }
}