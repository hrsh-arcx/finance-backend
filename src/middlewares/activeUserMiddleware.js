const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const { USER_STATUS } = require('../utils/enums');

function checkActiveUser(req, res, next) {
  if (!req.user) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized access'));
  }

  if (req.user.status !== USER_STATUS.ACTIVE) {
    return next(new ApiError(StatusCodes.FORBIDDEN, 'Your account is inactive'));
  }

  next();
}

module.exports = checkActiveUser;