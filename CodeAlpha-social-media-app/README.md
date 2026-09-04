# 🌐 Connectly (CodeAlpha) - Real-Time Social Media Platform

A modern, full-stack, real-time social media web application built with **Node.js, Express, MongoDB, Socket.io, HTML5, CSS3 (Custom Design System), and Vanilla JavaScript**.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![Express](https://img.shields.io/badge/Express-v4.19-lightgrey.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)
![Socket.io](https://img.shields.io/badge/Socket.io-v4.8-black.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## ✨ Features

### 🏠 1. Home Feed (`index.html`)
- **Rich Post Composer**: Create posts with text, images (drag & drop / file picker), feeling/mood popover (e.g. Happy 😊, Cool 😎, Excited 🤩), and hashtag chips.
- **Feed Interactions**:
  - Real-time like & unlike with heart animations.
  - Inline expandable comments drawer with instant submission.
  - Save / Bookmark posts directly to your saved list.
  - Post sharing (instant link copy to clipboard).
  - Post deletion and reporting menu.
- **Right Sidebar Widgets**: Suggested users with follow/unfollow buttons and trending topics list.

### 🧭 2. Explore & Discovery Hub (`explore.html`)
- **Live Search**: Debounced search across posts, hashtags, and user profiles.
- **Trending Hashtag Carousel**: Clickable topic tags (`#Technology`, `#WebDevelopment`, `#Design`, `#UIUXDesign`, `#JavaScript`, `#Photography`, `#RemoteWork`).
- **Three Discovery Tabs**:
  1. **Trending Posts**: Feed of popular posts with direct like, comment, and save buttons.
  2. **Creators**: Suggested creator cards with cover, avatar, bio, follower count, and Follow/Following toggle.
  3. **Visual Media**: 3-column photo grid with interactive hover stats (likes and comments count).
- **URL Parameter Support**: Direct linking via `explore.html?tag=WebDevelopment` or `explore.html?q=keyword`.

### 🔔 3. Real-Time Notification Center (`notifications.html`)
- **Real-Time Push**: Live notifications via Socket.io for likes, comments, follows, and messages.
- **Category Filter Tabs**: Filter by **All**, **Unread**, **Likes**, **Comments**, **Follows**, and **Messages** with live count badges.
- **Actionable Notification Cards**:
  - **Follow Back** button for new followers.
  - **Reply** button for direct messages.
  - **View Post** link for post interactions.
- **Bulk & Single Management**: "Mark all as read", "Clear all notifications", and single notification deletion.

### 🔖 4. Saved Bookmarks (`saved.html`)
- **Dual-View Switcher**: Switch between **Feed View** (full social cards) and **Visual Grid View** (photo tiles).
- **Search & Filter**: Search within saved posts and filter by media type (**All**, **Photos & Media**, **Text Only**).
- **Instant Unsave**: Remove bookmarks with instant UI updates and backend synchronization.

### 💬 5. Real-Time Chat & Direct Messaging (`chat.html`)
- **Live One-on-One Messaging**: Instant chat delivery powered by Socket.io rooms.
- **Conversations Sidebar**: Search users to start new chats, recent conversation threads, and unread badges.
- **Active Chat Header**: User status, avatar, and responsive mobile back button.

### 👤 6. Interactive User Profiles (`profile.html`)
- **Profile Header**: Cover image, avatar, full name, `@username`, bio, location, website link, joined date, follower & following counts.
- **Edit Profile Modal**: Update avatar, cover photo, name, username, bio, location, and website.
- **Followers / Following List Modal**: View followers/following lists with follow/unfollow action buttons.
- **Interactive Post Detail Modal**: Click any post tile in the grid to open a full modal with high-res media, full text, like button, comments drawer, and delete option.

### 🌓 7. Dark / Light Mode System
- Custom **Ivory & Brass** light theme and **Espresso & Brass** dark theme.
- Persistent state saved across sessions using `localStorage`.

---

## 🛠️ Tech Stack

### Frontend
- **HTML5 & Vanilla JavaScript (ES6+)**: Clean, modular vanilla JS without heavyweight frontend framework overhead.
- **CSS3 Design System (`style.css`)**: 8px grid scale, CSS custom variables, smooth transitions, responsive layout, and dark mode.
- **FontAwesome 6**: Icons for actions, tabs, and navigation.
- **Socket.io Client**: Real-time push notifications and live chat.

### Backend
- **Node.js & Express.js**: RESTful API server and static file hosting.
- **MongoDB & Mongoose**: Database models for Users, Posts, Comments, Messages, and Notifications.
- **Socket.io Server**: WebSocket server for real-time chat and push notifications.
- **Multer**: Secure multipart image uploads stored in `/uploads`.
- **JSON Web Tokens (JWT) & bcryptjs**: User authentication and password hashing.
- **Demo Mode Fallback**: Works offline / without MongoDB using intelligent localStorage fallback.

---

## 📂 Project Directory Structure

```text
social-media-app/
├── backend/
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/
│   │   ├── Comment.js          # Comment Mongoose model
│   │   ├── Message.js          # Chat Message Mongoose model
│   │   ├── Notification.js     # Notification Mongoose model
│   │   ├── Post.js             # Post Mongoose model
│   │   └── User.js             # User Mongoose model
│   ├── routes/
│   │   ├── auth.js             # Register, Login, Me endpoints
│   │   ├── comments.js         # Add, view, delete comments
│   │   ├── messages.js         # Real-time chat messages endpoints
│   │   ├── notifications.js    # Notifications CRUD & mark-read
│   │   ├── posts.js            # Feed, Explore, Saved, Likes endpoints
│   │   └── users.js            # User search, profile & follow/unfollow
│   ├── server.js               # Express + HTTP + Socket.io entry point
│   ├── socket.js               # Socket.io connection & event handlers
│   └── package.json            # Backend dependencies & scripts
├── frontend/
│   ├── css/
│   │   └── style.css           # Global design system & theme variables
│   ├── js/
│   │   ├── auth.js             # Auth state, theme switcher & toast utilities
│   │   ├── chat.js             # Real-time chat client logic
│   │   ├── explore.js          # Explore search, tags, tabs & creators
│   │   ├── feed.js             # Home feed, compose post, likes & comments
│   │   ├── notifications.js    # Navbar bell dropdown & live socket handler
│   │   ├── notifications-page.js # Full notifications page manager
│   │   ├── post.js             # Dedicated create-post page handler
│   │   ├── profile.js          # Profile page, edit modal & post detail modal
│   │   ├── saved.js            # Saved bookmarks manager & grid view
│   │   └── socket.js           # Socket.io client initialization
│   ├── chat.html               # Real-time messaging page
│   ├── create-post.html        # Dedicated create post page
│   ├── explore.html            # Explore & discovery hub
│   ├── index.html              # Home feed page
│   ├── login.html              # Sign in page
│   ├── notifications.html      # Notifications center page
│   ├── profile.html            # User profile page
│   ├── register.html           # Sign up page
│   └── saved.html              # Saved bookmarks page
└── uploads/                    # Uploaded post & profile images
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 2. Installation

1. Clone or open the repository folder:
   ```bash
   cd social-media-app
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. (Optional) Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/connectly
   JWT_SECRET=your_jwt_secret_key_here
   ```

### 3. Running the Application

1. Start the backend server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

2. Open your browser and navigate to:
   ```text
   http://localhost:5000
   ```
   *(The backend serves the frontend static files automatically)*

---

## 🔌 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate user and receive JWT token
- `GET /api/auth/me` - Get current authenticated user profile

### Posts (`/api/posts`)
- `GET /api/posts` - Get latest feed posts
- `POST /api/posts` - Create a new post (supports multipart image upload)
- `GET /api/posts/explore` - Explore posts by type (trending, media) and hashtag
- `GET /api/posts/saved` - Get authenticated user's saved posts
- `POST /api/posts/:id/save` - Toggle save/bookmark post
- `POST /api/posts/:id/like` - Like a post
- `POST /api/posts/:id/unlike` - Unlike a post
- `DELETE /api/posts/:id` - Delete post

### Notifications (`/api/notifications`)
- `GET /api/notifications` - Get all notifications for current user
- `GET /api/notifications/unread-count` - Get count of unread notifications
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `PUT /api/notifications/:id/read` - Mark single notification as read
- `DELETE /api/notifications/:id` - Delete single notification
- `DELETE /api/notifications` - Clear all notifications

### Users (`/api/users`)
- `GET /api/users?search=query` - Search users by name or handle
- `GET /api/users/:id` - Get public profile
- `PUT /api/users/:id` - Update profile information
- `POST /api/users/:id/follow` - Follow a user
- `POST /api/users/:id/unfollow` - Unfollow a user

### Messages (`/api/messages`)
- `GET /api/messages/:userId` - Get direct message history with a user
- `POST /api/messages` - Send a message

---

## 📄 License
This project is licensed under the MIT License.
