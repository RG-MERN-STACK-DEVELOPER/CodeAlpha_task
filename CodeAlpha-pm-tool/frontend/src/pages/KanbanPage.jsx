import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import AppTopbar from "../components/AppTopbar.jsx";
import ConicDonut from "../components/ConicDonut.jsx";
import AddTaskModal from "../components/AddTaskModal.jsx";
import api from "../api/axios";

const columns = [
  { key: "To Do", dot: "bg-gray-400" },
  { key: "In Progress", dot: "bg-amber-400" },
  { key: "Done", dot: "bg-emerald-500" },
];

const priorityStyles = {
  High: "bg-red-50 text-red-500",
  Medium: "bg-amber-50 text-amber-500",
  Low: "bg-emerald-50 text-emerald-500",
};

const tagPalette = [
  "bg-blue-50 text-blue-600",
  "bg-amber-50 text-amber-600",
  "bg-purple-50 text-purple-600",
  "bg-emerald-50 text-emerald-600",
  "bg-pink-50 text-pink-600",
  "bg-indigo-50 text-indigo-600",
];

const activityFeed = [
  { who: "Sarah", action: "completed", target: "Homepage Design", project: "Website Redesign", time: "2h ago", color: "from-pink-400 to-rose-500" },
  { who: "Developer", action: "commented on", target: "API Integration", project: "Mobile Application", time: "4h ago", color: "from-blue-400 to-indigo-500" },
  { who: "John", action: "moved task to In Progress", target: "", project: "Marketing Website", time: "6h ago", color: "from-amber-400 to-orange-500" },
  { who: "You", action: "created a new task", target: "", project: "Analytics Dashboard", time: "1d ago", color: "from-primary to-purple-500" },
];

const teamWorkload = [
  { name: "Sarah Johnson", percent: 82, color: "bg-primary", avatarColor: "from-pink-400 to-rose-500" },
  { name: "Developer", percent: 65, color: "bg-amber-400", avatarColor: "from-blue-400 to-indigo-500" },
  { name: "John Smith", percent: 48, color: "bg-blue-400", avatarColor: "from-amber-400 to-orange-500" },
  { name: "Fatima Khan", percent: 75, color: "bg-emerald-500", avatarColor: "from-emerald-400 to-teal-500" },
];

function initials(name = "") {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function projectTagColor(projectId, projects) {
  const idx = projects.findIndex((p) => p._id === projectId);
  return tagPalette[idx % tagPalette.length] || tagPalette[0];
}

export default function KanbanPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const { data: projectData } = await api.get("/projects");
      setProjects(projectData);

      const results = await Promise.all(
        projectData.map((p) => api.get(`/tasks/project/${p._id}`).then((r) => ({ project: p, tasks: r.data })))
      );
      const flat = results.flatMap(({ project, tasks }) =>
        tasks.map((t) => ({ ...t, projectName: project.name, projectId: project._id }))
      );
      setTasks(flat);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("taskId", task._id);
  };

  const handleDrop = async (e, status) => {
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === status) return;
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    try {
      await api.put(`/tasks/${taskId}`, { status });
    } catch (err) {
      console.error(err);
      loadAll();
    }
  };

  const totals = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "Done").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    todo: tasks.filter((t) => t.status === "To Do").length,
  };
  const overallPercent = totals.total > 0 ? Math.round((totals.done / totals.total) * 100) : 0;
  const overviewSegments = totals.total > 0
    ? [
        { percent: (totals.done / totals.total) * 100, color: "#4F46E5" },
        { percent: (totals.inProgress / totals.total) * 100, color: "#F59E0B" },
        { percent: (totals.todo / totals.total) * 100, color: "#D1D5DB" },
      ]
    : [{ percent: 100, color: "#E5E7EB" }];

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <AppTopbar />

        <div className="p-6 grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Kanban Board</h1>
                <p className="text-sm text-gray-500">Visualize your workflow and move tasks forward.</p>
              </div>
              <button
                onClick={() => setShowAddTask(true)}
                disabled={!projects.length}
                className="bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all hover:scale-105 disabled:opacity-60"
              >
                + Add Task
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => <div key={i} className="h-64 rounded-2xl shimmer" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                {columns.map((col) => {
                  const colTasks = tasks.filter((t) => t.status === col.key);
                  return (
                    <div
                      key={col.key}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, col.key)}
                      className="bg-white rounded-2xl border border-gray-100 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                          {col.key}
                          <span className="text-xs text-gray-400 font-normal">{colTasks.length}</span>
                        </h2>
                      </div>

                      <div className="space-y-3 min-h-[80px]">
                        {colTasks.map((t) => (
                          <div
                            key={t._id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, t)}
                            className="border border-gray-100 rounded-xl p-3 cursor-move card-lift bg-white"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-sm font-medium text-gray-800 flex-1 pr-2">{t.title}</p>
                              <span className="text-gray-300 text-xs">⋯</span>
                            </div>
                            <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-2 ${projectTagColor(t.projectId, projects)}`}>
                              {t.projectName}
                            </span>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <div className="flex items-center gap-2">
                                {t.assignees?.[0] && (
                                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-400 text-white text-[9px] font-bold flex items-center justify-center">
                                    {initials(t.assignees[0].name)}
                                  </span>
                                )}
                                {t.dueDate && (
                                  <span className="flex items-center gap-1">
                                    📅 {new Date(t.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                  </span>
                                )}
                              </div>
                              {t.priority && (
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${priorityStyles[t.priority]}`}>
                                  {t.priority === "High" ? "↑" : t.priority === "Low" ? "↓" : "•"} {t.priority}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setShowAddTask(true)}
                        className="w-full mt-3 text-xs text-gray-400 hover:text-primary border border-dashed border-gray-200 rounded-lg py-2 transition-colors"
                      >
                        + Add Task
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">Overall Progress</h2>
              <div className="flex flex-col items-center">
                <ConicDonut segments={overviewSegments} centerLabel={`${overallPercent}%`} centerSub="Overall Progress" size={140} />
              </div>
              <ul className="space-y-2 mt-4 text-sm">
                {[
                  { label: "Completed", value: totals.done, color: "bg-primary" },
                  { label: "In Progress", value: totals.inProgress, color: "bg-amber-400" },
                  { label: "Not Started", value: totals.todo, color: "bg-gray-300" },
                ].map((r) => (
                  <li key={r.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-600">
                      <span className={`w-2.5 h-2.5 rounded-full ${r.color}`} />
                      {r.label}
                    </span>
                    <span className="font-semibold text-gray-800">{r.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Activity Feed</h2>
                <span className="text-sm text-primary font-medium cursor-pointer">View all →</span>
              </div>
              <ul className="space-y-4">
                {activityFeed.map((a, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`w-8 h-8 rounded-full bg-gradient-to-br ${a.color} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>
                      {initials(a.who)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{a.who}</span> {a.action}{" "}
                        {a.target && <span className="font-semibold text-gray-900">{a.target}</span>}
                      </p>
                      <p className="text-xs text-primary">{a.project}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Team Workload</h2>
                <span className="text-sm text-primary font-medium cursor-pointer">View report</span>
              </div>
              <ul className="space-y-4">
                {teamWorkload.map((m) => (
                  <li key={m.name}>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className={`w-8 h-8 rounded-full bg-gradient-to-br ${m.avatarColor} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>
                        {initials(m.name)}
                      </span>
                      <span className="text-sm font-medium text-gray-700 flex-1">{m.name}</span>
                      <span className="text-xs font-semibold text-gray-500">{m.percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden ml-11">
                      <div className={`h-full ${m.color} rounded-full`} style={{ width: m.percent + "%" }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <footer className="text-center text-xs text-gray-400 py-6">© 2026 PM Tool. All rights reserved.</footer>
      </div>

      {showAddTask && (
        <AddTaskModal projects={projects} onClose={() => setShowAddTask(false)} onCreated={() => loadAll()} />
      )}
    </div>
  );
}
