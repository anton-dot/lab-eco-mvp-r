const express = require('express');
const router = express.Router();
const controller = require('../controllers/referral.controller');
const { ensureWebToken } = require('../middleware/auth.middleware');

router.get('/', ensureWebToken, controller.list);
router.get('/earnings', ensureWebToken, controller.earnings);

module.exports = router;


