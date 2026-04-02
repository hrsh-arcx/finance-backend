const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized access'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to perform this action'));
    }

    next();
  };
}

module.exports = authorizeRoles;