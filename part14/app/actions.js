"use server" // Enforces that all functions exported from this file run securely on the server

import { revalidatePath } from "next/cache"
import { createLiveTopic } from "@/services/topics"

export async function handleAddTopicAction(prevState, formData) {
  const title = formData.get("title")

  // 2026 Core Server-Side Input Validation Specification
  if (!title || title.trim().length < 5) {
    return {
      error: "Validation Failed: Topic title must be at least 5 characters long.",
      success: false
    }
  }

  try {
    // Send valid payload to service layer
    await createLiveTopic(title.trim())
    
    // Refresh client caches instantly
    revalidatePath("/")
    
    return {
      error: null,
      success: true
    }
  } catch (error) {
    return {
      error: "Database link failure. Could not preserve entry records.",
      success: false
    }
  }
}