const {dashboardRepository} = require('../repositories');

async function getSummary(filters = {}) {
  const { totalIncome, totalExpenses } = await dashboardRepository.getSummaryData(filters);

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses
  };
}

async function getCategoryBreakdown() {
  const rows = await dashboardRepository.getCategoryBreakdownData();

  return rows.map((row) => ({
    type: row.type,
    category: row.category,
    total: Number(row.dataValues.total)
  }));
}

async function getRecentActivity(limit) {
  const total = await dashboardRepository.countRecords();
  const safeLimit = Math.min(limit, total) || 5;
  return dashboardRepository.getRecentActivityData(safeLimit);
}

async function getMonthlyTrends() {
  const rows = await dashboardRepository.getMonthlyTrendsData();

  const trendMap = {};

  for (const row of rows) {
    const month = row.dataValues.month;
    const type = row.type;
    const total = Number(row.dataValues.total);

    if (!trendMap[month]) {
      trendMap[month] = {
        month,
        income: 0,
        expense: 0
      };
    }

    if (type === 'INCOME') {
      trendMap[month].income = total;
    } else if (type === 'EXPENSE') {
      trendMap[month].expense = total;
    }
  }

  return Object.values(trendMap);
}

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getRecentActivity,
  getMonthlyTrends
};