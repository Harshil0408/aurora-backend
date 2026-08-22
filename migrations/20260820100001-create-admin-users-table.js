'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin_users', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        references: {
          model: 'users',
          key: 'u_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      admin_level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '0 = moderator, 1 = admin, 2 = super_admin',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('admin_users');
  },
};
