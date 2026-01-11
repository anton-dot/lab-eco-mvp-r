const mockData = require('../services/mockData.service');

class AdminModel {
  async getWithdrawRequest() {
    return mockData.getAllWithdrawRequests();
  }

  async approveWithdrawRequest(data) {
    return mockData.updateWithdrawRequest(data.id, {
      status: 1,
      hash: data.hash,
    });
  }

  async rejectWithdrawRequest(data) {
    return mockData.updateWithdrawRequest(data.request_id, {
      status: 2,
    });
  }

  async balanceUpdate(data) {
    return mockData.updateUserBalance(data.user_id, 'token_balance', data.token_amount);
  }

  async getUserList() {
    const users = mockData.getAllUsers();
    return users
      .filter(u => u.is_admin === 0)
      .map(u => ({
        id: u.id,
        address: u.address,
        referral_code: u.referral_code,
        token_balance: u.token_balance,
        MBUSD_balance: u.MBUSD_balance,
        datetime: u.datetime,
      }));
  }

  async getStakingDetail() {
    const allStaking = mockData.getAllStaking();
    const plans = mockData.getStakingPlans();
    return allStaking.map(s => {
      const plan = plans.find(p => p.id === s.staking_period_id);
      const user = mockData.getUserById(s.user_id)[0];
      return {
        token_amount: s.token_amount,
        staking_period_id: s.staking_period_id,
        staking_percentage: s.staking_percentage,
        staking_duration: s.staking_duration,
        reward_token: s.reward_token,
        remaining_quantity: s.remaining_quantity,
        is_claim: s.is_claim,
        status: s.status,
        address: user ? user.address : null,
        created_date: s.created_date,
        plan_name: plan ? `Plan ${plan.id}` : null,
      };
    });
  }

  async getStakingEarningDetail() {
    const earnings = mockData.getAllStakingEarnings();
    const plans = mockData.getStakingPlans();
    return earnings.map(se => {
      const staking = mockData.getStakingById(se.staking_id, se.staking_period_id, se.user_id)[0];
      const plan = plans.find(p => p.id === se.staking_period_id);
      const user = mockData.getUserById(se.user_id)[0];
      return {
        reward_token: se.reward_token,
        is_claim: se.is_claim,
        status: se.status,
        datetime: se.datetime,
        staking_period_id: se.staking_period_id,
        address: user ? user.address : null,
        staking_duration: staking ? staking.staking_duration : null,
        token_amount: staking ? staking.token_amount : null,
        remaining_quantity: staking ? staking.remaining_quantity : null,
        perreward: staking ? staking.reward_token : null,
        plan_name: plan ? `Plan ${plan.id}` : null,
      };
    });
  }

  async getDepositBUSDDetail() {
    const transactions = mockData.getAllTransactions();
    return transactions
      .filter(t => t.transaction_type_id === 1)
      .map(t => ({
        address: t.address,
        from_address: t.from_address,
        to_address: t.to_address,
        hash: t.hash,
        busd_amount: t.busd_amount,
        token: t.token,
        status: t.status,
        datetime: t.created_at,
      }));
  }
}

module.exports = new AdminModel();
