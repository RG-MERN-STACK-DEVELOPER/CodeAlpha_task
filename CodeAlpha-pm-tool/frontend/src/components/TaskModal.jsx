import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

export default function TaskModal({ task, project, onClose, onUpdated, onDeleted }) {
  const socket = useSocket();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [assignees, setAssignees] = useState(task.assignees.map((a) => a._id));
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/comments/task/${task._id}`);
      setComments(data);
    };
    load();
  }, [task._id]);

  useEffect(() => {
    if (!socket) return;
    const onNewComment = (comment) => {
      if (comment.task === task._id || comment.task?._id === task._id) {
        setComments((prev) => [...prev, comment]);
      }
    };
    const onTyping = ({ taskId, userName }) => {
      if (taskId === task._id) {
        setTypingUser(userName);
        setTimeout(() => setTypingUser(""), 2000);
      }
    };
    socket.on("comment:new", onNewComment);
    socket.on("comment:typing", onTyping);
    return () => {
      socket.off("comment:new", onNewComment);
      socket.off("comment:typing", onTyping);
    };
  }, [socket, task._id]);

  const saveChanges = async () => {
    const { data } = await api.put(`/tasks/${task._id}`, { title, description, priority, assignees });
    onUpdated(data);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await api.post("/comments", { task: task._id, text: newComment });
    setNewComment("");
  };

  const handleTyping = () => {
    socket?.emit("comment:typing", { projectId: project._id, taskId: task._id, userName: user.name });
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;
    await api.delete(`/tasks/${task._id}`);
    onDeleted(task._id);
    onClose();
  };

  const toggleAssignee = (id) => {
    setAssignees((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="glass-strong rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 hero-animate">
        <div className="flex justify-between items-start mb-4">
          <input
            className="text-lg font-semibold w-full mr-4 border-b border-transparent focus:border-gray-300 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveChanges}
          />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            &times;
          </button>
        </div>

        <textarea
          className="w-full border border-gray-200 rounded-lg p-2 text-sm mb-4"
          rows={3}
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={saveChanges}
        />

        <div className="flex items-center gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Priority</label>
            <select
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
              }}
              onBlur={saveChanges}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Assignees</label>
            <div className="flex flex-wrap gap-2">
              {(project.members || []).map((m) => (
                <button
                  type="button"
                  key={m._id}
                  onClick={() => {
                    toggleAssignee(m._id);
                  }}
                  className={`text-xs px-2 py-1 rounded-full border ${
                    assignees.includes(m._id)
                      ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <button onClick={saveChanges} className="text-sm bg-primary text-white px-3 py-1.5 rounded-lg">
            Save changes
          </button>
          <button onClick={handleDelete} className="text-sm text-red-500 hover:underline">
            Delete task
          </button>
        </div>

        <h3 className="font-medium text-sm mb-2">Comments</h3>
        <div className="space-y-3 mb-3 max-h-56 overflow-y-auto">
          {comments.map((c) => (
            <div key={c._id} className="text-sm bg-gray-50 rounded-lg p-2">
              <span className="font-medium text-gray-700">{c.author?.name}: </span>
              <span className="text-gray-600">{c.text}</span>
            </div>
          ))}
          {comments.length === 0 && <p className="text-xs text-gray-400">No comments yet</p>}
        </div>
        {typingUser && <p className="text-xs text-gray-400 mb-2">{typingUser} is typing...</p>}

        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleTyping}
          />
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
