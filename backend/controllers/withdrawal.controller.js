const UserModel = require('../models/user.model');

exports.request = async (req, res) => {
  try {
    const body = { ...req.body, user_id: req.user_id, withdrawal_address: req.address };
    const total = await UserModel.getTotalBalance({ user_id: req.user_id });
    if (total.length === 0) return res.status(200).send({ success: false, msg: 'Balance unavailable' });
    if (parseFloat(body.token) <= 0) return res.status(200).send({ success: false, msg: 'Invalid amount' });
    if (parseFloat(body.token) > parseFloat(total[0].total_balance)) return res.status(200).send({ success: false, msg: 'Insufficient balance' });
    const busd_amount = (parseFloat(body.token) * 0.000166) - 0.3;
    if (busd_amount < 1) return res.status(200).send({ success: false, msg: 'Minimum withdraw 10,000 Token (1 BUSD)' });
    await UserModel.insertWithdrawRequest({ ...body, busd_amount });
    return res.status(200).send({ success: true });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

exports.list = async (req, res) => {
  try {
    const data = await UserModel.getwithdrawHistory({ user_id: req.user_id });
    return res.status(200).send({ success: true, data });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

exports.cancel = async (_req, res) => {
  return res.status(200).send({ success: false, msg: 'Not implemented' });
};


