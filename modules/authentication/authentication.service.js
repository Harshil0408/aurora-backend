const { getModels } = require('../../models/index');
const { checkExistsOrNotFunction, insertDataFunction } = require('../common/common.controller');
const { serviceToController } = require('../../helper/response.helper');
const bcrypt = require('bcrypt');

const userLoginService = async (userLoginData) => {
  try {
    const { user: UserModel } = getModels();
    const isUserExists = await checkExistsOrNotFunction({
      Model: UserModel,
      condition: { email: userLoginData.bodyData.email },
    });

    if (isUserExists.status === 0) {
      return serviceToController(0, null, 'Invalid email or password');
    }

    const user = isUserExists.data;
    if (user.password_hash !== userLoginData.bodyData.password) {
      return serviceToController(0, null, 'Invalid email or password');
    }

    return serviceToController(1, user, 'Login successful!');
  } catch (error) {
    return serviceToController(4, null, 'Internal server error');
  }
};

const userRegisterService = async (userRegisterData) => {
  try {
    const { user: UserModel, userProfile: UserProfile } = getModels();

    const isUserExists = await checkExistsOrNotFunction({
      Model: UserModel,
      condition: { email: userRegisterData.bodyData.email },
    });

    if (isUserExists.status === 1) {
      console.log('called');
      return serviceToController(0, null, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(userRegisterData.bodyData.password, 10);

    const userData = {
      email: userRegisterData.bodyData.email,
      password_hash: hashedPassword,
    };

    const user = await insertDataFunction({
      Model: UserModel,
      data: userData,
    });

    await insertDataFunction({
      Model: UserProfile,
      data: {
        user_id: user.data.u_id,
        first_name: userRegisterData.bodyData.first_name,
        last_name: userRegisterData.bodyData.last_name,
        phone: userRegisterData.bodyData.phone,
      },
    });

    return serviceToController(1, user.data, 'User registered successfully!');
  } catch (error) {
    return serviceToController(0, null, 'Internal server error');
  }
};

module.exports = {
  userLoginService,
  userRegisterService,
};
