'use strict';

const { addColumns, removeColumns } = require('../utils/column.util');

module.exports = {
  async up(queryInterface, Sequelize) {
    await addColumns(queryInterface, 'users', {
      token: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      google_client_id: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      auth_token: {
        type: Sequelize.STRING(500),
        allowNull: true,
        unique: true,
      },
    });
  },

  async down(queryInterface) {
    await removeColumns(queryInterface, 'users', ['token', 'google_client_id', 'auth_token']);
  },
};
