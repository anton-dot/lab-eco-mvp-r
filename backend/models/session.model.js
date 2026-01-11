// Session model - using in-memory storage for demo
// In production, this would use Redis or database
const mockData = require('../services/mockData.service');

class SessionModel {
  async save(data) {
    // Mock: Store session in memory
    const session = {
      user_id: data.user_id,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
    };
    mockData.sessions.set(data.refresh_token, session);
    return { insertId: 1, ...session };
  }

  async revoke(data) {
    // Mock: Remove session
    const deleted = mockData.sessions.delete(data.refresh_token);
    return { affectedRows: deleted ? 1 : 0 };
  }

  async find(data) {
    // Mock: Find session
    return mockData.sessions.get(data.refresh_token) || null;
  }
}

module.exports = new SessionModel();
