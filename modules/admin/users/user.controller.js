const { logger } = require('../../../utils/logger');
const ResponseHelper = require('../../../helper/response.helper');
const { validateRequestBody } = require('../../../utils/validation');
const { getUserForAdminService } = require('./user.service');

const getUserForAdminController = async (req, res) => {
  try {
    const requestData = { bodyData: req.body };

    const validObj = {
      page: 'number',
      per_page: 'number',
    };

    const validation = validateRequestBody(requestData.bodyData, validObj);

    if (validation.status) {
      const data = await getUserForAdminService(requestData);
      return ResponseHelper.controllerToResponse(res, data);
    } else {
      return ResponseHelper.controllerToResponse(res, validation.description);
    }
  } catch (error) {
    logger.error('============ERROR FROM userLoginController CONTROLLER============');
    logger.error(error);
    return ResponseHelper.internalServerError(res, 'Internal server error');
  }
};

module.exports = {
  getUserForAdminController,
};
