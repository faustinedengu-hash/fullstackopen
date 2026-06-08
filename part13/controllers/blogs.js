const router = require('express').Router()
const { Blog, User } = require('../models') // <-- Now importing from the central index.js

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['name', 'username'] // We only pull the name and username, hiding the user's ID
    }
  })
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  try {
    // FSO Temporary Trick: Find the first user in the DB to attach to the new blog
    const user = await User.findOne()
    
    // Create the blog and attach the user's ID as the foreign key
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

module.exports = router