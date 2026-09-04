const express = require('express');
const mongoose = require('mongoose');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/messages/conversations - list of people the user has chatted with,
// each with their last message and unread count (for the chat sidebar)
router.get('/conversations', auth, async (req, res) => {
  try {
    const myId = new mongoose.Types.ObjectId(req.userId);

    const conversations = await Message.aggregate([
      { $match: { $or: [{ sender: myId }, { recipient: myId }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$sender', myId] }, '$recipient', '$sender']
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$recipient', myId] }, { $eq: ['$read', false] }] }, 1, 0]
            }
          }
        }
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          user: {
            _id: '$user._id',
            name: '$user.name',
            username: '$user.username',
            profileImage: '$user.profileImage'
          },
          lastMessage: 1,
          unreadCount: 1
        }
      }
    ]);

    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/messages/:userId - full message thread with a specific user
router.get('/:userId', auth, async (req, res) => {
  try {
    const otherId = req.params.userId;
    const messages = await Message.find({
      $or: [
        { sender: req.userId, recipient: otherId },
        { sender: otherId, recipient: req.userId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', '-password')
      .populate('recipient', '-password');

    // Mark all messages from the other user as read now that we've opened the thread
    await Message.updateMany(
      { sender: otherId, recipient: req.userId, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/messages/:userId - send a message (REST fallback; live delivery happens over the
// 'message:send' socket event, but this endpoint keeps chat working even if the socket drops)
router.post('/:userId', auth, async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Message text is required' });
  }
  try {
    const message = await Message.create({
      sender: req.userId,
      recipient: req.params.userId,
      text: text.trim()
    });
    const populated = await message.populate('sender', '-password');

    const io = req.app.get('io');
    if (io) {
      io.to(req.params.userId).emit('message:new', populated);
      io.to(req.userId).emit('message:new', populated);
    }

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
