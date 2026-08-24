const { Op, QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../database');
const UserModel = require('./user.models');
const AdminUserModel = require('./admin_user.models');
const SellerUserModel = require('./seller_users.model');
const UserProfileModel = require('./user_profile.models');

module.exports = {
  user: UserModel,
  adminUser: AdminUserModel,
  sellerUser: SellerUserModel,
  userProfile: UserProfileModel,
  QueryTypes,
  sequelize,
  Sequelize,
  Op,
};
