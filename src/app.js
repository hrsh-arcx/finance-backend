const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorMiddleware = require('./middlewares/errorMiddleware');
const {StatusCodes} = require('http-status-codes')
const authRoutes = require('./modules/auth/authRoutes')

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Server is running'
  });
});

app.use('/api/v1/auth',authRoutes);
app.use(errorMiddleware);

module.exports = app;