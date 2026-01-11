const express = require('express');
const router = express.Router();
const controller = require('../controllers/notification.controller');
const { ensureWebToken } = require('../middleware/auth.middleware');

router.get('/', ensureWebToken, controller.list);
router.post('/:id/read', ensureWebToken, controller.markRead);

module.exports = router;


