const Sequelize = require('sequelize');
const database = require('../database');

const AdminUserModel = database.define(
  'admin_users',
  {
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
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },

    updated_at: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
  },
  {
    tableName: 'admin_users',
    timestamps: false,
  }
);

module.exports = AdminUserModel;
