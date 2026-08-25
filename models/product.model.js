const Sequelize = require('sequelize');
const database = require('../database');

const ProductModel = database.define(
  'products',
  {
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    seller_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,

      references: {
        model: 'seller_users',
        key: 'seller_id',
      },

      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,

      references: {
        model: 'categories',
        key: 'category_id',
      },

      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    brand_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,

      references: {
        model: 'brands',
        key: 'brand_id',
      },

      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING(300),
      allowNull: false,
      unique: true,
    },
    sku: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    },
    short_description: {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: null,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    mrp: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
      comment: 'Original / list price before discount',
    },
    cost_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
    },
    currency: {
      type: Sequelize.STRING(10),
      allowNull: false,
      defaultValue: 'INR',
    },
    stock_quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    low_stock_threshold: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    weight_grams: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    tags: {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: null,
    },
    average_rating: {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
    },
    review_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sold_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    view_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '0 = inactive, 1 = active',
    },
    is_featured: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = normal, 1 = featured',
    },
    is_digital: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = physical product, 1 = digital product',
    },
    tax_percent: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
    published_at: {
      type: 'TIMESTAMP',
      allowNull: true,
      defaultValue: null,
    },
    deleted_at: {
      type: 'TIMESTAMP',
      allowNull: true,
      defaultValue: null,
      comment: 'Soft delete timestamp',
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
    tableName: 'products',
    timestamps: false,
  }
);

module.exports = ProductModel;
