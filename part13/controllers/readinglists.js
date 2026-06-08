const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { ReadingList } = require('../models')
const { SECRET } = require('../util/config')

// Helper middleware to isolate and extract the token payload securely
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

// POST /api/readinglists - Add a blog to a reading list
router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId } = req.body
    const readingListEntry = await ReadingList.create({ blogId, userId })
    res.json(readingListEntry)
  } catch (error) {
    next(error)
  }
})

// Exercise 13.19: PUT /api/readinglists/:id - Update reading status with authorization checks
router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const entry = await ReadingList.findByPk(req.params.id)
    
    if (!entry) {
      return res.status(404).json({ error: 'Reading list entry not found' })
    }

    // Access Control: Verify the logged-in user matches the owner of the reading list entry
    if (entry.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'Access denied: You can only update your own reading list' })
    }

    // Map incoming "read" value to the database column "isRead"
    if (req.body.read !== undefined) {
      entry.isRead = req.body.read
      await entry.save()
      return res.json(entry)
    }

    res.status(400).json({ error: 'Missing parameter: read' })
  } catch (error) {
    next(error)
  }
})

module.exports = router