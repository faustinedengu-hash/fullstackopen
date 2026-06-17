import { notFound } from "next/navigation";
import { getBlogById } from "../../services/blogs";
import { likeBlog } from "../../blogActions"; // 👈 Import the Server Action
import Link from "next/link";

export default async function BlogPage({ params }) {
  const { id } = await params;
  const blog = getBlogById(id);

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
          <div className="flex items-center justify-center gap-6">
            <p className="text-3xl font-bold text-white">
              {blog.likes}
            </p>
            
            {/* 👇 The Form with the hidden input field! */}
            <form action={likeBlog}>
              <input type="hidden" name="id" value={blog.id} />
              <button 
                type="submit" 
                className="bg-zinc-100 hover:bg-white text-black px-4 py-2 rounded-md font-semibold transition"
              >
                👍 Like
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Link
          href="/blogs" 
          className="text-zinc-400 hover:text-white transition"
        >
          ← Back to all blogs
        </Link>
      </div>
    </div>
  );
}