const UserModel = require('../models/user.model');

exports.createDeposit = async (req, res) => {
  try {
    const body = { ...req.body, user_id: req.user_id, address: req.address, from_address: req.address };
    const exists = await UserModel.checkHash(body);
    if (exists.length > 0) return res.status(403).send({ success: false, msg: 'Forbidden' });
    await UserModel.saveDepositBUSDDetails({ ...body, to_address: require('../config').clientDepositAddress, token: parseFloat(body.busd_amount) * 10 });
    return res.status(200).send({ success: true, msg: 'Deposit recorded. Awaiting blockchain confirmation.' });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

exports.list = async (req, res) => {
  try {
    const data = await UserModel.getTransactionHistory({ user_id: req.user_id });
    return res.status(200).send({ success: true, data });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};


