
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// GET all blogs - populated with user info
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

// POST a new blog
blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    const user = request.user // Assumes userExtractor middleware is used

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    // Populate user before sending back so frontend has the name immediately
    const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
    response.status(201).json(populatedBlog)
  } catch (exception) {
    next(exception)
  }
})

// DELETE a blog
blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = request.user 

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    // Check if the user trying to delete is the owner
    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'only the creator can delete this blog' })
    }
  } catch (exception) {
    next(exception)
  }
})

// PUT - Update likes
blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body

    const blog = {
      likes: body.likes,
      user: body.user // Keep the user reference
    }

    // Using returnDocument: 'after' to satisfy the Mongoose warning
    // Using populate so the frontend 'Remove' button logic still works
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id, 
      blog, 
      { returnDocument: 'after' } 
    ).populate('user', { username: 1, name: 1 })

    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter