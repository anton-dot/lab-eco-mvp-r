const express = require('express');
const router = express.Router();
const controller = require('../controllers/ticket.controller');
const { ensureWebToken } = require('../middleware/auth.middleware');

router.post('/', ensureWebToken, controller.create);
router.get('/', ensureWebToken, controller.list);
router.get('/:id/messages', ensureWebToken, controller.messages);
router.post('/:id/messages', ensureWebToken, controller.addMessage);

module.exports = router;


