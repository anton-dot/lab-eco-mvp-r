const UserModel = require('../models/user.model');

exports.list = async (req, res) => {
  try {
    const data = await UserModel.getReferralUsersList({ user_id: req.user_id });
    return res.status(200).send({ success: true, data });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

exports.earnings = async (_req, res) => {
  return res.status(200).send({ success: false, msg: 'Not implemented' });
};


