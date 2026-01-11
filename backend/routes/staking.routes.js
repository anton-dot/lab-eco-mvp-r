const express = require('express');
const router = express.Router();
const stakingController = require('../controllers/staking.controller');
const { ensureWebToken } = require('../middleware/auth.middleware');

router.post('/', ensureWebToken, stakingController.create);
router.get('/', ensureWebToken, stakingController.list);
router.post('/claim', ensureWebToken, stakingController.claim);
router.post('/sell', ensureWebToken, stakingController.sell);

module.exports = router;


