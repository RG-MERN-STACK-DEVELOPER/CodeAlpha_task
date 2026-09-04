import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar.jsx";
import AppTopbar from "../components/AppTopbar.jsx";
import ConicDonut from "../components/ConicDonut.jsx";
import MiniCalendar from "../components/MiniCalendar.jsx";
import AddTaskModal from "../components/AddTaskModal.jsx";
import api from "../api/axios";

const PAGE_SIZE = 8;

/* =========================================================
   PRIORITY STYLES
========================================================= */

const priorityStyles = {
  High: "text-red-500",
  Medium: "text-amber-500",
  Low: "text-emerald-500",
};

/* =========================================================
   STATUS STYLES
========================================================= */

const statusStyles = {
  "To Do": "bg-indigo-50 text-primary",
  "In Progress": "bg-blue-50 text-blue-600",
  Done: "bg-emerald-50 text-emerald-600",
};

/* =========================================================
   RECENT ACTIVITY
========================================================= */

const recentActivity = [
  {
    who: "Sarah",
    action: "completed",
    target: "Homepage Design",
    project: "Website Redesign",
    time: "2h ago",
    color: "from-pink-400 to-rose-500",
  },
  {
    who: "Ali",
    action: "commented on",
    target: "API Integration",
    project: "Mobile Application",
    time: "4h ago",
    color: "from-blue-400 to-indigo-500",
  },
  {
    who: "John",
    action: "created a new task",
    target: "",
    project: "Marketing Website",
    time: "6h ago",
    color: "from-amber-400 to-orange-500",
  },
];

/* =========================================================
   INITIALS
========================================================= */

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* =========================================================
   CALENDAR ICON
========================================================= */

function CalendarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M8 2.5v4" />
      <path d="M16 2.5v4" />
      <path d="M3 9h18" />
      <path d="M8 13h.01" />
      <path d="M12 13h.01" />
      <path d="M16 13h.01" />
      <path d="M8 17h.01" />
      <path d="M12 17h.01" />
      <path d="M16 17h.01" />
    </svg>
  );
}

/* =========================================================
   CHART ICON
========================================================= */

function ChartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M7 15l3-4 3 2 5-6" />
      <circle cx="7" cy="15" r="1" />
      <circle cx="10" cy="11" r="1" />
      <circle cx="13" cy="13" r="1" />
      <circle cx="18" cy="7" r="1" />
    </svg>
  );
}

/* =========================================================
   SORT ICON
========================================================= */

function SortIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6h12" />
      <path d="M8 12h8" />
      <path d="M8 18h4" />
      <path d="m4 6 2-2 2 2" />
      <path d="M6 4v16" />
    </svg>
  );
}

/* =========================================================
   TASKS PAGE
========================================================= */

export default function TasksPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("All Tasks");
  const [sortBy, setSortBy] = useState("Priority");
  const [page, setPage] = useState(1);
  const [showAddTask, setShowAddTask] = useState(false);

  /* =========================================================
     LOAD PROJECTS + TASKS
  ========================================================= */

  const loadAll = async () => {
    setLoading(true);

    try {
      const { data: projectData } = await api.get("/projects");

      setProjects(projectData);

      const results = await Promise.all(
        projectData.map((project) =>
          api
            .get(`/tasks/project/${project._id}`)
            .then((response) => ({
              project,
              tasks: response.data,
            }))
        )
      );

      const flatTasks = results.flatMap(
        ({ project, tasks: projectTasks }) =>
          projectTasks.map((task) => ({
            ...task,
            projectName: project.name,
          }))
      );

      setTasks(flatTasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* =========================================================
     TASK COUNTS
  ========================================================= */

  const counts = useMemo(
    () => ({
      "All Tasks": tasks.length,

      "To Do": tasks.filter(
        (task) => task.status === "To Do"
      ).length,

      "In Progress": tasks.filter(
        (task) => task.status === "In Progress"
      ).length,

      Done: tasks.filter(
        (task) => task.status === "Done"
      ).length,
    }),
    [tasks]
  );

  /* =========================================================
     FILTER + SORT
  ========================================================= */

  const filtered = useMemo(() => {
    let list =
      activeTab === "All Tasks"
        ? tasks
        : tasks.filter(
            (task) => task.status === activeTab
          );

    list = [...list];

    if (sortBy === "Priority") {
      const priorityRank = {
        High: 0,
        Medium: 1,
        Low: 2,
      };

      list.sort(
        (a, b) =>
          (priorityRank[a.priority] ?? 99) -
          (priorityRank[b.priority] ?? 99)
      );
    }

    if (sortBy === "Due Date") {
      list.sort(
        (a, b) =>
          new Date(
            a.dueDate || "9999-12-31"
          ) -
          new Date(
            b.dueDate || "9999-12-31"
          )
      );
    }

    if (sortBy === "Status") {
      const statusRank = {
        "To Do": 0,
        "In Progress": 1,
        Done: 2,
      };

      list.sort(
        (a, b) =>
          (statusRank[a.status] ?? 99) -
          (statusRank[b.status] ?? 99)
      );
    }

    return list;
  }, [tasks, activeTab, sortBy]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [activeTab, sortBy]);

  /* =========================================================
     DONUT DATA
  ========================================================= */

  const donutSegments =
    tasks.length > 0
      ? [
          {
            percent:
              (counts["To Do"] / tasks.length) *
              100,
            color: "#4F46E5",
          },
          {
            percent:
              (counts["In Progress"] /
                tasks.length) *
              100,
            color: "#3B82F6",
          },
          {
            percent:
              (counts["Done"] / tasks.length) *
              100,
            color: "#10B981",
          },
        ]
      : [
          {
            percent: 100,
            color: "#E5E7EB",
          },
        ];

  /* =========================================================
     SUMMARY ITEMS
  ========================================================= */

  const summaryItems = [
    {
      label: "To Do",
      value: counts["To Do"],
      color: "bg-primary",
    },
    {
      label: "In Progress",
      value: counts["In Progress"],
      color: "bg-blue-500",
    },
    {
      label: "Done",
      value: counts["Done"],
      color: "bg-emerald-500",
    },
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <AppTopbar />

        <div className="p-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">

          {/* ===================================================
              LEFT SIDE
          =================================================== */}

          <div className="min-w-0 space-y-6">

            {/* PAGE HEADER */}

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">
                  Tasks
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Stay on top of your tasks and never miss a deadline.
                </p>
              </div>

              <div className="flex items-center gap-2">

                {/* SORT */}

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <SortIcon />
                  </span>

                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value)
                    }
                    className="appearance-none text-sm border border-gray-200 rounded-lg pl-9 pr-8 py-2.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Priority</option>
                    <option>Due Date</option>
                    <option>Status</option>
                  </select>

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                    ▾
                  </span>

                </div>

                {/* ADD TASK */}

                <button
                  onClick={() =>
                    setShowAddTask(true)
                  }
                  disabled={!projects.length}
                  className="bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 flex items-center gap-1.5"
                >
                  <span className="text-lg leading-none">
                    +
                  </span>

                  Add Task
                </button>

              </div>
            </div>

            {/* =================================================
                TASK TABLE
            ================================================= */}

            <div className="bg-white rounded-2xl border border-gray-100 p-5">

              {/* TABS */}

              <div className="flex items-center gap-5 border-b border-gray-100 mb-4 text-sm font-medium text-gray-400 overflow-x-auto">

                {[
                  "All Tasks",
                  "To Do",
                  "In Progress",
                  "Done",
                ].map((tab) => (

                  <button
                    key={tab}
                    onClick={() =>
                      setActiveTab(tab)
                    }
                    className={`pb-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                      activeTab === tab
                        ? "text-primary border-primary"
                        : "border-transparent hover:text-gray-600"
                    }`}
                  >

                    {tab}

                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeTab === tab
                          ? "bg-indigo-50 text-primary"
                          : "bg-surface text-gray-500"
                      }`}
                    >
                      {counts[tab]}
                    </span>

                  </button>

                ))}

              </div>

              {/* LOADING */}

              {loading ? (

                <div className="space-y-2">

                  {[1, 2, 3, 4].map(
                    (i) => (
                      <div
                        key={i}
                        className="h-14 rounded-lg shimmer"
                      />
                    )
                  )}

                </div>

              ) : paginated.length === 0 ? (

                /* EMPTY */

                <div className="text-center py-12">

                  <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 text-primary flex items-center justify-center mb-3">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                  </div>

                  <p className="text-sm text-gray-400">
                    No tasks found.
                  </p>

                </div>

              ) : (

                <>
                  {/* TABLE */}

                  <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                      <thead>

                        <tr className="text-left text-xs text-gray-400 border-b border-gray-100">

                          <th className="pb-2 pr-3 font-medium">
                            Task Name
                          </th>

                          <th className="pb-2 px-3 font-medium">
                            Project
                          </th>

                          <th className="pb-2 px-3 font-medium">
                            Assignees
                          </th>

                          <th className="pb-2 px-3 font-medium">
                            Priority
                          </th>

                          <th className="pb-2 px-3 font-medium">
                            Due Date
                          </th>

                          <th className="pb-2 pl-3 font-medium">
                            Status
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {paginated.map((task) => (

                          <tr
                            key={task._id}
                            className="border-b border-gray-50 hover:bg-surface/60 transition-colors"
                          >

                            {/* TASK */}

                            <td className="py-3 pr-3">

                              <p className="font-medium text-gray-800">
                                {task.title}
                              </p>

                              {task.description && (
                                <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">
                                  {task.description}
                                </p>
                              )}

                            </td>

                            {/* PROJECT */}

                            <td className="px-3">

                              <span className="text-xs bg-indigo-50 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">
                                {task.projectName}
                              </span>

                            </td>

                            {/* ASSIGNEES */}

                            <td className="px-3">

                              <div className="flex -space-x-2">

                                {(task.assignees || [])
                                  .slice(0, 3)
                                  .map(
                                    (assignee) => (
                                      <span
                                        key={
                                          assignee._id
                                        }
                                        title={
                                          assignee.name
                                        }
                                        className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-400 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white"
                                      >
                                        {initials(
                                          assignee.name
                                        )}
                                      </span>
                                    )
                                  )}

                                {(task.assignees || [])
                                  .length === 0 && (
                                  <span className="text-gray-300 text-xs">
                                    —
                                  </span>
                                )}

                              </div>

                            </td>

                            {/* PRIORITY */}

                            <td
                              className={`px-3 font-medium whitespace-nowrap ${
                                priorityStyles[
                                  task.priority
                                ] ||
                                "text-gray-500"
                              }`}
                            >
                              {task.priority}
                            </td>

                            {/* DATE */}

                            <td className="px-3 text-gray-500 whitespace-nowrap">

                              {task.dueDate
                                ? new Date(
                                    task.dueDate
                                  ).toLocaleDateString(
                                    undefined,
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )
                                : "—"}

                            </td>

                            {/* STATUS */}

                            <td className="pl-3">

                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                                  statusStyles[
                                    task.status
                                  ] ||
                                  "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {task.status}
                              </span>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                  {/* PAGINATION */}

                  <div className="flex items-center justify-between mt-4 text-sm text-gray-500">

                    <p>
                      Showing{" "}
                      {filtered.length === 0
                        ? 0
                        : (page - 1) *
                            PAGE_SIZE +
                          1}
                      –
                      {Math.min(
                        page * PAGE_SIZE,
                        filtered.length
                      )}{" "}
                      of {filtered.length} tasks
                    </p>

                    <div className="flex items-center gap-1">

                      <button
                        onClick={() =>
                          setPage((p) =>
                            Math.max(
                              1,
                              p - 1
                            )
                          )
                        }
                        disabled={page === 1}
                        className="w-8 h-8 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-surface flex items-center justify-center"
                      >
                        ‹
                      </button>

                      {Array.from({
                        length: totalPages,
                      })
                        .slice(0, 5)
                        .map((_, i) => (

                          <button
                            key={i}
                            onClick={() =>
                              setPage(i + 1)
                            }
                            className={`w-8 h-8 rounded-lg text-sm ${
                              page === i + 1
                                ? "bg-primary text-white"
                                : "border border-gray-200 hover:bg-surface"
                            }`}
                          >
                            {i + 1}
                          </button>

                        ))}

                      <button
                        onClick={() =>
                          setPage((p) =>
                            Math.min(
                              totalPages,
                              p + 1
                            )
                          )
                        }
                        disabled={
                          page === totalPages
                        }
                        className="w-8 h-8 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-surface flex items-center justify-center"
                      >
                        ›
                      </button>

                    </div>

                  </div>

                </>

              )}

            </div>

          </div>

          {/* ===================================================
              RIGHT SIDEBAR
          =================================================== */}

          <div className="w-full min-w-0 space-y-6">

            {/* =================================================
                CALENDAR
            ================================================= */}

            <div className="bg-white rounded-2xl border border-gray-100 p-5 w-full">

              {/* CALENDAR HEADER */}

              <div className="flex items-center justify-between mb-4">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-primary flex items-center justify-center flex-shrink-0">
                    <CalendarIcon />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Calendar
                    </h2>

                    <p className="text-[11px] text-gray-400">
                      Quick schedule
                    </p>
                  </div>

                </div>

              </div>

              {/* CALENDAR */}

              <div className="w-full pt-1 overflow-hidden">
                <MiniCalendar />
              </div>

            </div>

            {/* =================================================
                TASK SUMMARY
            ================================================= */}

            <div className="bg-white rounded-2xl border border-gray-100 p-5 w-full">

              {/* HEADER */}

              <div className="flex items-center gap-3 mb-5">

                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-primary flex items-center justify-center flex-shrink-0">
                  <ChartIcon />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Task Summary
                  </h2>

                  <p className="text-[11px] text-gray-400">
                    Current task progress
                  </p>
                </div>

              </div>

              {/* SUMMARY CONTENT */}

              <div className="flex items-center gap-5">

                {/* DONUT */}

                <div className="flex-shrink-0 flex items-center justify-center">
                  <ConicDonut
                    segments={donutSegments}
                    centerLabel={tasks.length}
                    centerSub="Total Tasks"
                    size={135}
                  />
                </div>

                {/* LEGEND */}

                <div className="flex-1 min-w-0">

                  <ul className="space-y-4">

                    {summaryItems.map(
                      (item) => {

                        const percentage =
                          tasks.length > 0
                            ? Math.round(
                                (item.value /
                                  tasks.length) *
                                  100
                              )
                            : 0;

                        return (
                          <li
                            key={item.label}
                            className="flex items-center justify-between gap-2"
                          >

                            {/* LABEL */}

                            <div className="flex items-center gap-2 min-w-0">

                              <span
                                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`}
                              />

                              <span className="text-sm text-gray-600 truncate">
                                {item.label}
                              </span>

                            </div>

                            {/* VALUE */}

                            <div className="flex items-center gap-1 flex-shrink-0">

                              <span className="text-sm font-bold text-gray-800">
                                {item.value}
                              </span>

                              <span className="text-xs text-gray-500 font-medium">
                                ({percentage}%)
                              </span>

                            </div>

                          </li>
                        );
                      }
                    )}

                  </ul>

                </div>

              </div>

            </div>

            {/* =================================================
                RECENT ACTIVITY
            ================================================= */}

            <div className="bg-white rounded-2xl border border-gray-100 p-5">

              <div className="flex items-center justify-between mb-4">

                <h2 className="font-bold text-gray-900">
                  Recent Activity
                </h2>

                <Link
                  to="/dashboard"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  View all →
                </Link>

              </div>

              <ul className="space-y-4">

                {recentActivity.map(
                  (activity, index) => (

                    <li
                      key={index}
                      className="flex items-start gap-3"
                    >

                      {/* AVATAR */}

                      <span
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${activity.color} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}
                      >
                        {initials(
                          activity.who
                        )}
                      </span>

                      {/* CONTENT */}

                      <div className="flex-1 min-w-0">

                        <p className="text-sm text-gray-700">

                          <span className="font-semibold">
                            {activity.who}
                          </span>{" "}

                          {activity.action}{" "}

                          {activity.target && (
                            <span className="font-semibold text-gray-900">
                              {activity.target}
                            </span>
                          )}

                        </p>

                        <p className="text-xs text-primary mt-0.5">
                          {activity.project}
                        </p>

                      </div>

                      {/* TIME */}

                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {activity.time}
                      </span>

                    </li>

                  )
                )}

              </ul>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <footer className="text-center text-xs text-gray-400 py-6">
          © 2026 PM Tool. All rights reserved.
        </footer>

      </div>

      {/* =======================================================
          ADD TASK MODAL
      ======================================================= */}

      {showAddTask && (
        <AddTaskModal
          projects={projects}
          onClose={() =>
            setShowAddTask(false)
          }
          onCreated={() =>
            loadAll()
          }
        />
      )}

    </div>
  );
}