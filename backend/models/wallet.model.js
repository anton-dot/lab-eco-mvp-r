const mockData = require('../services/mockData.service');

class WalletModel {
  async addWallet(data) {
    return mockData.createWallet(data);
  }

  async listWallets(data) {
    return mockData.getWalletsByUserId(data.user_id);
  }

  async removeWallet(data) {
    return mockData.deleteWallet(data.id, data.user_id);
  }
}

module.exports = new WalletModel();
