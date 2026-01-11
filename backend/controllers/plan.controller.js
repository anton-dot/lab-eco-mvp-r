const UserModel = require('../models/user.model');

exports.list = async (_req, res) => {
  try {
    const data = await UserModel.getPlanDetails();
    return res.status(200).send({ success: true, data });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

exports.detail = async (_req, res) => {
  return res.status(200).send({ success: false, msg: 'Not implemented' });
};


