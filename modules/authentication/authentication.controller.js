const { logger } = require('../../utils/logger');

const { validateRequestBody } = require('../../utils/validation');
const ResponseHelper = require('../../helper/response.helper');
const { userLoginService, userRegisterService } = require('./authentication.service');

const userLoginController = async (req, res) => {
  try {
    const userLoginData = { bodyData: req.body };

    console.log('called');

    const validObj = {
      email: 'string',
      password: 'string',
    };

    const validation = validateRequestBody(userLoginData.bodyData, validObj);

    if (validation.status) {
      const data = await userLoginService(userLoginData);
      return ResponseHelper.controllerToResponse(res, data);
    } else {
      return ResponseHelper.badRequest(res, validation.description);
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
      console.log('data', data);
      return ResponseHelper.controllerToResponse(res, data);
    }
  } catch (error) {
    logger.error('============ERROR FROM registerUserController CONTROLLER============');
    logger.error(error);
    return ResponseHelper.internalServerError(res, 'Internal server error');
  }
};

module.exports = {
  userLoginController,
  registerUserController,
};
