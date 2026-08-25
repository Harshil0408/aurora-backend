const Sequelize = require('sequelize');
const database = require('../database');

const SellerUserModel = database.define(
  'seller_users',
  {
    seller_id: {
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
    store_name: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    store_slug: {
      type: Sequelize.STRING(200),
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.STRING(3000),
      defaultValue: null,
    },
    logo_url: {
      type: Sequelize.STRING(500),
      defaultValue: null,
    },
    banner_url: {
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
    gst_number: {
      type: Sequelize.STRING(50),
      defaultValue: null,
      comment: 'GST / VAT registration number',
    },
    tax_number: {
      type: Sequelize.STRING(50),
      defaultValue: null,
    },
    pan_number: {
      type: Sequelize.STRING(50),
      defaultValue: null,
    },
    bank_name: {
      type: Sequelize.STRING(200),
      defaultValue: null,
    },
    bank_account_holder_name: {
      type: Sequelize.STRING(200),
      defaultValue: null,
    },
    bank_account_number: {
      type: Sequelize.STRING(50),
      defaultValue: null,
    },
    bank_ifsc_code: {
      type: Sequelize.STRING(20),
      defaultValue: null,
    },
    address_line1: {
      type: Sequelize.STRING(255),
      defaultValue: null,
    },
    city: {
      type: Sequelize.STRING(100),
      defaultValue: null,
    },
    state: {
      type: Sequelize.STRING(100),
      defaultValue: null,
    },
    country: {
      type: Sequelize.STRING(100),
      defaultValue: null,
    },
    pincode: {
      type: Sequelize.STRING(20),
      defaultValue: null,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = pending, 1 = approved, 2 = rejected, 3 = suspended',
    },
    commission_rate: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Platform commission percentage',
    },
    rating: {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total_products: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total_sales: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    wallet_balance: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    approved_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,

      references: {
        model: 'users',
        key: 'u_id',
      },

      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    approved_at: {
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
    tableName: 'seller_users',
    timestamps: false,
  }
);

module.exports = SellerUserModel;
