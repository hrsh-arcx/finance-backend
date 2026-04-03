const { body, param } = require('express-validator');
const { ROLES, USER_STATUS } = require('../utils/enums');

const create = [
  body('name').notEmpty().withMessage('Name is required'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage('Invalid role')
];

const updateRole = [
  param('id').isInt().withMessage('Invalid user ID'),

  body('role')
    .isIn(Object.values(ROLES))
    .withMessage('Invalid role')
];

const updateStatus = [
  param('id').isInt().withMessage('Invalid user ID'),

  body('status')
    .isIn(Object.values(USER_STATUS))
    .withMessage('Invalid status')
];

module.exports = {
  create,
  updateRole,
  updateStatus
};