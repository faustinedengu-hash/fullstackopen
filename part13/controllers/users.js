const router = require('express').Router()
const { User, Blog } = require('../models')

// GET /api/users - Lists all users and their created blogs
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

// Exercise 13.18 & 13.20: GET /api/users/:id - Get profile with optionally filtered reading list
router.get('/:id', async (req, res, next) => {
  try {
    // 1. Check if the 'read' query parameter was provided (?read=true or ?read=false)
    const whereClause = {}
    if (req.query.read !== undefined) {
      // Convert the incoming string 'true' or 'false' into a boolean value
      whereClause.isRead = req.query.read === 'true'
    }

    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Blog,
          as: 'readings',
          attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
          through: {
            attributes: ['isRead', 'id'],
            where: whereClause // <-- Dynamically applies filtering on the join table!
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