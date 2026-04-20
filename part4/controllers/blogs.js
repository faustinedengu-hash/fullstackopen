const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// --- REPLACE YOUR OLD POST ROUTE WITH THIS ---
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // This is the "Gatekeeper" that checks for Title and URL
  if (!body.title || !body.url) {
    return response.status(400).end()
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes // Mongoose will handle the default 0 if this is missing
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter