const UserModel = require('../models/user.model');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/response');
const logger = require('../utils/logger');

exports.getMe = async (req, res, next) => {
  try {
    const users = await UserModel.getUsersAddress({ address: req.address });
    if (users.length === 0) {
      const { response, statusCode } = notFoundResponse('User not found');
      return res.status(statusCode).json(response);
    }

    const user = users[0];
    const { response, statusCode } = successResponse({
      id: user.id,
      address: user.address,
      token_balance: user.token_balance,
      MBUSD_balance: user.MBUSD_balance,
      referral_code: user.referral_code,
    });

    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get user error:', error);
    next(error);
  }
};

exports.updateMe = async (_req, res) => {
  const { response, statusCode } = errorResponse('Not implemented', 501);
  return res.status(statusCode).json(response);
};
