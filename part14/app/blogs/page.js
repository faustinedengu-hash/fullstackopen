import Link from "next/link";
import { getBlogs } from "../services/blogs";

export default async function BlogsPage() {
  // 1. Get the blogs
  const blogs = getBlogs(); 

  // 2. Sort them in descending order (highest likes first)
  // We use [...blogs] to create a copy so we don't accidentally mutate the original array!
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-white">Blogs</h1>
      
      <div className="space-y-4">
        {/* 3. Map over the sorted array instead of the original one! */}
        {sortedBlogs.map((blog) => (
          <div key={blog.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-2">{blog.title}</h2>
            <p className="text-zinc-400 mb-4">By {blog.author}</p>
            
            <div className="flex items-center justify-between">
              <Link 
                href={`/blogs/${blog.id}`}
                className="text-blue-400 hover:text-blue-300 hover:underline transition"
              >
                Visit Blog →
              </Link>
              <div className="bg-zinc-800 px-3 py-1 rounded-full text-sm font-medium text-zinc-300">
                👍 {blog.likes} likes
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}