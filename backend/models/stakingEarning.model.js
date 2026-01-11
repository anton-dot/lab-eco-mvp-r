const mockData = require('../services/mockData.service');

class StakingEarningModel {
  async listByUser(data) {
    const earnings = mockData.getAllStakingEarnings();
    return earnings.filter(e => e.user_id === parseInt(data.user_id));
  }
}

module.exports = new StakingEarningModel();
