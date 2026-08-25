const Sequelize = require('sequelize');
const database = require('../database');

const ProductVariantModel = database.define(
  'product_variants',
  {
    variant_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
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
    sku: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    },
    attribute_name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      comment: 'e.g. Size, Color',
    },
    attribute_value: {
      type: Sequelize.STRING(100),
      allowNull: false,
      comment: 'e.g. XL, Red',
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    stock_quantity: {
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
    tableName: 'product_variants',
    timestamps: false,
  }
);

module.exports = ProductVariantModel;
