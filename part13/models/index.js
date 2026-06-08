const Blog = require('./blog')
const User = require('./user')

// Establish the One-to-Many relationship
User.hasMany(Blog)
Blog.belongsTo(User)

module.exports = {
  Blog, User
}