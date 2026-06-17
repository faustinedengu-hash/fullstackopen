let blogs = [
  {
    id: "1",
    title: "React Components in Next.js",
    author: "Dan Abramov",
    url: "https://react.dev",
    likes: 42
  },
  {
    id: "2",
    title: "Mastering the App Router",
    author: "Lee Robinson",
    url: "https://nextjs.org/blog",
    likes: 87
  },
  {
    id: "3",
    title: "Drizzle ORM: The Clean SQL Way",
    author: "Alex Blokh",
    url: "https://orm.drizzle.team",
    likes: 55
  }
];

let nextId = 4;

export const getBlogs = () => {
  return blogs;
};

export const addBlog = (title, author, url) => {
  blogs.push({ 
    id: String(nextId++), 
    title, 
    author, 
    url, 
    likes: 0 // New blogs start with 0 likes
  });
};