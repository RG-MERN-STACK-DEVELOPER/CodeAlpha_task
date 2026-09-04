const express = require("express");
const Comment = require("../models/Comment");
const Task = require("../models/Task");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/comments/task/:taskId
router.get("/task/:taskId", protect, async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate("author", "name email avatar")
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/comments -> { task, text }
router.post("/", protect, async (req, res) => {
  try {
    const { task: taskId, text } = req.body;
    if (!taskId || !text) return res.status(400).json({ message: "Task and text are required" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const comment = await Comment.create({ task: taskId, author: req.user._id, text });
    const populated = await comment.populate("author", "name email avatar");

    const io = req.app.get("io");
    io.to(`project:${task.project}`).emit("comment:new", populated);

    // Notify assignees + task creator (except the commenter)
    const notifyIds = new Set(
      [...task.assignees.map((a) => a.toString()), task.createdBy.toString()].filter(
        (id) => id !== req.user._id.toString()
      )
    );

    for (const userId of notifyIds) {
      await Notification.create({
        user: userId,
        type: "NEW_COMMENT",
        message: `${req.user.name} commented on "${task.title}"`,
        project: task.project,
        task: task._id,
      });
      io.to(`user:${userId}`).emit("notification:new", {
        type: "NEW_COMMENT",
        message: `${req.user.name} commented on "${task.title}"`,
        project: task.project,
        task: task._id,
      });
    }

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/comments/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }
    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
