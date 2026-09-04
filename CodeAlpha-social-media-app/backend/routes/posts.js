const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

/* =========================================================
   MULTER CONFIG
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: 8 * 1024 * 1024 // 8 MB
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif'
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed'));
    }

    cb(null, true);
  }
});


/* =========================================================
   HELPER: VALIDATE MONGODB OBJECT ID
========================================================= */

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}


/* =========================================================
   GET ALL POSTS
   Faster feed with limited data
========================================================= */

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name username avatar profilePicture')
      .populate('likes', '_id')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json(posts);

  } catch (err) {
    console.error('GET POSTS ERROR:', err);

    res.status(500).json({
      message: 'Unable to load posts'
    });
  }
});


/* =========================================================
   CREATE POST
========================================================= */

router.post('/', auth, upload.single('image'), async (req, res) => {

  try {

    const content =
      typeof req.body.content === 'string'
        ? req.body.content.trim()
        : '';

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : '';

    // Don't allow completely empty posts
    if (!content && !image) {
      return res.status(400).json({
        message: 'Post must contain text or an image'
      });
    }

    const post = await Post.create({
      user: req.userId,
      content,
      image
    });

    const populated = await Post.findById(post._id)
      .populate('user', 'name username avatar profilePicture')
      .populate('likes', '_id')
      .lean();

    res.status(201).json(populated);

  } catch (err) {

    console.error('CREATE POST ERROR:', err);

    res.status(500).json({
      message: 'Unable to create post'
    });
  }
});


/* =========================================================
   GET SAVED POSTS (AUTHENTICATED)
========================================================= */

router.get('/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'savedPosts',
      populate: [
        { path: 'user', select: 'name username avatar profilePicture profileImage' },
        { path: 'likes', select: '_id' }
      ]
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const posts = (user.savedPosts || []).filter(Boolean).reverse();
    res.json(posts);
  } catch (err) {
    console.error('GET SAVED POSTS ERROR:', err);
    res.status(500).json({ message: 'Unable to load saved posts' });
  }
});


/* =========================================================
   GET EXPLORE POSTS (SEARCH / TAG / TRENDING / MEDIA)
========================================================= */

router.get('/explore', async (req, res) => {
  try {
    const { search, tag, type } = req.query;
    const filter = {};
    if (tag) {
      filter.content = new RegExp(`#${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
    } else if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ content: regex }];
    }
    if (type === 'media') {
      filter.image = { $exists: true, $ne: '' };
    }

    let query = Post.find(filter)
      .populate('user', 'name username avatar profilePicture profileImage')
      .populate('likes', '_id');

    if (type === 'trending') {
      const posts = await query.lean();
      posts.sort((a, b) => ((b.likes?.length || 0) - (a.likes?.length || 0)) || (new Date(b.createdAt) - new Date(a.createdAt)));
      return res.json(posts.slice(0, 50));
    } else {
      query = query.sort({ createdAt: -1 }).limit(50);
      const posts = await query.lean();
      return res.json(posts);
    }
  } catch (err) {
    console.error('GET EXPLORE POSTS ERROR:', err);
    res.status(500).json({ message: 'Unable to load explore posts' });
  }
});


/* =========================================================
   GET SINGLE POST
========================================================= */

router.get('/:id', async (req, res) => {

  try {

    const { id } = req.params;

    // IMPORTANT:
    // Prevent MongoDB CastError
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid post id'
      });
    }

    const post = await Post.findById(id)
      .populate('user', 'name username avatar profilePicture')
      .populate('likes', '_id')
      .lean();

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    res.json(post);

  } catch (err) {

    console.error('GET SINGLE POST ERROR:', err);

    res.status(500).json({
      message: 'Server error'
    });
  }
});


/* =========================================================
   UPDATE POST
========================================================= */

router.put('/:id', auth, async (req, res) => {

  try {

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid post id'
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    if (post.user.toString() !== req.userId) {
      return res.status(403).json({
        message: 'Forbidden: cannot edit others'
      });
    }

    const updates = {};

    if (req.body.content !== undefined) {
      updates.content = String(req.body.content).trim();
    }

    const updated = await Post.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('user', 'name username avatar profilePicture')
      .populate('likes', '_id')
      .lean();

    res.json(updated);

  } catch (err) {

    console.error('UPDATE POST ERROR:', err);

    res.status(500).json({
      message: 'Unable to update post'
    });
  }
});


/* =========================================================
   DELETE POST
========================================================= */

router.delete('/:id', auth, async (req, res) => {

  try {

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid post id'
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    if (post.user.toString() !== req.userId) {
      return res.status(403).json({
        message: 'Forbidden: cannot delete others'
      });
    }

    await post.deleteOne();

    res.json({
      message: 'Post deleted',
      postId: id
    });

  } catch (err) {

    console.error('DELETE POST ERROR:', err);

    res.status(500).json({
      message: 'Unable to delete post'
    });
  }
});


/* =========================================================
   LIKE POST
========================================================= */

router.post('/:id/like', auth, async (req, res) => {

  try {

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid post id'
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    const alreadyLiked = post.likes.some(
      userId => userId.toString() === req.userId
    );

    if (!alreadyLiked) {

      post.likes.push(req.userId);

      await post.save();

      // Notification only for other users
      if (post.user.toString() !== req.userId) {

        const notif = await Notification.create({
          recipient: post.user,
          sender: req.userId,
          type: 'like',
          post: post._id
        });

        const populated = await notif.populate(
          'sender',
          'name username avatar profilePicture'
        );

        const io = req.app.get('io');

        if (io) {
          io.to(post.user.toString()).emit(
            'notification:new',
            populated
          );
        }
      }
    }

    res.json({
      message: 'Post liked',
      likesCount: post.likes.length
    });

  } catch (err) {

    console.error('LIKE ERROR:', err);

    res.status(500).json({
      message: 'Unable to like post'
    });
  }
});


/* =========================================================
   UNLIKE POST
========================================================= */

router.post('/:id/unlike', auth, async (req, res) => {

  try {

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid post id'
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    post.likes = post.likes.filter(
      userId => userId.toString() !== req.userId
    );

    await post.save();

    res.json({
      message: 'Post unliked',
      likesCount: post.likes.length
    });

  } catch (err) {

    console.error('UNLIKE ERROR:', err);

    res.status(500).json({
      message: 'Unable to unlike post'
    });
  }
});


/* =========================================================
   SAVE / UNSAVE (BOOKMARK) POST
========================================================= */

router.post('/:id/save', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid post id' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.savedPosts) user.savedPosts = [];

    const isSaved = user.savedPosts.some(pId => pId.toString() === id);
    if (isSaved) {
      user.savedPosts = user.savedPosts.filter(pId => pId.toString() !== id);
    } else {
      user.savedPosts.push(id);
    }

    await user.save();

    res.json({
      saved: !isSaved,
      message: isSaved ? 'Post removed from bookmarks' : 'Post saved to bookmarks'
    });
  } catch (err) {
    console.error('SAVE POST ERROR:', err);
    res.status(500).json({ message: 'Unable to save post' });
  }
});


/* =========================================================
   MULTER / UPLOAD ERROR HANDLER
========================================================= */

router.use((err, req, res, next) => {

  if (err instanceof multer.MulterError) {

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'Image is too large. Maximum size is 8MB.'
      });
    }

    return res.status(400).json({
      message: err.message
    });
  }

  if (err) {
    console.error('UPLOAD ERROR:', err);

    return res.status(400).json({
      message: err.message || 'Image upload failed'
    });
  }

  next();
});


module.exports = router;