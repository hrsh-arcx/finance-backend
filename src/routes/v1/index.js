const express = require('express')
const router = express.Router();

const authRoute = require('./authRoutes');
router.use('/auth',authRoute);

const userRoute = require('./userRoutes');
router.use('/users',userRoute);

const recordRoute = require('./recordRoutes');
router.use('/records',recordRoute);

const dashboardRoute = require('./dashboardRoutes');
router.use('/dashboard',dashboardRoute);

module.exports = router;