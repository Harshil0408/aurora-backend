const Sequelize = require('sequelize');
const database = require('../database');

const OrderModel = database.define(
  'orders',
  {
    order_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    order_number: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,

      references: {
        model: 'users',
        key: 'u_id',
      },

      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
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
    shipping_address: {
      type: Sequelize.TEXT,
      allowNull: false,
      comment: 'Snapshot of address at time of ordering (JSON)',
    },
    billing_address: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Snapshot of billing address at time of ordering (JSON)',
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = pending, 1 = confirmed, 2 = processing, 3 = shipped, 4 = delivered, 5 = cancelled, 6 = returned',
    },
    payment_status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = pending, 1 = paid, 2 = failed, 3 = refunded',
    },
    subtotal: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    },
    discount_amount: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    tax_amount: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    shipping_fee: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    grand_total: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    },
    currency: {
      type: Sequelize.STRING(10),
      allowNull: false,
      defaultValue: 'INR',
    },
    tracking_number: {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    courier_name: {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    cancel_reason: {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: null,
    },
    placed_at: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    shipped_at: {
      type: 'TIMESTAMP',
      allowNull: true,
      defaultValue: null,
    },
    delivered_at: {
      type: 'TIMESTAMP',
      allowNull: true,
      defaultValue: null,
    },
    cancelled_at: {
      type: 'TIMESTAMP',
      allowNull: true,
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
  },
  {
    tableName: 'orders',
    timestamps: false,
  }
);

module.exports = OrderModel;
