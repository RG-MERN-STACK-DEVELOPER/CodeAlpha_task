/* ==========================================================================
   CodeAlpha - REAL-TIME SOCKET CONNECTION (socket.js)
   Shared socket.io connection used by notifications.js and chat.js.
   Must be loaded AFTER auth.js and the socket.io CDN script.
   ========================================================================== */

let socket = null;

function initConnectlySocket() {
  const token = getAuthToken();
  if (!token || typeof io === 'undefined') return null;

  socket = io(API_BASE_URL.replace('/api', ''), {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true
  });

  socket.on('connect_error', (err) => {
    console.warn('Socket connection error:', err.message);
  });

  return socket;
}

function getConnectlySocket() {
  return socket || initConnectlySocket();
}

document.addEventListener('DOMContentLoaded', () => {
  // Demo/local users won't have a real backend token; the socket will simply
  // fail to authenticate and the UI degrades gracefully to non-real-time.
  initConnectlySocket();
});
