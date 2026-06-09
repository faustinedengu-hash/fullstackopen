const { Session } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
    
    // NEW STATEFUL SECURITY CHECK: Does this token exist in the database?
    const session = await Session.findOne({
      where: { token: req.token }
    })

    if (!session) {
      return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' })
    }
    
  } else {
    return res.status(401).json({ error: 'Token missing' })
  }
  
  next()
}

module.exports = { tokenExtractor }