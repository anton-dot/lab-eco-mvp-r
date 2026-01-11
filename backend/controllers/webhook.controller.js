const UserModel = require('../models/user.model');

// Example webhook to confirm deposits
exports.bscDepositConfirmed = async (req, res) => {
  try {
    const { transaction_id, busd_amount, token, user_id, address } = req.body;
    if (!transaction_id) return res.status(400).send({ success: false, msg: 'transaction_id required' });
    await UserModel.userBalanceUpdate({ id: transaction_id, busd_amount, token, user_id, address });
    return res.status(200).send({ success: true });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};


