const { StatusCodes } = require('http-status-codes');

const ApiResponse      = require('../utils/ApiResponse');
const catchAsync       = require('../utils/catchAsync');
const {dashboardService} = require('../services');

const summary = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  const data = await dashboardService.getSummary({ startDate, endDate });
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'Dashboard summary fetched successfully', data));
});

const categoryBreakdown = catchAsync(async (req, res) => {
  const data = await dashboardService.getCategoryBreakdown();
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'Category breakdown fetched successfully', data));
});

const recentActivity = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const data  = await dashboardService.getRecentActivity(limit);
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'Recent activity fetched successfully', data));
});

const monthlyTrends = catchAsync(async (req, res) => {
  const data = await dashboardService.getMonthlyTrends();
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'Monthly trends fetched successfully', data));
});

module.exports = {
  summary,
  categoryBreakdown,
  recentActivity,
  monthlyTrends,
};