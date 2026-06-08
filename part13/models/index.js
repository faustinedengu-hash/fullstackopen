const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList') // <-- Import middleman join table

// 1. One-to-Many Relationship (Blog Creator/Owner)
User.hasMany(Blog)
Blog.belongsTo(User)

// 2. Many-to-Many Relationship (Reading Lists)
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'listed_by' })

module.exports = {
  Blog, 
  User, 
  ReadingList
}