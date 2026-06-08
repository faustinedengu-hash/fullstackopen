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

// Exercise 13.12: Route protected by token authentication
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

router.delete('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      await blog.destroy()
      res.status(204).end()
    } else {
      res.status(404).json({ error: 'Blog not found' })
    }
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

module.exports = router // <-- The missing key!