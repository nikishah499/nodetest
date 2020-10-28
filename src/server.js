const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const httpStatus = require('http-status');
const { ValidationError } = require('express-validation');
const helmet = require('helmet');
const routes = require('./routes');
const config = require('./config');
const APIError = require('./helpers/APIError');

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse body params
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount all routes on /api
app.use('/api', routes);

// Convert error to APIError if it is not an instanceOf APIError
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    // Prepare error message for Validation error
    const allErrors = err.details.map((pathErrors) => Object.values(pathErrors).join(', '));
    const unifiedErrorMessage = allErrors.join(', ').replace(/, ([^,]*)$/, ' and $1');
    const error = new APIError(unifiedErrorMessage, err.statusCode);
    return next(error);
  }
  if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API Not Found', httpStatus.NOT_FOUND);
  return next(err);
});

// error handler
app.use((err, req, res, next) =>
  res.status(err.status).json({
    statusCode: httpStatus[err.status],
    message: err.message
  }));

module.exports = app;
