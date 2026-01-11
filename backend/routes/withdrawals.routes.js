const express = require('express');
const router = express.Router();
const controller = require('../controllers/withdrawal.controller');
const { ensureWebToken } = require('../middleware/auth.middleware');

router.post('/', ensureWebToken, controller.request);
router.get('/', ensureWebToken, controller.list);
router.delete('/:id', ensureWebToken, controller.cancel);

module.exports = router;


