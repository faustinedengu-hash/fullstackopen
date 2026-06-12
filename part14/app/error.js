"use client" // Error boundaries must strictly be Client Components

import { useEffect } from "react"

export default function GlobalErrorTrigger({ error, reset }) {
  useEffect(() => {
    // Log the intercepted system exception securely to an admin logging terminal
    console.error("Intercepted Route Exception:", error)
  }, [error])

  return (
    <div className="p-8 max-w-xl mx-auto font-sans text-center mt-12">
      <div className="bg-zinc-950 border border-red-900 rounded-xl p-8 shadow-2xl">
        <div className="text-4xl mb-4">💥</div>
        <h1 className="text-2xl font-bold text-red-500 mb-2">Unexpected Runtime Error</h1>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          An unhandled error occurred while trying to render this path segment view. 
          The runtime engine has blocked full-system deterioration.
        </p>
        
        {/* RE-TRY EXECUTION TRIGGER BUTTON */}
        <button
          onClick={() => reset()} // Next.js will attempt to re-render the server route section
          className="bg-red-900 hover:bg-red-800 text-red-100 text-xs font-mono font-bold px-4 py-2 rounded border border-red-700 transition-colors"
        >
          Recover Engine (Try Again)
        </button>
      </div>
    </div>
  )
}