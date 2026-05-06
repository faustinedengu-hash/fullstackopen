const blogsRouter = require('express').Router() // <-- THIS MUST BE AT THE TOP
const Blog = require('../models/blog')
const User = require('../models/user')

// 1. GET all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// 2. POST a new blog
blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    const user = request.user

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

    const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
    response.status(201).json(populatedBlog)
  } catch (exception) {
    next(exception)
  }
})

// 3. DELETE a blog
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

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

// 4. UPDATE (Likes)
blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const blog = { likes: body.likes }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      .populate('user', { username: 1, name: 1 })
    response.json(updatedBlog)
  } catch (exception) {
    next(exception)
  }
})

// 5. NEW: Add a comment (Exercise 7.18)
blogsRouter.post('/:id/comments', async (request, response, next) => {
  try {
    const { comment } = request.body

    if (!comment) {
      return response.status(400).json({ error: 'comment is missing' })
    }

    const blog = await Blog.findById(request.params.id)
    
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    blog.comments = blog.comments ? blog.comments.concat(comment) : [comment]
    
    const updatedBlog = await blog.save()
    const populatedBlog = await updatedBlog.populate('user', { username: 1, name: 1 })
    
    response.status(201).json(populatedBlog)
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter