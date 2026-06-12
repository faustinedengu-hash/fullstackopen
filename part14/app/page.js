import Link from "next/link"
import { revalidatePath } from "next/cache" // <-- Native caching cleaner tool
import { getLiveTopics, createLiveTopic } from "@/services/topics"

export default async function Home() {
  const topics = await getLiveTopics()

  // NEW: Secure inline server action that handles form data payload natively
  async function handleAddTopic(formData) {
    "use server" // Marks this specific inner function to execute purely on the backend server
    
    const title = formData.get("title")
    if (!title || title.trim() === "") return

    // Push data over the network to our API layer
    await createLiveTopic(title)

    // Clear Next.js server data caches for the root path so the layout displays your new entry immediately!
    revalidatePath("/")
  }

  return (
    <div className="p-8 max-w-xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-white">Full Stack Open: Next.js</h1>
      
      {/* NEW: Core Mutation HTML Input Form Container */}
      <form action={handleAddTopic} className="mb-8 p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex gap-3">
        <input 
          type="text" 
          name="title" 
          required
          placeholder="Enter new module title..." 
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
        />
        <button 
          type="submit" 
          className="bg-green-600 hover:bg-green-500 text-black text-sm font-bold px-4 py-2 rounded transition-colors"
        >
          Add Topic
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4 text-gray-300">Active Topics Overview</h2>
      
      <ul className="space-y-3">
        {topics.map(topic => (
          <li 
            key={topic.id} 
            className="p-4 rounded bg-zinc-900 border border-zinc-800 flex justify-between items-center transition-all hover:border-zinc-700"
          >
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