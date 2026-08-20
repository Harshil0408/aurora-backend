const moment = require('moment/moment');
const ResponseHelpers = require('../helper/response.helper');
const {
  EMAIL_VALIDATION_REGEX,
  MOBILE_VALIDATION_REGEX,
  ACCOUNT_NO_VALIDATION_REGEX,
  IFSC_CODE_VALIDATION_REGEX,
  TIME_VALIDATION_REGEX,
} = require('../constants');
const { logger } = require('./logger');
const validationFunction = (type, value, message = '', regex = null) => {
  try {
    const validationObj = { error: 0, message: '' };
    // requireField validation
    if (type === 'required') {
      if (value === '' || value === null || value === 'null' || value.trim().length === 0) {
        validationObj.error = 1;
        validationObj.message = message;
      }
    }
    if (type === 'num_required') {
      if (value === undefined || value === null || value === '0' || value === '') {
        validationObj.error = 1;
        validationObj.message = message;
      }
    }
    if (type === 'email') {
      if (!EMAIL_VALIDATION_REGEX.test(String(value).toLowerCase())) {
        validationObj.error = 1;
        validationObj.message = message;
      }
    }
    if (type === 'mobile') {
      if (!MOBILE_VALIDATION_REGEX.test(value)) {
        validationObj.error = 1;
        validationObj.message = message;
      }
    }
    if (type === 'permissionList') {
      if (value === undefined || value === 'undefined' || typeof value === 'undefined') {
        validationObj.error = 1;
        validationObj.message = message;
      }
    }
    if (type === 'date') {
      if (value === null || value === '' || value.trim().length === 0 || moment(value, regex, true).isValid() === false) {
        validationObj.error = 1;
        validationObj.message = message;
      }
    }
    if (type === 'account_no') {
      if (!ACCOUNT_NO_VALIDATION_REGEX.test(value)) {
        validationObj.error = 1;
        validationObj.message = message;
      }
    }
    if (type === 'ifsc_code') {
      if (!IFSC_CODE_VALIDATION_REGEX.test(value)) {
        validationObj.error = 1;
        validationObj.message = message;
      }
    }
    return ResponseHelpers.serviceToController(validationObj.error, [], validationObj.message);
  } catch (error) {
    logger.error('==========ERROR FROM Common ValidationFunction ============');
    logger.error(error);
    return ResponseHelpers.serviceToController(0, [], 'ERROR FROM Common ValidationFunction');
  }
};

const removeSpace = (data) => {
  return Object.entries(data).reduce((obj, [key, values]) => {
    const strValue = values === null ? (values = '') : values.toString();
    obj[key] = strValue.trim();
    return obj;
  }, {});
};

// validation.js
// {
//   g_type: 'number',
//   g_id: 'number',
//   slotsData: {
//     type: 'array',
//     fields: {
//       slot_date: { type: 'date', format: DD_MM_YYYY },
//       slot_start_time: { type: 'time', format: HH_MM },
//       slot_end_time: { type: 'time', format: HH_MM },
//       price: 'number'
//     }
//   }
// this function return status and description
const validateRequestBody = (body, requiredFields) => {
  const validateValue = (key, value, type, path = '', format = '') => {
    const currentPath = path ? `${path}.${key}` : key;

    if (value === undefined || value === null || value === '' || value === 'null') {
      return { status: false, description: `${currentPath} is required` };
    }

    switch (type) {
      case 'number':
        if (isNaN(value) || typeof value !== 'number') {
          return { status: false, description: `${currentPath} must be a valid number` };
        }
        break;
      case 'price':
        if (isNaN(value) || typeof value !== 'number' || value <= 0) {
          return { status: false, description: `${currentPath} must be a valid price` };
        }
        break;
      case 'string':
        if (typeof value !== 'string' || value.trim().length === 0) {
          return { status: false, description: `${currentPath} must be a valid non-empty string` };
        }
        break;
      case 'email':
        if (!EMAIL_VALIDATION_REGEX.test(String(value).toLowerCase())) {
          return { status: false, description: `${currentPath} must be a valid email address` };
        }
        break;
      case 'mobile':
        if (!MOBILE_VALIDATION_REGEX.test(value)) {
          return { status: false, description: `${currentPath} must be a valid mobile number` };
        }
        break;
      case 'account_no':
        if (!ACCOUNT_NO_VALIDATION_REGEX.test(value)) {
          return { status: false, description: `${currentPath} must be a valid account number` };
        }
        break;
      case 'ifsc_code':
        if (!IFSC_CODE_VALIDATION_REGEX.test(value)) {
          return { status: false, description: `${currentPath} must be a valid IFSC code` };
        }
        break;
      case 'date':
        if (!moment(value, format, true).isValid()) {
          return { status: false, description: `${currentPath} must be a valid date in ${format} format` };
        }
        break;
      case 'time':
        if (!moment(value, format, true).isValid() && !TIME_VALIDATION_REGEX.test(value)) {
          return { status: false, description: `${currentPath} must be a valid time in ${format || 'HH:mm'} format` };
        }
        break;
      case 'array':
        if (!Array.isArray(value)) {
          return { status: false, description: `${currentPath} must be a valid array` };
        }
        if (value.length === 0) {
          return { status: false, description: `${currentPath} cannot be an empty array` };
        }
        break;
      case 'object':
        if (typeof value !== 'object' || Array.isArray(value) || value === null) {
          return { status: false, description: `${currentPath} must be a valid object` };
        }
        if (Object.keys(value).length === 0) {
          return { status: false, description: `${currentPath} cannot be an empty object` };
        }
        break;
      default:
        return { status: false, description: `${currentPath} has an unsupported type` };
    }

    return { status: true, description: 'success' };
  };

  const validateStructure = (obj, structure, path = '') => {
    for (const [key, rule] of Object.entries(structure)) {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof rule === 'string') {
        const result = validateValue(key, value, rule, path);
        if (!result.status) return result;
      } else if (typeof rule === 'object') {
        if (rule.type === 'array') {
          if (!Array.isArray(value) || value.length <= 0) {
            return { status: false, description: `${currentPath} must be a valid array` };
          }
          for (const [index, item] of value.entries()) {
            const arrayPath = `${currentPath}[${index}]`;
            const result = validateStructure(item, rule.fields, arrayPath);
            if (!result.status) return result;
          }
        } else if (rule.type === 'object') {
          if (typeof value !== 'object' || Array.isArray(value)) {
            return { status: false, description: `${currentPath} must be a valid object` };
          }
          const result = validateStructure(value, rule.fields, currentPath);
          if (!result.status) return result;
        } else if (rule.type === 'date' || rule.type === 'time') {
          const format = rule.format || '';
          const result = validateValue(key, value, rule.type, path, format);
          if (!result.status) return result;
        }
      }
    }
    return { status: true, description: 'success' };
  };

  return validateStructure(body, requiredFields);
};

module.exports = { validationFunction, removeSpace, validateRequestBody };
