const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');
const {StatusCodes} = require('http-status-codes');

function validateMiddleware(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
        new ApiError(
        StatusCodes.BAD_REQUEST,
        'Validation failed',
        errors.array().map((error) => ({
            field: error.path,
            message: error.msg
        }))
        )
    );
  }

  next();
}

module.exports = validateMiddleware;