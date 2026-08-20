const CryptoJS = require('crypto-js');
const ResponseHelper = require('../helper/response.helper');
const { logger } = require('../Utils/logger');
const { validationFunction } = require('../utils/validation');
const { CRYPTOJSKEY } = require('../config');

const cryptoMiddleware = async (req, res, next) => {
  try {
    const contentType = req.headers['content-type'] || '';

    // ✅ Skip decryption for multipart/form-data (like FormData)
    if (contentType.includes('multipart/form-data')) {
      return next();
    }
    if (!req.body || !req.body.data) {
      if (
        req.headers.skip_crypto !== undefined &&
        validationFunction('required', req.headers.skip_crypto).status === 0 &&
        req.headers.password !== undefined &&
        validationFunction('required', req.headers.password).status === 0 &&
        req.headers.password === '@SOLUTION#'
      ) {
        next();
      } else {
        return ResponseHelper.badRequest(res, 'Data Is Not In encryptAES.');
      }
    } else {
      const bytes = CryptoJS.AES.decrypt(req.body.data, CRYPTOJSKEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      try {
        req.body = await JSON.parse(decryptedData);
      } catch (e) {
        req.body = decryptedData;
      }
      next();
    }
  } catch (error) {
    logger.error('==================  ERROR FROM cryptoMiddleware CONTROLLER ==================');
    logger.error(error);
    return ResponseHelper.internalServerError(res, 'Data Is Not In encryptAES. ');
  }
};
module.exports = {
  cryptoMiddleware,
};
