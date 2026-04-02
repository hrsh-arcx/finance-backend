const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../../utils/ApiError');
const db = require('../../database/models');
const { USER_STATUS } = require('../../utils/enums');
const { StatusCodes } = require('http-status-codes');

async function loginUser(email, password) {
  const user = await db.User.findOne({
    where: { email }
  });

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Your account is inactive. Please contact admin');
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      status: user.status
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  };
}

async function getCurrentUser(userId) {
  const user = await db.User.findByPk(userId);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  };
}

module.exports = {
  loginUser,
  getCurrentUser,
};