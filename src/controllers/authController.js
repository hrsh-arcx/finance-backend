const { StatusCodes } = require('http-status-codes');

const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');
const {authService} = require('../services');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'Login successful', result));
});

const me = catchAsync(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'Current user fetched successfully', user));
});

module.exports = {
  login,
  me,
};