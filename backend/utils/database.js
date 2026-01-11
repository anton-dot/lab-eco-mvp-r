// Database utility (demo mode)
// In the demo project, we do NOT connect to a real database.
// All data access has been refactored to use the in-memory mock data service.
// This file is kept only to avoid breaking legacy imports.

const logger = require('./logger');

const notAvailable = async () => {
  logger.warn('Database access attempted in demo mode. Using mock data only.');
  throw new Error('Database is not available in demo mode. All data is mock/in-memory.');
};

const pool = {};

const promisePool = {
  query: notAvailable,
};

module.exports = {
  pool,
  promisePool,
};
