const { Op } = require('sequelize');
const db = require('../database/models');

const ALLOWED_SORT_FIELDS = ['date', 'amount', 'category', 'createdAt'];
const USER_ATTRIBUTES = ['id', 'name', 'email', 'role'];
const includeCreator = {
  model      : db.User,
  as         : 'records',
  attributes : USER_ATTRIBUTES,
};

async function createRecord(data) {
  return await db.FinancialRecord.create(data);
}

async function findRecordById(id) {
  return await db.FinancialRecord.findOne({
    where: {
      id,
      isDeleted: false
    },
    include: [includeCreator]
  });
}

async function findRecords(filters) {
  const {
    type,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    search,
    sortBy = 'date',
    sortOrder = 'DESC'
  } = filters;

  const where = {
    isDeleted: false
  };

  if (type) where.type = type;
  if (category) where.category = category;

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date[Op.gte] = startDate;
    if (endDate) where.date[Op.lte] = endDate;
  }

  if (search) {
    where[Op.or] = [
      { notes: { [Op.like]: `%${search}%` } },
      { category: { [Op.like]: `%${search}%` } }
    ];
  }

  const safeSortBy  = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'date';
  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await db.FinancialRecord.findAndCountAll({
    where,
    include: [includeCreator],
    limit: Number(limit),
    offset,
    order: [[safeSortBy, sortOrder.toUpperCase()]]
  });

  return {
    records : rows,
    total : count,
    page : Number(page),
    limit : Number(limit),
    totalPages : Math.ceil(count / Number(limit)),
  };
}

async function updateRecord(record, data) {
  return await record.update(data);
}

async function softDeleteRecord(record) {
  return await record.update({ isDeleted: true });
}

module.exports = {
  createRecord,
  findRecordById,
  findRecords,
  updateRecord,
  softDeleteRecord
};