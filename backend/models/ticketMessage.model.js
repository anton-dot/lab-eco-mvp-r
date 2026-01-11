const mockData = require('../services/mockData.service');

class TicketMessageModel {
  async create(data) {
    return mockData.createTicketMessage({
      ticket_id: data.ticket_id,
      user_id: data.sender_id,
      message: data.message,
      is_admin: data.receiver_id ? 0 : 1,
    });
  }

  async list(data) {
    const messages = mockData.getTicketMessagesByTicketId(data.ticket_id);
    return messages.map(m => ({
      id: m.id,
      ticket_id: m.ticket_id,
      sender: m.user_id,
      receiver: m.is_admin ? null : m.user_id,
      message: m.message,
      datetime: m.created_at,
    }));
  }
}

module.exports = new TicketMessageModel();
