const mockData = require('../services/mockData.service');

class StakingModel {
  async listByUser(data) {
    return mockData.getStakingByUserId(data.user_id);
  }
}

module.exports = new StakingModel();
