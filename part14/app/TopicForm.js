"use client" // Marks this as a Client Component so it can use React hooks like useActionState

import { useActionState } from "react"
import { handleAddTopicAction } from "./actions" // We will create this secure action file next

// Initial state structure matching our error response scheme
const initialState = {
  error: null,
  success: false
}

export default function TopicForm() {
  // useActionState intercepts the action and provides the server response state down to our elements
  const [state, formAction, isPending] = useActionState(handleAddTopicAction, initialState)

  return (
    <div className="mb-8">
      <form action={formAction} className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex gap-3 items-center">
        <input 
          type="text" 
          name="title" 
          placeholder="Enter new module title (min 5 chars)..." 
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
        />
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-400 text-black text-sm font-bold px-4 py-2 rounded transition-colors shrink-0"
        >
          {isPending ? "Adding..." : "Add Topic"}
        </button>
      </form>

      {/* RENDER ERROR BANNER IF SERVER-SIDE VALIDATION FAILS */}
      {state?.error && (
        <div className="mt-2 p-3 bg-red-950/50 border border-red-900 rounded text-sm text-red-400 font-medium">
          ⚠️ {state.error}
        </div>
      )}
    </div>
  )
}