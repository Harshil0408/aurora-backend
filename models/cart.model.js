const Sequelize = require('sequelize');
const database = require('../database');

const CartModel = database.define(
  'carts',
  {
    cart_id: {
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
    coupon_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,

      references: {
        model: 'coupons',
        key: 'coupon_id',
      },

      onUpdate: 'SET NULL',
      onDelete: 'SET NULL',
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
    tableName: 'carts',
    timestamps: false,
  }
);

module.exports = CartModel;
