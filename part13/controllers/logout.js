const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')

// DELETE /api/logout
router.delete('/', tokenExtractor, async (req, res, next) => {
  try {
    // Find the active session in the database
    const session = await Session.findOne({
      where: { token: req.token }
    })

    // If it exists, destroy it to revoke access completely
    if (session) {
      await session.destroy()
    }

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router