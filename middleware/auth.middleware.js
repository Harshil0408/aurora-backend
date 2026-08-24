const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../config');
const Models = require('../models/index');
const ResponseHelper = require('../helper/response.helper');
const { logger } = require('../utils/logger');

const extractToken = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  return null;
};

const authMiddleware = (roles = null) => {
  return async (req, res, next) => {
    try {
      const token = extractToken(req);

      if (!token) {
        return ResponseHelper.invalidToken(res, 'Access denied, No token provided');
      }

      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET_KEY);
      } catch (error) {
        return ResponseHelper.invalidToken(res, 'Invalid or expired token.');
      }

      const { user: UserModel } = Models;
      const user = await UserModel.findOne({ where: { u_id: decoded.u_id } });

      if (!user) {
        return ResponseHelper.invalidToken(res, 'User not found');
      }

      const storedToken = Buffer.from(user.token || '', 'utf8');
      const providedToken = Buffer.from(token, 'utf8');
      if (storedToken.length !== providedToken.length || !crypto.timingSafeEqual(storedToken, providedToken)) {
        return ResponseHelper.invalidToken(res, 'Session expired. Please login again.');
      }

      if (user.is_active !== 1) {
        return ResponseHelper.invalidToken(res, 'Account is deactivated.');
      }

      if (Array.isArray(roles) && roles.length > 0 && !roles.includes(user.role)) {
        return ResponseHelper.invalidToken(res, 'You do not have permission to access this resource.');
      }

      req.user = user;
      next();
    } catch (error) {
      logger.error('================== ERROR FROM authMiddleware MIDDLEWARE ==================');
      logger.error(error);
      return ResponseHelper.internalServerError(res, 'Internal server error');
    }
  };
};

module.exports = { authMiddleware };
