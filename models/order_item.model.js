const Sequelize = require('sequelize');
const database = require('../database');

const OrderItemModel = database.define(
  'order_items',
  {
    order_item_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: Sequelize.INTEGER,
      allowNull: false,

      references: {
        model: 'orders',
        key: 'order_id',
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

      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    },
    variant_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,

      references: {
        model: 'product_variants',
        key: 'variant_id',
      },

      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    },
    seller_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,

      references: {
        model: 'seller_users',
        key: 'seller_id',
      },

      onUpdate: 'RESTRICT',
      onDelete: 'RESTRICT',
    },
    product_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: 'Snapshot of product name at purchase time',
    },
    sku: {
      type: Sequelize.STRING(100),
      allowNull: false,
      comment: 'Snapshot of SKU at purchase time',
    },
    variant_details: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
      comment: 'e.g. Size: XL, Color: Red',
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unit_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    total_price: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    },
    item_status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = pending, 1 = confirmed, 2 = processing, 3 = shipped, 4 = delivered, 5 = cancelled, 6 = returned',
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
    tableName: 'order_items',
    timestamps: false,
  }
);

module.exports = OrderItemModel;
