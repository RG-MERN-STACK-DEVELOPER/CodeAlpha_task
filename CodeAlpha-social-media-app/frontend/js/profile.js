/* ==========================================================================
   CodeAlpha - PROFILE MODULE (profile.js)
   ========================================================================== */

let currentProfileUser = null;
let profilePosts = [];
let activeTab = 'posts';

// --- Fetch & Render Profile Info ---
async function loadProfile() {
  currentProfileUser = getCurrentUser();
  renderProfileHeader(currentProfileUser);
  loadProfilePosts();

  // Pull the authoritative record from the server so follower/following
  // counts, bio, etc. reflect real data (not a stale local cache).
  const token = getAuthToken();
  if (token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_')) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const freshUser = await res.json();
        setAuth(freshUser, token);
        currentProfileUser = freshUser;
        renderProfileHeader(freshUser);
        loadProfilePosts();
      }
    } catch (err) {
      // Offline / backend unreachable — keep showing the cached copy
    }
  }
}

function renderProfileHeader(user) {
  const profileFullName = document.getElementById('profileFullName');
  const profileHandle = document.getElementById('profileHandle');
  const profileBioText = document.getElementById('profileBioText');
  const profileLocationText = document.getElementById('profileLocationText');
  const profileWebsiteLink = document.getElementById('profileWebsiteLink');
  const profileAvatarImg = document.getElementById('profileAvatarImg');
  const profileCoverImg = document.getElementById('profileCoverImg');

  if (profileFullName) profileFullName.textContent = user.name || 'Sarah Jenkins';
  if (profileHandle) profileHandle.textContent = `@${user.username || 'sarahj'}`;
  if (profileBioText) profileBioText.textContent = user.bio || 'No bio yet.';
  if (profileLocationText) profileLocationText.textContent = user.location || 'Global';
  
  if (profileWebsiteLink) {
    profileWebsiteLink.textContent = user.website ? user.website.replace(/^https?:\/\//, '') : 'sarahjenkins.dev';
    profileWebsiteLink.href = user.website || '#';
  }

  if (profileAvatarImg) profileAvatarImg.src = user.profileImage || DEFAULT_DEMO_USER.profileImage;
  if (profileCoverImg) profileCoverImg.src = user.coverImage || DEFAULT_DEMO_USER.coverImage;

  // Stats
  const followersCount = user.followers ? user.followers.length : 2480;
  const followingCount = user.following ? user.following.length : 486;
  
  const statFollowersCount = document.getElementById('statFollowersCount');
  const statFollowingCount = document.getElementById('statFollowingCount');

  if (statFollowersCount) statFollowersCount.textContent = followersCount.toLocaleString();
  if (statFollowingCount) statFollowingCount.textContent = followingCount.toLocaleString();
}

// --- Fetch User's Posts ---
async function loadProfilePosts() {
  const container = document.getElementById('profilePostsContainer');
  if (!container) return;

  const currentUser = getCurrentUser();
  const token = getAuthToken();
  const isRealAccount = token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_');

  if (isRealAccount) {
    // Backend is the source of truth — always reflects real, persisted posts
    try {
      const res = await fetch(`${API_BASE_URL}/posts`);
      if (res.ok) {
        const allPosts = await res.json();
        profilePosts = allPosts.filter(p => p.user._id === currentUser._id);
      } else {
        profilePosts = [];
      }
    } catch (err) {
      profilePosts = [];
    }
  } else {
    // Demo/offline mode falls back to whatever is cached locally
    const allPosts = getStoredPosts();
    profilePosts = allPosts.filter(p => p.user._id === currentUser._id || p.user.username === currentUser.username);
  }

  const statPostsCount = document.getElementById('statPostsCount');
  if (statPostsCount) statPostsCount.textContent = profilePosts.length;

  renderTabContent();
}

function renderTabContent() {
  const container = document.getElementById('profilePostsContainer');
  if (!container) return;

  if (activeTab === 'posts') {
    if (profilePosts.length === 0) {
      container.innerHTML = `
        <div class="card text-center" style="padding: 40px 20px; text-align: center;">
          <i class="fa-regular fa-clone text-muted" style="font-size: 2.5rem; margin-bottom: 12px;"></i>
          <h3>No posts published yet</h3>
          <p class="text-muted text-sm">When you share posts, they will appear on your profile.</p>
        </div>
      `;
      return;
    }
    container.innerHTML = `<div class="profile-grid">${profilePosts.map(renderProfileGridTile).join('')}</div>`;
  } else if (activeTab === 'replies') {
    container.innerHTML = `
      <div class="card text-center" style="padding: 30px; text-align: center;">
        <i class="fa-regular fa-comments text-muted" style="font-size: 2rem; margin-bottom: 8px;"></i>
        <p class="text-muted">No public replies yet.</p>
      </div>
    `;
  } else if (activeTab === 'media') {
    const mediaPosts = profilePosts.filter(p => p.image);
    if (mediaPosts.length === 0) {
      container.innerHTML = `
        <div class="card text-center" style="padding: 30px; text-align: center;">
          <i class="fa-regular fa-image text-muted" style="font-size: 2rem; margin-bottom: 8px;"></i>
          <p class="text-muted">No photo uploads found.</p>
        </div>
      `;
    } else {
      container.innerHTML = `<div class="profile-grid">${mediaPosts.map(renderProfileGridTile).join('')}</div>`;
    }
  } else if (activeTab === 'likes') {
    container.innerHTML = `
      <div class="card text-center" style="padding: 30px; text-align: center;">
        <i class="fa-solid fa-heart text-muted" style="font-size: 2rem; margin-bottom: 8px;"></i>
        <p class="text-muted">Posts you like will be saved here.</p>
      </div>
    `;
  }
}

// --- Instagram-style square grid tile (used by Posts & Media tabs) ---
function renderProfileGridTile(post) {
  const likeCount = post.likes ? post.likes.length : 0;
  const commentCount = post.comments ? post.comments.length : 0;
  const currentUser = getCurrentUser();
  const isOwnPost = post.user && (post.user._id === currentUser._id || post.user.username === currentUser.username);

  const overlay = `
    <div class="profile-grid-overlay">
      <span><i class="fa-solid fa-heart"></i> ${likeCount}</span>
      <span><i class="fa-solid fa-comment"></i> ${commentCount}</span>
    </div>
    ${isOwnPost ? `
      <button class="remove-img-btn" style="top: 8px; right: 8px; width: 30px; height: 30px;" title="Delete post" onclick="event.stopPropagation(); deleteProfilePost('${post._id}')">
        <i class="fa-regular fa-trash-can" style="font-size: 0.8rem;"></i>
      </button>` : ''}`;

  if (post.image) {
    return `
      <div class="profile-grid-item" onclick="openPostDetailModal('${post._id}')" style="cursor: pointer;">
        <img src="${post.image}" alt="Post image">
        ${overlay}
      </div>`;
  }
  return `
    <div class="profile-grid-item text-tile" onclick="openPostDetailModal('${post._id}')" style="cursor: pointer;">
      <p>${escapeHTML(post.content)}</p>
      ${overlay}
    </div>`;
}

// --- Delete a post from the profile grid ---
async function deleteProfilePost(postId) {
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

  profilePosts = profilePosts.filter(p => p._id !== postId);
  const statPostsCount = document.getElementById('statPostsCount');
  if (statPostsCount) statPostsCount.textContent = profilePosts.length;
  renderTabContent();
  showToast('Post deleted', 'info');
}

// --- Tab Switching Event Listeners ---
function initTabListeners() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.getAttribute('data-tab');
      renderTabContent();
    });
  });
}

// --- Edit Profile Modal Handlers ---
function initEditProfileModal() {
  const modal = document.getElementById('editProfileModal');
  const openBtn = document.getElementById('editProfileModalBtn');
  const closeBtn = document.getElementById('closeEditModalBtn');
  const cancelBtn = document.getElementById('cancelEditModalBtn');
  const form = document.getElementById('editProfileForm');

  if (!modal) return;

  const openModal = () => {
    const user = getCurrentUser();
    document.getElementById('editName').value = user.name || '';
    document.getElementById('editUsername').value = user.username || '';
    document.getElementById('editBio').value = user.bio || '';
    document.getElementById('editLocation').value = user.location || '';
    document.getElementById('editWebsite').value = user.website || '';
    document.getElementById('editAvatarPreview').src = user.profileImage || DEFAULT_DEMO_USER.profileImage;
    document.getElementById('editCoverPreview').src = user.coverImage || DEFAULT_DEMO_USER.coverImage;

    modal.classList.add('active');
  };

  const closeModal = () => modal.classList.remove('active');

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // File Preview Listeners
  const editAvatarInput = document.getElementById('editAvatarInput');
  const editAvatarPreview = document.getElementById('editAvatarPreview');
  if (editAvatarInput && editAvatarPreview) {
    editAvatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => editAvatarPreview.src = evt.target.result;
        reader.readAsDataURL(file);
      }
    });
  }

  const editCoverInput = document.getElementById('editCoverInput');
  const editCoverPreview = document.getElementById('editCoverPreview');
  if (editCoverInput && editCoverPreview) {
    editCoverInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => editCoverPreview.src = evt.target.result;
        reader.readAsDataURL(file);
      }
    });
  }

  // Form Submit Handler
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentUser = getCurrentUser();

      const updatedData = {
        ...currentUser,
        name: document.getElementById('editName').value.trim(),
        username: document.getElementById('editUsername').value.trim(),
        bio: document.getElementById('editBio').value.trim(),
        location: document.getElementById('editLocation').value.trim(),
        website: document.getElementById('editWebsite').value.trim(),
        profileImage: editAvatarPreview ? editAvatarPreview.src : currentUser.profileImage,
        coverImage: editCoverPreview ? editCoverPreview.src : currentUser.coverImage
      };

      setAuth(updatedData);
      renderProfileHeader(updatedData);
      closeModal();
      showToast('Profile updated successfully!', 'success');

      try {
        await fetch(`${API_BASE_URL}/users/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedData)
        });
      } catch (err) {}
    });
  }
}

// --- Followers / Following List Modal ---
function initFollowListModal() {
  const modal = document.getElementById('followListModal');
  const closeBtn = document.getElementById('closeFollowListModalBtn');
  const followersBox = document.getElementById('followersStatBox');
  const followingBox = document.getElementById('followingStatBox');
  if (!modal) return;

  const closeModal = () => modal.classList.remove('active');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  const openList = async (type) => {
    const title = document.getElementById('followListModalTitle');
    const body = document.getElementById('followListModalBody');
    title.textContent = type === 'followers' ? 'Followers' : 'Following';
    body.innerHTML = '<div class="notif-empty">Loading...</div>';
    modal.classList.add('active');

    const user = getCurrentUser();
    const token = getAuthToken();
    const isRealAccount = token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_');

    if (!isRealAccount || !user._id) {
      body.innerHTML = '<div class="notif-empty">Sign in with a real account to see this list.</div>';
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/${user._id}/${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const list = res.ok ? await res.json() : [];
      if (!list.length) {
        body.innerHTML = `<div class="notif-empty">No ${type} yet.</div>`;
        return;
      }
      const myFollowingIds = new Set((user.following || []).map(id => (id._id || id).toString()));
      body.innerHTML = list.map(u => `
        <div class="suggested-user-item">
          <img src="${u.profileImage}" alt="${escapeHTML(u.name)}" class="avatar avatar-sm">
          <div class="suggested-info">
            <div class="suggested-name">${escapeHTML(u.name)}</div>
            <div class="suggested-handle">@${escapeHTML(u.username)}</div>
          </div>
          ${u._id !== user._id ? `
            <button class="btn ${myFollowingIds.has(u._id) ? 'btn-secondary' : 'btn-outline'} btn-sm" onclick="toggleFollowUser(this, '${u._id}', '${escapeHTML(u.name)}')">
              ${myFollowingIds.has(u._id) ? 'Following' : 'Follow'}
            </button>` : ''}
        </div>
      `).join('');
    } catch (err) {
      body.innerHTML = '<div class="notif-empty">Could not load this list right now.</div>';
    }
  };

  if (followersBox) followersBox.addEventListener('click', () => openList('followers'));
  if (followingBox) followingBox.addEventListener('click', () => openList('following'));
}

// --- Post Detail Modal Logic ---
let currentActiveDetailPostId = null;

function openPostDetailModal(postId) {
  const post = profilePosts.find(p => p._id === postId);
  if (!post) return;

  currentActiveDetailPostId = postId;
  renderPostDetailModalContent(post);

  const modal = document.getElementById('postDetailModal');
  if (modal) modal.classList.add('active');
}

function closePostDetailModal() {
  const modal = document.getElementById('postDetailModal');
  if (modal) modal.classList.remove('active');
  currentActiveDetailPostId = null;
}

function renderPostDetailModalContent(post) {
  const currentUser = getCurrentUser();
  const author = post.user || currentUser;
  const isOwnPost = author._id === currentUser._id || author.username === currentUser.username;
  const isLiked = post.likes && post.likes.some(l => (l._id || l) === currentUser._id);
  const likesCount = post.likes ? post.likes.length : 0;
  const commentsList = post.comments || [];
  const commentsCount = commentsList.length;

  const savedPosts = JSON.parse(localStorage.getItem('connectly_saved_posts') || '[]');
  const isSaved = savedPosts.some(p => p._id === post._id);

  // Author details
  const avatar = document.getElementById('modalPostAvatar');
  const name = document.getElementById('modalPostAuthorName');
  const meta = document.getElementById('modalPostMeta');
  if (avatar) avatar.src = author.profileImage || author.avatar || DEFAULT_DEMO_USER.profileImage;
  if (name) name.textContent = author.name || 'User';
  if (meta) meta.textContent = `@${author.username || 'user'} • ${post.createdAt || 'Just now'}`;

  // Delete button
  const deleteBtn = document.getElementById('modalPostDeleteBtn');
  if (deleteBtn) {
    deleteBtn.style.display = isOwnPost ? 'inline-flex' : 'none';
    deleteBtn.onclick = () => {
      closePostDetailModal();
      deleteProfilePost(post._id);
    };
  }

  // Media
  const mediaWrap = document.getElementById('modalPostMediaWrap');
  const img = document.getElementById('modalPostImage');
  if (post.image) {
    if (img) img.src = post.image;
    if (mediaWrap) mediaWrap.style.display = 'block';
  } else {
    if (mediaWrap) mediaWrap.style.display = 'none';
  }

  // Text
  const content = document.getElementById('modalPostContent');
  if (content) {
    content.innerHTML = escapeHTML(post.content || '').replace(/#([a-zA-Z0-9_]+)/g, '<span class="text-accent font-semibold">#$1</span>');
  }

  // Stats
  const likesEl = document.getElementById('modalPostLikesCount');
  const commentsEl = document.getElementById('modalPostCommentsCount');
  if (likesEl) likesEl.textContent = likesCount;
  if (commentsEl) commentsEl.textContent = commentsCount;

  // Like button
  const likeBtn = document.getElementById('modalPostLikeBtn');
  if (likeBtn) {
    likeBtn.className = `action-btn ${isLiked ? 'liked' : ''}`;
    likeBtn.innerHTML = `<i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i> <span>Like</span>`;
    likeBtn.onclick = () => toggleLikeDetailPost(post._id);
  }

  // Save button
  const saveBtn = document.getElementById('modalPostSaveBtn');
  if (saveBtn) {
    saveBtn.className = `action-btn ${isSaved ? 'saved' : ''}`;
    saveBtn.innerHTML = `<i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i> <span>${isSaved ? 'Saved' : 'Save'}</span>`;
    saveBtn.onclick = () => toggleSaveDetailPost(post._id);
  }

  // Share button
  const shareBtn = document.getElementById('modalPostShareBtn');
  if (shareBtn) {
    shareBtn.onclick = () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.origin + `/index.html#post_${post._id}`);
      }
      showToast('Post link copied to clipboard!', 'success');
    };
  }

  // Comments list
  renderDetailCommentsList(commentsList);
}

function renderDetailCommentsList(commentsList) {
  const container = document.getElementById('modalCommentsList');
  if (!container) return;

  if (!commentsList || commentsList.length === 0) {
    container.innerHTML = '<div class="text-muted text-xs" style="padding: 10px 0;">No comments yet. Be the first to comment!</div>';
    return;
  }

  container.innerHTML = commentsList.map(c => `
    <div class="comment-item">
      <img src="${c.user?.profileImage || DEFAULT_DEMO_USER.profileImage}" class="avatar avatar-sm">
      <div class="comment-bubble">
        <div class="comment-author">${escapeHTML(c.user?.name || 'User')}</div>
        <div class="comment-text">${escapeHTML(c.text || '')}</div>
        <div class="comment-meta">
          <span>${c.createdAt || 'Just now'}</span>
        </div>
      </div>
    </div>
  `).join('');
}

async function toggleLikeDetailPost(postId) {
  const currentUser = getCurrentUser();
  const post = profilePosts.find(p => p._id === postId);
  if (!post) return;

  if (!post.likes) post.likes = [];
  const likedIndex = post.likes.findIndex(l => (l._id || l) === currentUser._id);
  const isLiked = likedIndex !== -1;

  if (isLiked) {
    post.likes.splice(likedIndex, 1);
  } else {
    post.likes.push(currentUser._id);
  }

  renderPostDetailModalContent(post);
  renderTabContent();

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

async function toggleSaveDetailPost(postId) {
  const post = profilePosts.find(p => p._id === postId);
  if (!post) return;

  const savedPosts = JSON.parse(localStorage.getItem('connectly_saved_posts') || '[]');
  const existingIdx = savedPosts.findIndex(p => p._id === postId);
  const willSave = existingIdx === -1;

  if (willSave) {
    savedPosts.unshift(post);
    showToast('Post saved to bookmarks', 'success');
  } else {
    savedPosts.splice(existingIdx, 1);
    showToast('Removed from bookmarks', 'info');
  }

  localStorage.setItem('connectly_saved_posts', JSON.stringify(savedPosts));
  renderPostDetailModalContent(post);

  const token = getAuthToken();
  const isReal = token && !token.startsWith('demo_') && !token.startsWith('google_') && !token.startsWith('token_');
  if (isReal) {
    try {
      await fetch(`${API_BASE_URL}/posts/${postId}/save`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  }
}

async function addDetailComment(postId) {
  const input = document.getElementById('modalCommentInput');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  const currentUser = getCurrentUser();
  const post = profilePosts.find(p => p._id === postId);
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
  renderPostDetailModalContent(post);
  renderTabContent();
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

function initPostDetailModal() {
  const modal = document.getElementById('postDetailModal');
  const closeBtn = document.getElementById('closePostDetailModalBtn');
  const commentSubmitBtn = document.getElementById('modalCommentSubmitBtn');
  const commentInput = document.getElementById('modalCommentInput');

  if (closeBtn) closeBtn.addEventListener('click', closePostDetailModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closePostDetailModal();
    });
  }

  if (commentSubmitBtn) {
    commentSubmitBtn.addEventListener('click', () => {
      if (currentActiveDetailPostId) addDetailComment(currentActiveDetailPostId);
    });
  }

  if (commentInput) {
    commentInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (currentActiveDetailPostId) addDetailComment(currentActiveDetailPostId);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  initTabListeners();
  initEditProfileModal();
  initFollowListModal();
  initPostDetailModal();
});