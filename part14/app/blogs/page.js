import Link from "next/link";
import { getBlogs } from "../services/blogs";

export default async function BlogsPage({ searchParams }) {
  // 1. Get the blogs
  const blogs = getBlogs();

  // 2. Safely read the 'filter' parameter from the URL if it exists
  const queryParams = await searchParams;
  const filterText = queryParams?.filter || "";

  // 3. Filter blogs by title if a search term is present
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(filterText.toLowerCase())
  );

  // 4. Sort the filtered blogs in descending order (highest likes first)
  const sortedBlogs = [...filteredBlogs].sort((a, b) => b.likes - a.likes);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-white">Blogs</h1>

      {/* Search Feature Form */}
      <form action="/blogs" method="GET" className="flex gap-2 mb-8">
        <input
          type="text"
          name="filter"
          defaultValue={filterText}
          placeholder="Search blogs by title..."
          className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition"
        >
          Search
        </button>
      </form>
      
      <div className="space-y-4">
        {sortedBlogs.length === 0 ? (
          <p className="text-zinc-500 text-center py-4">No blogs found matching that title.</p>
        ) : (
          sortedBlogs.map((blog) => (
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
          ))
        )}
      </div>
    </div>
  );
}