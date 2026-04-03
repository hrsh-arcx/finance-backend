const express = require('express');
const {userController} = require('../../controllers');
const {userValidator} = require('../../validators');
const {validateMiddleware,authMiddleware,activeUserMiddleware,roleMiddleware} = require('../../middlewares');
const { ROLES } = require('../../utils/enums');

const router = express.Router();

router.use(authMiddleware, activeUserMiddleware,  roleMiddleware(ROLES.ADMIN));

router.post('/', userValidator.create, validateMiddleware, userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getOne);
router.patch('/:id/role', userValidator.updateRole, validateMiddleware, userController.updateRole);
router.patch('/:id/status', userValidator.updateStatus, validateMiddleware, userController.updateStatus);

module.exports = router;