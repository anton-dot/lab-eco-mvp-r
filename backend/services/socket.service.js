const logger = require('../utils/logger');
const mockData = require('./mockData.service');

class SocketService {
  constructor() {
    this.activeUsers = new Map();
  }

  newUser(socketId, username, room) {
    const user = { socketId, username, room };
    this.activeUsers.set(socketId, user);
    return user;
  }

  getActiveUser(socketId) {
    return this.activeUsers.get(socketId);
  }

  exitRoom(socketId) {
    const user = this.activeUsers.get(socketId);
    if (user) {
      this.activeUsers.delete(socketId);
    }
    return user;
  }

  getIndividualRoomUsers(room) {
    const users = [];
    this.activeUsers.forEach((user) => {
      if (user.room === room) {
        users.push(user);
      }
    });
    return users;
  }

  async handleJoinRoom(socket, data, io) {
    try {
      const receiveData = typeof data === 'string' ? JSON.parse(data) : data;
      const ticketId = receiveData.room;

      if (!ticketId) {
        socket.emit('error', { message: 'Room ID is required' });
        return;
      }

      const ticketMessages = mockData.getTicketMessagesByTicketId(ticketId);

      if (ticketMessages.length > 0) {
        const user = this.newUser(socket.id, receiveData.username, receiveData.room);
        socket.join(user.room);

        io.to(user.room).emit('roomUsers', {
          chatHistory: ticketMessages,
          room: user.room,
          users: this.getIndividualRoomUsers(user.room),
        });
      }
    } catch (error) {
      logger.error('Error handling join room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  }

  async handleChatMessage(socket, data, io) {
    try {
      const newChatHistory = typeof data === 'string' ? JSON.parse(data) : data;
      const { ticket_id: ticketId, sender, receiver, message } = newChatHistory;

      if (!ticketId || !sender || !message) {
        socket.emit('error', { message: 'Missing required fields' });
        return;
      }

      mockData.createTicketMessage({
        ticket_id: ticketId,
        user_id: sender,
        message,
        is_admin: receiver ? 0 : 1,
      });

      const user = this.getActiveUser(socket.id);
      if (!user) {
        socket.emit('error', { message: 'User not found in active users' });
        return;
      }

      const ticketMessages = mockData.getTicketMessagesByTicketId(ticketId);

      io.to(user.room).emit('message', {
        username: user.username,
        messages: ticketMessages,
      });
    } catch (error) {
      logger.error('Error handling chat message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  handleDisconnect(socket, io) {
    const user = this.exitRoom(socket.id);
    if (user) {
      logger.info(`User ${user.username} has left room ${user.room}`);
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: this.getIndividualRoomUsers(user.room),
      });
    }
  }

  initializeSocket(io) {
    io.on('connection', (socket) => {
      logger.info('Socket connected:', socket.id);

      socket.on('joinRoom', async (data) => {
        await this.handleJoinRoom(socket, data, io);
      });

      socket.on('chatMessage', async (data) => {
        await this.handleChatMessage(socket, data, io);
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(socket, io);
      });
    });
  }
}

module.exports = new SocketService();

