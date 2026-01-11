const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const { ensureWebToken } = require('../middleware/auth.middleware');

router.post('/', ensureWebToken, walletController.addWallet);
router.get('/', ensureWebToken, walletController.listWallets);
router.delete('/:id', ensureWebToken, walletController.removeWallet);

module.exports = router;


