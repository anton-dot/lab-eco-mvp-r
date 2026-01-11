const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const config = require('./config');
const logger = require('./utils/logger');
const socketService = require('./services/socket.service');
const { routes } = require('./routes/routes');
const errorMiddleware = require('./middleware/error.middleware');

// Initialize mock data service (replaces database)
require('./services/mockData.service');

// Initialize cron jobs
require('./services/cron.service');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

socketService.initializeSocket(io);

// Load environment variables
dotenv.config({ path: `${config.nodeEnv}.env` });
app.set('env', config.nodeEnv);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});
  
// API routes
app.use('/api', routes);
  
// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
if (require.main === module) {
  const PORT = config.port;
  server.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    });
}

module.exports = { app, server, io };
