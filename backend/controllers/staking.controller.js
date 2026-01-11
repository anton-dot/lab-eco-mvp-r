const UserModel = require('../models/user.model');

exports.create = async (req, res) => {
  try {
    req.body.user_id = req.user_id;
    req.body.address = req.address;
    const check = await UserModel.checkPeriodId(req.body);
    if (check.length === 0) return res.status(200).send({ success: false, msg: 'Invalid plan' });
    req.body.token_amount = check[0].price;
    req.body.reward_token = check[0].token;
    const result = await UserModel.addStaking(req.body);
    return res.status(200).send({ success: true, id: result.insertId });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

exports.list = async (req, res) => {
  try {
    const data = await UserModel.getstakingHistory({ user_id: req.user_id });
    return res.status(200).send({ success: true, data });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

exports.claim = async (req, res) => {
  try {
    const body = { ...req.body, user_id: req.user_id };
    const rewardCheck = await UserModel.RewardClaimCheck(body);
    if (rewardCheck.length === 0 || rewardCheck[0].isClaimAvailable == 0) {
      return res.status(200).send({ success: false, msg: 'Claim not available yet' });
    }
    const qty = await UserModel.stakingQuantity(body);
    if (qty.length === 0) return res.status(200).send({ success: false, msg: 'Invalid staking' });
    const token = parseFloat(qty[0].reward_token) * parseFloat(qty[0].remaining_quantity);
    if (token <= 0) return res.status(200).send({ success: false, msg: 'No reward' });
    await UserModel.SingalRewardClaim({ ...body, token });
    return res.status(200).send({ success: true });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

exports.sell = async (req, res) => {
  try {
    const body = { ...req.body, user_id: req.user_id };
    const check = await UserModel.checkSellPlan(body);
    if (check.length === 0) return res.status(200).send({ success: false, msg: 'Invalid staking details' });
    await UserModel.SellPlan({ ...body, reward_token: parseFloat(check[0].reward_token) * parseFloat(check[0].remaining_quantity) });
    return res.status(200).send({ success: true });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};


