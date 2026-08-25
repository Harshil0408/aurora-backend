const Sequelize = require('sequelize');
const database = require('../database');

const UserModel = database.define(
  'users',
  {
    u_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'Null for social login only accounts',
    },
    provider: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = local, 1 = google, 2 = facebook, 3 = apple',
    },
    google_id: {
      type: Sequelize.STRING(100),
      unique: true,
      allowNull: true,
    },
    facebook_id: {
      type: Sequelize.STRING(100),
      unique: true,
      allowNull: true,
    },
    apple_id: {
      type: Sequelize.STRING(100),
      unique: true,
      allowNull: true,
    },
    auth_token: {
      type: Sequelize.STRING(500),
      unique: true,
      allowNull: true,
    },
    refresh_token: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    role: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = user, 1 = seller, 2 = admin',
    },
    is_active: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: '0 = inactive/blocked, 1 = active',
      defaultValue: 1,
    },
    is_verified: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: '0 = not verified, 1 = verified',
      defaultValue: 0,
    },
    email_verification_token: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    email_verified_at: {
      type: 'TIMESTAMP',
      allowNull: true,
      defaultValue: null,
    },
    password_reset_token: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    password_reset_expires_at: {
      type: 'TIMESTAMP',
      allowNull: true,
      defaultValue: null,
    },
    token: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    failed_login_attempts: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    locked_until: {
      type: 'TIMESTAMP',
      allowNull: true,
      defaultValue: null,
    },
    last_login_ip: {
      type: Sequelize.STRING(45),
      allowNull: true,
      defaultValue: null,
    },
    last_login_at: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
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
    tableName: 'users',
    timestamps: false,
  }
);

module.exports = UserModel;
