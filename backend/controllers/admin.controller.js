const AdminModel = require('../models/admin.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

exports.getwithdrawrequest = async (req, res, next) => {
  try {
    const withdrawRequests = await AdminModel.getWithdrawRequest();

    const { response, statusCode } = successResponse(
      withdrawRequests,
      withdrawRequests.length > 0 ? 'Withdraw requests retrieved successfully' : 'No withdraw requests found'
    );
    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get withdraw request error:', error);
    next(error);
  }
};

exports.approvewithdrawrequest = async (req, res, next) => {
  try {
    const result = await AdminModel.approveWithdrawRequest(req.body);
    if (result) {
      const { response, statusCode } = successResponse(null, 'Withdraw request approved successfully');
      return res.status(statusCode).json(response);
    } else {
      const { response, statusCode } = errorResponse('Failed to approve withdraw request', 400);
      return res.status(statusCode).json(response);
    }
  } catch (error) {
    logger.error('Approve withdraw request error:', error);
    next(error);
  }
};

exports.rejectwithdrawrequest = async (req, res, next) => {
  try {
    const result = await AdminModel.rejectWithdrawRequest(req.body);
    if (result) {
      await AdminModel.balanceUpdate(req.body);
      const { response, statusCode } = successResponse(null, 'Withdraw request rejected successfully');
      return res.status(statusCode).json(response);
    } else {
      const { response, statusCode } = errorResponse('Failed to reject withdraw request', 400);
      return res.status(statusCode).json(response);
    }
  } catch (error) {
    logger.error('Reject withdraw request error:', error);
    next(error);
  }
};

exports.getUserList = async (req, res, next) => {
  try {
    const userList = await AdminModel.getUserList();

    const { response, statusCode } = successResponse(
      userList,
      userList.length > 0 ? 'User list retrieved successfully' : 'No users found'
    );
    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get user list error:', error);
    next(error);
  }
};

exports.getStakingDetail = async (req, res, next) => {
  try {
    const stakingDetail = await AdminModel.getStakingDetail();

    const { response, statusCode } = successResponse(
      stakingDetail,
      stakingDetail.length > 0 ? 'Staking details retrieved successfully' : 'No staking details found'
    );
    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get staking detail error:', error);
    next(error);
  }
};

exports.getStakingEarningDetail = async (req, res, next) => {
  try {
    const stakingEarningDetail = await AdminModel.getStakingEarningDetail();

    const { response, statusCode } = successResponse(
      stakingEarningDetail,
      stakingEarningDetail.length > 0 ? 'Staking earning details retrieved successfully' : 'No staking earning details found'
    );
    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get staking earning detail error:', error);
    next(error);
  }
};

exports.getdepositBUSDDetail = async (req, res, next) => {
  try {
    const depositBUSDDetail = await AdminModel.getDepositBUSDDetail();

    const { response, statusCode } = successResponse(
      depositBUSDDetail,
      depositBUSDDetail.length > 0 ? 'Deposit BUSD details retrieved successfully' : 'No deposit BUSD details found'
    );
    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get deposit BUSD detail error:', error);
    next(error);
  }
};
