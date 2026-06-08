const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

app.use(express.json())

// Hook up the routers
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

// Centralized Error Handling Middleware
const errorHandler = (error, req, res, next) => {
  console.error('❌ Error:', error.message)
  
  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
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