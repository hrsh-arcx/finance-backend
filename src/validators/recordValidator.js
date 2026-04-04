const { body, query, param } = require('express-validator');
const { RECORD_TYPES } = require('../utils/enums');

const createRecord = [
  body('amount')
  .notEmpty().withMessage('Amount is required')
  .toFloat()
  .isFloat({ min: 0.01 }).withMessage('Amount must be at least 0.01')
  .custom((value) => {
    if (!/^\d+(\.\d{1,2})?$/.test(String(value))) {
      throw new Error('Amount can have at most 2 decimal places');
    }
    return true;
  }),

  body('type')
    .notEmpty().withMessage('Type is required')
    .trim()
    .isIn(Object.values(RECORD_TYPES)).withMessage('Invalid record type'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 }).withMessage('Category must be between 2 and 50 characters'),

  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid date')
    .toDate(),

  body('notes')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

const updateRecord = [
  param('id')
    .toInt()
    .isInt().withMessage('Invalid record ID'),

  body('amount')
    .optional()
    .toFloat()
    .isFloat({ min: 0.01 }).withMessage('Amount must be at least 0.01')
    .custom((value) => {
      if (!/^\d+(\.\d{1,2})?$/.test(String(value))) {
        throw new Error('Amount can have at most 2 decimal places');
      }
      return true;
    }),

  body('type')
    .optional()
    .trim()
    .isIn(Object.values(RECORD_TYPES)).withMessage('Invalid record type'),

  body('category')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 }).withMessage('Category must be between 2 and 50 characters'),

  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid date')
    .toDate(),

  body('notes')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),

  body().custom((_, { req }) => {
    const allowed = ['amount', 'type', 'category', 'date', 'notes'];
    const hasField = allowed.some(field => req.body[field] !== undefined);
    if (!hasField) {
      throw new Error('At least one field must be provided to update');
    }
    return true;
  }),
];

const recordId = [
  param('id')
    .toInt()
    .isInt().withMessage('Invalid record ID'),
];

const getRecordsQuery = [
  query('type')
    .optional()
    .trim()
    .isIn(Object.values(RECORD_TYPES)).withMessage('Invalid record type'),

  query('category')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 1, max: 50 }).withMessage('Category filter is invalid'),

  query('startDate')
    .optional()
    .isISO8601().withMessage('startDate must be a valid date')
    .toDate(),

  query('endDate')
    .optional()
    .isISO8601().withMessage('endDate must be a valid date')
    .toDate(),

  query('page')
    .optional()
    .toInt()
    .isInt({ min: 1 }).withMessage('Page must be at least 1'),

  query('limit')
    .optional()
    .toInt()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('sortBy')
    .optional()
    .trim()
    .isIn(['date', 'amount', 'category', 'createdAt']).withMessage('Invalid sortBy field'),

  query('sortOrder')
    .optional()
    .toUpperCase()
    .isIn(['ASC', 'DESC']).withMessage('sortOrder must be asc or desc'),

  query('search')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 }).withMessage('Search term is invalid'),
];

module.exports = {
  createRecord,
  updateRecord,
  recordId,
  getRecordsQuery,
};