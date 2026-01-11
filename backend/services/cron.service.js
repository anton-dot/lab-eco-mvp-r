const cron = require('node-cron');
const registerController = require('../controllers/register.controller');
const logger = require('../utils/logger');

// Run every minute to check for BUSD deposits
cron.schedule('* * * * *', async () => {
  try {
    logger.debug('Running userBUSDDepositCheck cron job');
    await registerController.userBUSDDepositCheck();
  } catch (error) {
    logger.error('Error in userBUSDDepositCheck cron job:', error);
  }
});

// Uncomment to run staking income daily at 1 AM
// cron.schedule('0 1 * * *', async () => {
//   try {
//     logger.info('Running usersStakingIncome cron job');
//     await registerController.usersStakingIncome();
//   } catch (error) {
//     logger.error('Error in usersStakingIncome cron job:', error);
//   }
// });

logger.info('Cron jobs initialized');

module.exports = {};

