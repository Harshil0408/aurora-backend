'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seller_users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'u_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      store_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      store_slug: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(3000),
        defaultValue: null,
      },
      logo_url: {
        type: Sequelize.STRING(500),
        defaultValue: null,
      },
      business_email: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
      },
      business_phone: {
        type: Sequelize.STRING(20),
        defaultValue: null,
      },
      tax_number: {
        type: Sequelize.STRING(50),
        defaultValue: null,
      },
      status: {
        type: Sequelize.INTEGER,
        comment: '0 = pending, 1 = approved, 2 = rejected, 3 = suspended',
      },
      commission_rate: {
        type: Sequelize.DECIMAL,
        defaultValue: null,
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('seller_users');
  },
};
