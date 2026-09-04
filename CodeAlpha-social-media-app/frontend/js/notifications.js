/* ==========================================================================
   CodeAlpha - REAL-TIME NOTIFICATIONS (notifications.js)
   Powers the bell dropdown in the navbar: fetch on load, live push via
   socket.io, unread badge, click-to-open, mark-all-read.
   ========================================================================== */

let notifCache = [];

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString();
}

function notifIconMeta(type) {
  switch (type) {
    case 'like': return { cls: 'like', icon: 'fa-solid fa-heart' };
    case 'comment': return { cls: 'comment', icon: 'fa-solid fa-comment' };
    case 'follow': return { cls: 'follow', icon: 'fa-solid fa-user-plus' };
    case 'message': return { cls: 'message', icon: 'fa-solid fa-paper-plane' };
    default: return { cls: 'like', icon: 'fa-solid fa-bell' };
  }
}

function notifText(n) {
  const name = `<strong>${n.sender?.name || 'Someone'}</strong>`;
  switch (n.type) {
    case 'like': return `${name} liked your post`;
    case 'comment': return `${name} commented: "${(n.text || '').slice(0, 40)}"`;
    case 'follow': return `${name} started following you`;
    case 'message': return `${name} sent you a message`;
    default: return `${name} sent a notification`;
  }
}

function renderNotifDropdown() {
  const list = document.getElementById('notifList');
  if (!list) return;
  if (!notifCache.length) {
    list.innerHTML = '<div class="notif-empty">No notifications yet</div>';
    return;
  }
  list.innerHTML = notifCache.map(n => {
    const meta = notifIconMeta(n.type);
    return `
      <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n._id}" data-type="${n.type}" data-sender="${n.sender?._id || ''}">
        <div class="notif-icon ${meta.cls}"><i class="${meta.icon}"></i></div>
        <div class="notif-body">
          <div class="notif-text">${notifText(n)}</div>
          <div class="notif-time">${timeAgo(n.createdAt)}</div>
        </div>
      </div>`;
  }).join('');
}

function updateNotifBadge() {
  const unread = notifCache.filter(n => !n.read).length;
  const dot = document.getElementById('notifDot');
  if (dot) dot.style.display = unread > 0 ? 'block' : 'none';
}

async function loadNotifications() {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    if (!res.ok) return;
    notifCache = await res.json();
    renderNotifDropdown();
    updateNotifBadge();
  } catch (e) {
    // Backend / demo mode fallback - fail silently, dropdown just stays empty
  }
}

async function markAllNotificationsRead() {
  notifCache = notifCache.map(n => ({ ...n, read: true }));
  renderNotifDropdown();
  updateNotifBadge();
  try {
    await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
  } catch (e) { /* no-op */ }
}

function addIncomingNotification(n) {
  notifCache.unshift(n);
  renderNotifDropdown();
  updateNotifBadge();
  showToast(notifText(n).replace(/<\/?strong>/g, ''), 'info');
}

document.addEventListener('DOMContentLoaded', () => {
  loadNotifications();

  const notifBtn = document.getElementById('notifBtn');
  const notifMenu = document.getElementById('notifDropdownMenu');
  const markAllBtn = document.getElementById('markAllReadBtn');

  if (notifBtn && notifMenu) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifMenu.classList.toggle('active');
      document.getElementById('profileDropdownMenu')?.classList.remove('active');
    });
    document.addEventListener('click', (e) => {
      if (!notifMenu.contains(e.target) && e.target !== notifBtn) {
        notifMenu.classList.remove('active');
      }
    });
  }

  if (markAllBtn) {
    markAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      markAllNotificationsRead();
    });
  }

  // Clicking a notification takes you to the relevant place
  document.getElementById('notifList')?.addEventListener('click', (e) => {
    const item = e.target.closest('.notif-item');
    if (!item) return;
    const type = item.dataset.type;
    const senderId = item.dataset.sender;
    if (type === 'message' && senderId) {
      window.location.href = `chat.html?user=${senderId}`;
    } else if (type === 'follow' && senderId) {
      window.location.href = `profile.html?id=${senderId}`;
    }
  });

  // Live push: listen once the socket connects
  const trySocketBind = () => {
    const s = getConnectlySocket();
    if (s) {
      s.on('notification:new', addIncomingNotification);
    } else {
      setTimeout(trySocketBind, 500);
    }
  };
  trySocketBind();
});
