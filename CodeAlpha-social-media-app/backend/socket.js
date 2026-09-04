const jwt = require('jsonwebtoken');
require('dotenv').config();

// Maps userId (string) -> Set of socket ids (a user can have multiple tabs/devices open)
const onlineUsers = new Map();

let ioInstance = null;

function initSocket(io) {
  ioInstance = io;

  // Authenticate every socket connection using the same JWT used for the REST API
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error('Authentication token missing'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;

    // Track this socket for the user & join a personal room named after their id
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);
    socket.join(userId);

    // Let everyone know this user just came online (first connection only)
    if (onlineUsers.get(userId).size === 1) {
      io.emit('presence:update', { userId, online: true });
    }

    // --- Direct messaging ---
    socket.on('message:send', async (payload, callback) => {
      try {
        const Message = require('./models/Message');
        const { recipientId, text } = payload || {};
        if (!recipientId || !text || !text.trim()) {
          if (callback) callback({ ok: false, error: 'recipientId and text are required' });
          return;
        }
        const message = await Message.create({ sender: userId, recipient: recipientId, text: text.trim() });
        const populated = await message.populate('sender', '-password');

        // Deliver instantly to recipient (if online) and echo back to sender's other tabs
        io.to(recipientId).emit('message:new', populated);
        io.to(userId).emit('message:new', populated);

        // Create a notification for the recipient
        const Notification = require('./models/Notification');
        const notif = await Notification.create({
          recipient: recipientId,
          sender: userId,
          type: 'message',
          text: text.trim().slice(0, 80)
        });
        const populatedNotif = await notif.populate('sender', '-password');
        io.to(recipientId).emit('notification:new', populatedNotif);

        if (callback) callback({ ok: true, message: populated });
      } catch (err) {
        console.error('socket message:send error', err);
        if (callback) callback({ ok: false, error: 'Server error' });
      }
    });

    // Typing indicator relay
    socket.on('typing:start', ({ recipientId }) => {
      if (recipientId) io.to(recipientId).emit('typing:start', { userId });
    });
    socket.on('typing:stop', ({ recipientId }) => {
      if (recipientId) io.to(recipientId).emit('typing:stop', { userId });
    });

    socket.on('disconnect', () => {
      const set = onlineUsers.get(userId);
      if (set) {
        set.delete(socket.id);
        if (set.size === 0) {
          onlineUsers.delete(userId);
          io.emit('presence:update', { userId, online: false });
        }
      }
    });
  });
}

function isOnline(userId) {
  return onlineUsers.has(String(userId));
}

function getOnlineUserIds() {
  return Array.from(onlineUsers.keys());
}

// Used by REST routes (likes, comments, follows) to push a real-time notification
function emitNotification(recipientId, notification) {
  if (ioInstance) ioInstance.to(String(recipientId)).emit('notification:new', notification);
}

module.exports = { initSocket, isOnline, getOnlineUserIds, emitNotification };
