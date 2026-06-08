const router = require('express').Router()
const { User, Blog } = require('../models') // <-- Updated import

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] } // Exclude the raw foreign key for cleaner JSON
    }
  })
  res.json(users)
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