const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')

app.use(express.json())

// Hook up the router
app.use('/api/blogs', blogsRouter)

// Exercise 13.7: Centralized Error Handling Middleware
const errorHandler = (error, req, res, next) => {
  console.error('❌ Error:', error.message)
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  }
  
  // Default to 500 for unhandled errors
  res.status(500).json({ error: 'Something went wrong' })
}

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
  })
}

start()