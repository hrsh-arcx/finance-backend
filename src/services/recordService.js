const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const recordRepository = require('../repositories/recordRepository');

//Helper

async function findRecordOrFail(id) {
  const record = await recordRepository.findRecordById(id);
  if (!record) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Financial record not found');
  }
  return record;
}

//Service

async function createRecord(data, userId) {
  return recordRepository.createRecord({ ...data, createdBy: userId });
}

async function getAllRecords(query) {
  return recordRepository.findRecords(query);
}

async function getRecordById(id) {
  return findRecordOrFail(id);
}

async function updateRecordById(id, data) {
  const record = await findRecordOrFail(id);
  const hasChanges = Object.keys(data).some(
    key => String(record[key]) !== String(data[key])
  );
  if (!hasChanges) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No changes detected');
  }
  return recordRepository.updateRecord(record, data);
}

async function deleteRecordById(id) {
  const record = await findRecordOrFail(id);
  return recordRepository.softDeleteRecord(record);
}

module.exports = {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecordById,
  deleteRecordById,
};