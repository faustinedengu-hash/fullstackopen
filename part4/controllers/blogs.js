const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user') // REQUIRED FOR EXERCISE 4.17

// EXERCISE 4.17: Populating the user data
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    // EXERCISE 4.17: Find a user to assign to the blog
    const user = await User.findOne()

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      // Safety check: if user exists, use their ID, else null (prevents test crashes)
      user: user ? user.id : null 
    })

    const savedBlog = await blog.save()

    // EXERCISE 4.17: Save the blog ID to the user's array
    if (user) {
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
    }

    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
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