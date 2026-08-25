const Sequelize = require('sequelize');
const database = require('../database');

const CategoryModel = database.define(
  'categories',
  {
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    parent_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,

      references: {
        model: 'categories',
        key: 'category_id',
      },

      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING(150),
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.STRING(1000),
      allowNull: true,
      defaultValue: null,
    },
    image_url: {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: null,
    },
    sort_order: {
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
    tableName: 'categories',
    timestamps: false,
  }
);

module.exports = CategoryModel;
