const jwt = require('jsonwebtoken');
const config = require('../config');

function ensureWebToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.sendStatus(403);
  }
  jwt.verify(token, config.JWT_SECRET_KEY, async function (err, _data) {
    if (err) {
      return res.sendStatus(403);
    }
    try {
      const decoded = await jwt.decode(token, { complete: true, json: true });
      req.user = decoded['payload'];
      req.user_id = req.user.id;
      req.email = req.user.email;
      req.address = req.user.address;
      return next();
    } catch (_e) {
      return res.sendStatus(403);
    }
  });
}

function ensureWebTokenForAdmin(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.sendStatus(403);
  }
  jwt.verify(token, config.JWT_SECRET_KEY, async function (err, _data) {
    if (err) {
      return res.sendStatus(403);
    }
    try {
      const decoded = await jwt.decode(token, { complete: true, json: true });
      req.user = decoded['payload'];
      if (req.user.role != 'cpadmin') {
        return res.sendStatus(403);
      }
      return next();
    } catch (_e) {
      return res.sendStatus(403);
    }
  });
}

module.exports = { ensureWebToken, ensureWebTokenForAdmin };


