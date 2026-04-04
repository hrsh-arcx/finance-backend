const bcrypt = require('bcrypt');

const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const {userRepository} = require('../repositories');
const createAuditLog = require('../utils/auditLogger')

//Helpers
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

//Service
async function createUser(data, userId) {
  const existingUser = await userRepository.findUserByEmail(data.email);

  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'User with this email already exists');
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await userRepository.createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || 'VIEWER',
  });

  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'User',
    entityId: user.id,
    oldValues: null,
    newValues: { id: user.id, name: user.name, email: user.email, role: user.role },
  });

  return user;
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

async function updateUserRole(id, role, userId) {
  const user = await userRepository.findUserByIdWithPassword(id);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if(user.role==role){
    throw new ApiError(StatusCodes.BAD_REQUEST, `The user already has the same role`);
  }

  const oldValues = { role: user.role };
  user.role = role;
  const updated = await userRepository.saveUser(user);

  await createAuditLog({
    userId,
    action: 'UPDATE',
    entity: 'User',
    entityId: id,
    oldValues,
    newValues: { role },
  });

  return updated;
}

async function updateUserStatus(id, status, userId) {
  const user = await userRepository.findUserByIdWithPassword(id);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if(user.status==status){
    throw new ApiError(StatusCodes.BAD_REQUEST, `The user already has the same status`);
  }
  const oldValues = { status: user.status };
  user.status = status;
  const updated = await userRepository.saveUser(user);

  await createAuditLog({
    userId,
    action: 'UPDATE',
    entity: 'User',
    entityId: id,
    oldValues,
    newValues: { status },
  });

  return updated;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
};


