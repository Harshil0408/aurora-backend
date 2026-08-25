const Sequelize = require('sequelize');
const database = require('../database');

const ProductImageModel = database.define(
  'product_images',
  {
    image_id: {
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
    image_url: {
      type: Sequelize.STRING(500),
      allowNull: false,
    },
    alt_text: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    sort_order: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    tableName: 'product_images',
    timestamps: false,
  }
);

module.exports = ProductImageModel;
