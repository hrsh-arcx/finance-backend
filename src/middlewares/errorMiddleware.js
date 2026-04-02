function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const errors = err.errors || [];

  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
}

module.exports = errorMiddleware;