const router = require('express').Router()
const User = require('../models/user')

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    next(error) // Send errors (like duplicate usernames) to our error handler!
  }
})

module.exports = router