const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize') // <-- 1. Import Op from sequelize to handle advanced operators
const { Blog, User } = require('../models')

// Helper middleware/function to extract token from headers
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  }
  next()
}

// Exercise 13.21: GET /api/blogs - Lists all blogs with optional multi-column case-insensitive filtering
router.get('/', async (req, res) => {
  let whereClause = {}

  // If a ?search= query parameter exists, build a dynamic SQL OR query
  if (req.query.search) {
    whereClause = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%` // Case-insensitive substring match on Title
          }
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%` // Case-insensitive substring match on Author
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    where: whereClause, // <-- Applies the multi-column search filter dynamically
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

// Secure DELETE route checking creator ownership
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