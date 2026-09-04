import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import AppTopbar from "../components/AppTopbar.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";
import AddMemberModal from "../components/AddMemberModal.jsx";
import api from "../api/axios";
import { useSocket } from "../context/SocketContext";

const columnDots = {
  "To Do": "bg-gray-400",
  "In Progress": "bg-amber-400",
  Done: "bg-emerald-500",
};

function initials(name = "") {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function ProjectBoard() {
  const { projectId } = useParams();
  const socket = useSocket();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newTaskTitles, setNewTaskTitles] = useState({});

  useEffect(() => {
    const load = async () => {
      const [{ data: projectData }, { data: taskData }] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/tasks/project/${projectId}`),
      ]);
      setProject(projectData);
      setTasks(taskData);
    };
    load();
  }, [projectId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("project:join", projectId);

    const onCreated = (task) => setTasks((prev) => [...prev, task]);
    const onUpdated = (task) =>
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    const onDeleted = ({ _id }) => setTasks((prev) => prev.filter((t) => t._id !== _id));

    socket.on("task:created", onCreated);
    socket.on("task:updated", onUpdated);
    socket.on("task:deleted", onDeleted);

    return () => {
      socket.emit("project:leave", projectId);
      socket.off("task:created", onCreated);
      socket.off("task:updated", onUpdated);
      socket.off("task:deleted", onDeleted);
    };
  }, [socket, projectId]);

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("taskId", task._id);
  };

  const handleDrop = async (e, status) => {
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === status) return;
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    await api.put(`/tasks/${taskId}`, { status });
  };

  const handleCreateTask = async (status) => {
    const title = newTaskTitles[status];
    if (!title?.trim()) return;
    await api.post("/tasks", { project: projectId, title, status });
    setNewTaskTitles((prev) => ({ ...prev, [status]: "" }));
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-surface flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="h-40 rounded-2xl shimmer" />
        </div>
      </div>
    );
  }

  const columns = project.columns || ["To Do", "In Progress", "Done"];

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <AppTopbar />

        <div className="p-6 space-y-6">
          <Link to="/projects" className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 w-fit">
            ← All projects
          </Link>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold text-gray-900">{project.name}</h1>
                <Link
                  to={`/projects/${projectId}/overview`}
                  className="text-xs text-primary font-medium border border-indigo-100 bg-indigo-50 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  View Overview
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-1">{project.description}</p>
              <div className="flex -space-x-2 mt-3">
                {(project.members || []).slice(0, 5).map((m) => (
                  <span
                    key={m._id}
                    title={m.name}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-400 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white"
                  >
                    {initials(m.name)}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowAddMember(true)}
              className="bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all hover:scale-105 flex-shrink-0"
            >
              + Add member
            </button>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4">
            {columns.map((col) => (
              <div
                key={col}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, col)}
                className="bg-white rounded-2xl border border-gray-100 p-4 w-72 flex-shrink-0"
              >
                <div className="flex items-center justify-between mb-3 px-0.5">
                  <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${columnDots[col] || "bg-primary"}`} />
                    {col}
                  </h2>
                  <span className="text-xs text-gray-400 bg-surface px-2 py-0.5 rounded-full">
                    {tasks.filter((t) => t.status === col).length}
                  </span>
                </div>

                {tasks
                  .filter((t) => t.status === col)
                  .map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onDragStart={handleDragStart}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))}

                <input
                  placeholder="+ Add task"
                  className="w-full text-sm bg-surface border border-gray-100 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                  value={newTaskTitles[col] || ""}
                  onChange={(e) => setNewTaskTitles((prev) => ({ ...prev, [col]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateTask(col);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center text-xs text-gray-400 py-6">© 2026 PM Tool. All rights reserved.</footer>
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          project={project}
          onClose={() => setSelectedTask(null)}
          onUpdated={(t) => {
            setTasks((prev) => prev.map((x) => (x._id === t._id ? t : x)));
            setSelectedTask(t);
          }}
          onDeleted={(id) => setTasks((prev) => prev.filter((t) => t._id !== id))}
        />
      )}

      {showAddMember && (
        <AddMemberModal
          project={project}
          onClose={() => setShowAddMember(false)}
          onAdded={(updated) => setProject(updated)}
        />
      )}
    </div>
  );
}