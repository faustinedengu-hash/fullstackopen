const { DataTypes, Sequelize } = require('sequelize') // <-- Added Sequelize here

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'created_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW') // <-- Native Postgres default!
    })
    await queryInterface.addColumn('users', 'updated_at', {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW') // <-- Native Postgres default!
    })
  },
  
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'created_at')
    await queryInterface.removeColumn('users', 'updated_at')
  }
}