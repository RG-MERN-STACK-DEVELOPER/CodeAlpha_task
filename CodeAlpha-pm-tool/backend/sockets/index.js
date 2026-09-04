const jwt = require("jsonwebtoken");

module.exports = function initSocket(io) {
  // Authenticate socket connections using the same JWT used for REST API
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication error"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (user ${socket.userId})`);

    // Every user automatically joins their personal notification room
    socket.join(`user:${socket.userId}`);

    // Client asks to join a project board room to receive live task/comment updates
    socket.on("project:join", (projectId) => {
      socket.join(`project:${projectId}`);
    });

    socket.on("project:leave", (projectId) => {
      socket.leave(`project:${projectId}`);
    });

    // Simple "user is typing a comment" indicator
    socket.on("comment:typing", ({ projectId, taskId, userName }) => {
      socket.to(`project:${projectId}`).emit("comment:typing", { taskId, userName });
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
