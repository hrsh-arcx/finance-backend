const { StatusCodes } = require('http-status-codes');

const ApiResponse  = require('../utils/ApiResponse');
const catchAsync   = require('../utils/catchAsync');
const {userService} = require('../services');

// ─── Controllers ─────────────────────────────────────────────────────────────

const create = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body, req.user.id);
  return res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, 'User created successfully', user));
});

const getAll = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'Users fetched successfully', users));
});

const getOne = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'User fetched successfully', user));
});

const updateRole = catchAsync(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role,req.user.id);
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'User role updated successfully', user));
});

const updateStatus = catchAsync(async (req, res) => {
  const user = await userService.updateUserStatus(req.params.id, req.body.status,req.user.id);
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'User status updated successfully', user));
});

module.exports = {
  create,
  getAll,
  getOne,
  updateRole,
  updateStatus,
};