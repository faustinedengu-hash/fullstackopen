const jwt = require('jsonwebtoken')
const router = require('express').Router()
const User = require('../models/user')

router.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  // Since FSO doesn't use passwords for this exercise, we just check if the user exists
  if (!user) {
    return res.status(401).json({
      error: 'invalid username'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  // Sign the token using a secret key (we fallback to 'secret' if the env variable isn't set)
  const token = jwt.sign(userForToken, process.env.SECRET || 'secret')

  res
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router