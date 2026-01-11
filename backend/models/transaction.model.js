const mockData = require('../services/mockData.service');

class TransactionModel {
  async listByUser(data) {
    return mockData.getTransactionsByUserId(data.user_id);
  }
}

module.exports = new TransactionModel();
