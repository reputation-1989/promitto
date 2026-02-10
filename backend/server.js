const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/connection', require('./routes/connection'));

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join user to their private room
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle sending messages
  socket.on('sendMessage', ({ from, to, message }) => {
    // Emit to recipient's room
    io.to(to).emit('receiveMessage', {
      from,
      message,
      timestamp: new Date()
    });
  });

  // Handle typing indicator
  socket.on('typing', ({ from, to }) => {
    io.to(to).emit('userTyping', { from });
  });

  socket.on('stopTyping', ({ from, to }) => {
    io.to(to).emit('userStoppedTyping', { from });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Promitto API is running' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});