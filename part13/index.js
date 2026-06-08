const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

// Import Routers
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const readingListsRouter = require('./controllers/readinglists') 

app.use(express.json())

// Hook up Routers
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/readinglists', readingListsRouter) 

// Centralized Error Handling Middleware
const errorHandler = (error, req, res, next) => {
  console.error('❌ Error:', error.message)
  
  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: error.message })
  }
  
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid or missing' })
  }
  
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