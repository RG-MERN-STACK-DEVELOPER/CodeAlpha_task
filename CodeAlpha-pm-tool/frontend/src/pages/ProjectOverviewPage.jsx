import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import AppTopbar from "../components/AppTopbar.jsx";
import ConicDonut from "../components/ConicDonut.jsx";
import api from "../api/axios";

const avatarColors = [
  "from-pink-400 to-rose-500",
  "from-blue-400 to-indigo-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-purple-400 to-fuchsia-500",
];

const statusStyles = {
  "To Do": "bg-gray-100 text-gray-600",
  "In Progress": "bg-blue-50 text-blue-600",
  Done: "bg-emerald-50 text-emerald-600",
};

// No real activity log exists on the backend yet — this illustrates
// the kind of feed the feature would show once one is built.
const activityFeed = [
  { who: "Ali Hassan", action: "uploaded a new file", time: "Today, 09:15 AM" },
  { who: "Sarah Johnson", action: "completed a task", time: "Yesterday, 04:45 PM" },
  { who: "John Smith", action: "added a comment", time: "Yesterday, 02:20 PM" },
];

function initials(name = "") {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function ProjectOverviewPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: projectData }, { data: taskData }] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/tasks/project/${projectId}`),
        ]);
        setProject(projectData);
        setTasks(taskData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "Done").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const todo = tasks.filter((t) => t.status === "To Do").length;
    return { total, done, inProgress, todo };
  }, [tasks]);

  const percent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  const statusLabel = stats.total === 0 ? "Not Started" : percent === 100 ? "Completed" : "In Progress";
  const statusColor =
    statusLabel === "Completed" ? "bg-emerald-50 text-emerald-600" :
    statusLabel === "In Progress" ? "bg-indigo-50 text-primary" : "bg-gray-100 text-gray-500";

  const donutSegments = stats.total > 0
    ? [
        { percent: (stats.done / stats.total) * 100, color: "#4F46E5" },
        { percent: (stats.inProgress / stats.total) * 100, color: "#3B82F6" },
        { percent: (stats.todo / stats.total) * 100, color: "#D1D5DB" },
      ]
    : [{ percent: 100, color: "#E5E7EB" }];

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex">
        <Sidebar />
        <div className="flex-1 p-6"><div className="h-40 rounded-2xl shimmer" /></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <AppTopbar />

        <div className="p-6 space-y-6">
          <Link to="/projects" className="text-sm text-gray-400 hover:text-primary flex items-center gap-1.5 w-fit">
            ← Back to Projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Header */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start gap-4">
                <span className="w-14 h-14 rounded-xl bg-indigo-50 text-primary flex items-center justify-center text-2xl flex-shrink-0">
                  📁
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-extrabold text-gray-900">{project.name}</h1>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>{statusLabel}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{project.description || "No description provided."}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
                    <span>👥 {project.members?.length || 0} Members</span>
                    <span>📅 Created {new Date(project.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span>✅ {stats.total} Tasks</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 border-b border-gray-100 mt-5 pb-0 text-sm font-medium text-gray-400">
                <span className="pb-3 border-b-2 border-primary text-primary">Overview</span>
                <Link to={`/projects/${projectId}`} className="pb-3 hover:text-gray-600">Tasks (Board)</Link>
                <span className="pb-3 text-gray-300 cursor-not-allowed" title="Coming soon">Files</span>
                <span className="pb-3 text-gray-300 cursor-not-allowed" title="Coming soon">Time Log</span>
                <span className="pb-3 text-gray-300 cursor-not-allowed" title="Coming soon">Settings</span>
              </div>
            </div>

            {/* Progress donut */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-3 text-sm">Project Progress</h2>
              <div className="flex flex-col items-center">
                <ConicDonut segments={donutSegments} centerLabel={`${percent}%`} centerSub="Completed" size={120} />
              </div>
              <ul className="space-y-1.5 mt-3 text-xs">
                {[
                  { label: "Completed", value: stats.done, color: "bg-primary" },
                  { label: "In Progress", value: stats.inProgress, color: "bg-blue-500" },
                  { label: "To Do", value: stats.todo, color: "bg-gray-300" },
                ].map((r) => (
                  <li key={r.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <span className={`w-2 h-2 rounded-full ${r.color}`} />
                      {r.label}
                    </span>
                    <span className="font-semibold text-gray-800">{r.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Project details */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">Project Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mb-5">
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">Project Owner</span>
                  <span className="flex items-center gap-2 font-medium text-gray-800">
                    <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${avatarColors[0]} text-white text-[9px] font-bold flex items-center justify-center`}>
                      {initials(project.owner?.name)}
                    </span>
                    {project.owner?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">Members</span>
                  <span className="font-medium text-gray-800">{project.members?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">Total Tasks</span>
                  <span className="font-medium text-gray-800">{stats.total}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">Created On</span>
                  <span className="font-medium text-gray-800">
                    {new Date(project.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>

              <p className="text-xs font-semibold text-gray-500 mb-2">Board Columns</p>
              <div className="flex flex-wrap gap-2">
                {(project.columns || []).map((c) => (
                  <span key={c} className="text-xs bg-indigo-50 text-primary px-2.5 py-1 rounded-full font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Members */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4 text-sm">Team</h2>
              <ul className="space-y-3">
                {(project.members || []).map((m, i) => (
                  <li key={m._id} className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>
                      {initials(m.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{m.name}</p>
                      <p className="text-xs text-gray-400 truncate">{m.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Task summary + recent tasks */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Recent Tasks</h2>
                <Link to={`/projects/${projectId}`} className="text-sm text-primary font-medium">View all tasks →</Link>
              </div>
              {recentTasks.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No tasks yet — add some from the board.</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {recentTasks.map((t) => (
                    <li key={t._id} className="py-3 flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-700 flex-1 truncate">{t.title}</p>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${statusStyles[t.status] || "bg-gray-100 text-gray-600"}`}>
                        {t.status}
                      </span>
                      <div className="flex -space-x-2 flex-shrink-0">
                        {(t.assignees || []).slice(0, 2).map((a) => (
                          <span key={a._id} className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-400 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                            {initials(a.name)}
                          </span>
                        ))}
                      </div>
                      {t.dueDate && (
                        <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                          {new Date(t.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Activity feed */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 text-sm">Activity Feed</h2>
                <span className="text-xs text-primary font-medium cursor-pointer">View all</span>
              </div>
              <ul className="space-y-4">
                {activityFeed.map((a, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarColors[(i + 1) % avatarColors.length]} text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0`}>
                      {initials(a.who)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold">{a.who}</span> {a.action}
                      </p>
                      <p className="text-[10px] text-gray-400">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <footer className="text-center text-xs text-gray-400 py-6">© 2026 PM Tool. All rights reserved.</footer>
      </div>
    </div>
  );
}
