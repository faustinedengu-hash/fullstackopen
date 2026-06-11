import { NextResponse } from "next/server"

const coreTopics = [
  { id: 1, title: "React Server Components", completed: true },
  { id: 2, title: "Next.js App Router & File Routing", completed: true },
  { id: 3, title: "Drizzle ORM & Postgres Mappings", completed: false },
  { id: 4, title: "NextAuth Stateful Session Control", completed: false }
]

export async function GET(request, { params }) {
  // Await the dynamic parameters promise
  const { id } = await params
  
  // Find the single topic object whose ID matches the route parameter
  const topic = coreTopics.find(t => t.id === parseInt(id))

  if (!topic) {
    return NextResponse.json(
      { error: `Topic with ID ${id} not found` },
      { status: 404 }
    )
  }

  return NextResponse.json(topic)
}