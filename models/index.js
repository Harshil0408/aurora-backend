const { Op, QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../database');
const UserModel = require('./user.models');
const AdminUserModel = require('./admin_user.models');
const SellerUserModel = require('./seller_users.model');
const UserProfileModel = require('./user_profile.models');

UserModel.hasOne(UserProfileModel, {
  foreignKey: 'user_id',
  as: 'userProfile',
});

UserProfileModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

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
