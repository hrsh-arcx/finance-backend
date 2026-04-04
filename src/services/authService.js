const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createAuditLog = require('../utils/auditLogger')
const ApiError = require('../utils/ApiError');
const { USER_STATUS } = require('../utils/enums');
const { StatusCodes } = require('http-status-codes');
const {authRepository} = require('../repositories');

//Helpers
function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, status: user.status },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
}

function formatUser(user) {
  const { id, name, email, role, status } = user;
  return { id, name, email, role, status };
}

//Service
async function loginUser(email, password) {
  const user = await authRepository.findUserByEmail(email);

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

  await createAuditLog({
    userId: user.id,
    action: 'LOGIN',
    entity: 'User',
    entityId: user.id,
    oldValues: null,
    newValues: null,
  });

  return {
    token : generateToken(user),
    user  : formatUser(user),
  };
}

async function getCurrentUser(userId) {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return formatUser(user);
}

module.exports = {
  loginUser,
  getCurrentUser,
};