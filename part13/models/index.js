const Blog = require('./blog')
const User = require('./user')

// Establish the One-to-Many relationship
User.hasMany(Blog)
Blog.belongsTo(User)

// Sync the tables and alter them to add the foreign key column
User.sync({ alter: true })
Blog.sync({ alter: true })

module.exports = {
  Blog, User
}