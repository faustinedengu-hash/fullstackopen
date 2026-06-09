const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { User, Session } = require('../models') // <-- Import both models from index.js

router.post('/', async (req, res, next) => {
  try {
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

    // Sign the token using a secret key
    const token = jwt.sign(userForToken, process.env.SECRET || 'secret')

    // NEW: Save the active session into the database
    await Session.create({
      userId: user.id,
      token: token
    })

    res
      .status(200)
      .send({ token, username: user.username, name: user.name })
  } catch (error) {
    next(error)
  }
})

module.exports = router