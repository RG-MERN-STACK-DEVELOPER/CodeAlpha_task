import { useState } from "react";
import api from "../api/axios";

export default function AddTaskModal({ projects, onClose, onCreated }) {
  const [projectId, setProjectId] = useState(projects[0]?._id || "");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectId) {
      setError("Please select a project");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/tasks", {
        project: projectId,
        title,
        priority,
        dueDate: dueDate || undefined,
      });
      const project = projects.find((p) => p._id === projectId);
      onCreated({ ...data, projectName: project?.name });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-30 p-4">
      <form onSubmit={handleSubmit} className="glass-strong rounded-2xl shadow-2xl p-6 w-full max-w-md hero-animate">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Add Task</h2>

        {error && <div className="bg-red-50 text-red-600 text-sm p-2.5 rounded-lg mb-4 border border-red-100">{error}</div>}

        <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
        <select
          required
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-4 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">Task title</label>
        <input
          required
          placeholder="e.g. Design system update"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-4 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !projects.length}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
