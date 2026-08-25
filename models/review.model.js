const Sequelize = require('sequelize');
const database = require('../database');

const ReviewModel = database.define(
  'reviews',
  {
    review_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,

      references: {
        model: 'users',
        key: 'u_id',
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

      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
      comment: '1 to 5 stars',
    },
    title: {
      type: Sequelize.STRING(200),
      allowNull: true,
      defaultValue: null,
    },
    comment: {
      type: Sequelize.STRING(2000),
      allowNull: true,
      defaultValue: null,
    },
    is_verified_purchase: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = no, 1 = yes',
    },
    is_approved: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '0 = pending moderation, 1 = approved',
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
    tableName: 'reviews',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'product_id'],
      },
    ],
  }
);

module.exports = ReviewModel;
