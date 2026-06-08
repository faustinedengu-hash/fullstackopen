const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    // 1. Add columns as allowNull: true temporarily so Postgres doesn't complain about existing data
    await queryInterface.addColumn('blogs', 'created_at', {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    })
    await queryInterface.addColumn('blogs', 'updated_at', {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    })

    // 2. Set a fallback timestamp for all your existing rows right now
    const now = new Date()
    await queryInterface.bulkUpdate('blogs', {
      created_at: now,
      updated_at: now
    }, {
      created_at: null // Target only rows where it's currently empty
    })

    // 3. Now that no rows contain NULL, safely alter the columns to be NOT NULL
    await queryInterface.changeColumn('blogs', 'created_at', {
      type: DataTypes.DATE,
      allowNull: false
    })
    await queryInterface.changeColumn('blogs', 'updated_at', {
      type: DataTypes.DATE,
      allowNull: false
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'created_at')
    await queryInterface.removeColumn('blogs', 'updated_at')
  },
}