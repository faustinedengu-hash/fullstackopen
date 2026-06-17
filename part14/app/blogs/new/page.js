import { createBlog } from "../../blogActions";

export default function NewBlogPage() {
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Create a new blog</h1>
      
      {/* Passing the Server Action directly to the form */}
      <form action={createBlog} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Title
          </label>
          <input 
            type="text" 
            name="title" 
            required 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Author
          </label>
          <input 
            type="text" 
            name="author" 
            required 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            URL
          </label>
          <input 
            type="url" 
            name="url" 
            required 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-white focus:outline-none focus:border-white"
          />
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            className="bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-zinc-200 transition"
          >
            Create
          </button>
          <a 
            href="/blogs" 
            className="px-6 py-2 rounded-md font-semibold text-zinc-400 hover:text-white transition"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}