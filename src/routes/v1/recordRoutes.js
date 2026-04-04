const express = require('express');
const {recordController} = require('../../controllers')
const {validateMiddleware,authMiddleware,activeUserMiddleware,roleMiddleware} = require('../../middlewares');
const {recordValidator} = require('../../validators');

const { ROLES } = require('../../utils/enums');

const router = express.Router();
router.use(authMiddleware,activeUserMiddleware);

router.post(
  '/',
  roleMiddleware(ROLES.ADMIN),
  recordValidator.createRecord,
  validateMiddleware,
  recordController.create
);

router.get(
  '/',
  roleMiddleware(ROLES.ANALYST, ROLES.ADMIN),
  recordValidator.getRecordsQuery,
  validateMiddleware,
  recordController.getAll
);

router.get(
  '/:id',
  roleMiddleware(ROLES.ANALYST, ROLES.ADMIN),
  recordValidator.recordId,
  validateMiddleware,
  recordController.getOne
);

router.patch(
  '/:id',
  roleMiddleware(ROLES.ADMIN),
  recordValidator.updateRecord,
  validateMiddleware,
  recordController.update
);

router.delete(
  '/:id',
  roleMiddleware(ROLES.ADMIN),
  recordValidator.recordId,
  validateMiddleware,
  recordController.remove
);

module.exports = router;
