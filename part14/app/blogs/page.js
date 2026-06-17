import { getBlogs } from "../services/blogs";

export default function BlogsPage() {
  // 👇 Fetching data from our new service instead of hardcoding it here
  const blogs = getBlogs();

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blogs</h1>
        <a 
          href="/blogs/new" 
          className="bg-white text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-zinc-200 transition"
        >
          + New Blog
        </a>
      </div>
      
      <div className="space-y-4">
        {blogs.map((blog) => (
          <div 
            key={blog.id} 
            className="p-5 border border-zinc-800 bg-zinc-900/50 rounded-xl hover:border-zinc-700 transition-all"
          >
            <h2 className="text-xl font-semibold text-white mb-1">{blog.title}</h2>
            <p className="text-zinc-400 text-sm mb-3">By {blog.author}</p>
            <div className="flex justify-between items-center text-xs text-zinc-500">
              <a 
                href={blog.url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-blue-400 hover:underline"
              >
                Visit Blog →
              </a>
              <span className="bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md">
                👍 {blog.likes} likes
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}