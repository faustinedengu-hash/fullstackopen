const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Blog, User } = require('../models')

// Helper middleware/function to extract token from headers
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  }
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['name', 'username']
    }
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET || 'secret')
    
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findByPk(decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

// Exercise 13.13: Secure DELETE route checking creator ownership
router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET || 'secret')
    
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid or missing' })
    }

    const blog = await Blog.findByPk(req.params.id)
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    // Check if the logged-in user is the creator of the blog
    if (blog.userId !== decodedToken.id) {
      return res.status(401).json({ error: 'only the creator can delete this blog' })
    }

    await blog.destroy()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      blog.likes = req.body.likes
      await blog.save()
      res.json(blog)
    } else {
      res.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router