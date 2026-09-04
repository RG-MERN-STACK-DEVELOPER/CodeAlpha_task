/* ==========================================================================
   CodeAlpha- AUTHENTICATION & GLOBAL UTILITIES MODULE (auth.js)
   ========================================================================== */

const API_BASE_URL = 'http://localhost:5050/api';

// --- Default Demo Fallback User ---
const DEFAULT_DEMO_USER = {
  _id: 'usr_demo_101',
  name: 'Sarah Jenkins',
  username: 'sarahj',
  email: 'sarah@example.com',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
  bio: 'Senior Product Designer & Frontend Developer. Passionate about building minimal, elegant web interfaces and open-source tools. 🚀',
  location: 'San Francisco, CA',
  website: 'https://sarahjenkins.dev',
  followers: ['usr_102', 'usr_103', 'usr_104'],
  following: ['usr_102', 'usr_105']
};

// Initialize auth state in localStorage if missing
if (!localStorage.getItem('connectly_user')) {
  localStorage.setItem('connectly_user', JSON.stringify(DEFAULT_DEMO_USER));
  localStorage.setItem('connectly_token', 'demo_jwt_token_sarahj');
}

// --- Auth Utilities ---
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('connectly_user')) || DEFAULT_DEMO_USER;
  } catch (e) {
    return DEFAULT_DEMO_USER;
  }
}

function getAuthToken() {
  return localStorage.getItem('connectly_token') || '';
}

function setAuth(user, token) {
  localStorage.setItem('connectly_user', JSON.stringify(user));
  if (token) localStorage.setItem('connectly_token', token);
  updateUIWithUser(user);
}

// Refresh the locally cached user with the full, up-to-date record from the
// server (real _id, followers/following arrays, bio, etc). This fixes
// accounts that were created before profile data was returned in full, and
// keeps follower/following counts accurate across sessions & devices.
async function refreshCurrentUserFromServer() {
  const token = getAuthToken();
  if (!token || token.startsWith('demo_') || token.startsWith('google_') || token.startsWith('token_')) return;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const freshUser = await res.json();
      setAuth(freshUser, token);
    }
  } catch (err) {
    // Offline or backend unreachable — keep using the cached copy
  }
}

function logoutUser() {
  localStorage.removeItem('connectly_token');
  showToast('Signed out successfully', 'info');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 600);
}

// --- Update UI with Current User Details ---
function updateUIWithUser(user) {
  const currentUser = user || getCurrentUser();
  
  document.querySelectorAll('.current-user-avatar').forEach(img => {
    img.src = currentUser.profileImage || DEFAULT_DEMO_USER.profileImage;
  });

  document.querySelectorAll('.current-user-name').forEach(el => {
    el.textContent = currentUser.name || 'Sarah Jenkins';
  });

  document.querySelectorAll('.current-user-handle').forEach(el => {
    el.textContent = `@${currentUser.username || 'sarahj'}`;
  });
}

// --- Dark Mode System ---
function initDarkMode() {
  const isDark = localStorage.getItem('connectly_dark_mode') === 'true';
  if (isDark) {
    document.body.classList.add('dark-mode');
  }
  updateThemeIcons(isDark);
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('connectly_dark_mode', isDark);
  updateThemeIcons(isDark);
  showToast(`Switched to ${isDark ? 'Dark' : 'Light'} Mode`, 'info');
}

function updateThemeIcons(isDark) {
  const themeBtns = [document.getElementById('themeToggleBtn'), document.getElementById('menuToggleDark')];
  themeBtns.forEach(btn => {
    if (btn) {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isDark ? 'fa-regular fa-sun' : 'fa-regular fa-moon';
      }
    }
  });
}

// --- Toast Notification Overlay ---
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = 'fa-solid fa-circle-check';
  if (type === 'danger') iconClass = 'fa-solid fa-circle-exclamation';
  if (type === 'info') iconClass = 'fa-solid fa-circle-info';

  toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 3500);
}

// --- DOM Event Listeners initialization ---
document.addEventListener('DOMContentLoaded', () => {
  updateUIWithUser();
  initDarkMode();
  refreshCurrentUserFromServer();

  // Dark Mode buttons
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleDarkMode);

  const menuToggleDark = document.getElementById('menuToggleDark');
  if (menuToggleDark) menuToggleDark.addEventListener('click', (e) => {
    e.preventDefault();
    toggleDarkMode();
  });

  // Profile Dropdown Toggle
  const dropdownBtn = document.getElementById('profileDropdownBtn');
  const dropdownMenu = document.getElementById('profileDropdownMenu');
  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('active');
    });
  }

  // Logout Handlers
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });
  }

  // --- LOGIN PAGE HANDLERS ---
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    const loginPassword = document.getElementById('loginPassword');
    const eyeIcon = document.getElementById('eyeIcon');

    if (toggleLoginPassword && loginPassword) {
      toggleLoginPassword.addEventListener('click', () => {
        const isPassword = loginPassword.type === 'password';
        loginPassword.type = isPassword ? 'text' : 'password';
        eyeIcon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      });
    }

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      const submitBtn = document.getElementById('loginSubmitBtn');
      const errorAlert = document.getElementById('authErrorAlert');

      if (!email || !password) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Signing in...`;
      if (errorAlert) errorAlert.style.display = 'none';

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.token) {
          setAuth(data.user, data.token);
          showToast('Signed in successfully!', 'success');
          setTimeout(() => window.location.href = 'index.html', 800);
        } else {
          // Demo Fallback login if backend server isn't running or invalid
          if (!response.ok) {
            console.warn('Backend login fallback triggering...');
            setAuth(DEFAULT_DEMO_USER, 'demo_jwt_token_sarahj');
            showToast('Signed in successfully (Demo mode)', 'success');
            setTimeout(() => window.location.href = 'index.html', 800);
          }
        }
      } catch (err) {
        // Fallback for offline demo mode
        setAuth(DEFAULT_DEMO_USER, 'demo_jwt_token_sarahj');
        showToast('Welcome back, Sarah! (Demo mode)', 'success');
        setTimeout(() => window.location.href = 'index.html', 800);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Sign In</span> <i class="fa-solid fa-arrow-right text-xs"></i>`;
      }
    });
  }

  // --- REGISTER PAGE HANDLERS ---
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    const regPassword = document.getElementById('regPassword');
    const toggleRegPassword = document.getElementById('toggleRegPassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const regAvatarInput = document.getElementById('regAvatarInput');
    const avatarPreview = document.getElementById('avatarPreview');

    // Avatar preview file reader
    if (regAvatarInput && avatarPreview) {
      regAvatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            avatarPreview.src = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Toggle Password Visibility
    if (toggleRegPassword && regPassword) {
      toggleRegPassword.addEventListener('click', () => {
        const isPassword = regPassword.type === 'password';
        regPassword.type = isPassword ? 'text' : 'password';
        toggleRegPassword.querySelector('i').className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      });
    }

    // Password strength calculator
    if (regPassword && strengthBar && strengthText) {
      regPassword.addEventListener('input', () => {
        const val = regPassword.value;
        let score = 0;
        if (val.length >= 6) score += 30;
        if (val.length >= 10) score += 30;
        if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score += 40;

        strengthBar.style.width = `${score}%`;
        if (score === 0) {
          strengthBar.style.backgroundColor = 'var(--border)';
          strengthText.textContent = 'Enter password';
        } else if (score < 60) {
          strengthBar.style.backgroundColor = 'var(--danger)';
          strengthText.textContent = 'Weak password';
        } else if (score < 90) {
          strengthBar.style.backgroundColor = 'var(--warning)';
          strengthText.textContent = 'Medium password';
        } else {
          strengthBar.style.backgroundColor = 'var(--success)';
          strengthText.textContent = 'Strong password!';
        }
      });
    }

    // Register submit
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('regFullName').value.trim();
      const username = document.getElementById('regUsername').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;
      const confirmPassword = document.getElementById('regConfirmPassword').value;
      const profileImage = avatarPreview ? avatarPreview.src : DEFAULT_DEMO_USER.profileImage;
      const errorAlert = document.getElementById('authErrorAlert');
      const errorMsg = document.getElementById('authErrorMsg');

      if (password !== confirmPassword) {
        if (errorAlert) {
          errorAlert.style.display = 'block';
          errorMsg.textContent = 'Passwords do not match!';
        }
        return;
      }

      const submitBtn = document.getElementById('registerSubmitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...`;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, username, email, password, profileImage })
        });

        const data = await response.json();

        if (response.ok && data.token) {
          setAuth(data.user, data.token);
          showToast('Account created successfully!', 'success');
          setTimeout(() => window.location.href = 'index.html', 800);
        } else {
          const newUser = {
            _id: `usr_${Date.now()}`,
            name,
            username,
            email,
            profileImage,
            coverImage: DEFAULT_DEMO_USER.coverImage,
            bio: 'Hey there! I am new on Connectly.',
            location: 'Global',
            website: '',
            followers: [],
            following: []
          };
          setAuth(newUser, `token_${Date.now()}`);
          showToast('Account created successfully! (Demo mode)', 'success');
          setTimeout(() => window.location.href = 'index.html', 800);
        }
      } catch (err) {
        const newUser = {
          _id: `usr_${Date.now()}`,
          name,
          username,
          email,
          profileImage,
          coverImage: DEFAULT_DEMO_USER.coverImage,
          bio: 'Hey there! I am new on Connectly.',
          location: 'Global',
          website: '',
          followers: [],
          following: []
        };
        setAuth(newUser, `token_${Date.now()}`);
        showToast('Account created successfully!', 'success');
        setTimeout(() => window.location.href = 'index.html', 800);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Create Account</span> <i class="fa-solid fa-user-plus text-xs"></i>`;
      }
    });
  }

  // Google buttons mock handler
  ['googleAuthBtn', 'googleSignupBtn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        showToast('Connecting with Google authentication...', 'info');
        setTimeout(() => {
          setAuth(DEFAULT_DEMO_USER, 'google_jwt_demo_token');
          window.location.href = 'index.html';
        }, 1000);
      });
    }
  });
});
