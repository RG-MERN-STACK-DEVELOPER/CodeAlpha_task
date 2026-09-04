/* ==========================================================================
   CodeAlpha - SAVED BOOKMARKS MODULE (saved.js)
   Manages bookmarked posts: load saved posts, search & filter, switch between
   feed & media grid views, like/comment, and remove/unsave with instant feedback.
   ========================================================================== */

let stateSavedPosts = [];
let savedFilter = 'all'; // 'all', 'media', 'text'
let currentViewMode = 'list'; // 'list' or 'grid'
let searchQuery = '';

// Seed mock saved posts for fallback/demo
const MOCK_SAVED_POSTS = [
  {
    _id: 'post_101',
    user: {
      _id: 'usr_102',
      name: 'Alex Rivera',
      username: 'alexrivera',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    content: 'Just launched our new design system at Connectly! Built with pure CSS variables, smooth animations, and a strict 8px grid scale. Feedback is welcome! 🎨✨ #Design #WebDev',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    likes: ['usr_demo_101', 'usr_103', 'usr_104'],
    comments: [
      {
        _id: 'c_1',
        user: { name: 'Elena Rostova', username: 'elena_r', profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
        text: 'The contrast and typography look absolutely phenomenal!',
        createdAt: '25m ago'
      }
    ],
    createdAt: '2 hours ago'
  },
  {
    _id: 'post_102',
    user: {
      _id: 'usr_103',
      name: 'Elena Rostova',
      username: 'elena_r',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    content: 'Had an amazing morning exploring hidden coastal views and working remotely from this quiet coffee corner ☕️🌊 #Photography #RemoteWork',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    likes: ['usr_102'],
    comments: [],
    createdAt: '5 hours ago'
  }
];

// Helper: Escape HTML
function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}

// Fetch saved posts
async function fetchSavedPosts() {
  const token = getAuthToken();
  const isRealAccount = token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_');

  if (isRealAccount) {
    try {
      const res = await fetch(`${API_BASE_URL}/posts/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        stateSavedPosts = await res.json();
      } else {
        stateSavedPosts = getStoredSavedPosts();
      }
    } catch (err) {
      stateSavedPosts = getStoredSavedPosts();
    }
  } else {
    stateSavedPosts = getStoredSavedPosts();
  }

  updateSavedCountBadge();
  renderSavedView();
}

function getStoredSavedPosts() {
  const stored = localStorage.getItem('connectly_saved_posts');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('connectly_saved_posts', JSON.stringify(MOCK_SAVED_POSTS));
  return MOCK_SAVED_POSTS;
}

function saveStoredSavedPosts(posts) {
  stateSavedPosts = posts;
  localStorage.setItem('connectly_saved_posts', JSON.stringify(posts));
  updateSavedCountBadge();
}

function updateSavedCountBadge() {
  const badge = document.getElementById('savedCountBadge');
  if (badge) {
    badge.textContent = `${stateSavedPosts.length} ${stateSavedPosts.length === 1 ? 'item' : 'items'}`;
  }
}

// Filter posts
function getFilteredSavedPosts() {
  return stateSavedPosts.filter(post => {
    // Type filter
    if (savedFilter === 'media' && !post.image) return false;
    if (savedFilter === 'text' && post.image) return false;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const contentMatch = (post.content || '').toLowerCase().includes(q);
      const nameMatch = (post.user?.name || '').toLowerCase().includes(q);
      const usernameMatch = (post.user?.username || '').toLowerCase().includes(q);
      if (!contentMatch && !nameMatch && !usernameMatch) return false;
    }

    return true;
  });
}

// Render View: List or Grid
function renderSavedView() {
  const container = document.getElementById('savedPostsContainer');
  if (!container) return;

  const filtered = getFilteredSavedPosts();

  if (filtered.length === 0) {
    let emptyTitle = 'No saved posts yet';
    let emptySub = 'When you bookmark posts from your feed or explore, they will appear here for easy access.';
    if (searchQuery || savedFilter !== 'all') {
      emptyTitle = 'No matching saved posts';
      emptySub = 'Try adjusting your search query or filter tags to find what you are looking for.';
    }

    container.innerHTML = `
      <div class="card text-center" style="padding: 56px 24px; text-align: center;">
        <i class="fa-regular fa-bookmark text-muted" style="font-size: 3.2rem; margin-bottom: 14px;"></i>
        <h3 style="font-size: 1.25rem; margin-bottom: 6px;">${emptyTitle}</h3>
        <p class="text-muted text-sm" style="max-width: 440px; margin: 0 auto 20px;">${emptySub}</p>
        <a href="explore.html" class="btn btn-primary btn-sm">
          <i class="fa-regular fa-compass"></i> Explore Posts
        </a>
      </div>
    `;
    return;
  }

  if (currentViewMode === 'grid') {
    renderSavedGridView(filtered, container);
  } else {
    renderSavedListView(filtered, container);
  }
}

// Render Feed / List View
function renderSavedListView(posts, container) {
  const currentUser = getCurrentUser();

  container.innerHTML = posts.map(post => {
    const isLiked = post.likes && post.likes.some(l => (l._id || l) === currentUser._id);
    const likesCount = post.likes ? post.likes.length : 0;
    const commentsList = post.comments || [];
    const commentsCount = commentsList.length;

    return `
      <article class="card post-card" id="saved_post_card_${post._id}">
        <!-- Post Header -->
        <div class="post-header">
          <div class="post-author">
            <img src="${post.user?.profileImage || DEFAULT_DEMO_USER.profileImage}" alt="${escapeHTML(post.user?.name)}" class="avatar">
            <div>
              <a href="profile.html?id=${post.user?._id || ''}" class="post-author-name">${escapeHTML(post.user?.name || 'Anonymous')}</a>
              <div class="post-meta">
                <span>@${escapeHTML(post.user?.username || 'user')}</span> • <span>${post.createdAt || 'Saved'}</span>
              </div>
            </div>
          </div>

          <button class="btn btn-outline btn-sm text-accent" onclick="unsavePost('${post._id}')" title="Remove from Bookmarks">
            <i class="fa-solid fa-bookmark"></i> <span>Saved</span>
          </button>
        </div>

        <!-- Post Body -->
        <div class="post-content">
          ${escapeHTML(post.content || '')}
        </div>

        <!-- Image Media (if present) -->
        ${post.image ? `
          <div class="post-media">
            <img src="${post.image}" alt="Post media attachment" loading="lazy">
          </div>
        ` : ''}

        <!-- Stats -->
        <div class="post-stats">
          <div>
            <i class="fa-solid fa-heart text-danger"></i>
            <span id="saved_likes_${post._id}">${likesCount}</span> likes
          </div>
          <div>
            <span>${commentsCount}</span> comments
          </div>
        </div>

        <!-- Actions -->
        <div class="post-actions">
          <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLikeSavedPost('${post._id}')">
            <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            <span>Like</span>
          </button>

          <button class="action-btn" onclick="toggleCommentsSection('${post._id}')">
            <i class="fa-regular fa-comment"></i>
            <span>Comment</span>
          </button>

          <button class="action-btn" onclick="sharePost('${post._id}')">
            <i class="fa-regular fa-share-from-square"></i>
            <span>Share</span>
          </button>

          <button class="action-btn text-danger" onclick="unsavePost('${post._id}')" title="Remove from saved">
            <i class="fa-regular fa-trash-can"></i>
            <span>Remove</span>
          </button>
        </div>

        <!-- Comments Drawer -->
        <div class="comments-section" id="comments_section_${post._id}">
          <div class="add-comment-box">
            <img src="${currentUser.profileImage}" class="avatar avatar-sm">
            <input type="text" id="saved_comment_input_${post._id}" placeholder="Write a comment..." onkeypress="handleSavedCommentKeyPress(event, '${post._id}')">
            <button class="btn btn-primary btn-sm" onclick="addSavedComment('${post._id}')">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>

          <div class="comment-list" id="saved_comment_list_${post._id}">
            ${commentsList.map(c => `
              <div class="comment-item">
                <img src="${c.user?.profileImage || DEFAULT_DEMO_USER.profileImage}" class="avatar avatar-sm">
                <div class="comment-bubble">
                  <div class="comment-author">${escapeHTML(c.user?.name || 'User')}</div>
                  <div class="comment-text">${escapeHTML(c.text)}</div>
                  <div class="comment-meta">
                    <span>${c.createdAt || 'Just now'}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Render Grid View
function renderSavedGridView(posts, container) {
  container.innerHTML = `
    <div class="saved-media-grid">
      ${posts.map(post => `
        <div class="saved-grid-card">
          ${post.image ? `
            <div class="saved-grid-media">
              <img src="${post.image}" alt="Saved media" loading="lazy">
            </div>
          ` : `
            <div class="saved-grid-media" style="display:flex; align-items:center; justify-content:center; background:var(--accent-light); color:var(--accent);">
              <i class="fa-solid fa-quote-left" style="font-size:2.5rem; opacity:0.6;"></i>
            </div>
          `}
          <div class="saved-grid-body">
            <div class="saved-grid-author">
              <img src="${post.user?.profileImage || DEFAULT_DEMO_USER.profileImage}" class="avatar avatar-sm">
              <span class="font-bold text-sm" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHTML(post.user?.name || 'User')}</span>
            </div>
            <div class="saved-grid-text">
              ${escapeHTML(post.content || '')}
            </div>
            <div class="saved-grid-footer">
              <span><i class="fa-solid fa-heart text-danger"></i> ${(post.likes || []).length}</span>
              <button class="btn btn-secondary btn-sm" onclick="unsavePost('${post._id}')" title="Remove bookmark">
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Unsave Post
async function unsavePost(postId) {
  stateSavedPosts = stateSavedPosts.filter(p => p._id !== postId);
  saveStoredSavedPosts(stateSavedPosts);
  renderSavedView();
  showToast('Removed from saved bookmarks', 'info');

  const token = getAuthToken();
  const isRealAccount = token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_');

  if (isRealAccount) {
    try {
      await fetch(`${API_BASE_URL}/posts/${postId}/save`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  }
}

// Toggle Like
async function toggleLikeSavedPost(postId) {
  const currentUser = getCurrentUser();
  const post = stateSavedPosts.find(p => p._id === postId);
  if (!post) return;

  if (!post.likes) post.likes = [];
  const likedIndex = post.likes.findIndex(l => (l._id || l) === currentUser._id);
  const isLiked = likedIndex !== -1;

  if (isLiked) {
    post.likes.splice(likedIndex, 1);
  } else {
    post.likes.push(currentUser._id);
  }

  saveStoredSavedPosts(stateSavedPosts);
  renderSavedView();

  try {
    const endpoint = isLiked ? 'unlike' : 'like';
    await fetch(`${API_BASE_URL}/posts/${postId}/${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (e) {}
}

// Toggle Comments
function toggleCommentsSection(postId) {
  const section = document.getElementById(`comments_section_${postId}`);
  if (section) {
    section.classList.toggle('active');
    const input = document.getElementById(`saved_comment_input_${postId}`);
    if (section.classList.contains('active') && input) input.focus();
  }
}

// Add Comment
async function addSavedComment(postId) {
  const input = document.getElementById(`saved_comment_input_${postId}`);
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  const currentUser = getCurrentUser();
  const post = stateSavedPosts.find(p => p._id === postId);
  if (!post) return;

  if (!post.comments) post.comments = [];
  post.comments.push({
    _id: `c_${Date.now()}`,
    user: {
      _id: currentUser._id,
      name: currentUser.name,
      username: currentUser.username,
      profileImage: currentUser.profileImage
    },
    text: text,
    createdAt: 'Just now'
  });

  input.value = '';
  saveStoredSavedPosts(stateSavedPosts);
  renderSavedView();
  toggleCommentsSection(postId);
  showToast('Comment added!', 'success');

  try {
    await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });
  } catch (e) {}
}

function handleSavedCommentKeyPress(event, postId) {
  if (event.key === 'Enter') addSavedComment(postId);
}

// Share post helper
function sharePost(postId) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.origin + `/index.html#post_${postId}`);
  }
  showToast('Post link copied to clipboard!', 'success');
}

// Initialize Controls
function initSavedControls() {
  const searchInput = document.getElementById('savedFilterSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderSavedView();
    });
  }

  const filterPills = document.querySelectorAll('#savedFilterPills .filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      savedFilter = pill.dataset.filter;
      renderSavedView();
    });
  });

  const listBtn = document.getElementById('viewModeListBtn');
  const gridBtn = document.getElementById('viewModeGridBtn');

  if (listBtn && gridBtn) {
    listBtn.addEventListener('click', () => {
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
      currentViewMode = 'list';
      renderSavedView();
    });

    gridBtn.addEventListener('click', () => {
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
      currentViewMode = 'grid';
      renderSavedView();
    });
  }
}

// Suggested Users Widget
async function loadSuggestedUsersWidget() {
  const container = document.getElementById('suggestedUsersContainer');
  if (!container) return;

  const token = getAuthToken();
  const isRealAccount = token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_');

  if (!isRealAccount) {
    container.innerHTML = [
      { _id: 'usr_103', name: 'Elena Rostova', username: 'elena_r', profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
      { _id: 'usr_104', name: 'Marcus Vance', username: 'marcus_v', profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' }
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
          <button class="btn btn-outline btn-sm" onclick="showToast('Followed ${escapeHTML(u.name)}!', 'success')">Follow</button>
        </div>
      `).join('');
    }
  } catch (e) {}
}

// On DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  fetchSavedPosts();
  initSavedControls();
  loadSuggestedUsersWidget();

  document.getElementById('navbarSearchInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value.trim();
      if (query) window.location.href = `explore.html?q=${encodeURIComponent(query)}`;
    }
  });
});
