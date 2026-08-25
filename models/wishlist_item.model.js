const Sequelize = require('sequelize');
const database = require('../database');

const WishlistItemModel = database.define(
  'wishlist_items',
  {
    wishlist_item_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    wishlist_id: {
      type: Sequelize.INTEGER,
      allowNull: false,

      references: {
        model: 'wishlists',
        key: 'wishlist_id',
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
    tableName: 'wishlist_items',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['wishlist_id', 'product_id'],
      },
    ],
  }
);

module.exports = WishlistItemModel;
