const express = require('express');
const {dashboardController} = require('../../controllers');
const {authMiddleware,activeUserMiddleware,roleMiddleware} = require('../../middlewares');
const { ROLES } = require('../../utils/enums');
const router = express.Router();

router.use(authMiddleware, activeUserMiddleware);

router.get('/summary', dashboardController.summary);
router.get('/category-breakdown', dashboardController.categoryBreakdown);
router.get('/recent-activity', roleMiddleware(ROLES.ANALYST, ROLES.ADMIN), dashboardController.recentActivity);
router.get('/trends', dashboardController.monthlyTrends);

module.exports = router;