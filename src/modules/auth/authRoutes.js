const express = require('express');
const { login , me } = require('./authController');
const { loginValidator } = require('./authValidation');
const validateMiddleware = require('../../middlewares/validateMiddleware');
const authenticate = require('../../middlewares/authMiddleware');
const checkActiveUser = require('../../middlewares/activeUserMiddleware');

const router = express.Router();

router.post('/login', loginValidator, validateMiddleware, login);
router.get('/me',authenticate,checkActiveUser,me);

module.exports = router;