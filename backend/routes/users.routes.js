const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { ensureWebToken } = require('../middleware/auth.middleware');

router.get('/me', ensureWebToken, userController.getMe);
router.patch('/me', ensureWebToken, userController.updateMe);

module.exports = router;


