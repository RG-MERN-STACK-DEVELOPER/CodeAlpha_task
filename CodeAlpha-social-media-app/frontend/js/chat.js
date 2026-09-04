/* ==========================================================================
   CodeAlpha - LIVE CHAT / DIRECT MESSAGES (chat.js)
   Powers chat.html: conversation list, message thread, typing indicator,
   presence dots. Uses the shared socket connection from socket.js, with a
   REST fallback (via API_BASE_URL) whenever the socket isn't connected.
   ========================================================================== */

let activeConversationUser = null; // { _id, name, username, profileImage }
let conversationsCache = [];
let onlineUserIds = new Set();
let typingTimeout = null;

function escapeHTML(str) {
  return String(str || '').replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function chatTimeLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ---------------------------- Conversation list --------------------------- */

async function loadConversations() {
  const list = document.getElementById('conversationList');
  try {
    const res = await fetch(`${API_BASE_URL}/messages/conversations`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    if (!res.ok) throw new Error('Failed to load conversations');
    conversationsCache = await res.json();
    renderConversationList();
  } catch (e) {
    list.innerHTML = '<div class="notif-empty">No conversations yet. Search for someone to say hi 👋</div>';
  }
}

function renderConversationList() {
  const list = document.getElementById('conversationList');
  if (!conversationsCache.length) {
    list.innerHTML = '<div class="notif-empty">No conversations yet. Search for someone to say hi 👋</div>';
    return;
  }
  list.innerHTML = conversationsCache.map(c => {
    const u = c.user;
    const isActive = activeConversationUser && activeConversationUser._id === u._id;
    const isOnline = onlineUserIds.has(u._id);
    return `
      <div class="conversation-item ${isActive ? 'active' : ''}" data-user-id="${u._id}">
        <div class="conversation-avatar-wrap">
          <img src="${u.profileImage}" alt="${escapeHTML(u.name)}" class="avatar avatar-sm">
          <span class="online-dot ${isOnline ? 'show' : ''}" data-presence-for="${u._id}"></span>
        </div>
        <div class="conversation-info">
          <div class="conversation-name">${escapeHTML(u.name)}</div>
          <div class="conversation-preview">${escapeHTML(c.lastMessage?.text || '')}</div>
        </div>
        ${c.unreadCount > 0 ? `<span class="conversation-unread-badge">${c.unreadCount}</span>` : ''}
      </div>`;
  }).join('');
}

/* ------------------------------ User search -------------------------------- */

let searchDebounce = null;
function initUserSearch() {
  const input = document.getElementById('chatSearchInput');
  const resultsBox = document.getElementById('userSearchResults');
  const convoBox = document.getElementById('conversationList');

  input.addEventListener('input', () => {
    const q = input.value.trim();
    clearTimeout(searchDebounce);
    if (!q) {
      resultsBox.style.display = 'none';
      convoBox.style.display = 'block';
      return;
    }
    searchDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users?search=${encodeURIComponent(q)}`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        const users = res.ok ? await res.json() : [];
        resultsBox.style.display = 'block';
        convoBox.style.display = 'none';
        resultsBox.innerHTML = users.length
          ? users.map(u => `
            <div class="conversation-item" data-user-id="${u._id}" data-search-result="1">
              <div class="conversation-avatar-wrap">
                <img src="${u.profileImage}" alt="${escapeHTML(u.name)}" class="avatar avatar-sm">
              </div>
              <div class="conversation-info">
                <div class="conversation-name">${escapeHTML(u.name)}</div>
                <div class="conversation-preview">@${escapeHTML(u.username)}</div>
              </div>
            </div>`).join('')
          : '<div class="notif-empty">No people found</div>';
      } catch (e) {
        resultsBox.innerHTML = '<div class="notif-empty">Search unavailable right now</div>';
      }
    }, 350);
  });

  const newChatBtn = document.getElementById('newChatBtn');
  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      input.style.display = input.style.display === 'none' ? 'block' : 'block';
      input.focus();
    });
  }
}

/* ------------------------------ Active thread ------------------------------ */

async function openConversation(user) {
  activeConversationUser = user;
  renderConversationList();

  document.getElementById('chatEmptyState').style.display = 'none';
  document.getElementById('chatActiveView').style.display = 'flex';
  document.getElementById('chatHeaderAvatar').src = user.profileImage;
  document.getElementById('chatHeaderName').textContent = user.name;
  document.getElementById('chatHeaderStatus').textContent = onlineUserIds.has(user._id) ? 'Online' : 'Offline';
  document.getElementById('chatHeaderOnlineDot').classList.toggle('show', onlineUserIds.has(user._id));
  document.getElementById('typingIndicator').style.display = 'none';

  // Mobile: show the thread, hide the sidebar
  document.getElementById('chatSidebar').classList.add('hide-mobile');
  document.getElementById('chatMain').classList.remove('hide-mobile');
  document.getElementById('chatBackBtn').style.display = window.innerWidth <= 768 ? 'flex' : 'none';

  const messagesBox = document.getElementById('chatMessages');
  messagesBox.innerHTML = '<div class="notif-empty">Loading messages...</div>';

  try {
    const res = await fetch(`${API_BASE_URL}/messages/${user._id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    const messages = res.ok ? await res.json() : [];
    renderMessages(messages);
    // Refresh sidebar so the unread badge for this thread clears
    loadConversations();
  } catch (e) {
    messagesBox.innerHTML = '<div class="notif-empty">Could not load this conversation.</div>';
  }
}

function renderMessages(messages) {
  const me = getCurrentUser();
  const box = document.getElementById('chatMessages');
  if (!messages.length) {
    box.innerHTML = '<div class="notif-empty">Say hello 👋 — this is the start of your conversation.</div>';
    return;
  }
  box.innerHTML = messages.map(m => {
    const mine = (m.sender._id || m.sender) === me._id;
    return `
      <div class="chat-bubble-row ${mine ? 'me' : 'them'}">
        <div>
          <div class="chat-bubble">${escapeHTML(m.text)}</div>
          <div class="chat-bubble-time">${chatTimeLabel(m.createdAt)}</div>
        </div>
      </div>`;
  }).join('');
  box.scrollTop = box.scrollHeight;
}

function appendMessageBubble(m) {
  const me = getCurrentUser();
  const mine = (m.sender._id || m.sender) === me._id;
  const box = document.getElementById('chatMessages');
  const emptyNotice = box.querySelector('.notif-empty');
  if (emptyNotice) emptyNotice.remove();

  const row = document.createElement('div');
  row.className = `chat-bubble-row ${mine ? 'me' : 'them'}`;
  row.innerHTML = `
    <div>
      <div class="chat-bubble">${escapeHTML(m.text)}</div>
      <div class="chat-bubble-time">${chatTimeLabel(m.createdAt)}</div>
    </div>`;
  box.appendChild(row);
  box.scrollTop = box.scrollHeight;
}

/* -------------------------------- Sending ---------------------------------- */

function initChatInput() {
  const form = document.getElementById('chatInputForm');
  const input = document.getElementById('chatMessageInput');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || !activeConversationUser) return;
    input.value = '';
    stopTyping();

    const socket = getConnectlySocket();
    if (socket && socket.connected) {
      socket.emit('message:send', { recipientId: activeConversationUser._id, text }, (ack) => {
        if (!ack || !ack.ok) showToast('Message failed to send', 'danger');
      });
    } else {
      // REST fallback when the socket isn't connected (offline/demo mode)
      try {
        const res = await fetch(`${API_BASE_URL}/messages/${activeConversationUser._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({ text })
        });
        if (res.ok) {
          const saved = await res.json();
          appendMessageBubble(saved);
        } else {
          showToast('Message failed to send', 'danger');
        }
      } catch (err) {
        showToast('You are offline — message not sent', 'danger');
      }
    }
  });

  // Typing indicator (outgoing)
  input.addEventListener('input', () => {
    if (!activeConversationUser) return;
    const socket = getConnectlySocket();
    if (!socket) return;
    socket.emit('typing:start', { recipientId: activeConversationUser._id });
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(stopTyping, 1500);
  });
}

function stopTyping() {
  if (activeConversationUser) {
    const socket = getConnectlySocket();
    if (socket) socket.emit('typing:stop', { recipientId: activeConversationUser._id });
  }
  clearTimeout(typingTimeout);
}

/* ------------------------------ Socket wiring ------------------------------- */

function bindChatSocketEvents() {
  const trySocketBind = () => {
    const socket = getConnectlySocket();
    if (!socket) {
      setTimeout(trySocketBind, 500);
      return;
    }

    socket.on('message:new', (m) => {
      const me = getCurrentUser();
      const otherId = (m.sender._id || m.sender) === me._id ? m.recipient : (m.sender._id || m.sender);
      if (activeConversationUser && otherId === activeConversationUser._id) {
        appendMessageBubble(m);
      }
      loadConversations();
    });

    socket.on('typing:start', ({ userId }) => {
      if (activeConversationUser && activeConversationUser._id === userId) {
        document.getElementById('typingIndicator').style.display = 'block';
      }
    });

    socket.on('typing:stop', ({ userId }) => {
      if (activeConversationUser && activeConversationUser._id === userId) {
        document.getElementById('typingIndicator').style.display = 'none';
      }
    });

    socket.on('presence:update', ({ userId, online }) => {
      if (online) onlineUserIds.add(userId); else onlineUserIds.delete(userId);
      document.querySelectorAll(`[data-presence-for="${userId}"]`).forEach(dot => {
        dot.classList.toggle('show', online);
      });
      if (activeConversationUser && activeConversationUser._id === userId) {
        document.getElementById('chatHeaderStatus').textContent = online ? 'Online' : 'Offline';
        document.getElementById('chatHeaderOnlineDot').classList.toggle('show', online);
      }
    });
  };
  trySocketBind();
}

/* --------------------------------- Init ------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  loadConversations();
  initUserSearch();
  initChatInput();
  bindChatSocketEvents();

  // Clicking a conversation (existing thread) or a search result opens the thread
  ['conversationList', 'userSearchResults'].forEach(id => {
    document.getElementById(id).addEventListener('click', async (e) => {
      const item = e.target.closest('.conversation-item');
      if (!item) return;
      const userId = item.dataset.userId;

      if (item.dataset.searchResult) {
        // Fetch the full user object before opening a brand-new thread
        try {
          const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
          });
          if (res.ok) {
            const user = await res.json();
            document.getElementById('chatSearchInput').value = '';
            document.getElementById('userSearchResults').style.display = 'none';
            document.getElementById('conversationList').style.display = 'block';
            openConversation(user);
          }
        } catch (err) {
          showToast('Could not open conversation', 'danger');
        }
      } else {
        const convo = conversationsCache.find(c => c.user._id === userId);
        if (convo) openConversation(convo.user);
      }
    });
  });

  // Back button on mobile returns to the conversation list
  document.getElementById('chatBackBtn').addEventListener('click', () => {
    document.getElementById('chatSidebar').classList.remove('hide-mobile');
    document.getElementById('chatMain').classList.add('hide-mobile');
  });

  // Deep link support: chat.html?user=<id> (used by notification clicks, profile "Message" buttons)
  const params = new URLSearchParams(window.location.search);
  const deepLinkUserId = params.get('user');
  if (deepLinkUserId) {
    fetch(`${API_BASE_URL}/users/${deepLinkUserId}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(user => { if (user) openConversation(user); })
      .catch(() => {});
  }
});
