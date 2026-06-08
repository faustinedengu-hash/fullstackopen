const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Connection to PostgreSQL has been established successfully.')
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }