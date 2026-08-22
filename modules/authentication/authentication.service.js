const UserModel = require('../../models/user.models');
const { checkExistsOrNotFunction } = require('../common/common.controller');
const userLoginService = async (userLoginData) => {
  try {
    const isUserExists = await checkExistsOrNotFunction({
      Model: UserModel,
      condition: { email: userLoginData.bodyData.email, password: userLoginData.bodyData.email },
    });

    console.log(isUserExists);
  } catch (error) {}
};

module.exports = {
  userLoginService,
};
