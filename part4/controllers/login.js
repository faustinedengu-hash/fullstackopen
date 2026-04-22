const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response, next) => {
  try {
    const { username, password } = request.body

    const user = await User.findOne({ username })
    
    // Check if user exists AND if the password matches the hash
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password'
      })
    }

    // The data we want to encode inside the token
    const userForToken = {
      username: user.username,
      id: user._id,
    }

    // Generate the token using the secret from .env
    const token = jwt.sign(userForToken, process.env.SECRET)

    // Send the token back to the user
    response
      .status(200)
      .send({ token, username: user.username, name: user.name })
      
  } catch (exception) {
    next(exception)
  }
})

module.exports = loginRouter