const UserModel = require('./user.models');
const AdminUserModel = require('./admin_user.models');
const SellerUserModel = require('./seller_users.model');
const UserProfileModel = require('./user_profile.models');

module.exports = (database) => {
  const user = UserModel(database);
  const adminUser = AdminUserModel(database);
  const sellerUser = SellerUserModel(database);
  const userProfile = UserProfileModel(database);
  return { user, adminUser, sellerUser, userProfile };
};
