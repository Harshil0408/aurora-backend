const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getModels } = require('../../models/index');
const { checkExistsOrNotFunction, insertDataFunction, updateDataFunction } = require('../common/common.controller');
const { serviceToController } = require('../../helper/response.helper');
const { JWT_EXPIRES_AT, JWT_SECRET_KEY } = require('../../config/index');

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
    const isPasswordMatch = await bcrypt.compare(userLoginData.bodyData.password, user.password_hash);

    if (!isPasswordMatch) {
      return serviceToController(0, null, 'Invalid email or password');
    }

    const payload = {
      u_id: user.u_id,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_AT });

    user.token = token;

    await updateDataFunction({
      Model: UserModel,
      condition: { u_id: user.u_id },
      data: { token, last_login_at: new Date().toISOString() },
    });

    delete user.password_hash;

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
