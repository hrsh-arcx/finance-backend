const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const db = require('../database/models');
const { StatusCodes } = require('http-status-codes');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Access token is missing or invalid'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(decoded.id);

    if (!user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User associated with token no longer exists'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token'));
  }
}

module.exports = authenticate;