const router = require('express').Router()
const { ReadingList } = require('../models')

// Exercise 13.17: Add a blog to a user's reading list
router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId } = req.body
    
    // Create the entry inside our middleman join table
    const readingListEntry = await ReadingList.create({ 
      blogId, 
      userId 
    })
    
    res.json(readingListEntry)
  } catch (error) {
    next(error)
  }
})

module.exports = router // <-- Exports the router safely!