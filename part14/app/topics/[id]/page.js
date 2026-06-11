export default async function TopicDetailPage({ params }) {
  // Unwrapping the dynamic parameters promise
  const { id } = await params

  // Dummy mock data matching our homepage array to simulate database lookup
  const topicsData = {
    "1": { title: "React Server Components", completed: true, details: "Components default to rendering on the server side to minimize client bundles." },
    "2": { title: "Next.js App Router & File Routing", completed: true, details: "Routing is dictated fully by the file system layout using page.js markers." },
    "3": { title: "Drizzle ORM & Postgres Mappings", completed: false, details: "Type-safe database relations and querying natively embedded inside server views." },
    "4": { title: "NextAuth Stateful Session Control", completed: false, details: "Enforcing absolute security checks on user state across layout transitions." }
  }

  const topic = topicsData[id]

  if (!topic) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-500">Topic Not Found</h1>
        <p className="text-zinc-400 mt-2">The topic ID #{id} does not exist in the 2026 curriculum.</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-xl mx-auto font-sans">
      <div className="mb-4">
        <span className={`text-xs px-2 py-1 rounded font-bold ${
          topic.completed ? 'bg-green-950 text-green-400' : 'bg-amber-950 text-amber-400'
        }`}>
          {topic.completed ? 'Completed Module' : 'Planned Module'}
        </span>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-white">{topic.title}</h1>
      <p className="text-zinc-300 leading-relaxed bg-zinc-900 border border-zinc-800 p-4 rounded">
        {topic.details}
      </p>
    </div>
  )
}