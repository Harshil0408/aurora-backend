const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../../database');
const Models = require('../../models/index');
const { checkExistsOrNotFunction, insertDataFunction, updateDataFunction, findOneSequelizeDataFunction } = require('../common/common.controller');
const { serviceToController } = require('../../helper/response.helper');
const { JWT_EXPIRES_AT, JWT_SECRET_KEY } = require('../../config/index');
const { generateSlug } = require('../../utils/utils');

const { user: UserModel, userProfile: UserProfile, sellerUser: SellerUserModel } = Models;

const userLoginService = async (userLoginData) => {
  try {
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

const sellerLoginService = async (userLoginData) => {
  try {
    const isUserExists = await checkExistsOrNotFunction({
      Model: UserModel,
      condition: { email: userLoginData.bodyData.email },
    });

    if (isUserExists.status === 0) {
      return serviceToController(0, null, 'Invalid email or password');
    }

    const user = isUserExists.data;

    if (user.role !== 1) {
      return serviceToController(0, null, 'This account is not a seller');
    }

    const isPasswordMatch = await bcrypt.compare(userLoginData.bodyData.password, user.password_hash);

    if (!isPasswordMatch) {
      return serviceToController(0, null, 'Invalid email or password');
    }

    const payload = {
      u_id: user.u_id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_AT });

    await updateDataFunction({
      Model: UserModel,
      condition: { u_id: user.u_id },
      data: { token, last_login_at: new Date().toISOString() },
    });

    const sellerData = await findOneSequelizeDataFunction({
      Model: SellerUserModel,
      condition: { user_id: user.u_id },
    });

    delete user.password_hash;

    const finalData = { ...user, sellerData: sellerData.data };

    return serviceToController(1, finalData, 'Seller login successful!');
  } catch (error) {
    console.error('sellerLoginService error:', error);
    return serviceToController(4, null, 'Internal server error');
  }
};

const userRegisterService = async (userRegisterData) => {
  try {
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

const registerSellerUserService = async (userRegisterData) => {
  const transaction = await database.transaction();
  try {
    const isUserExists = await checkExistsOrNotFunction({
      Model: UserModel,
      condition: { email: userRegisterData.bodyData.email },
    });

    if (isUserExists.status === 1) {
      return serviceToController(0, null, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(userRegisterData.bodyData.password, 10);

    const user = await insertDataFunction({
      Model: UserModel,
      data: {
        email: userRegisterData.bodyData.email,
        password_hash: hashedPassword,
        role: 1,
        provider: 0,
      },
      transaction,
    });

    if (user.status !== 1) {
      await transaction.rollback();
      return serviceToController(0, null, 'Seller registration failed');
    }

    const seller = await insertDataFunction({
      Model: SellerUserModel,
      data: {
        user_id: user.data.u_id,
        store_name: userRegisterData.bodyData.store_name,
        store_slug: generateSlug(userRegisterData.bodyData.store_name),
        description: userRegisterData.bodyData.description || null,
        logo_url: userRegisterData.bodyData.logo_url || null,
        banner_url: userRegisterData.bodyData.banner_url || null,
        business_email: userRegisterData.bodyData.business_email,
        business_phone: userRegisterData.bodyData.business_phone || null,
        gst_number: userRegisterData.bodyData.gst_number || null,
        tax_number: userRegisterData.bodyData.tax_number || null,
        pan_number: userRegisterData.bodyData.pan_number || null,
        bank_name: userRegisterData.bodyData.bank_name || null,
        bank_account_holder_name: userRegisterData.bodyData.bank_account_holder_name || null,
        bank_account_number: userRegisterData.bodyData.bank_account_number || null,
        bank_ifsc_code: userRegisterData.bodyData.bank_ifsc_code || null,
        address_line1: userRegisterData.bodyData.address_line1 || null,
        city: userRegisterData.bodyData.city || null,
        state: userRegisterData.bodyData.state || null,
        country: userRegisterData.bodyData.country || null,
        pincode: userRegisterData.bodyData.pincode || null,
      },
      transaction,
    });

    if (seller.status !== 1) {
      await transaction.rollback();
      return serviceToController(0, null, 'Seller registration failed');
    }

    await transaction.commit();

    const userData = { ...user.data, ...seller.data };
    delete userData.password_hash;

    return serviceToController(1, userData, 'Seller registered successfully!');
  } catch (error) {
    await transaction.rollback();
    return serviceToController(4, null, 'Internal server error');
  }
};

module.exports = {
  userLoginService,
  userRegisterService,
  registerSellerUserService,
  sellerLoginService,
};
