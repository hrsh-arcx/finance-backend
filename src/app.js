const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorMiddleware = require('./middlewares/errorMiddleware');
const {StatusCodes} = require('http-status-codes')
const apiRouter = require('./routes')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')

const swaggerdocument = YAML.load('./src/docs/swagger.yaml')
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerdocument));

app.get('/health', (req, res) => {
  return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Server is running'
  });
});

app.use('/api',apiRouter);
app.use(errorMiddleware);

module.exports = app;