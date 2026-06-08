const router = require('express').Router()
const { User, Blog } = require('../models')

// GET /api/users - Lists all users and their created blogs (One-to-Many)
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

// Exercise 13.18: GET /api/users/:id - Get specific user profile and their reading list (Many-to-Many)
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Blog,
          as: 'readings', // <-- Matches the alias configured in models/index.js
          attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
          through: {
            attributes: ['isRead', 'id'] // <-- Cleanly shapes the readingList nesting payload
          }
        }
      ]
    })

    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ 
      where: { 
        username: req.params.username 
      } 
    })
    
    if (user) {
      user.username = req.body.username
      await user.save()
      res.json(user)
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router