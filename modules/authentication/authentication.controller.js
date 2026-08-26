const { logger } = require('../../utils/logger');

const { validateRequestBody } = require('../../utils/validation');
const ResponseHelper = require('../../helper/response.helper');
const { NODE_ENV } = require('../../config/index');
const { userLoginService, userRegisterService, registerSellerUserService, sellerLoginService } = require('./authentication.service');

const userLoginController = async (req, res) => {
  try {
    const userLoginData = { bodyData: req.body };

    const validObj = {
      email: 'string',
      password: 'string',
    };

    const validation = validateRequestBody(userLoginData.bodyData, validObj);

    if (validation.status) {
      const data = await userLoginService(userLoginData);
      if (data.status === 1 && data.data && data.data.token) {
        res.cookie('accessToken', data.data.token, {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }
      return ResponseHelper.controllerToResponse(res, data);
    } else {
      return ResponseHelper.badRequest(res, null, validation.description);
    }
  } catch (error) {
    logger.error('============ERROR FROM userLoginController CONTROLLER============');
    logger.error(error);
    return ResponseHelper.internalServerError(res, 'Internal server error');
  }
};
const sellerLoginController = async (req, res) => {
  try {
    const sellerLoginData = { bodyData: req.body };

    const validObj = {
      email: 'string',
      password: 'string',
    };

    const validation = validateRequestBody(sellerLoginData.bodyData, validObj);

    if (validation.status) {
      const data = await sellerLoginService(sellerLoginData);
      if (data.status === 1 && data.data && data.data.token) {
        res.cookie('accessToken', data.data.token, {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }
      return ResponseHelper.controllerToResponse(res, data);
    } else {
      return ResponseHelper.badRequest(res, null, validation.description);
    }
  } catch (error) {
    logger.error('============ERROR FROM userLoginController CONTROLLER============');
    logger.error(error);
    return ResponseHelper.internalServerError(res, 'Internal server error');
  }
};

const registerUserController = async (req, res) => {
  try {
    const userRegisterData = {
      bodyData: req.body,
    };

    const validation = validateRequestBody(userRegisterData.bodyData, {
      first_name: 'string',
      last_name: 'string',
      phone: 'string',
      email: 'string',
      password: 'string',
    });

    if (!validation.status) {
      return ResponseHelper.badRequest(res, validation.description);
    } else {
      const data = await userRegisterService(userRegisterData);
      return ResponseHelper.controllerToResponse(res, data);
    }
  } catch (error) {
    logger.error('============ERROR FROM registerUserController CONTROLLER============');
    logger.error(error);
    return ResponseHelper.internalServerError(res, 'Internal server error');
  }
};

const registerSellerUserController = async (req, res) => {
  try {
    const userRegisterData = {
      bodyData: req.body,
    };

    const validObj = {
      first_name: 'string',
      last_name: 'string',
      phone: 'string',
      email: 'string',
      store_name: 'string',
      business_email: 'string',
      business_phone: 'string',
      gst_number: 'string',
      pan_number: 'string',
      bank_name: 'string',
      bank_account_holder_name: 'string',
      bank_account_number: 'string',
      bank_ifsc_code: 'string',
      address_line1: 'string',
      city: 'string',
      state: 'string',
      country: 'string',
      pincode: 'string',
    };

    const validation = validateRequestBody(userRegisterData.bodyData, validObj);

    if (!validation.status) {
      return ResponseHelper.badRequest(res, validation.description);
    } else {
      const data = await registerSellerUserService(userRegisterData);
      return ResponseHelper.controllerToResponse(res, data);
    }
  } catch (error) {
    logger.error('============ERROR FROM registerSellerUserController CONTROLLER============');
    logger.error(error);
    return ResponseHelper.internalServerError(res, 'Internal server error');
  }
};

module.exports = {
  userLoginController,
  registerUserController,
  registerSellerUserController,
  sellerLoginController,
};
