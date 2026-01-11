const NotificationModel = require('../models/notification.model');

exports.list = async (req, res) => {
  try {
    const rows = await NotificationModel.list({ user_id: req.user_id });
    return res.status(200).send({ success: true, data: rows });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    await NotificationModel.markRead({ user_id: req.user_id, id });
    return res.status(200).send({ success: true });
  } catch (_e) {
    return res.status(200).send({ success: false, msg: 'Internal error' });
  }
};


