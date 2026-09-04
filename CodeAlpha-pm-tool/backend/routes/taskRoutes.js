const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/tasks/project/:projectId -> all tasks for a project
router.get("/project/:projectId", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignees", "name email avatar")
      .populate("createdBy", "name email avatar")
      .sort({ order: 1, createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks -> create task
router.post("/", protect, async (req, res) => {
  try {
    const { project, title, description, status, priority, assignees, dueDate } = req.body;
    if (!project || !title) {
      return res.status(400).json({ message: "Project and title are required" });
    }

    const task = await Task.create({
      project,
      title,
      description,
      status: status || "To Do",
      priority: priority || "Medium",
      assignees: assignees || [],
      dueDate,
      createdBy: req.user._id,
    });

    const populated = await task.populate([
      { path: "assignees", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
    ]);

    const io = req.app.get("io");
    io.to(`project:${project}`).emit("task:created", populated);

    if (assignees && assignees.length) {
      for (const userId of assignees) {
        await Notification.create({
          user: userId,
          type: "TASK_ASSIGNED",
          message: `You were assigned to task "${title}"`,
          project,
          task: task._id,
        });
        io.to(`user:${userId}`).emit("notification:new", {
          type: "TASK_ASSIGNED",
          message: `You were assigned to task "${title}"`,
          project,
          task: task._id,
        });
      }
    }

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id -> update task (status, title, description, priority, assignees, order)
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const prevAssignees = task.assignees.map((a) => a.toString());

    const updatable = ["title", "description", "status", "priority", "assignees", "dueDate", "order"];
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save();
    const populated = await task.populate([
      { path: "assignees", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
    ]);

    const io = req.app.get("io");
    io.to(`project:${task.project}`).emit("task:updated", populated);

    if (req.body.assignees) {
      const newAssignees = req.body.assignees.filter((a) => !prevAssignees.includes(a));
      for (const userId of newAssignees) {
        await Notification.create({
          user: userId,
          type: "TASK_ASSIGNED",
          message: `You were assigned to task "${task.title}"`,
          project: task.project,
          task: task._id,
        });
        io.to(`user:${userId}`).emit("notification:new", {
          type: "TASK_ASSIGNED",
          message: `You were assigned to task "${task.title}"`,
          project: task.project,
          task: task._id,
        });
      }
    }

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    await task.deleteOne();

    const io = req.app.get("io");
    io.to(`project:${task.project}`).emit("task:deleted", { _id: task._id, project: task.project });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
