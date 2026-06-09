const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const Session = require('./session') // <-- 1. Import Session

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_marked' })

// 2. Add Session Associations
User.hasMany(Session)
Session.belongsTo(User)

// 3. Export Session
module.exports = {
  Blog, User, ReadingList, Session
}