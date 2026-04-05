const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const recordRepository = require('../repositories/recordRepository');
const createAuditLog = require('../utils/auditLogger')

//Helper
async function findRecordOrFail(id) {
  const record = await recordRepository.findRecordById(id);
  if (!record) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Financial record not found');
  }
  return record;
}
function isDifferent(oldVal, newVal) {

  if (oldVal == null && newVal == null) return false;
  if (oldVal == null || newVal == null) return true;

  if (oldVal instanceof Date || (typeof oldVal === 'string' && !isNaN(Date.parse(oldVal)))) {
    const oldDate = new Date(oldVal).toLocaleDateString('en-CA');
    const newDate = new Date(newVal).toLocaleDateString('en-CA');
    return oldDate !== newDate;
  }

  if (!isNaN(oldVal) && !isNaN(newVal)) {
    return Number(oldVal) !== Number(newVal);
  }

  return String(oldVal).trim() !== String(newVal).trim();
}


//Service
async function createRecord(data, userId) {
  const record = await recordRepository.createRecord({ ...data, createdBy: userId });
  await createAuditLog({
    userId,
    action: 'CREATE',
    entity: 'FinancialRecord',
    entityId: record.id,
    oldValues: null,
    newValues: record.toJSON(),
  });
  return record;
}

async function getAllRecords(query) {
  return recordRepository.findRecords(query);
}

async function getRecordById(id) {
  return findRecordOrFail(id);
}

async function updateRecordById(id, data, userId) {
  const record = await findRecordOrFail(id);
  const hasChanges = Object.keys(data).some(
    key => isDifferent(record[key],data[key])
  );
  if (!hasChanges) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No changes detected');
  }
  const oldValues = record.toJSON();
  const updated = await recordRepository.updateRecord(record, data);

  await createAuditLog({
    userId,
    action: 'UPDATE',
    entity: 'FinancialRecord',
    entityId: record.id,
    oldValues,
    newValues: updated.toJSON(),
  });

  return updated;
}

async function deleteRecordById(id, userId) {
  const record = await findRecordOrFail(id);
  const oldValues = record.toJSON();
  await recordRepository.softDeleteRecord(record);

  await createAuditLog({
    userId,
    action: 'DELETE',
    entity: 'FinancialRecord',
    entityId: record.id,
    oldValues,
    newValues: null,
  });
}

module.exports = {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecordById,
  deleteRecordById,
};