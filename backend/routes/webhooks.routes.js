const express = require('express');
const router = express.Router();
const controller = require('../controllers/webhook.controller');

router.post('/bsc/deposit-confirmed', controller.bscDepositConfirmed);

module.exports = router;


