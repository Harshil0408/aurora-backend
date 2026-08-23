'use strict';

const { addColumns, removeColumns } = require('../utils/column.util');

module.exports = {
  async up(queryInterface, Sequelize) {
    await addColumns(queryInterface, 'users', {
      auth_token: {
        type: Sequelize.STRING(500),
        allowNull: true,
        unique: true,
      },
    });
  },

  async down(queryInterface) {
    await removeColumns(queryInterface, 'users', ['auth_token']);
  },
};
