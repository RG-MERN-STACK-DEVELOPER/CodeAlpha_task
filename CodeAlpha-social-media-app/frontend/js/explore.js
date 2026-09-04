/* ==========================================================================
   CodeAlpha - EXPLORE & DISCOVERY MODULE (explore.js)
   Search posts & people, browse trending hashtags, explore suggested creators,
   and visual gallery grid with direct like, comment, bookmark, and follow actions.
   ========================================================================== */

let explorePosts = [];
let exploreCreators = [];
let activeExploreTab = 'trending'; // 'trending', 'creators', 'gallery'
let activeTag = 'all';
let searchKeyword = '';

// Seed mock data for offline/demo fallback
const MOCK_EXPLORE_POSTS = [
  {
    _id: 'post_101',
    user: {
      _id: 'usr_102',
      name: 'Alex Rivera',
      username: 'alexrivera',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    content: 'Just launched our new design system at Connectly! Built with pure CSS variables, smooth animations, and a strict 8px grid scale. Feedback is welcome! 🎨✨ #Design #WebDevelopment #UIUXDesign',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    likes: ['usr_demo_101', 'usr_103', 'usr_104', 'usr_105', 'usr_106'],
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
    content: 'Had an amazing morning exploring hidden coastal views and working remotely from this quiet coffee corner ☕️🌊 #Photography #RemoteWork #Travel',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    likes: ['usr_102', 'usr_104'],
    comments: [],
    createdAt: '5 hours ago'
  },
  {
    _id: 'post_103',
    user: {
      _id: 'usr_104',
      name: 'Marcus Vance',
      username: 'marcus_v',
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
    },
    content: 'Pro tip for backend engineers: Keep your REST API controllers slim and delegate business logic to clean services. Your future self will thank you! 💻⚡️ #Technology #JavaScript #WebDevelopment',
    image: '',
    likes: ['usr_demo_101', 'usr_102', 'usr_103'],
    comments: [],
    createdAt: '1 day ago'
  },
  {
    _id: 'post_104',
    user: {
      _id: 'usr_105',
      name: 'Sophia Lin',
      username: 'sophialin',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
    },
    content: 'Modern minimal UI design exploration for our new dashboard interface. Clean spacing and typography always win. ✨🎨 #Design #UIUXDesign',
    image: 'https://images.unsplash.com/photo-1581291518655-9523c932deb4?w=800',
    likes: ['usr_102', 'usr_103', 'usr_104'],
    comments: [],
    createdAt: '2 days ago'
  }
];

const MOCK_EXPLORE_CREATORS = [
  {
    _id: 'usr_102',
    name: 'Alex Rivera',
    username: 'alexrivera',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    bio: 'Lead frontend architect & UI craft enthusiast. Building the future of social networks.',
    followers: ['usr_demo_101', 'usr_103', 'usr_104']
  },
  {
    _id: 'usr_103',
    name: 'Elena Rostova',
    username: 'elena_r',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    bio: 'Photographer & remote traveler. Documenting stories from every corner of the world 📸',
    followers: ['usr_102', 'usr_104']
  },
  {
    _id: 'usr_104',
    name: 'Marcus Vance',
    username: 'marcus_v',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    bio: 'Distributed systems engineer, open source author, and cloud enthusiast.',
    followers: ['usr_demo_101', 'usr_102', 'usr_103']
  },
  {
    _id: 'usr_105',
    name: 'Sophia Lin',
    username: 'sophialin',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    coverImage: 'https://images.unsplash.com/photo-1581291518655-9523c932deb4?w=800',
    bio: 'Design systems fanatic & product strategist at Connectly.',
    followers: ['usr_102']
  }
];

// Helper: Escape HTML
function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}

// Fetch Explore Posts
async function loadExploreData() {
  const token = getAuthToken();
  const isRealAccount = token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_');

  // Load Posts
  try {
    let url = `${API_BASE_URL}/posts/explore?type=trending`;
    if (activeTag !== 'all') url += `&tag=${encodeURIComponent(activeTag)}`;
    if (searchKeyword) url += `&search=${encodeURIComponent(searchKeyword)}`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      explorePosts = Array.isArray(data) && data.length > 0 ? data : getFallbackExplorePosts();
    } else {
      explorePosts = getFallbackExplorePosts();
    }
  } catch (e) {
    explorePosts = getFallbackExplorePosts();
  }

  // Load Creators
  if (isRealAccount) {
    try {
      let userUrl = `${API_BASE_URL}/users`;
      if (searchKeyword) userUrl += `?search=${encodeURIComponent(searchKeyword)}`;
      const res = await fetch(userUrl, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        exploreCreators = await res.json();
      } else {
        exploreCreators = getFallbackCreators();
      }
    } catch (e) {
      exploreCreators = getFallbackCreators();
    }
  } else {
    exploreCreators = getFallbackCreators();
  }

  renderExploreContent();
}

function getFallbackExplorePosts() {
  const stored = localStorage.getItem('connectly_posts');
  let base = MOCK_EXPLORE_POSTS;
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) base = parsed;
    } catch (e) {}
  }

  return base.filter(p => {
    if (activeTag !== 'all') {
      const tagRegex = new RegExp(`#${activeTag}`, 'i');
      if (!tagRegex.test(p.content || '')) return false;
    }
    if (searchKeyword) {
      const q = searchKeyword.toLowerCase();
      const match = (p.content || '').toLowerCase().includes(q) ||
                    (p.user?.name || '').toLowerCase().includes(q) ||
                    (p.user?.username || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

function getFallbackCreators() {
  if (!searchKeyword) return MOCK_EXPLORE_CREATORS;
  const q = searchKeyword.toLowerCase();
  return MOCK_EXPLORE_CREATORS.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.username.toLowerCase().includes(q) ||
    (c.bio || '').toLowerCase().includes(q)
  );
}

// Render active tab content
function renderExploreContent() {
  const container = document.getElementById('exploreContentContainer');
  if (!container) return;

  if (activeExploreTab === 'trending') {
    renderTrendingPosts(container);
  } else if (activeExploreTab === 'creators') {
    renderCreators(container);
  } else if (activeExploreTab === 'gallery') {
    renderVisualGallery(container);
  }
}

// 1. Trending Posts Tab
function renderTrendingPosts(container) {
  if (explorePosts.length === 0) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 48px 24px; text-align: center;">
        <i class="fa-regular fa-compass text-muted" style="font-size: 3rem; margin-bottom: 12px;"></i>
        <h3 style="font-size: 1.15rem; margin-bottom: 4px;">No posts found</h3>
        <p class="text-muted text-sm">Try searching for a different keyword or topic.</p>
      </div>
    `;
    return;
  }

  const currentUser = getCurrentUser();

  container.innerHTML = explorePosts.map(post => {
    const isLiked = post.likes && post.likes.some(l => (l._id || l) === currentUser._id);
    const likesCount = post.likes ? post.likes.length : 0;
    const commentsList = post.comments || [];
    const commentsCount = commentsList.length;

    // Check saved state
    const savedPosts = JSON.parse(localStorage.getItem('connectly_saved_posts') || '[]');
    const isSaved = savedPosts.some(p => p._id === post._id);

    return `
      <article class="card post-card" id="explore_post_${post._id}">
        <!-- Header -->
        <div class="post-header">
          <div class="post-author">
            <img src="${post.user?.profileImage || DEFAULT_DEMO_USER.profileImage}" alt="${escapeHTML(post.user?.name)}" class="avatar">
            <div>
              <a href="profile.html?id=${post.user?._id || ''}" class="post-author-name">${escapeHTML(post.user?.name || 'User')}</a>
              <div class="post-meta">
                <span>@${escapeHTML(post.user?.username || 'user')}</span> • <span>${post.createdAt || 'Just now'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Content with styled hashtags -->
        <div class="post-content">
          ${formatPostTextWithTags(post.content || '')}
        </div>

        <!-- Media -->
        ${post.image ? `
          <div class="post-media">
            <img src="${post.image}" alt="Explore post media" loading="lazy">
          </div>
        ` : ''}

        <!-- Stats -->
        <div class="post-stats">
          <div>
            <i class="fa-solid fa-heart text-danger"></i>
            <span id="explore_likes_${post._id}">${likesCount}</span> likes
          </div>
          <div>
            <span>${commentsCount}</span> comments
          </div>
        </div>

        <!-- Actions -->
        <div class="post-actions">
          <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLikeExplorePost('${post._id}')">
            <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            <span>Like</span>
          </button>

          <button class="action-btn" onclick="toggleExploreComments('${post._id}')">
            <i class="fa-regular fa-comment"></i>
            <span>Comment</span>
          </button>

          <button class="action-btn" onclick="shareExplorePost('${post._id}')">
            <i class="fa-regular fa-share-from-square"></i>
            <span>Share</span>
          </button>

          <button class="action-btn ${isSaved ? 'saved' : ''}" id="explore_save_btn_${post._id}" onclick="toggleSaveExplorePost(this, '${post._id}')">
            <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
            <span>${isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <!-- Comments Drawer -->
        <div class="comments-section" id="explore_comments_${post._id}">
          <div class="add-comment-box">
            <img src="${currentUser.profileImage}" class="avatar avatar-sm">
            <input type="text" id="explore_comment_input_${post._id}" placeholder="Write a comment..." onkeypress="handleExploreCommentKey(event, '${post._id}')">
            <button class="btn btn-primary btn-sm" onclick="addExploreComment('${post._id}')">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>

          <div class="comment-list" id="explore_comment_list_${post._id}">
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

// 2. Creators Tab
function renderCreators(container) {
  if (exploreCreators.length === 0) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 48px 24px; text-align: center;">
        <i class="fa-regular fa-user text-muted" style="font-size: 3rem; margin-bottom: 12px;"></i>
        <h3 style="font-size: 1.15rem; margin-bottom: 4px;">No creators found</h3>
        <p class="text-muted text-sm">Try searching for a different username or name.</p>
      </div>
    `;
    return;
  }

  const currentUser = getCurrentUser();
  const followingIds = (currentUser.following || []).map(id => (id._id || id).toString());

  container.innerHTML = `
    <div class="creators-grid">
      ${exploreCreators.map(creator => {
        const isFollowing = followingIds.includes(creator._id);
        const isSelf = creator._id === currentUser._id;
        const followersCount = (creator.followers || []).length;

        return `
          <div class="creator-card">
            <img src="${creator.coverImage || DEFAULT_DEMO_USER.coverImage}" class="creator-card-cover" alt="Cover">
            <img src="${creator.profileImage || DEFAULT_DEMO_USER.profileImage}" class="creator-card-avatar" alt="${escapeHTML(creator.name)}">
            <div class="creator-card-body">
              <a href="profile.html?id=${creator._id}" class="creator-card-name">${escapeHTML(creator.name)}</a>
              <div class="creator-card-handle">@${escapeHTML(creator.username)}</div>
              <div class="creator-card-bio">${escapeHTML(creator.bio || 'Creator on Connectly')}</div>
              <div class="text-xs text-muted mb-3" style="margin-bottom: 12px;">
                <strong>${followersCount}</strong> followers
              </div>
              ${!isSelf ? `
                <button class="btn ${isFollowing ? 'btn-secondary' : 'btn-primary'} btn-sm btn-full" onclick="toggleFollowCreator(this, '${creator._id}', '${escapeHTML(creator.name)}')">
                  ${isFollowing ? 'Following' : 'Follow'}
                </button>
              ` : `
                <a href="profile.html" class="btn btn-secondary btn-sm btn-full">View Profile</a>
              `}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// 3. Visual Gallery Grid Tab
function renderVisualGallery(container) {
  const mediaPosts = explorePosts.filter(p => p.image);

  if (mediaPosts.length === 0) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 48px 24px; text-align: center;">
        <i class="fa-regular fa-image text-muted" style="font-size: 3rem; margin-bottom: 12px;"></i>
        <h3 style="font-size: 1.15rem; margin-bottom: 4px;">No visual media found</h3>
        <p class="text-muted text-sm">Photos and visual creations from this topic will appear here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="explore-gallery-grid">
      ${mediaPosts.map(post => `
        <div class="gallery-grid-item" onclick="switchToPostView('${post._id}')">
          <img src="${post.image}" alt="Media thumbnail" loading="lazy">
          <div class="gallery-grid-overlay">
            <div class="gallery-overlay-stat">
              <i class="fa-solid fa-heart"></i>
              <span>${(post.likes || []).length}</span>
            </div>
            <div class="gallery-overlay-stat">
              <i class="fa-solid fa-comment"></i>
              <span>${(post.comments || []).length}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Helper: Format hashtags into clickable triggers
function formatPostTextWithTags(text) {
  const escaped = escapeHTML(text);
  return escaped.replace(/#([a-zA-Z0-9_]+)/g, (match, tag) => {
    return `<span class="text-accent font-semibold" style="cursor: pointer;" onclick="selectTag('${tag}')">#${tag}</span>`;
  });
}

// Switch back to trending post view & scroll to post
function switchToPostView(postId) {
  activeExploreTab = 'trending';
  document.querySelectorAll('#exploreTabs .explore-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === 'trending');
  });
  renderExploreContent();
  setTimeout(() => {
    const el = document.getElementById(`explore_post_${postId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

// Like / Unlike Post
async function toggleLikeExplorePost(postId) {
  const currentUser = getCurrentUser();
  const post = explorePosts.find(p => p._id === postId);
  if (!post) return;

  if (!post.likes) post.likes = [];
  const likedIndex = post.likes.findIndex(l => (l._id || l) === currentUser._id);
  const isLiked = likedIndex !== -1;

  if (isLiked) {
    post.likes.splice(likedIndex, 1);
  } else {
    post.likes.push(currentUser._id);
  }

  renderExploreContent();

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

// Save / Bookmark Post
async function toggleSaveExplorePost(btn, postId) {
  const post = explorePosts.find(p => p._id === postId);
  if (!post) return;

  const savedPosts = JSON.parse(localStorage.getItem('connectly_saved_posts') || '[]');
  const existingIndex = savedPosts.findIndex(p => p._id === postId);
  const willSave = existingIndex === -1;

  if (willSave) {
    savedPosts.unshift(post);
    showToast('Post saved to bookmarks', 'success');
  } else {
    savedPosts.splice(existingIndex, 1);
    showToast('Removed from saved bookmarks', 'info');
  }

  localStorage.setItem('connectly_saved_posts', JSON.stringify(savedPosts));
  renderExploreContent();

  const token = getAuthToken();
  if (token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_')) {
    try {
      await fetch(`${API_BASE_URL}/posts/${postId}/save`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  }
}

// Toggle comments drawer
function toggleExploreComments(postId) {
  const drawer = document.getElementById(`explore_comments_${postId}`);
  if (drawer) {
    drawer.classList.toggle('active');
    const input = document.getElementById(`explore_comment_input_${postId}`);
    if (drawer.classList.contains('active') && input) input.focus();
  }
}

// Add comment
async function addExploreComment(postId) {
  const input = document.getElementById(`explore_comment_input_${postId}`);
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  const currentUser = getCurrentUser();
  const post = explorePosts.find(p => p._id === postId);
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
  renderExploreContent();
  toggleExploreComments(postId);
  showToast('Comment posted!', 'success');

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

function handleExploreCommentKey(event, postId) {
  if (event.key === 'Enter') addExploreComment(postId);
}

// Share post
function shareExplorePost(postId) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.origin + `/index.html#post_${postId}`);
  }
  showToast('Post link copied to clipboard!', 'success');
}

// Follow / Unfollow Creator
async function toggleFollowCreator(btn, userId, userName) {
  const isFollowing = btn.textContent.trim() === 'Following';
  const endpoint = isFollowing ? 'unfollow' : 'follow';
  const token = getAuthToken();

  btn.disabled = true;
  if (isFollowing) {
    btn.className = 'btn btn-primary btn-sm btn-full';
    btn.textContent = 'Follow';
  } else {
    btn.className = 'btn btn-secondary btn-sm btn-full';
    btn.textContent = 'Following';
  }

  showToast(isFollowing ? `Unfollowed ${userName}` : `You are now following ${userName}!`, isFollowing ? 'info' : 'success');

  const isReal = token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_');
  if (isReal) {
    try {
      await fetch(`${API_BASE_URL}/users/${userId}/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshCurrentUserFromServer();
    } catch (e) {}
  }
  btn.disabled = false;
}

// Tag selection trigger
window.selectTag = function(tag) {
  activeTag = tag;
  document.querySelectorAll('#exploreTagsList .explore-tag-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.tag === tag);
  });
  loadExploreData();
};

// Initialize Explore Controls
function initExploreControls() {
  // Tabs
  const tabs = document.querySelectorAll('#exploreTabs .explore-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeExploreTab = tab.dataset.tab;
      renderExploreContent();
    });
  });

  // Tag pills
  const tagPills = document.querySelectorAll('#exploreTagsList .explore-tag-pill');
  tagPills.forEach(pill => {
    pill.addEventListener('click', () => {
      tagPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeTag = pill.dataset.tag;
      loadExploreData();
    });
  });

  // Search input
  const searchInput = document.getElementById('exploreSearchInput');
  const clearBtn = document.getElementById('exploreClearBtn');

  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      searchKeyword = e.target.value.trim();
      if (clearBtn) clearBtn.style.display = searchKeyword ? 'block' : 'none';

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        loadExploreData();
      }, 300);
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchKeyword = '';
      clearBtn.style.display = 'none';
      loadExploreData();
    });
  }

  // Check URL params (?q=... or ?tag=...)
  const params = new URLSearchParams(window.location.search);
  const qParam = params.get('q');
  const tagParam = params.get('tag');

  if (tagParam) {
    selectTag(tagParam);
  } else if (qParam) {
    if (searchInput) {
      searchInput.value = qParam;
      searchKeyword = qParam;
      if (clearBtn) clearBtn.style.display = 'block';
    }
  }
}

// Suggested Creators in right sidebar
async function loadSuggestedCreatorsSidebar() {
  const container = document.getElementById('suggestedUsersContainer');
  if (!container) return;

  const creators = MOCK_EXPLORE_CREATORS.slice(0, 3);
  container.innerHTML = creators.map(u => `
    <div class="suggested-user-item">
      <img src="${u.profileImage}" class="avatar avatar-sm">
      <div class="suggested-info">
        <div class="suggested-name">${escapeHTML(u.name)}</div>
        <div class="suggested-handle">@${escapeHTML(u.username)}</div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="showToast('Followed ${escapeHTML(u.name)}!', 'success')">Follow</button>
    </div>
  `).join('');
}

// On DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initExploreControls();
  loadExploreData();
  loadSuggestedCreatorsSidebar();

  document.getElementById('navbarSearchInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      if (q) {
        searchKeyword = q;
        const mainSearch = document.getElementById('exploreSearchInput');
        if (mainSearch) mainSearch.value = q;
        loadExploreData();
      }
    }
  });
});
