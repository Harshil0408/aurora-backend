const Sequelize = require('sequelize');
const database = require('../database');

const CartItemModel = database.define(
  'cart_items',
  {
    cart_item_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    cart_id: {
      type: Sequelize.INTEGER,
      allowNull: false,

      references: {
        model: 'carts',
        key: 'cart_id',
      },

      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,

      references: {
        model: 'products',
        key: 'product_id',
      },

      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    variant_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,

      references: {
        model: 'product_variants',
        key: 'variant_id',
      },

      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price_at_add: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Unit price captured when item was added',
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
    tableName: 'cart_items',
    timestamps: false,
  }
);

module.exports = CartItemModel;
