const express = require('express');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Search / list users (used by the chat page to start new conversations)
// GET /api/users?search=sara
router.get('/', auth, async (req, res) => {
  try {
    const q = (req.query.search || '').trim();
    const filter = { _id: { $ne: req.userId } };
    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: regex }, { username: regex }];
    }
    const users = await User.find(filter)
      .select('name username profileImage bio')
      .limit(20);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update own profile (protected)
router.put('/:id', auth, async (req, res) => {
  if (req.userId !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden: cannot edit other user' });
  }
  const updates = { ...req.body };
  // disallow password change here; separate endpoint could be added
  delete updates.password;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow a user (protected)
router.post('/:id/follow', auth, async (req, res) => {
  const targetId = req.params.id;
  const followerId = req.userId;
  if (targetId === followerId) return res.status(400).json({ message: "Cannot follow yourself" });
  try {
    const targetUser = await User.findById(targetId);
    const followerUser = await User.findById(followerId);
    if (!targetUser || !followerUser) return res.status(404).json({ message: 'User not found' });
    // Add follower if not already
    if (!targetUser.followers.includes(followerId)) {
      targetUser.followers.push(followerId);
      await targetUser.save();
    }
    if (!followerUser.following.includes(targetId)) {
      followerUser.following.push(targetId);
      await followerUser.save();
    }

    // Notify the followed user in real time
    const notif = await Notification.create({
      recipient: targetId,
      sender: followerId,
      type: 'follow'
    });
    const populated = await notif.populate('sender', '-password');
    const io = req.app.get('io');
    if (io) io.to(targetId).emit('notification:new', populated);

    res.json({ message: 'Followed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unfollow a user (protected)
router.post('/:id/unfollow', auth, async (req, res) => {
  const targetId = req.params.id;
  const followerId = req.userId;
  if (targetId === followerId) return res.status(400).json({ message: "Cannot unfollow yourself" });
  try {
    const targetUser = await User.findById(targetId);
    const followerUser = await User.findById(followerId);
    if (!targetUser || !followerUser) return res.status(404).json({ message: 'User not found' });
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== followerId);
    followerUser.following = followerUser.following.filter(id => id.toString() !== targetId);
    await targetUser.save();
    await followerUser.save();
    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get followers list
router.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.followers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get following list
router.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.following);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
