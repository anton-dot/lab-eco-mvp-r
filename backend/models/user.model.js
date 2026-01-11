const mockData = require('../services/mockData.service');

class UserModel {
  async getUsersDetailsAddress(data) {
    return mockData.getUserByAddress(data.address);
  }

  async getUserDetailsByAddress(referralCode) {
    return mockData.getUserByReferralCode(referralCode);
  }

  async getUsersAddress(data) {
    return mockData.getUserByAddress(data.address);
  }

  async checkBalanceFromStaking(data) {
    return mockData.getUserById(data.user_id);
  }

  async saveUserAddressDetails(data) {
    return mockData.createUser(data);
  }

  async saveReferralTransaction(data, address) {
    const refBalance = parseFloat((data.amount * 5) / 100).toFixed(2);
    return mockData.createReferralTransaction({
      address: data.address,
      to_address: address,
      amount: data.amount,
      ref_balance: refBalance,
      percentage: 5,
    });
  }

  async getPlanDetails() {
    return mockData.getStakingPlans();
  }

  async checkHash(data) {
    const transactions = mockData.getTransactionByHash(data.hash);
    return transactions.map(t => ({ id: t.id }));
  }

  async saveDepositBUSDDetails(data) {
    return mockData.createTransaction({
      user_id: data.user_id,
      address: data.address,
      from_address: data.from_address,
      to_address: data.to_address,
      hash: data.hash,
      busd_amount: data.busd_amount,
      token: data.token,
      transaction_type_id: 1,
      status: 1,
    });
  }

  async checkPeriodId(data) {
    const plan = mockData.getStakingPlanById(data.staking_period_id);
    if (plan) {
      return [{
        id: plan.id,
        price: plan.price,
        duration: plan.duration,
        token: plan.token,
      }];
    }
    return [];
  }

  async stakingQuantity(data) {
    const stakings = mockData.getStakingById(data.staking_id, data.staking_period_id, data.user_id);
    if (stakings.length > 0) {
      const staking = stakings[0];
      return [{
        id: staking.id,
        reward_token: staking.reward_token,
        remaining_quantity: staking.remaining_quantity,
      }];
    }
    return [];
  }

  async addStaking(data) {
    const result = mockData.createStaking({
      user_id: data.user_id,
      token_amount: data.token_amount,
      busd_amount: data.busd_amount,
      staking_period_id: data.staking_period_id,
      staking_duration: data.staking_duration,
      staking_percentage: data.staking_percentage,
      reward_token: data.reward_token,
      hash: data.hash,
      quantity: data.quantity,
      remaining_quantity: data.quantity,
    });

    // Create transaction
    mockData.createTransaction({
      user_id: data.user_id,
      address: data.address,
      staking_id: result.insertId,
      from_address: data.from_address,
      to_address: data.to_address,
      hash: data.hash,
      busd_amount: data.busd_amount,
      token: data.token_amount,
      transaction_type_id: 9,
      status: 1,
    });

    // Update balance
    const mbusdBalance = parseFloat(data.token_amount * data.quantity);
    mockData.updateUserBalance(data.user_id, 'MBUSD_balance', -mbusdBalance);

    return result;
  }

  async saveReferralIncome(data) {
    const newToken = parseFloat((data.token * 5) / 100);
    return mockData.createTransaction({
      user_id: data.user_id,
      address: data.address,
      referred_by: data.referred_by,
      busd_amount: data.busd_amount,
      token: newToken,
      referral_level: 1,
      referral_trx_id: data.referred_by,
      referral_percent: 5,
      transaction_type_id: 4,
      status: 1,
    });
  }

  async getReferralUser(data) {
    return mockData.getUserById(data);
  }

  async getTransactionHistory(data) {
    return mockData.getTransactionsByUserId(data.user_id, 1);
  }

  async getWithdrawHistory(data) {
    return mockData.getWithdrawRequestsByUserId(data.user_id);
  }

  async getStakingHistory(data) {
    return mockData.getStakingByUserId(data.user_id);
  }

  async usersStakingIncome() {
    // Mock: Create earnings for active staking
    const allStaking = mockData.getAllStaking();
    for (const staking of allStaking) {
      if (staking.status === 1 && staking.is_claim === 1) {
        mockData.createStakingEarning({
          staking_id: staking.id,
          user_id: staking.user_id,
          staking_period_id: staking.staking_period_id,
          reward_token: staking.reward_token * staking.remaining_quantity,
          is_claim: 1,
          status: 1,
        });
      }
    }
    return { affectedRows: allStaking.length };
  }

  async rewardClaimCheck(data) {
    const staking = mockData.getStakingById(data.staking_id, data.staking_period_id, data.user_id);
    if (staking.length > 0) {
      const s = staking[0];
      const earnings = mockData.getStakingEarningsByStakingId(data.staking_id);
      const lastEarning = earnings.length > 0 ? earnings[earnings.length - 1] : null;
      const lastDate = lastEarning ? new Date(lastEarning.datetime) : new Date(s.created_date);
      const hoursSinceLastClaim = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60);
      return [{
        datetime: lastEarning ? lastEarning.datetime : null,
        created_date: s.created_date,
        isClaimAvailable: hoursSinceLastClaim >= 24 ? 1 : 0,
      }];
    }
    return [];
  }

  async singalRewardClaim(data) {
    mockData.createStakingEarning({
      staking_id: data.staking_id,
      user_id: data.user_id,
      staking_period_id: data.staking_period_id,
      reward_token: data.token,
      is_claim: 1,
      status: 1,
    });

    mockData.updateUserBalance(data.user_id, 'token_balance', parseFloat(data.token));

    return { success: true };
  }

  async addBalance(data) {
    return mockData.updateUserBalance(data.user_id, 'MBUSD_balance', data.token);
  }

  async checkSellPlan(data) {
    const stakings = mockData.getStakingById(data.staking_id, data.staking_period_id, data.user_id);
    if (stakings.length > 0) {
      const staking = stakings[0];
      const createdDate = new Date(staking.created_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      createdDate.setHours(0, 0, 0, 0);
      
      if (staking.status === 1 && createdDate < today) {
        return [{
          id: staking.id,
          reward_token: staking.reward_token,
          remaining_quantity: staking.remaining_quantity,
        }];
      }
    }
    return [];
  }

  async sellPlan(data) {
    const newToken = data.reward_token * 14;
    mockData.updateStakingStatus(data.staking_id, data.user_id, {
      is_claim: 0,
      status: 0,
      plan_sell_date: new Date(),
    });

    mockData.updateUserBalance(data.user_id, 'token_balance', parseFloat(newToken));

    return { success: true };
  }

  async getTotalBalance(data) {
    return mockData.getTotalBalance(data.user_id);
  }

  async insertWithdrawRequest(data) {
    return mockData.createWithdrawRequest({
      user_id: data.user_id,
      withdrawal_address: data.withdrawal_address,
      token: data.token,
      busd_amount: data.busd_amount,
      status: 0,
    });
  }

  async withdrawCrypto(data) {
    return mockData.createWithdrawRequest({
      user_id: data.user_id,
      withdrawal_address: data.withdrawal_address,
      token: data.token,
      busd_amount: data.busd_amount,
      fee: data.fee,
      hash: data.hash,
      status: 1,
    });
  }

  async balanceUpdate(data) {
    mockData.updateTransaction(data.id, {
      busd_amount: data.busd_amount,
      token: data.token,
      isblockchainConfirm: 1,
    });

    mockData.updateUserBalance(data.user_id, 'MBUSD_balance', data.token);

    return { success: true };
  }

  async getReferralUsersList(data) {
    return mockData.getReferralUsers(data.user_id);
  }

  async getTotalInvested() {
    return mockData.getTotalInvested();
  }

  async userBalanceUpdate(data) {
    return this.balanceUpdate(data);
  }

  async userBalanceReject(data) {
    mockData.updateTransaction(data.id, { isblockchainConfirm: 2 });
    return { affectedRows: 1 };
  }

  async userBUSDDepositCheck() {
    return mockData.getPendingDeposits();
  }
}

module.exports = new UserModel();
