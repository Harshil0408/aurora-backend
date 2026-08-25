const Sequelize = require('sequelize');
const database = require('../database');

const BrandModel = database.define(
  'brands',
  {
    brand_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: Sequelize.STRING(150),
      allowNull: false,
      unique: true,
    },
    logo_url: {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: null,
    },
    description: {
      type: Sequelize.STRING(1000),
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
    tableName: 'brands',
    timestamps: false,
  }
);

module.exports = BrandModel;
