import { useState } from "react";
import api from "../api/axios";

export default function AddMemberModal({ project, onClose, onAdded }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post(`/projects/${project._id}/members`, { email });
      onAdded(data);
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
        <h2 className="text-lg font-bold mb-4">Add Member</h2>
        {error && <div className="bg-red-50 text-red-600 text-sm p-2 rounded mb-3">{error}</div>}
        <label className="block text-sm font-medium text-gray-700 mb-1">Member email</label>
        <input
          type="email"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
