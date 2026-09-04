/* ==========================================================================
   CodeAlpha - DEDICATED POST CREATION MODULE (post.js)
   ========================================================================== */

let dedicatedSelectedImage = '';

document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('dedicatedFileInput');
  const previewBox = document.getElementById('dedicatedPreviewBox');
  const previewSrc = document.getElementById('dedicatedPreviewSrc');
  const removeBtn = document.getElementById('dedicatedRemoveImgBtn');
  const form = document.getElementById('dedicatedPostForm');
  const postText = document.getElementById('dedicatedPostText');

  if (!form) return;

  // Click on dropzone triggers file picker
  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--accent)';
      dropZone.style.backgroundColor = 'var(--accent-light)';
    });

    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--border)';
      dropZone.style.backgroundColor = 'var(--bg-hover)';
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--border)';
      dropZone.style.backgroundColor = 'var(--bg-hover)';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }

  function handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'danger');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      dedicatedSelectedImage = evt.target.result;
      previewSrc.src = dedicatedSelectedImage;
      previewBox.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dedicatedSelectedImage = '';
      if (fileInput) fileInput.value = '';
      if (previewBox) previewBox.style.display = 'none';
    });
  }

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = postText.value.trim();

    if (!content && !dedicatedSelectedImage) {
      showToast('Please enter post text or upload an image', 'danger');
      return;
    }

    const submitBtn = document.getElementById('submitPostBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Publishing...`;

    const currentUser = getCurrentUser();

    const newPost = {
      _id: `post_${Date.now()}`,
      user: {
        _id: currentUser._id,
        name: currentUser.name,
        username: currentUser.username,
        profileImage: currentUser.profileImage
      },
      content: content,
      image: dedicatedSelectedImage,
      likes: [],
      comments: [],
      createdAt: 'Just now'
    };

    // Save to local storage cache
    let posts = [];
    try {
      posts = JSON.parse(localStorage.getItem('connectly_posts')) || [];
    } catch (err) {}
    posts.unshift(newPost);
    localStorage.setItem('connectly_posts', JSON.stringify(posts));

    // Send API request
    try {
      await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, image: dedicatedSelectedImage })
      });
    } catch (e) {}

    showToast('Post published successfully!', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 600);
  });
});
