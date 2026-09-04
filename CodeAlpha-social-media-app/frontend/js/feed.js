/* ==========================================================================
   CodeAlpha - HOME FEED MODULE (feed.js)
   ========================================================================== */

// Initial Seed Feed Data (for immediate visual feedback & API fallback)
const MOCK_POSTS = [
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
    likes: ['usr_demo_101', 'usr_103', 'usr_104', 'usr_105'],
    comments: [
      {
        _id: 'c_1',
        user: { name: 'Elena Rostova', username: 'elena_r', profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
        text: 'The contrast and typography look absolutely phenomenal!',
        createdAt: '25m ago'
      },
      {
        _id: 'c_2',
        user: { name: 'David Chen', username: 'davidc', profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
        text: 'Is this repository open source? Would love to contribute.',
        createdAt: '10m ago'
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
    content: 'Had an amazing morning exploring hidden coastal views and working remotely from this quiet coffee corner ☕️🌊',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    likes: ['usr_102'],
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
    content: 'Pro tip for backend engineers: Keep your REST API controllers slim and delegate business logic to clean services. Your future self will thank you! 💻⚡️',
    image: '',
    likes: ['usr_demo_101', 'usr_102', 'usr_103'],
    comments: [],
    createdAt: '1 day ago'
  }
];

const MOCK_SUGGESTED_USERS = [
  { _id: 'usr_103', name: 'Elena Rostova', username: 'elena_r', profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', isFollowing: false },
  { _id: 'usr_104', name: 'Marcus Vance', username: 'marcus_v', profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', isFollowing: true },
  { _id: 'usr_105', name: 'Sophia Lin', username: 'sophialin', profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', isFollowing: false }
];

let statePosts = [];
let selectedPostImageBase64 = '';
let selectedPostImageFile = null; // real File object sent to the backend via multipart upload
let selectedFeeling = null; // { emoji, label }
let selectedTags = []; // array of hashtag strings (without '#')

const FEELING_OPTIONS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🥰', label: 'Loved' },
  { emoji: '😎', label: 'Cool' },
  { emoji: '🤩', label: 'Excited' },
  { emoji: '😴', label: 'Sleepy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '🤔', label: 'Thoughtful' },
  { emoji: '🥳', label: 'Festive' },
  { emoji: '🙏', label: 'Grateful' },
  { emoji: '💪', label: 'Motivated' },
  { emoji: '☕', label: 'Chill' }
];

// --- Feeling Popover ---
function renderFeelingGrid() {
  const grid = document.getElementById('feelingGrid');
  if (!grid) return;
  grid.innerHTML = FEELING_OPTIONS.map(f => `
    <button type="button" class="feeling-option" data-emoji="${f.emoji}" data-label="${f.label}">
      <span>${f.emoji}</span>
      <span class="feeling-label">${f.label}</span>
    </button>
  `).join('');
}

function closeAllPopovers() {
  document.getElementById('feelingPopover')?.classList.remove('active');
  document.getElementById('tagPopover')?.classList.remove('active');
}

function initFeelingAndTagPopovers() {
  const emojiBtn = document.getElementById('emojiBtn');
  const feelingPopover = document.getElementById('feelingPopover');
  const tagBtn = document.getElementById('tagBtn');
  const tagPopover = document.getElementById('tagPopover');
  const tagInputField = document.getElementById('tagInputField');
  const tagAddBtn = document.getElementById('tagAddBtn');

  renderFeelingGrid();
  renderTagChips();

  if (emojiBtn && feelingPopover) {
    emojiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !feelingPopover.classList.contains('active');
      closeAllPopovers();
      if (willOpen) feelingPopover.classList.add('active');
    });
  }

  if (tagBtn && tagPopover) {
    tagBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !tagPopover.classList.contains('active');
      closeAllPopovers();
      if (willOpen) {
        tagPopover.classList.add('active');
        tagInputField?.focus();
      }
    });
  }

  document.getElementById('feelingGrid')?.addEventListener('click', (e) => {
    const opt = e.target.closest('.feeling-option');
    if (!opt) return;
    selectedFeeling = { emoji: opt.dataset.emoji, label: opt.dataset.label };
    renderSelectedFeelingBadge();
    closeAllPopovers();
  });

  const addTagFromInput = () => {
    const raw = tagInputField.value.trim().replace(/^#/, '');
    if (!raw) return;
    const clean = raw.replace(/[^a-zA-Z0-9_]/g, '');
    if (clean && !selectedTags.includes(clean)) {
      selectedTags.push(clean);
      renderTagChips();
    }
    tagInputField.value = '';
    tagInputField.focus();
  };

  if (tagAddBtn) tagAddBtn.addEventListener('click', addTagFromInput);
  if (tagInputField) {
    tagInputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTagFromInput();
      }
    });
  }

  document.getElementById('tagChipList')?.addEventListener('click', (e) => {
    const removeIcon = e.target.closest('[data-remove-tag]');
    if (!removeIcon) return;
    selectedTags = selectedTags.filter(t => t !== removeIcon.dataset.removeTag);
    renderTagChips();
  });

  // Close popovers when clicking outside of them
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.popover-wrap')) closeAllPopovers();
  });
}

function renderSelectedFeelingBadge() {
  const textarea = document.getElementById('postInputText');
  if (!textarea) return;
  let badge = document.getElementById('selectedFeelingBadge');
  if (!selectedFeeling) {
    if (badge) badge.remove();
    return;
  }
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'selectedFeelingBadge';
    badge.className = 'selected-feeling-badge';
    textarea.insertAdjacentElement('afterend', badge);
  }
  badge.innerHTML = `${selectedFeeling.emoji} Feeling ${escapeHTML(selectedFeeling.label)} <i class="fa-solid fa-xmark" id="clearFeelingBtn"></i>`;
  document.getElementById('clearFeelingBtn').addEventListener('click', () => {
    selectedFeeling = null;
    renderSelectedFeelingBadge();
  });
}

function renderTagChips() {
  const list = document.getElementById('tagChipList');
  if (!list) return;
  list.innerHTML = selectedTags.map(t => `
    <span class="tag-chip">#${escapeHTML(t)} <i class="fa-solid fa-xmark" data-remove-tag="${escapeHTML(t)}"></i></span>
  `).join('') || '<span class="text-xs text-muted">No hashtags added yet</span>';
}

function buildFinalPostContent(rawText) {
  let text = rawText;
  if (selectedFeeling) text += `${text ? '\n\n' : ''}— feeling ${selectedFeeling.emoji} ${selectedFeeling.label}`;
  if (selectedTags.length) text += `${text ? '\n' : ''}${selectedTags.map(t => `#${t}`).join(' ')}`;
  return text;
}

function resetFeelingAndTags() {
  selectedFeeling = null;
  selectedTags = [];
  renderSelectedFeelingBadge();
  renderTagChips();
}


// Helper to sanitize text HTML output
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// --- Fetch Posts from Backend API (with Mock Fallback) ---
async function fetchFeedPosts() {
  const container = document.getElementById('postsFeedContainer');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}/posts`);
    if (res.ok) {
      const data = await res.json();
      statePosts = Array.isArray(data) && data.length > 0 ? data : getStoredPosts();
    } else {
      statePosts = getStoredPosts();
    }
  } catch (err) {
    statePosts = getStoredPosts();
  }

  renderPosts(statePosts);
}

function getStoredPosts() {
  const stored = localStorage.getItem('connectly_posts');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('connectly_posts', JSON.stringify(MOCK_POSTS));
  return MOCK_POSTS;
}

function saveStoredPosts(posts) {
  statePosts = posts;
  localStorage.setItem('connectly_posts', JSON.stringify(posts));
}

// --- Render Posts to Feed Container ---
function renderPosts(posts) {
  const container = document.getElementById('postsFeedContainer');
  if (!container) return;

  if (posts.length === 0) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 40px 20px; text-align: center;">
        <i class="fa-regular fa-folder-open text-muted" style="font-size: 3rem; margin-bottom: 12px;"></i>
        <h3>No posts yet</h3>
        <p class="text-muted text-sm" style="margin-top: 4px;">Be the first to share something with the community!</p>
      </div>
    `;
    return;
  }

  const currentUser = getCurrentUser();
  const savedList = JSON.parse(localStorage.getItem('connectly_saved_posts') || '[]');
  const savedIds = new Set(savedList.map(p => p._id));

  container.innerHTML = posts.map(post => {
    const isLiked = post.likes && post.likes.includes(currentUser._id);
    const isSaved = savedIds.has(post._id);
    const likesCount = post.likes ? post.likes.length : 0;
    const commentsList = post.comments || [];
    const commentsCount = commentsList.length;

    return `
      <article class="card post-card" id="post_card_${post._id}">
        <!-- Post Header -->
        <div class="post-header">
          <div class="post-author">
            <img src="${post.user.profileImage || DEFAULT_DEMO_USER.profileImage}" alt="${escapeHTML(post.user.name)}" class="avatar">
            <div>
              <a href="profile.html?user=${post.user._id}" class="post-author-name">${escapeHTML(post.user.name)}</a>
              <div class="post-meta">
                <span>@${escapeHTML(post.user.username)}</span> • <span>${post.createdAt || 'Just now'}</span>
              </div>
            </div>
          </div>
          <div class="user-dropdown">
            <button class="nav-icon-btn text-muted" onclick="event.stopPropagation(); togglePostMenu('${post._id}')">
              <i class="fa-solid fa-ellipsis"></i>
            </button>
            <div class="dropdown-menu" id="post_menu_${post._id}">
              ${post.user._id === currentUser._id ? `
                <a href="#" class="dropdown-item text-muted" onclick="event.preventDefault(); deletePost('${post._id}')">
                  <i class="fa-regular fa-trash-can"></i> Delete Post
                </a>
              ` : `
                <a href="#" class="dropdown-item text-muted" onclick="event.preventDefault(); showToast('Post reported', 'info'); document.getElementById('post_menu_${post._id}').classList.remove('active');">
                  <i class="fa-regular fa-flag"></i> Report Post
                </a>
              `}
            </div>
          </div>
        </div>

        <!-- Post Body Content -->
        <div class="post-content">
          ${escapeHTML(post.content)}
        </div>

        <!-- Post Image Media (if available) -->
        ${post.image ? `
          <div class="post-media">
            <img src="${post.image}" alt="Post image attachment" loading="lazy">
          </div>
        ` : ''}

        <!-- Post Stats Counter -->
        <div class="post-stats">
          <div>
            <i class="fa-solid fa-heart text-danger"></i>
            <span id="likes_count_${post._id}">${likesCount}</span> likes
          </div>
          <div>
            <span id="comments_count_${post._id}">${commentsCount}</span> comments
          </div>
        </div>

        <!-- Post Action Buttons -->
        <div class="post-actions">
          <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLikePost('${post._id}')">
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

          <button class="action-btn ${isSaved ? 'saved' : ''}" onclick="toggleBookmarkPost(this, '${post._id}')">
            <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
            <span>${isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <!-- Comments Drawer Section -->
        <div class="comments-section" id="comments_section_${post._id}">
          <div class="add-comment-box">
            <img src="${currentUser.profileImage}" class="avatar avatar-sm">
            <input type="text" id="comment_input_${post._id}" placeholder="Write a comment..." onkeypress="handleCommentKeyPress(event, '${post._id}')">
            <button class="btn btn-primary btn-sm" onclick="addComment('${post._id}')">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>

          <div class="comment-list" id="comment_list_${post._id}">
            ${commentsList.map(c => `
              <div class="comment-item">
                <img src="${c.user.profileImage || DEFAULT_DEMO_USER.profileImage}" class="avatar avatar-sm">
                <div class="comment-bubble">
                  <div class="comment-author">${escapeHTML(c.user.name)}</div>
                  <div class="comment-text">${escapeHTML(c.text)}</div>
                  <div class="comment-meta">
                    <span>${c.createdAt || 'Just now'}</span>
                    <span style="cursor: pointer;" onclick="showToast('Liked comment', 'info')">Like</span>
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

// --- Post "..." Menu (delete / report) ---
function togglePostMenu(postId) {
  const menu = document.getElementById(`post_menu_${postId}`);
  if (!menu) return;
  const willOpen = !menu.classList.contains('active');
  document.querySelectorAll('.dropdown-menu.active').forEach(m => m.classList.remove('active'));
  if (willOpen) menu.classList.add('active');
}

// Close any open post menu when clicking elsewhere on the page
document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-dropdown')) {
    document.querySelectorAll('[id^="post_menu_"].active').forEach(m => m.classList.remove('active'));
  }
});

// --- Delete a Post ---
async function deletePost(postId) {
  const menu = document.getElementById(`post_menu_${postId}`);
  if (menu) menu.classList.remove('active');

  if (!confirm('Delete this post? This cannot be undone.')) return;

  const token = getAuthToken();
  const isRealAccount = token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_');

  if (isRealAccount) {
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        showToast('Could not delete post — please try again', 'danger');
        return;
      }
    } catch (err) {
      showToast('Could not delete post — please try again', 'danger');
      return;
    }
  }

  statePosts = statePosts.filter(p => p._id !== postId);
  saveStoredPosts(statePosts);
  renderPosts(statePosts);
  showToast('Post deleted', 'info');
}

// --- Like / Unlike Post Handler ---
async function toggleLikePost(postId) {
  const currentUser = getCurrentUser();
  const post = statePosts.find(p => p._id === postId);
  if (!post) return;

  if (!post.likes) post.likes = [];
  const likedIndex = post.likes.indexOf(currentUser._id);
  const isCurrentlyLiked = likedIndex !== -1;

  if (isCurrentlyLiked) {
    post.likes.splice(likedIndex, 1);
  } else {
    post.likes.push(currentUser._id);
  }

  saveStoredPosts(statePosts);
  renderPosts(statePosts);

  // Send request to API backend
  try {
    const endpoint = isCurrentlyLiked ? 'unlike' : 'like';
    await fetch(`${API_BASE_URL}/posts/${postId}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (e) {
    // Graceful offline fallback
  }
}

// --- Toggle Comments Drawer ---
function toggleCommentsSection(postId) {
  const section = document.getElementById(`comments_section_${postId}`);
  if (section) {
    section.classList.toggle('active');
    const input = document.getElementById(`comment_input_${postId}`);
    if (section.classList.contains('active') && input) {
      input.focus();
    }
  }
}

// --- Handle Add Comment ---
async function addComment(postId) {
  const input = document.getElementById(`comment_input_${postId}`);
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  const currentUser = getCurrentUser();
  const post = statePosts.find(p => p._id === postId);

  if (!post) return;

  if (!post.comments) post.comments = [];

  const newComment = {
    _id: `c_${Date.now()}`,
    user: {
      _id: currentUser._id,
      name: currentUser.name,
      username: currentUser.username,
      profileImage: currentUser.profileImage
    },
    text: text,
    createdAt: 'Just now'
  };

  post.comments.push(newComment);
  input.value = '';
  saveStoredPosts(statePosts);
  renderPosts(statePosts);

  // Keep comments section open
  toggleCommentsSection(postId);
  showToast('Comment added!', 'success');

  try {
    await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });
  } catch (e) {}
}

function handleCommentKeyPress(event, postId) {
  if (event.key === 'Enter') {
    addComment(postId);
  }
}

// --- Bookmark / Share Handlers ---
async function toggleBookmarkPost(btn, postId) {
  const post = statePosts.find(p => p._id === postId);
  if (!post) return;

  let savedPosts = JSON.parse(localStorage.getItem('connectly_saved_posts') || '[]');
  const idx = savedPosts.findIndex(p => p._id === postId);
  const willSave = idx === -1;

  if (willSave) {
    savedPosts.unshift(post);
    btn.classList.add('saved');
    btn.querySelector('i').className = 'fa-solid fa-bookmark';
    const span = btn.querySelector('span');
    if (span) span.textContent = 'Saved';
    showToast('Post saved to bookmarks', 'success');
  } else {
    savedPosts.splice(idx, 1);
    btn.classList.remove('saved');
    btn.querySelector('i').className = 'fa-regular fa-bookmark';
    const span = btn.querySelector('span');
    if (span) span.textContent = 'Save';
    showToast('Removed from bookmarks', 'info');
  }

  localStorage.setItem('connectly_saved_posts', JSON.stringify(savedPosts));

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

function sharePost(postId) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
  }
  showToast('Post link copied to clipboard!', 'success');
}

// --- Create Post Composer (Home Feed) ---
function initCreatePostComposer() {
  const postFileInput = document.getElementById('postFileInput');
  const imagePreviewBox = document.getElementById('imagePreviewBox');
  const imagePreviewSrc = document.getElementById('imagePreviewSrc');
  const removeImgBtn = document.getElementById('removeImgBtn');
  const publishPostBtn = document.getElementById('publishPostBtn');
  const postInputText = document.getElementById('postInputText');

  if (!publishPostBtn || !postInputText) return;

  if (postFileInput) {
    postFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        selectedPostImageFile = file; // the real File object, sent to the backend
        const reader = new FileReader();
        reader.onload = (event) => {
          selectedPostImageBase64 = event.target.result; // only used for the local preview
          imagePreviewSrc.src = selectedPostImageBase64;
          imagePreviewBox.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (removeImgBtn) {
    removeImgBtn.addEventListener('click', () => {
      selectedPostImageBase64 = '';
      selectedPostImageFile = null;
      if (postFileInput) postFileInput.value = '';
      imagePreviewBox.style.display = 'none';
    });
  }

  publishPostBtn.addEventListener('click', async () => {
    const rawText = postInputText.value.trim();
    if (!rawText && !selectedPostImageBase64) {
      showToast('Please enter text or upload an image for your post', 'danger');
      return;
    }
    const text = buildFinalPostContent(rawText);

    const currentUser = getCurrentUser();
    const tempId = `post_${Date.now()}`;
    const newPost = {
      _id: tempId,
      user: {
        _id: currentUser._id,
        name: currentUser.name,
        username: currentUser.username,
        profileImage: currentUser.profileImage
      },
      content: text,
      image: selectedPostImageBase64, // local preview only, until the server confirms
      likes: [],
      comments: [],
      createdAt: 'Just now'
    };

    // Show the post immediately (optimistic update)
    statePosts.unshift(newPost);
    renderPosts(statePosts);

    publishPostBtn.disabled = true;
    publishPostBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Posting...`;

    let saveSucceeded = false;
    try {
      let response;
      if (selectedPostImageFile) {
        // Real image attached — send as multipart/form-data so the backend's
        // multer middleware can save it to /uploads and return a real path.
        const formData = new FormData();
        formData.append('content', text);
        formData.append('image', selectedPostImageFile);
        response = await fetch(`${API_BASE_URL}/posts`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${getAuthToken()}` },
          body: formData
        });
      } else {
        response = await fetch(`${API_BASE_URL}/posts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: text })
        });
      }

      if (response.ok) {
        const savedPost = await response.json();
        // Swap the optimistic temp post for the real, persisted one
        const idx = statePosts.findIndex(p => p._id === tempId);
        if (idx !== -1) statePosts[idx] = savedPost;
        saveSucceeded = true;
      } else {
        let errMsg = `Server error (${response.status})`;
        try {
          const errData = await response.json();
          if (errData.message) errMsg = errData.message;
        } catch (parseErr) {}
        showToast(`Post was NOT saved to the server: ${errMsg}`, 'danger');
        // Remove the misleading optimistic post so the UI doesn't show
        // something that didn't actually persist to the database.
        statePosts = statePosts.filter(p => p._id !== tempId);
      }
    } catch (e) {
      showToast('Post was NOT saved — check your connection to the server', 'danger');
      statePosts = statePosts.filter(p => p._id !== tempId);
    }

    saveStoredPosts(statePosts);

    // Reset Composer
    postInputText.value = '';
    selectedPostImageBase64 = '';
    selectedPostImageFile = null;
    resetFeelingAndTags();
    if (imagePreviewBox) imagePreviewBox.style.display = 'none';
    if (postFileInput) postFileInput.value = '';


    publishPostBtn.disabled = false;
    publishPostBtn.innerHTML = `<span>Post</span> <i class="fa-solid fa-paper-plane text-xs"></i>`;

    renderPosts(statePosts);
    if (saveSucceeded) showToast('Post published successfully!', 'success');
  });
}

// --- Suggested Users Widget Render & Actions ---
async function renderSuggestedUsers() {
  const container = document.getElementById('suggestedUsersContainer');
  if (!container) return;

  const token = getAuthToken();
  const isRealAccount = token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_');

  if (!isRealAccount) {
    // Demo/offline mode — show the illustrative mock list (no real follow persistence)
    container.innerHTML = MOCK_SUGGESTED_USERS.map(user => `
      <div class="suggested-user-item">
        <img src="${user.profileImage}" alt="${escapeHTML(user.name)}" class="avatar avatar-sm">
        <div class="suggested-info">
          <div class="suggested-name">${escapeHTML(user.name)}</div>
          <div class="suggested-handle">@${escapeHTML(user.username)}</div>
        </div>
        <button class="btn ${user.isFollowing ? 'btn-secondary' : 'btn-outline'} btn-sm" onclick="toggleFollowUser(this, '${user._id}', '${escapeHTML(user.name)}')">
          ${user.isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    `).join('');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to load suggested users');
    const users = await res.json();
    const currentUser = getCurrentUser();
    const followingIds = (currentUser.following || []).map(id => (id._id || id).toString());

    if (!users.length) {
      container.innerHTML = '<div class="text-xs text-muted">No suggestions yet — invite friends to join!</div>';
      return;
    }

    container.innerHTML = users.slice(0, 5).map(user => {
      const isFollowing = followingIds.includes(user._id);
      return `
        <div class="suggested-user-item">
          <img src="${user.profileImage}" alt="${escapeHTML(user.name)}" class="avatar avatar-sm">
          <div class="suggested-info">
            <div class="suggested-name">${escapeHTML(user.name)}</div>
            <div class="suggested-handle">@${escapeHTML(user.username)}</div>
          </div>
          <button class="btn ${isFollowing ? 'btn-secondary' : 'btn-outline'} btn-sm" onclick="toggleFollowUser(this, '${user._id}', '${escapeHTML(user.name)}')">
            ${isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = '<div class="text-xs text-muted">Could not load suggestions right now.</div>';
  }
}

async function toggleFollowUser(btn, userId, userName) {
  const isFollowing = btn.classList.contains('btn-secondary');
  const endpoint = isFollowing ? 'unfollow' : 'follow';
  const token = getAuthToken();
  const isRealAccount = token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_');

  // Optimistic UI update
  btn.disabled = true;
  if (isFollowing) {
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-outline');
    btn.textContent = 'Follow';
  } else {
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-secondary');
    btn.textContent = 'Following';
  }

  if (!isRealAccount) {
    btn.disabled = false;
    showToast(isFollowing ? `Unfollowed ${userName}` : `You are now following ${userName}!`, isFollowing ? 'info' : 'success');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/${endpoint}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Follow action failed');

    // Keep the local following list in sync so profile counts stay accurate
    const currentUser = getCurrentUser();
    const following = new Set((currentUser.following || []).map(id => (id._id || id).toString()));
    if (isFollowing) following.delete(userId); else following.add(userId);
    currentUser.following = Array.from(following);
    setAuth(currentUser, token);

    showToast(isFollowing ? `Unfollowed ${userName}` : `You are now following ${userName}!`, isFollowing ? 'info' : 'success');
  } catch (err) {
    // Revert the optimistic update on failure
    if (isFollowing) {
      btn.classList.remove('btn-outline');
      btn.classList.add('btn-secondary');
      btn.textContent = 'Following';
    } else {
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-outline');
      btn.textContent = 'Follow';
    }
    showToast('Could not update follow status — please try again', 'danger');
  } finally {
    btn.disabled = false;
  }
}

// --- Search Filter Input Listener ---
function initSearchFilter() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderPosts(statePosts);
      return;
    }

    const filtered = statePosts.filter(p => 
      p.content.toLowerCase().includes(query) ||
      p.user.name.toLowerCase().includes(query) ||
      p.user.username.toLowerCase().includes(query)
    );

    renderPosts(filtered);
  });
}

// Initialize Home Feed
document.addEventListener('DOMContentLoaded', () => {
  fetchFeedPosts();
  initCreatePostComposer();
  initFeelingAndTagPopovers();
  renderSuggestedUsers();
  initSearchFilter();
});