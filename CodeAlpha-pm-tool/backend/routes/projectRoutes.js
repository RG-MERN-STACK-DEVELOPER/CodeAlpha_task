const express = require("express");
const Project = require("../models/Project");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/projects  -> all projects the user owns or is a member of
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects -> create project
router.post("/", protect, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Project name is required" });

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });

    const populated = await project.populate([
      { path: "owner", select: "name email avatar" },
      { path: "members", select: "name email avatar" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/projects/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/projects/:id -> update project (name/description/columns)
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the owner can update this project" });
    }
    const { name, description, columns } = req.body;
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (columns) project.columns = columns;
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects/:id/members -> add member by email
router.post("/:id/members", protect, async (req, res) => {
  try {
    const User = require("../models/User");
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User with this email not found" });

    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: "User already a member" });
    }

    project.members.push(user._id);
    await project.save();

    await Notification.create({
      user: user._id,
      type: "PROJECT_INVITE",
      message: `You were added to project "${project.name}"`,
      project: project._id,
    });

    const io = req.app.get("io");
    io.to(`user:${user._id}`).emit("notification:new", {
      type: "PROJECT_INVITE",
      message: `You were added to project "${project.name}"`,
      project: project._id,
    });

    const populated = await project.populate("members", "name email avatar");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the owner can delete this project" });
    }
    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
