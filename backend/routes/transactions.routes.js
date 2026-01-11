const express = require('express');
const router = express.Router();
const controller = require('../controllers/transaction.controller');
const { ensureWebToken } = require('../middleware/auth.middleware');

router.post('/deposits', ensureWebToken, controller.createDeposit);
router.get('/', ensureWebToken, controller.list);

module.exports = router;


