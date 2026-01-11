const mockData = require('../services/mockData.service');

class TicketModel {
  async create(data) {
    return mockData.createTicket({
      user_id: data.user_id,
      subject: data.subject,
      status: 'open',
    });
  }

  async list(data) {
    return mockData.getTicketsByUserId(data.user_id);
  }
}

module.exports = new TicketModel();
