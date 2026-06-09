const { Session, User } = require('../models') // <-- Imported User model

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
    
    // 1. STATEFUL SESSION CHECK: Does this token exist in the database?
    const session = await Session.findOne({
      where: { token: req.token }
    })

    if (!session) {
      return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' })
    }

    // 2. USER BANNED CHECK: Is the user associated with this session disabled?
    const user = await User.findByPk(session.userId)
    if (!user || user.disabled) {
      // Security measure: Optional but good practice to clean up the dead session
      await session.destroy() 
      return res.status(401).json({ error: 'User account is disabled. Access denied.' })
    }
    
  } else {
    return res.status(401).json({ error: 'Token missing' })
  }
  
  next()
}

module.exports = { tokenExtractor }