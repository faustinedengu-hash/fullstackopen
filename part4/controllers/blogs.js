const jwt = require('jsonwebtoken') 
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// EXERCISE 4.17: Populating the user data
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    
    // 1. Get the token from the request
const decodedToken = jwt.verify(request.token, process.env.SECRET)
    // 2. Check if the token is valid and has an ID
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    
    // 3. Find the specific user who owns this token!
    const user = await User.findById(decodedToken.id)

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

    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    // 1. Verify the token first
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    // 2. Find the blog in the database
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    // 3. Check if the person trying to delete it is the creator
    // We have to use .toString() because the IDs are objects in MongoDB!
    if (blog.user.toString() === decodedToken.id.toString()) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'only the creator can delete this blog' })
    }
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body

    const blog = {
      likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter