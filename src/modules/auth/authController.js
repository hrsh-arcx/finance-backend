const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../utils/ApiResponse');
const { loginUser , getCurrentUser } = require('./authService');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    return res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, 'Login successful', result));
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await getCurrentUser(req.user.id);

    return res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, 'Current user fetched successfully', user));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  me,
};