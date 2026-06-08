const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const { DATABASE_URL } = require('./config')
const path = require('path') // <-- Import the native path utility

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

// Configure the programmatic migration runner with an absolute path
const migrationConf = {
  migrations: {
    // This points explicitly to the migrations folder inside part13
    glob: path.join(__dirname, '../migrations/*.js'),
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('🚀 Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('✅ Connection to PostgreSQL has been established successfully.')
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }