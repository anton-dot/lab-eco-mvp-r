const express = require('express');
const router = express.Router();
const { ensureWebToken, ensureWebTokenForAdmin } = require('../middleware/auth.middleware');
const registerController = require('../controllers/register.controller');
const adminController = require('../controllers/admin.controller');
const path = require('path');

// v1 API Routes
const v1AuthRoutes = require('./auth.routes');
const v1UserRoutes = require('./users.routes');
const v1WalletRoutes = require('./wallets.routes');
const v1StakingRoutes = require('./staking.routes');
const v1TransactionRoutes = require('./transactions.routes');
const v1WithdrawalRoutes = require('./withdrawals.routes');
const v1ReferralRoutes = require('./referrals.routes');
const v1PlanRoutes = require('./plans.routes');
const v1NotificationRoutes = require('./notifications.routes');
const v1TicketRoutes = require('./tickets.routes');
const v1WebhookRoutes = require('./webhooks.routes');
const v1HealthRoutes = require('./health.routes');

// Legacy routes (for backward compatibility)
router.post('/userregister', registerController.userRegister);
router.get('/getplandetail', registerController.getPlanDetails);
router.post('/busddeposit', ensureWebToken, registerController.depositBUSD);
router.post('/gettransactionhistory', ensureWebToken, registerController.getTransactionHistory);
router.post('/addStaking', ensureWebToken, registerController.addStaking);
router.post('/getstakingHistory', ensureWebToken, registerController.getStakingHistory);
router.post('/singalclaimreward', ensureWebToken, registerController.SingalClaimReward);
router.post('/sellplan', ensureWebToken, registerController.SellPlan);
router.post('/gettotalbalance', ensureWebToken, registerController.getTotalBalance);
router.post('/getreferraluserslist', registerController.getReferralUsersList);
router.post('/getwithdrawhistory', ensureWebToken, registerController.getWithdrawHistory);
router.post('/gettotalinvasted', registerController.getTotalInvested);
router.post('/withdrawcrypto', ensureWebToken, registerController.WithdrawCrypto);

// Admin routes
router.post('/getwithdrawrequest', ensureWebTokenForAdmin, adminController.getwithdrawrequest);
router.post('/approvewithdrawrequest', ensureWebTokenForAdmin, adminController.approvewithdrawrequest);
router.post('/rejectwithdrawrequest', ensureWebTokenForAdmin, adminController.rejectwithdrawrequest);
router.get('/getuserlist', ensureWebTokenForAdmin, adminController.getUserList);
router.get('/getstakingdetail', ensureWebTokenForAdmin, adminController.getStakingDetail);
router.get('/getstakingearningdetail', ensureWebTokenForAdmin, adminController.getStakingEarningDetail);
router.get('/getdepositbusd', ensureWebTokenForAdmin, adminController.getdepositBUSDDetail);

// Image serving route
router.get('/images/:image', (req, res) => {
  const imagePath = path.resolve(process.cwd(), 'uploads', req.params.image);
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).json({ success: false, message: 'Image not found' });
    }
  });
});

// Mount versioned API routes
router.use('/v1/auth', v1AuthRoutes);
router.use('/v1/users', v1UserRoutes);
router.use('/v1/wallets', v1WalletRoutes);
router.use('/v1/staking', v1StakingRoutes);
router.use('/v1/transactions', v1TransactionRoutes);
router.use('/v1/withdrawals', v1WithdrawalRoutes);
router.use('/v1/referrals', v1ReferralRoutes);
router.use('/v1/plans', v1PlanRoutes);
router.use('/v1/notifications', v1NotificationRoutes);
router.use('/v1/tickets', v1TicketRoutes);
router.use('/v1/webhooks', v1WebhookRoutes);
router.use('/v1', v1HealthRoutes);

// 404 handler for unmatched routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

module.exports = { routes: router };
