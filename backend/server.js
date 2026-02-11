const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { sanitizeInput } = require('./middleware/validator');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Trust proxy for GitHub Codespaces / reverse proxy environments
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());
app.use(compression()); // Compress responses

// CORS - Allow all origins for development
app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize all inputs
app.use(sanitizeInput);

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/connection', require('./routes/connection'));
app.use('/api/level', require('./routes/level'));

// Socket.IO Connection with error handling
io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  // Join user to their private room
  socket.on('join', (userId) => {
    try {
      socket.join(userId);
      console.log(`👤 User ${userId} joined their room`);
    } catch (error) {
      console.error('Join error:', error);
    }
  });

  // Handle sending messages
  socket.on('sendMessage', ({ from, to, message }) => {
    try {
      io.to(to).emit('receiveMessage', {
        from,
        message,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Send message error:', error);
    }
  });

  // Handle typing indicator
  socket.on('typing', ({ from, to }) => {
    try {
      io.to(to).emit('userTyping', { from });
    } catch (error) {
      console.error('Typing indicator error:', error);
    }
  });

  socket.on('stopTyping', ({ from, to }) => {
    try {
      io.to(to).emit('userStoppedTyping', { from });
    } catch (error) {
      console.error('Stop typing error:', error);
    }
  });

  // Online status
  socket.on('userOnline', (userId) => {
    try {
      socket.broadcast.emit('userStatusChange', { userId, status: 'online' });
    } catch (error) {
      console.error('Online status error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Promitto API is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Health check for monitoring
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔒 Security: Enabled`);
  console.log(`⚡ Compression: Enabled`);
  console.log(`🛡️  Rate Limiting: Active`);
  console.log(`💎 Connection Level System: Active`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});