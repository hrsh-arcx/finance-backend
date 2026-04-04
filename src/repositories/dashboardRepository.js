const { Op, fn, col, literal } = require('sequelize');
const db = require('../database/models');

async function countRecords() {
  return db.FinancialRecord.count({
    where: { isDeleted: false },
  });
}

async function getSummaryData(filters = {}) {
  const { startDate, endDate } = filters;

  const where = { isDeleted: false };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date[Op.gte] = startDate;
    if (endDate) where.date[Op.lte] = endDate;
  }

  const [incomeResult, expenseResult] = await Promise.all([
    db.FinancialRecord.sum('amount', { where: { ...where, type: 'INCOME' }}),
    db.FinancialRecord.sum('amount', { where: { ...where, type: 'EXPENSE'}}),
  ]);

  return {
    totalIncome : Number(incomeResult || 0),
    totalExpenses : Number(expenseResult || 0),
  };
}

async function getCategoryBreakdownData() {
  return db.FinancialRecord.findAll({
    where: {
      isDeleted: false
    },
    attributes: [
      'type',
      'category',
      [fn('SUM', col('amount')), 'total']
    ],
    group: ['type', 'category'],
    order: [[literal('total'), 'DESC']]
  });
}

async function getRecentActivityData(limit = 5) {
  return db.FinancialRecord.findAll({
    where: {
      isDeleted: false
    },
    include: [
      {
        model: db.User,
        as: 'records',
        attributes: ['id', 'name', 'email', 'role']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit
  });
}

async function getMonthlyTrendsData() {
  return db.FinancialRecord.findAll({
    where: {
      isDeleted: false
    },
    attributes: [
      [fn('DATE_FORMAT', col('date'), '%Y-%m'), 'month'],
      'type',
      [fn('SUM', col('amount')), 'total']
    ],
    group: [fn('DATE_FORMAT', col('date'), '%Y-%m'), 'type'],
    order: [[literal('month'), 'ASC']]
  });
}

module.exports = {
  countRecords,
  getSummaryData,
  getCategoryBreakdownData,
  getRecentActivityData,
  getMonthlyTrendsData
};