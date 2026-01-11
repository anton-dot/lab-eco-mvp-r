const mockData = require('../services/mockData.service');

class ReferralTransactionModel {
  async listByUser(data) {
    const transactions = mockData.getAllTransactions();
    return transactions.filter(
      t => t.transaction_type_id === 4 && t.user_id === parseInt(data.user_id)
    );
  }
}

module.exports = new ReferralTransactionModel();
