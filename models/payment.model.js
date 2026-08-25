const Sequelize = require('sequelize');
const database = require('../database');

const PaymentModel = database.define(
  'payments',
  {
    payment_id: {
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
      onDelete: 'RESTRICT',
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
    payment_method: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = COD, 1 = card, 2 = UPI, 3 = net_banking, 4 = wallet',
    },
    gateway_name: {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: null,
      comment: 'e.g. razorpay, stripe, payu',
    },
    gateway_order_id: {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    gateway_payment_id: {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    amount: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    },
    currency: {
      type: Sequelize.STRING(10),
      allowNull: false,
      defaultValue: 'INR',
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = initiated, 1 = success, 2 = failed, 3 = refunded',
    },
    refunded_amount: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    gateway_response: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Raw gateway response (JSON)',
    },
    paid_at: {
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
    tableName: 'payments',
    timestamps: false,
  }
);

module.exports = PaymentModel;
