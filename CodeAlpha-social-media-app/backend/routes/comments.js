const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Get comments for a post
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', '-password')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment to a post (protected)
router.post('/posts/:postId/comments', auth, async (req, res) => {
  const { text } = req.body;
  try {
    const comment = await Comment.create({ post: req.params.postId, user: req.userId, text });
    const populated = await comment.populate('user', '-password');

    // Notify the post owner in real time (skip commenting on your own post)
    const post = await Post.findById(req.params.postId);
    if (post && post.user.toString() !== req.userId) {
      const notif = await Notification.create({
        recipient: post.user,
        sender: req.userId,
        type: 'comment',
        post: post._id,
        text: text.slice(0, 80)
      });
      const populatedNotif = await notif.populate('sender', '-password');
      const io = req.app.get('io');
      if (io) io.to(post.user.toString()).emit('notification:new', populatedNotif);
    }

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a comment (owner only)
router.delete('/comments/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Forbidden: cannot delete others' });
    }
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
