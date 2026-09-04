/* ==========================================================================
   CodeAlpha - NOTIFICATIONS PAGE MODULE (notifications-page.js)
   Full notifications management: filter tabs, real-time push, action buttons,
   mark as read, delete single, clear all, and suggested creators.
   ========================================================================== */

let pageNotifications = [];
let currentFilter = 'all';

// Mock Seed Notifications for demo / offline fallback
const MOCK_PAGE_NOTIFICATIONS = [
  {
    _id: 'notif_101',
    type: 'like',
    sender: {
      _id: 'usr_102',
      name: 'Alex Rivera',
      username: 'alexrivera',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    post: {
      _id: 'post_101',
      content: 'Just launched our new design system at Connectly! Built with pure CSS variables...'
    },
    text: '',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15m ago
  },
  {
    _id: 'notif_102',
    type: 'comment',
    sender: {
      _id: 'usr_103',
      name: 'Elena Rostova',
      username: 'elena_r',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    post: {
      _id: 'post_101',
      content: 'Just launched our new design system at Connectly!'
    },
    text: 'The contrast and typography look absolutely phenomenal!',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45m ago
  },
  {
    _id: 'notif_103',
    type: 'follow',
    sender: {
      _id: 'usr_104',
      name: 'Marcus Vance',
      username: 'marcus_v',
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
    },
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() // 3h ago
  },
  {
    _id: 'notif_104',
    type: 'message',
    sender: {
      _id: 'usr_105',
      name: 'Sophia Lin',
      username: 'sophialin',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
    },
    text: 'Hey Sarah! Loved your recent case study on typography.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1d ago
  }
];

// Helper: Escape HTML
function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}

// Helper: Time formatting
function formatNotificationTime(dateStr) {
  if (!dateStr) return 'Just now';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// Meta for notification type icon & color
function getNotificationMeta(type) {
  switch (type) {
    case 'like':
      return { cls: 'like', icon: 'fa-solid fa-heart', label: 'liked your post' };
    case 'comment':
      return { cls: 'comment', icon: 'fa-solid fa-comment', label: 'commented on your post' };
    case 'follow':
      return { cls: 'follow', icon: 'fa-solid fa-user-plus', label: 'started following you' };
    case 'message':
      return { cls: 'message', icon: 'fa-solid fa-paper-plane', label: 'sent you a message' };
    default:
      return { cls: 'like', icon: 'fa-solid fa-bell', label: 'sent a notification' };
  }
}

// Load notifications
async function fetchPageNotifications() {
  const token = getAuthToken();
  const isRealAccount = token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_');

  if (isRealAccount) {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        pageNotifications = await res.json();
      } else {
        pageNotifications = getStoredPageNotifications();
      }
    } catch (err) {
      pageNotifications = getStoredPageNotifications();
    }
  } else {
    pageNotifications = getStoredPageNotifications();
  }

  updateFilterCounts();
  renderNotificationsList();
}

function getStoredPageNotifications() {
  const stored = localStorage.getItem('connectly_page_notifications');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('connectly_page_notifications', JSON.stringify(MOCK_PAGE_NOTIFICATIONS));
  return MOCK_PAGE_NOTIFICATIONS;
}

function saveStoredPageNotifications(notifs) {
  pageNotifications = notifs;
  localStorage.setItem('connectly_page_notifications', JSON.stringify(notifs));
  updateFilterCounts();
}

// Update count badges on filter pills
function updateFilterCounts() {
  const countAll = pageNotifications.length;
  const countUnread = pageNotifications.filter(n => !n.read).length;
  const countLikes = pageNotifications.filter(n => n.type === 'like').length;
  const countComments = pageNotifications.filter(n => n.type === 'comment').length;
  const countFollows = pageNotifications.filter(n => n.type === 'follow').length;
  const countMessages = pageNotifications.filter(n => n.type === 'message').length;

  document.getElementById('countAll')?.replaceChildren(document.createTextNode(countAll));
  document.getElementById('countUnread')?.replaceChildren(document.createTextNode(countUnread));
  document.getElementById('countLikes')?.replaceChildren(document.createTextNode(countLikes));
  document.getElementById('countComments')?.replaceChildren(document.createTextNode(countComments));
  document.getElementById('countFollows')?.replaceChildren(document.createTextNode(countFollows));
  document.getElementById('countMessages')?.replaceChildren(document.createTextNode(countMessages));

  const unreadBadge = document.getElementById('unreadBadgeCounter');
  if (unreadBadge) {
    if (countUnread > 0) {
      unreadBadge.textContent = `${countUnread} new`;
      unreadBadge.style.display = 'inline-block';
    } else {
      unreadBadge.style.display = 'none';
    }
  }
}

// Render Notifications
function renderNotificationsList() {
  const container = document.getElementById('notificationsContainer');
  if (!container) return;

  let filtered = pageNotifications;
  if (currentFilter === 'unread') {
    filtered = pageNotifications.filter(n => !n.read);
  } else if (currentFilter !== 'all') {
    filtered = pageNotifications.filter(n => n.type === currentFilter);
  }

  if (filtered.length === 0) {
    let emptyMsg = 'No notifications yet';
    let subMsg = "We'll notify you when someone interacts with your posts or profile.";
    if (currentFilter === 'unread') {
      emptyMsg = 'All caught up!';
      subMsg = 'You have no unread notifications at the moment.';
    } else if (currentFilter !== 'all') {
      emptyMsg = `No ${currentFilter} notifications`;
      subMsg = `There are no ${currentFilter} notifications to show right now.`;
    }

    container.innerHTML = `
      <div class="card text-center" style="padding: 48px 24px; text-align: center;">
        <i class="fa-regular fa-bell-slash text-muted" style="font-size: 3rem; margin-bottom: 12px;"></i>
        <h3 style="font-size: 1.15rem; margin-bottom: 4px;">${emptyMsg}</h3>
        <p class="text-muted text-sm">${subMsg}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(n => {
    const meta = getNotificationMeta(n.type);
    const sender = n.sender || { name: 'Someone', username: 'user', profileImage: DEFAULT_DEMO_USER.profileImage };

    let actionButton = '';
    if (n.type === 'follow') {
      actionButton = `
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); followBackUser('${sender._id || ''}', '${escapeHTML(sender.name)}')">
          <i class="fa-solid fa-user-plus text-xs"></i> Follow Back
        </button>
      `;
    } else if (n.type === 'message') {
      actionButton = `
        <a href="chat.html?user=${sender._id || ''}" class="btn btn-secondary btn-sm" onclick="event.stopPropagation();">
          <i class="fa-regular fa-paper-plane text-xs"></i> Reply
        </a>
      `;
    } else if (n.post) {
      actionButton = `
        <a href="index.html#post_${n.post._id || ''}" class="btn btn-secondary btn-sm" onclick="event.stopPropagation();">
          <i class="fa-regular fa-eye text-xs"></i> View Post
        </a>
      `;
    }

    let previewHtml = '';
    if (n.text) {
      previewHtml = `<div class="notif-page-preview">"${escapeHTML(n.text)}"</div>`;
    } else if (n.post && n.post.content) {
      previewHtml = `<div class="notif-page-preview">"${escapeHTML(n.post.content.slice(0, 80))}${n.post.content.length > 80 ? '...' : ''}"</div>`;
    }

    return `
      <div class="notif-page-item ${n.read ? '' : 'unread'}" id="notif_page_item_${n._id}" onclick="handleNotifClick('${n._id}', '${n.type}', '${sender._id || ''}')" style="cursor: pointer;">
        <div class="notif-page-icon ${meta.cls}">
          <i class="${meta.icon}"></i>
        </div>
        <div class="notif-page-content">
          <div class="notif-page-header">
            <div class="notif-page-user-info">
              <img src="${sender.profileImage || DEFAULT_DEMO_USER.profileImage}" alt="${escapeHTML(sender.name)}" class="avatar avatar-sm">
              <span class="font-bold text-sm">${escapeHTML(sender.name)}</span>
              <span class="text-xs text-muted">@${escapeHTML(sender.username)}</span>
            </div>
            <button class="notif-delete-btn" title="Delete notification" onclick="event.stopPropagation(); deleteSingleNotification('${n._id}')">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div class="notif-page-text">
            <strong>${escapeHTML(sender.name)}</strong> ${meta.label}
          </div>

          ${previewHtml}

          <div class="notif-page-footer">
            <span class="notif-page-time"><i class="fa-regular fa-clock"></i> ${formatNotificationTime(n.createdAt)}</span>
            <div class="notif-page-actions">
              ${actionButton}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Handle clicking a notification
async function handleNotifClick(notifId, type, senderId) {
  markSingleNotificationRead(notifId);

  if (type === 'message' && senderId) {
    window.location.href = `chat.html?user=${senderId}`;
  } else if (type === 'follow' && senderId) {
    window.location.href = `profile.html?id=${senderId}`;
  }
}

// Mark single notification as read
async function markSingleNotificationRead(notifId) {
  const notif = pageNotifications.find(n => n._id === notifId);
  if (notif && !notif.read) {
    notif.read = true;
    saveStoredPageNotifications(pageNotifications);
    renderNotificationsList();

    const token = getAuthToken();
    if (token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_')) {
      try {
        await fetch(`${API_BASE_URL}/notifications/${notifId}/read`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {}
    }
  }
}

// Mark all as read
async function markAllPageNotificationsRead() {
  const unreadCount = pageNotifications.filter(n => !n.read).length;
  if (unreadCount === 0) {
    showToast('All notifications are already marked as read', 'info');
    return;
  }

  pageNotifications.forEach(n => n.read = true);
  saveStoredPageNotifications(pageNotifications);
  renderNotificationsList();
  showToast('Marked all notifications as read', 'success');

  const token = getAuthToken();
  if (token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_')) {
    try {
      await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  }
}

// Delete single notification
async function deleteSingleNotification(notifId) {
  pageNotifications = pageNotifications.filter(n => n._id !== notifId);
  saveStoredPageNotifications(pageNotifications);
  renderNotificationsList();
  showToast('Notification deleted', 'info');

  const token = getAuthToken();
  if (token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_')) {
    try {
      await fetch(`${API_BASE_URL}/notifications/${notifId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  }
}

// Clear all notifications
async function clearAllPageNotifications() {
  if (pageNotifications.length === 0) {
    showToast('No notifications to clear', 'info');
    return;
  }

  if (!confirm('Are you sure you want to clear all notifications?')) return;

  pageNotifications = [];
  saveStoredPageNotifications(pageNotifications);
  renderNotificationsList();
  showToast('All notifications cleared', 'info');

  const token = getAuthToken();
  if (token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_')) {
    try {
      await fetch(`${API_BASE_URL}/notifications`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  }
}

// Follow back helper
async function followBackUser(userId, userName) {
  if (!userId) return;
  const token = getAuthToken();
  const isRealAccount = token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_');

  if (isRealAccount) {
    try {
      await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  }
  showToast(`You are now following ${userName}!`, 'success');
}

// Initialize Filter Pills
function initFilterTabs() {
  const filterPills = document.querySelectorAll('#notifFilterBar .filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      renderNotificationsList();
    });
  });

  document.getElementById('pageMarkAllReadBtn')?.addEventListener('click', markAllPageNotificationsRead);
  document.getElementById('pageClearAllBtn')?.addEventListener('click', clearAllPageNotifications);
}

// Render Suggested Users in Right Sidebar
async function loadSuggestedUsersWidget() {
  const container = document.getElementById('suggestedUsersContainer');
  if (!container) return;

  const token = getAuthToken();
  const isRealAccount = token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_');

  if (!isRealAccount) {
    container.innerHTML = [
      { _id: 'usr_103', name: 'Elena Rostova', username: 'elena_r', profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
      { _id: 'usr_104', name: 'Marcus Vance', username: 'marcus_v', profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
      { _id: 'usr_105', name: 'Sophia Lin', username: 'sophialin', profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' }
    ].map(u => `
      <div class="suggested-user-item">
        <img src="${u.profileImage}" class="avatar avatar-sm">
        <div class="suggested-info">
          <div class="suggested-name">${escapeHTML(u.name)}</div>
          <div class="suggested-handle">@${escapeHTML(u.username)}</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="showToast('Followed ${escapeHTML(u.name)}!', 'success')">Follow</button>
      </div>
    `).join('');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const users = await res.json();
      container.innerHTML = users.slice(0, 4).map(u => `
        <div class="suggested-user-item">
          <img src="${u.profileImage || DEFAULT_DEMO_USER.profileImage}" class="avatar avatar-sm">
          <div class="suggested-info">
            <div class="suggested-name">${escapeHTML(u.name)}</div>
            <div class="suggested-handle">@${escapeHTML(u.username)}</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="followBackUser('${u._id}', '${escapeHTML(u.name)}')">Follow</button>
        </div>
      `).join('');
    }
  } catch (e) {}
}

// Real-time Push via Socket.io
function initRealtimeNotifications() {
  const tryBind = () => {
    const s = getConnectlySocket();
    if (s) {
      s.on('notification:new', (newNotif) => {
        pageNotifications.unshift(newNotif);
        saveStoredPageNotifications(pageNotifications);
        renderNotificationsList();
      });
    } else {
      setTimeout(tryBind, 500);
    }
  };
  tryBind();
}

// On DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  fetchPageNotifications();
  initFilterTabs();
  loadSuggestedUsersWidget();
  initRealtimeNotifications();

  // Search redirection
  document.getElementById('navbarSearchInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value.trim();
      if (query) window.location.href = `explore.html?q=${encodeURIComponent(query)}`;
    }
  });
});
