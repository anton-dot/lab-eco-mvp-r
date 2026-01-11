const mockData = require('../services/mockData.service');

class StakingPlanModel {
  async list() {
    return mockData.getStakingPlans();
  }

  async find(id) {
    return mockData.getStakingPlanById(id);
  }
}

module.exports = new StakingPlanModel();
