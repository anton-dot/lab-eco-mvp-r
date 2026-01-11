const logger = require('../utils/logger');

function errorMiddleware(error, req, res, next) {
  const { status = 500, message, data } = error;

  logger.error(`Error: ${message || 'Internal server error'}`, {
    path: req.path,
    method: req.method,
    status,
    error: error.stack,
  });

  const errorMessage = status === 500 || !message ? 'Internal server error' : message;

  const errorResponse = {
    success: false,
        status,
    message: errorMessage,
    ...(data && { data }),
  };

  res.status(status).json(errorResponse);
}

module.exports = errorMiddleware;
