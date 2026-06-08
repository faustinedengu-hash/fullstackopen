require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')

const app = express()
app.use(express.json()) // Modern built-in body parser

// 1. Initialize Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

// 2. Define the Blog Model (Modern Class Syntax)
class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

// 3. API Routes
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    res.json(blog)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      await blog.destroy()
      res.status(204).end() // 204 No Content is the modern standard for successful deletions
    } else {
      res.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
app.put('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      // Modern Sequelize: simply update the property and save
      blog.likes = req.body.likes
      await blog.save()
      res.json(blog)
    } else {
      res.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
// 4. Execute startup
const start = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Connection to PostgreSQL has been established successfully.')
    
    // This creates the table in your Neon DB if it doesn't exist
    await Blog.sync() 
    console.log('✅ Blog table synced successfully.')

    const port = process.env.PORT || 3001
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`)
    })
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error)
    process.exit(1)
  }
}

start()