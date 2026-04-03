const bcrypt  = require('bcrypt');

const ApiError        = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const {userRepository} = require('../repositories');

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// ─── Service ──────────────────────────────────────────────────────────────────

async function createUser(data) {
  const existingUser = await userRepository.findUserByEmail(data.email);

  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'User with this email already exists');
  }

  const hashedPassword = await hashPassword(data.password);

  return userRepository.createUser({
    name    : data.name,
    email   : data.email,
    password: hashedPassword,
    role    : data.role || 'VIEWER',
  });
}

async function getAllUsers() {
  return userRepository.findAllUsers();
}

async function getUserById(id) {
  const user = await userRepository.findUserById(id);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  return user;
}

async function updateUserRole(id, role) {
  const user = await userRepository.findUserByIdWithPassword(id);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  user.role = role;
  return userRepository.saveUser(user);
}

async function updateUserStatus(id, status) {
  const user = await userRepository.findUserByIdWithPassword(id);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  user.status = status;
  return userRepository.saveUser(user);
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
};


