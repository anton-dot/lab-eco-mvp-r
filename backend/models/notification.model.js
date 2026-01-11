const mockData = require('../services/mockData.service');

class NotificationModel {
  async list(data) {
    const notifications = mockData.getNotificationsByUserId(data.user_id);
    return notifications.map(n => ({
      id: n.id,
      user_id: n.user_id,
      type: n.type,
      title: n.title,
      body: n.message,
      is_read: n.is_read,
      created_at: n.created_at,
    }));
  }

  async markRead(data) {
    // Mock: Mark notification as read (would need to add this to mockData service)
    return { affectedRows: 1 };
  }
}

module.exports = new NotificationModel();
