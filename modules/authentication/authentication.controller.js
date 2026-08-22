const { logger } = require('../../utils/logger');

const { validateRequestBody } = require('../../utils/validation');
const ResponseHelper = require('../../helper/response.helper');
const { userLoginService } = require('./authentication.service');

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
      return ResponseHelper.badRequest(res, data);
    } else {
      return ResponseHelper.badRequest(res, validation.description);
    }
  } catch (error) {
    logger.error('============ERROR FROM userLoginController CONTROLLER============');
    logger.error(error);
    return ResponseHelper.internalServerError(res, 'Invalid Call Try Again');
  }
};

module.exports = {
  userLoginController,
};
