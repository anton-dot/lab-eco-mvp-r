/**
 * Mock Data Service
 * In-memory data storage for demo purposes (replaces MySQL database)
 */

class MockDataService {
  constructor() {
    // Initialize in-memory data stores
    this.users = new Map();
    this.wallets = new Map();
    this.stakingPlans = [];
    this.staking = new Map();
    this.stakingEarnings = new Map();
    this.transactions = new Map();
    this.withdrawRequests = new Map();
    this.referralTransactions = new Map();
    this.notifications = new Map();
    this.tickets = new Map();
    this.ticketMessages = new Map();
    this.sessions = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Sample staking plans
    this.stakingPlans = [
      { id: 1, price: 100, duration: 30, token: 'MBUSD', staking_percentage: 5, created_at: new Date() },
      { id: 2, price: 500, duration: 60, token: 'MBUSD', staking_percentage: 8, created_at: new Date() },
      { id: 3, price: 1000, duration: 90, token: 'MBUSD', staking_percentage: 12, created_at: new Date() },
    ];

    // Sample admin user
    const adminId = 1;
    this.users.set(adminId, {
      id: adminId,
      address: '0x1234567890123456789012345678901234567890',
      referral_code: 'ADMIN01',
      referral_id: null,
      token_balance: 10000,
      MBUSD_balance: 50000,
      is_admin: 1,
      datetime: new Date(),
    });

    // Sample regular user
    const userId = 2;
    this.users.set(userId, {
      id: userId,
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      referral_code: 'USER01',
      referral_id: null,
      token_balance: 5000,
      MBUSD_balance: 25000,
      is_admin: 0,
      datetime: new Date(),
    });

    // Sample wallet
    this.wallets.set(1, {
      id: 1,
      user_id: userId,
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      chain: 'BSC',
      is_primary: 1,
      created_at: new Date(),
    });

    // Sample staking
    this.staking.set(1, {
      id: 1,
      user_id: userId,
      token_amount: 1000,
      busd_amount: 100,
      staking_period_id: 1,
      staking_duration: 30,
      staking_percentage: 5,
      reward_token: 50,
      trx_hash: '0x1111111111111111111111111111111111111111',
      is_claim: 1,
      status: 1,
      quantity: 1,
      remaining_quantity: 1,
      created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    });

    // Sample transactions
    this.transactions.set(1, {
      id: 1,
      user_id: userId,
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      from_address: '0x1111111111111111111111111111111111111111',
      to_address: '0x2222222222222222222222222222222222222222',
      hash: '0x3333333333333333333333333333333333333333',
      busd_amount: 100,
      token: 1000,
      transaction_type_id: 1,
      status: 1,
      isblockchainConfirm: 1,
      created_at: new Date(),
    });

    // Counter for auto-increment IDs
    this.counters = {
      users: 3,
      wallets: 2,
      staking: 2,
      stakingEarnings: 1,
      transactions: 2,
      withdrawRequests: 1,
      referralTransactions: 1,
      notifications: 1,
      tickets: 1,
      ticketMessages: 1,
    };
  }

  // User operations
  getUserByAddress(address) {
    for (const user of this.users.values()) {
      if (user.address.toLowerCase() === address.toLowerCase()) {
        return [user];
      }
    }
    return [];
  }

  getUserByReferralCode(referralCode) {
    for (const user of this.users.values()) {
      if (user.referral_code === referralCode) {
        return [user];
      }
    }
    return [];
  }

  getUserById(id) {
    const user = this.users.get(parseInt(id));
    return user ? [user] : [];
  }

  createUser(data) {
    const id = this.counters.users++;
    const user = {
      id,
      address: data.address,
      referral_code: data.referral_code || `REF${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      referral_id: data.referral_id || null,
      token_balance: 0,
      MBUSD_balance: 0,
      is_admin: 0,
      datetime: new Date(),
    };
    this.users.set(id, user);
    return { insertId: id, ...user };
  }

  updateUserBalance(userId, field, amount) {
    const user = this.users.get(parseInt(userId));
    if (user) {
      user[field] = (user[field] || 0) + parseFloat(amount);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // Wallet operations
  createWallet(data) {
    const id = this.counters.wallets++;
    const wallet = {
      id,
      user_id: data.user_id,
      address: data.address,
      chain: data.chain || 'BSC',
      is_primary: data.is_primary ? 1 : 0,
      created_at: new Date(),
    };
    this.wallets.set(id, wallet);
    return { insertId: id, ...wallet };
  }

  getWalletsByUserId(userId) {
    const wallets = [];
    for (const wallet of this.wallets.values()) {
      if (wallet.user_id === parseInt(userId)) {
        wallets.push(wallet);
      }
    }
    return wallets.sort((a, b) => b.id - a.id);
  }

  deleteWallet(id, userId) {
    const wallet = this.wallets.get(parseInt(id));
    if (wallet && wallet.user_id === parseInt(userId)) {
      this.wallets.delete(parseInt(id));
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // Staking plan operations
  getStakingPlans() {
    return [...this.stakingPlans];
  }

  getStakingPlanById(id) {
    return this.stakingPlans.find(plan => plan.id === parseInt(id)) || null;
  }

  // Staking operations
  createStaking(data) {
    const id = this.counters.staking++;
    const staking = {
      id,
      user_id: data.user_id,
      token_amount: data.token_amount,
      busd_amount: data.busd_amount,
      staking_period_id: data.staking_period_id,
      staking_duration: data.staking_duration,
      staking_percentage: data.staking_percentage,
      reward_token: data.reward_token,
      trx_hash: data.hash,
      is_claim: 1,
      status: 1,
      quantity: data.quantity,
      remaining_quantity: data.remaining_quantity,
      created_date: new Date(),
    };
    this.staking.set(id, staking);
    return { insertId: id, ...staking };
  }

  getStakingById(id, periodId, userId) {
    const staking = this.staking.get(parseInt(id));
    if (staking && staking.staking_period_id === parseInt(periodId) && staking.user_id === parseInt(userId)) {
      return [staking];
    }
    return [];
  }

  getStakingByUserId(userId) {
    const stakings = [];
    for (const staking of this.staking.values()) {
      if (staking.user_id === parseInt(userId)) {
        // Calculate mock total reward
        const daysSinceCreation = Math.floor((Date.now() - new Date(staking.created_date).getTime()) / (1000 * 60 * 60 * 24));
        const totalReward = (staking.reward_token * staking.remaining_quantity * daysSinceCreation) / staking.staking_duration;
        const unstakeDate = new Date(staking.created_date);
        unstakeDate.setDate(unstakeDate.getDate() + staking.staking_duration);
        const remainingSeconds = Math.max(0, Math.floor((unstakeDate.getTime() - Date.now()) / 1000));
        
        stakings.push({
          ...staking,
          totalreward: totalReward,
          unstakeDate,
          remaining_second: remainingSeconds,
        });
      }
    }
    return stakings.sort((a, b) => b.id - a.id);
  }

  updateStakingStatus(id, userId, updates) {
    const staking = this.staking.get(parseInt(id));
    if (staking && staking.user_id === parseInt(userId)) {
      Object.assign(staking, updates);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // Transaction operations
  createTransaction(data) {
    const id = this.counters.transactions++;
    const transaction = {
      id,
      user_id: data.user_id,
      address: data.address,
      staking_id: data.staking_id || null,
      from_address: data.from_address || null,
      to_address: data.to_address || null,
      hash: data.hash || null,
      busd_amount: data.busd_amount || 0,
      token: data.token || 0,
      transaction_type_id: data.transaction_type_id || 1,
      status: data.status || 1,
      isblockchainConfirm: data.isblockchainConfirm || 0,
      referred_by: data.referred_by || null,
      referral_level: data.referral_level || null,
      referral_trx_id: data.referral_trx_id || null,
      referral_percent: data.referral_percent || null,
      created_at: new Date(),
    };
    this.transactions.set(id, transaction);
    return { insertId: id, ...transaction };
  }

  getTransactionByHash(hash) {
    for (const transaction of this.transactions.values()) {
      if (transaction.hash && transaction.hash.toUpperCase() === hash.toUpperCase()) {
        return [transaction];
      }
    }
    return [];
  }

  getTransactionsByUserId(userId, typeId = null) {
    const transactions = [];
    for (const transaction of this.transactions.values()) {
      if (transaction.user_id === parseInt(userId)) {
        if (!typeId || transaction.transaction_type_id === parseInt(typeId)) {
          transactions.push(transaction);
        }
      }
    }
    return transactions.sort((a, b) => b.id - a.id);
  }

  updateTransaction(id, updates) {
    const transaction = this.transactions.get(parseInt(id));
    if (transaction) {
      Object.assign(transaction, updates);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  getPendingDeposits() {
    const deposits = [];
    for (const transaction of this.transactions.values()) {
      if (transaction.transaction_type_id === 1 && transaction.isblockchainConfirm === 0) {
        deposits.push(transaction);
      }
    }
    return deposits;
  }

  // Withdrawal operations
  createWithdrawRequest(data) {
    const id = this.counters.withdrawRequests++;
    const request = {
      id,
      user_id: data.user_id,
      withdrawal_address: data.withdrawal_address,
      token: data.token,
      busd_amount: data.busd_amount,
      fee: data.fee || 0,
      hash: data.hash || null,
      status: data.status || 0,
      created_at: new Date(),
    };
    this.withdrawRequests.set(id, request);
    return { insertId: id, ...request };
  }

  getWithdrawRequestsByUserId(userId) {
    const requests = [];
    for (const request of this.withdrawRequests.values()) {
      if (request.user_id === parseInt(userId)) {
        const user = this.getUserById(userId)[0];
        requests.push({
          ...request,
          address: user ? user.address : null,
        });
      }
    }
    return requests.sort((a, b) => b.id - a.id);
  }

  getAllWithdrawRequests() {
    const requests = [];
    for (const request of this.withdrawRequests.values()) {
      const user = this.getUserById(request.user_id)[0];
      requests.push({
        ...request,
        address: user ? user.address : null,
      });
    }
    return requests.sort((a, b) => b.id - a.id);
  }

  updateWithdrawRequest(id, updates) {
    const request = this.withdrawRequests.get(parseInt(id));
    if (request) {
      Object.assign(request, updates);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // Referral operations
  createReferralTransaction(data) {
    const id = this.counters.referralTransactions++;
    const refTransaction = {
      id,
      address: data.address,
      to_address: data.to_address,
      amount: data.amount,
      ref_balance: data.ref_balance,
      percentage: data.percentage,
      datetime: new Date(),
    };
    this.referralTransactions.set(id, refTransaction);
    return { insertId: id, ...refTransaction };
  }

  getReferralUsers(userId) {
    const referrals = [];
    for (const user of this.users.values()) {
      if (user.referral_id === parseInt(userId)) {
        // Calculate total tokens from transactions
        let totalToken = 0;
        for (const transaction of this.transactions.values()) {
          if (transaction.referred_by === user.id && transaction.token) {
            totalToken += parseFloat(transaction.token);
          }
        }
        referrals.push({
          referral_user: user.id,
          address: user.address,
          datetime: user.datetime,
          token: totalToken,
        });
      }
    }
    return referrals;
  }

  // Statistics
  getTotalInvested() {
    let invested = 0;
    let investors = this.users.size;
    let reward = 0;

    for (const transaction of this.transactions.values()) {
      if (transaction.transaction_type_id === 1 && transaction.isblockchainConfirm === 1) {
        invested += parseFloat(transaction.busd_amount || 0);
      }
    }

    for (const earning of this.stakingEarnings.values()) {
      reward += parseFloat(earning.reward_token || 0);
    }

    return [{
      invested,
      investors,
      reward,
    }];
  }

  getTotalBalance(userId) {
    const user = this.users.get(parseInt(userId));
    if (user) {
      return [{
        total_balance: user.token_balance || 0,
        MBUSD_total_balance: user.MBUSD_balance || 0,
      }];
    }
    return [{
      total_balance: 0,
      MBUSD_total_balance: 0,
    }];
  }

  // Staking earnings
  createStakingEarning(data) {
    const id = this.counters.stakingEarnings++;
    const earning = {
      id,
      staking_id: data.staking_id,
      user_id: data.user_id,
      staking_period_id: data.staking_period_id,
      reward_token: data.reward_token,
      is_claim: data.is_claim || 1,
      status: data.status || 1,
      datetime: new Date(),
    };
    this.stakingEarnings.set(id, earning);
    return { insertId: id, ...earning };
  }

  getStakingEarningsByStakingId(stakingId) {
    const earnings = [];
    for (const earning of this.stakingEarnings.values()) {
      if (earning.staking_id === parseInt(stakingId)) {
        earnings.push(earning);
      }
    }
    return earnings.sort((a, b) => b.id - a.id);
  }

  getAllStakingEarnings() {
    return Array.from(this.stakingEarnings.values()).sort((a, b) => b.id - a.id);
  }

  // Notification operations
  createNotification(data) {
    const id = this.counters.notifications++;
    const notification = {
      id,
      user_id: data.user_id,
      title: data.title,
      message: data.message,
      type: data.type || 'info',
      is_read: 0,
      created_at: new Date(),
    };
    this.notifications.set(id, notification);
    return { insertId: id, ...notification };
  }

  getNotificationsByUserId(userId) {
    const notifications = [];
    for (const notification of this.notifications.values()) {
      if (notification.user_id === parseInt(userId)) {
        notifications.push(notification);
      }
    }
    return notifications.sort((a, b) => b.id - a.id);
  }

  // Ticket operations
  createTicket(data) {
    const id = this.counters.tickets++;
    const ticket = {
      id,
      user_id: data.user_id,
      subject: data.subject,
      status: data.status || 'open',
      created_at: new Date(),
    };
    this.tickets.set(id, ticket);
    return { insertId: id, ...ticket };
  }

  getTicketsByUserId(userId) {
    const tickets = [];
    for (const ticket of this.tickets.values()) {
      if (ticket.user_id === parseInt(userId)) {
        tickets.push(ticket);
      }
    }
    return tickets.sort((a, b) => b.id - a.id);
  }

  getAllTickets() {
    return Array.from(this.tickets.values()).sort((a, b) => b.id - a.id);
  }

  // Ticket message operations
  createTicketMessage(data) {
    const id = this.counters.ticketMessages++;
    const message = {
      id,
      ticket_id: data.ticket_id,
      user_id: data.user_id,
      message: data.message,
      is_admin: data.is_admin || 0,
      created_at: new Date(),
    };
    this.ticketMessages.set(id, message);
    return { insertId: id, ...message };
  }

  getTicketMessagesByTicketId(ticketId) {
    const messages = [];
    for (const message of this.ticketMessages.values()) {
      if (message.ticket_id === parseInt(ticketId)) {
        messages.push(message);
      }
    }
    return messages.sort((a, b) => a.id - b.id);
  }

  // Admin operations
  getAllUsers() {
    return Array.from(this.users.values()).sort((a, b) => b.id - a.id);
  }

  getAllStaking() {
    return Array.from(this.staking.values()).sort((a, b) => b.id - a.id);
  }

  getAllTransactions() {
    return Array.from(this.transactions.values()).sort((a, b) => b.id - a.id);
  }

  getAllStaking() {
    return Array.from(this.staking.values()).sort((a, b) => b.id - a.id);
  }
}

// Export singleton instance
module.exports = new MockDataService();

