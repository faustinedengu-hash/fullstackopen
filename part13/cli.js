require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false // This stops Sequelize from printing raw SQL commands to the terminal
})

const printBlogs = async () => {
  try {
    // FSO wants us to use a raw query for this specific exercise
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    
    // Print each blog in the exact format: "Author: 'Title', Likes"
    blogs.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })
    
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  } finally {
    // Always close the connection in a standalone script so the terminal doesn't hang!
    await sequelize.close()
  }
}

printBlogs()