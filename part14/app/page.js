import Link from "next/link" // <-- NEW: Imported native optimized link helper

export default function Home() {
  const topics = [
    { id: 1, title: "React Server Components", completed: true },
    { id: 2, title: "Next.js App Router & File Routing", completed: true },
    { id: 3, title: "Drizzle ORM & Postgres Mappings", completed: false },
    { id: 4, title: "NextAuth Stateful Session Control", completed: false }
  ]

  return (
    <div className="p-8 max-w-xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-white">Full Stack Open: Next.js</h1>
      <h2 className="text-xl font-semibold mb-4 text-gray-300">Course Core Topics</h2>
      
      <ul className="space-y-3">
        {topics.map(topic => (
          <li 
            key={topic.id} 
            className="p-4 rounded bg-zinc-900 border border-zinc-800 flex justify-between items-center transition-all hover:border-zinc-700"
          >
            {/* NEW: Title is now wrapped in a dynamic client-side link element */}
            <Link 
              href={`/topics/${topic.id}`} 
              className="text-gray-200 font-medium hover:text-green-400 hover:underline transition-colors"
            >
              {topic.title}
            </Link>
            
            <span className={`text-xs px-2 py-1 rounded font-bold ${
              topic.completed ? 'bg-green-950 text-green-400' : 'bg-amber-950 text-amber-400'
            }`}>
              {topic.completed ? 'Completed' : 'Planned'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}