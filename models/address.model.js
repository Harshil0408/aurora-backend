const Sequelize = require('sequelize');
const database = require('../database');

const AddressModel = database.define(
  'addresses',
  {
    address_id: {
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
    address_type: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = home, 1 = work, 2 = other',
    },
    receiver_name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    alternate_phone: {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: null,
    },
    address_line1: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    address_line2: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    landmark: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    city: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: 'India',
    },
    pincode: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    is_default: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = normal, 1 = default address',
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
    tableName: 'addresses',
    timestamps: false,
  }
);

module.exports = AddressModel;
