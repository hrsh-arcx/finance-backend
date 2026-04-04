const { StatusCodes } = require('http-status-codes');

const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');
const recordService = require('../services/recordService');

const create = catchAsync(async (req, res) => {
  const record = await recordService.createRecord(req.body, req.user.id);

  return res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, 'Financial record created successfully', record));
});

const getAll = catchAsync(async (req, res) => {
  const result = await recordService.getAllRecords(req.query);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'Financial records fetched successfully', result.records, {
      total      : result.total,
      page       : result.page,
      limit      : result.limit,
      totalPages : result.totalPages,
    }));
});

const getOne = catchAsync(async (req, res) => {
  const record = await recordService.getRecordById(req.params.id);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'Financial record fetched successfully', record));
});

const update = catchAsync(async (req, res) => {
  const record = await recordService.updateRecordById(req.params.id, req.body);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'Financial record updated successfully', record));
});

const remove = catchAsync(async (req, res) => {
  await recordService.deleteRecordById(req.params.id);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'Financial record deleted successfully', null));
});

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
};