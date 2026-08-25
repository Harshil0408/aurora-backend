const Sequelize = require('sequelize');
const database = require('../database');

const CouponModel = database.define(
  'coupons',
  {
    coupon_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: null,
    },
    discount_type: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = flat amount, 1 = percentage',
    },
    discount_value: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    max_discount_amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
      comment: 'Cap for percentage coupons',
    },
    min_order_value: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    usage_limit: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: 'Total allowed uses, NULL = unlimited',
    },
    usage_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    per_user_limit: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    starts_at: {
      type: 'TIMESTAMP',
      allowNull: true,
      defaultValue: null,
    },
    expires_at: {
      type: 'TIMESTAMP',
      allowNull: true,
      defaultValue: null,
    },
    is_active: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '0 = inactive, 1 = active',
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
    tableName: 'coupons',
    timestamps: false,
  }
);

module.exports = CouponModel;
