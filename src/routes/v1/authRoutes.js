const express = require('express');
const {authController} = require('../../controllers');
const {loginValidator} = require('../../validators');
const {validateMiddleware,authMiddleware,activeUserMiddleware} = require('../../middlewares');

const router = express.Router();

router.post('/login', loginValidator, validateMiddleware, authController.login);
router.get('/me',authMiddleware,activeUserMiddleware,authController.me);

module.exports = router;