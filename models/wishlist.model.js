const Sequelize = require('sequelize');
const database = require('../database');

const WishlistModel = database.define(
  'wishlists',
  {
    wishlist_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,

      references: {
        model: 'users',
        key: 'u_id',
      },

      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
    tableName: 'wishlists',
    timestamps: false,
  }
);

module.exports = WishlistModel;
