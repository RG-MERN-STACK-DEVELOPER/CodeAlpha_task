const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/connectly';

// Socket.io - real-time notifications & live chat
const io = new Server(server, {
  cors: { origin: '*' }
});
const { initSocket } = require('./socket');
initSocket(io);
// Make io accessible inside REST route handlers via req.app.get('io')
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve Frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api', require('./routes/comments'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));

// Catch-all route to serve frontend index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Database Connection & Server Start
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB database successfully.');
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection warning:', err.message);
    console.warn('⚡ Running in demonstration fallback mode with local persistence.');
  });

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON payload:', err);
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }
  console.error('Unexpected error:', err);
  res.status(500).json({ message: 'Server error' });
});
server.listen(PORT, () => {
  console.log(`🚀 Connectly server (HTTP + Socket.io) running at http://localhost:${PORT}`);
});
