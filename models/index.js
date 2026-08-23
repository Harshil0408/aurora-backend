const UserModel = require('./user.models');
const AdminUserModel = require('./admin_user.models');
const SellerUserModel = require('./seller_users.model');
const UserProfileModel = require('./user_profile.models');

let models = null;

const loadModels = (database) => {
  const user = UserModel(database);
  const adminUser = AdminUserModel(database);
  const sellerUser = SellerUserModel(database);
  const userProfile = UserProfileModel(database);
  models = { user, adminUser, sellerUser, userProfile };
  return models;
};

const getModels = () => {
  if (models === null) {
    throw new Error('Models not initialized. Call loadModels(database) first.');
  }
  return models;
};

module.exports = { loadModels, getModels };
