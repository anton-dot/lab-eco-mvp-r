const config = require('../config');

// Log levels: error < warn < info < debug
const levels = { error: 0, warn: 1, info: 2, debug: 3 };
// Default to "error" to keep the console quiet unless overridden
const currentLevel = (process.env.LOG_LEVEL || 'error').toLowerCase();

function shouldLog(level) {
  return levels[level] <= levels[currentLevel];
}

const logger = {
  info: (message, ...args) => {
    if (shouldLog('info')) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  error: (message, ...args) => {
    if (shouldLog('error')) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  warn: (message, ...args) => {
    if (shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  debug: (message, ...args) => {
    if (shouldLog('debug')) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  level: currentLevel,
};

module.exports = logger;

