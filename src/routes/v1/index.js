const express = require('express')
const router = express.Router();

const authRoute = require('./authRoutes');
router.use('/auth',authRoute);

const userRoute = require('./userRoutes');
router.use('/users',userRoute);

module.exports = router;