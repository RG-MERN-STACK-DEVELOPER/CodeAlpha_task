import { useState } from "react";
import api from "../api/axios";

export default function TeamAddMemberModal({ ownedProjects, onClose, onAdded }) {
  const [projectId, setProjectId] = useState(ownedProjects[0]?._id || "");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectId) {
      setError("You need to own at least one project to add members.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post(`/projects/${projectId}/members`, { email });
      onAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-30 p-4">
      <form onSubmit={handleSubmit} className="glass-strong rounded-2xl shadow-2xl p-6 w-full max-w-sm hero-animate">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Add Team Member</h2>
        <p className="text-xs text-gray-500 mb-4">Add someone to one of the projects you own by their email.</p>

        {error && <div className="bg-red-50 text-red-600 text-sm p-2.5 rounded-lg mb-4 border border-red-100">{error}</div>}

        {ownedProjects.length === 0 ? (
          <p className="text-sm text-gray-500 mb-4">You don't own any projects yet — create one first to add members to it.</p>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-4 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              {ownedProjects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">Member email</label>
            <input
              type="email"
              required
              placeholder="colleague@example.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-6 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          {ownedProjects.length > 0 && (
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Member"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
