const { logger } = require('../../../utils/logger');
const { serviceToController } = require('../../../helper/response.helper');
const Models = require('../../../models/index');

const { user: User, userProfile: UserProfile, Op } = Models;

const getUserForAdminService = async (reqData) => {
  try {
    const search = reqData.bodyData.search ? reqData.bodyData.search : '';

    const { rows: users, count } = await User.findAndCountAll({
      limit: reqData.bodyData.per_page,
      offset: (reqData.bodyData.page - 1) * reqData.bodyData.per_page,
      where: {
        ...(Object.prototype.hasOwnProperty.call(reqData.bodyData, 'is_active') && { is_active: reqData.bodyData.is_active }),
        ...(Object.prototype.hasOwnProperty.call(reqData.bodyData, 'is_verified') && { is_verified: reqData.bodyData.is_verified }),
        ...(search && {
          [Op.or]: [
            { email: { [Op.like]: `%${search}%` } },
            { '$userProfile.first_name$': { [Op.like]: `%${search}%` } },
            { '$userProfile.last_name$': { [Op.like]: `%${search}%` } },
            { '$userProfile.phone$': { [Op.like]: `%${search}%` } },
          ],
        }),
      },
      include: {
        model: UserProfile,
        as: 'userProfile',
        required: false,
        attributes: ['user_id', 'last_name', 'phone', 'date_of_birth', 'created_at'],
      },
      attributes: ['u_id', 'email', 'auth_token', 'role', 'is_active', 'is_verified', 'token', 'last_login_at'],
      raw: false,
    });

    if (!users.length) return serviceToController(0, null, 'No users found!');

    const finalResponse = {
      users,
      paginationData: {
        page: reqData.bodyData.page,
        per_page: reqData.bodyData.per_page,
        total: count,
        total_pages: Math.ceil(count / reqData.bodyData.per_page),
      },
    };

    return serviceToController(1, finalResponse, 'Users found successfully!');
  } catch (error) {
    logger.error('============ERROR FROM getUserForAdminService SERVICE============');
    logger.error(error);
    return serviceToController(4, null, 'Internal server error');
  }
};

module.exports = {
  getUserForAdminService,
};
