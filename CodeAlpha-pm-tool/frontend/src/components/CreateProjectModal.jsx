import { useState } from "react";
import api from "../api/axios";

export default function CreateProjectModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/projects", { name, description });
      onCreated(data);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-30 p-4">
      <form onSubmit={handleSubmit} className="glass-strong rounded-2xl shadow-2xl p-6 w-full max-w-md hero-animate">
        <h2 className="text-lg font-bold mb-4">New Project</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
