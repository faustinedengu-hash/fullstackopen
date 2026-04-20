const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => {
        return sum + blog.likes
      }, 0)
}
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const topAuthor = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b))

  return {
    author: topAuthor,
    blogs: counts[topAuthor]
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}

