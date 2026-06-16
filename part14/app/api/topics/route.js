import { NextResponse } from "next/server"
import { db } from "@/db"                  // Import our initialized Drizzle client
import { topics } from "@/db/schema"       // Import our PostgreSQL table blueprint

// 1. GET ALL TOPICS FROM LIVE DATABASE
export async function GET() {
  try {
    // SELECT * FROM topics;
    const allTopics = await db.select().from(topics)
    return NextResponse.json(allTopics)
  } catch (error) {
    // 👇 THIS LINE WILL CATCH AND PRINT THE REAL POSTGRESQL ERROR
    console.error("🚨 POSTGRESQL CRASH LOG:", error) 
    
    return NextResponse.json(
      { error: "Database read failure. Could not fetch topics records." }, 
      { status: 500 }
    )
  }
}

// 2. INSERT A NEW TOPIC INTO LIVE DATABASE
export async function POST(request) {
  try {
    const body = await request.json()
    
    if (!body.title || body.title.trim() === "") {
      return NextResponse.json({ error: "Title parameter is strictly required" }, { status: 400 })
    }

    // INSERT INTO topics (title, completed) VALUES (body.title, false) RETURNING *;
    const [insertedTopic] = await db.insert(topics).values({
      title: body.title.trim(),
      completed: false
    }).returning() // .returning() fetches the freshly created row with its serial ID back from PG

    return NextResponse.json(insertedTopic, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Database write failure. Could not persist new entry records." }, 
      { status: 500 }
    )
  }
}