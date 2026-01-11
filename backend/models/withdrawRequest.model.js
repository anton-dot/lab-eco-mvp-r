const mockData = require('../services/mockData.service');

class WithdrawRequestModel {
  async create(data) {
    return mockData.createWithdrawRequest({
      user_id: data.user_id,
      withdrawal_address: data.withdrawal_address,
      token: data.token,
      busd_amount: data.busd_amount,
      status: 0,
    });
  }

  async listByUser(data) {
    return mockData.getWithdrawRequestsByUserId(data.user_id);
  }
}

module.exports = new WithdrawRequestModel();
