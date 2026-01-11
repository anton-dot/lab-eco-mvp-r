const WalletModel = require('../models/wallet.model');

exports.addWallet = async (req, res) => {
  try {
    const { address, chain, is_primary } = req.body;
    if (!address) return res.status(200).send({ success: false, msg: 'Address required' });
    const result = await WalletModel.addWallet({ user_id: req.user_id, address, chain: chain || 'bsc', is_primary: !!is_primary });
    return res.status(200).send({ success: true, id: result.insertId });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

exports.listWallets = async (req, res) => {
  try {
    const rows = await WalletModel.listWallets({ user_id: req.user_id });
    return res.status(200).send({ success: true, data: rows });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

exports.removeWallet = async (req, res) => {
  try {
    const { id } = req.params;
    await WalletModel.removeWallet({ user_id: req.user_id, id });
    return res.status(200).send({ success: true });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};


