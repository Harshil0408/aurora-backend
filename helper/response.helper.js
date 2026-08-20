const { CRYPTOJSKEY } = require('../config');
const { STATUS_SUCCESS, STATUS_ERROR } = require('../constants');

const success = (res, data, description = '', status = STATUS_SUCCESS) => {
  const newData = CryptoJS.AES.encrypt(JSON.stringify(data), CRYPTOJSKEY).toString();
  res.status(200).json({
    status,
    description,
    data: newData || null,
  });
};

const error = (res, data, description = '', status = STATUS_ERROR) => {
  const newData = CryptoJS.AES.encrypt(JSON.stringify(data), CRYPTOJSKEY).toString();
  res.status(200).json({
    status,
    description,
    data: newData || null,
  });
};

const badRequest = (res, data, description = '', status = STATUS_ERROR) => {
  const newData = CryptoJS.AES.encrypt(JSON.stringify(data), CRYPTOJSKEY).toString();
  res.status(400).json({
    status,
    description,
    data: newData || null,
  });
};

const invalidToken = (res, description = '', status = STATUS_ERROR) => {
  res.status(403).json({
    status,
    description: description || '',
  });
};

const serviceToController = (status, data, description) => {
  return {
    status,
    data,
    description,
  };
};

const internalServerError = (res, description, status = STATUS_ERROR) => {
  res.status(500).json({
    status,
    description: description || '',
  });
};

const okWithoutCJ = (res, data, description = '', status = STATUS_SUCCESS) => {
  res.status(200).json({
    status,
    description: description || '',
    data,
  });
};

const controllerToResponse = (res, data, withOutCj = false) => {
  if (data.status === 1) {
    if (withOutCj === true) {
      okWithoutCJ(res, data.data, data.description);
    } else {
      success(res, data.data, data.description);
    }
  } else if (data.status === 2) {
    error(res, data.data, data.description);
  } else if (data.status === 3) {
    badRequest(res, data.data, data.description);
  } else if (data.status === 4) {
    internalServerError(res, data.description);
  }
};

module.exports = {
  success,
  error,
  invalidToken,
  internalServerError,
  serviceToController,
  badRequest,
  okWithoutCJ,
  controllerToResponse,
};
