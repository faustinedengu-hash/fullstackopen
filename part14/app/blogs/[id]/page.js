import { notFound } from "next/navigation";
import { getBlogById } from "../../services/blogs";

export default async function BlogPage({ params }) {
  // Await the params to get the dynamic ID from the URL
  const { id } = await params;
  
  // Fetch the specific blog
  const blog = getBlogById(id);

  // If the user types a random URL like /blogs/999, show a 404 page
  if (!blog) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl font-bold mb-2 text-white">{blog.title}</h1>
      <p className="text-lg text-zinc-400 mb-8">By {blog.author}</p>
      
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 space-y-6">
        <div>
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            URL
          </p>
          <a 
            href={blog.url} 
            target="_blank" 
            rel="noreferrer" 
            className="text-blue-400 text-lg hover:underline"
          >
            {blog.url}
          </a>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            Likes
          </p>
          <p className="text-3xl font-bold text-white">
            {blog.likes}
          </p>
        </div>
      </div>
      
      <div className="mt-8">
        <a 
          href="/blogs" 
          className="text-zinc-400 hover:text-white transition"
        >
          ← Back to all blogs
        </a>
      </div>
    </div>
  );
}