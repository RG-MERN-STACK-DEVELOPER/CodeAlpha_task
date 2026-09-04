import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar.jsx";
import AppTopbar from "../components/AppTopbar.jsx";
import ConicDonut from "../components/ConicDonut.jsx";
import CreateProjectModal from "../components/CreateProjectModal.jsx";
import api from "../api/axios";

const deadlines = [
  {
    icon: "globe",
    color: "bg-blue-50 text-blue-500",
    title: "Website Redesign",
    sub: "Design system update",
    date: "May 25",
  },
  {
    icon: "mobile",
    color: "bg-amber-50 text-amber-500",
    title: "Mobile Application",
    sub: "API integration",
    date: "May 28",
  },
  {
    icon: "chart",
    color: "bg-purple-50 text-purple-500",
    title: "Analytics Dashboard",
    sub: "Unit testing",
    date: "May 30",
  },
  {
    icon: "target",
    color: "bg-emerald-50 text-emerald-500",
    title: "Marketing Website",
    sub: "Content review",
    date: "Jun 02",
  },
];

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "UI/UX Designer",
    status: "Online",
    color: "from-pink-400 to-rose-500",
  },
  {
    name: "John Smith",
    role: "Backend Developer",
    status: "Away",
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "Fatima Khan",
    role: "QA Engineer",
    status: "Online",
    color: "from-emerald-400 to-teal-500",
  },
];

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
    who: "John",
    action: "created a new task",
    target: "",
    project: "Marketing Website",
    time: "6h ago",
    color: "from-amber-400 to-orange-500",
  },
  {
    who: "You",
    action: "updated project",
    target: "Analytics Dashboard",
    project: "Analytics Dashboard",
    time: "Yesterday",
    color: "from-primary to-purple-500",
  },
];

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* Reusable inline SVG icons */
function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  className = "",
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  const paths = {
    folder: (
      <>
        <path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h4l2 2h6a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
        <path d="M3.5 9h17" />
      </>
    ),

    check: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),

    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    target: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle
          cx="12"
          cy="12"
          r="1.4"
          fill="currentColor"
          stroke="none"
        />
        <path d="M16.5 7.5 20 4m-3 0h3v3" />
      </>
    ),

    globe: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.8 9h16.4M3.8 15h16.4" />
        <path d="M12 3.5c2.1 2.2 3.2 5 3.2 8.5s-1.1 6.3-3.2 8.5c-2.1-2.2-3.2-5-3.2-8.5S9.9 5.7 12 3.5Z" />
      </>
    ),

    mobile: (
      <>
        <rect x="7" y="3.5" width="10" height="17" rx="2" />
        <path d="M10 6h4M11 17.5h2" />
      </>
    ),

    chart: (
      <>
        <path d="M4 19V5M4 19h16" />
        <rect x="7" y="12" width="2.5" height="4" rx=".5" />
        <rect x="11" y="9" width="2.5" height="7" rx=".5" />
        <rect x="15" y="6" width="2.5" height="10" rx=".5" />
      </>
    ),

    more: (
      <>
        <circle
          cx="5"
          cy="12"
          r="1.2"
          fill="currentColor"
          stroke="none"
        />
        <circle
          cx="12"
          cy="12"
          r="1.2"
          fill="currentColor"
          stroke="none"
        />
        <circle
          cx="19"
          cy="12"
          r="1.2"
          fill="currentColor"
          stroke="none"
        />
      </>
    ),

    edit: (
      <>
        <path d="M4 16.5V20h3.5L18.2 9.3l-3.5-3.5L4 16.5Z" />
        <path d="m13.5 7.5 3.5 3.5M14 20h6" />
      </>
    ),

    trash: (
      <>
        <path d="M4.5 7h15M9 7V4.5h6V7M7 7l.7 12h8.6L17 7M10 10.5v5.5M14 10.5v5.5" />
      </>
    ),

    rocket: (
      <>
        <path d="M14.5 4.5c2.6-1.2 4.4-.9 4.4-.9s.3 1.8-.9 4.4c-1.4 2.9-4.2 5.4-7.2 6.6l-2.8-2.8c1.2-3 3.7-5.8 6.5-7.3Z" />
        <path d="M8 13.5 5.5 16l2.5.5.5 2.5 2.5-2.5M14.5 8.5h.01" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.target}</svg>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [taskStats, setTaskStats] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Active project tab
  const [activeTab, setActiveTab] = useState("All Projects");

  const [openMenu, setOpenMenu] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: projectData } = await api.get("/projects");

        setProjects(projectData);

        const results = await Promise.all(
          projectData.map((p) =>
            api
              .get(`/tasks/project/${p._id}`)
              .then((r) => ({
                id: p._id,
                tasks: r.data,
              }))
          )
        );

        const stats = {};

        results.forEach(({ id, tasks }) => {
          stats[id] = {
            total: tasks.length,

            done: tasks.filter(
              (t) => t.status === "Done"
            ).length,

            inProgress: tasks.filter(
              (t) => t.status === "In Progress"
            ).length,

            todo: tasks.filter(
              (t) => t.status === "To Do"
            ).length,
          };
        });

        setTaskStats(stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /*
   * ----------------------------------------------------
   * TOTAL TASK STATISTICS
   * ----------------------------------------------------
   */

  const totals = Object.values(taskStats).reduce(
    (acc, s) => ({
      total: acc.total + s.total,
      done: acc.done + s.done,
      inProgress: acc.inProgress + s.inProgress,
      todo: acc.todo + s.todo,
    }),
    {
      total: 0,
      done: 0,
      inProgress: 0,
      todo: 0,
    }
  );

  const efficiency =
    totals.total > 0
      ? Math.round((totals.done / totals.total) * 100)
      : 0;

  /*
   * ----------------------------------------------------
   * TASK DONUT
   * ----------------------------------------------------
   */

  const taskDonutSegments =
    totals.total > 0
      ? [
          {
            percent:
              (totals.done / totals.total) * 100,
            color: "#4F46E5",
          },
          {
            percent:
              (totals.inProgress / totals.total) * 100,
            color: "#F59E0B",
          },
          {
            percent:
              (totals.todo / totals.total) * 100,
            color: "#10B981",
          },
        ]
      : [
          {
            percent: 100,
            color: "#E5E7EB",
          },
        ];

  /*
   * ----------------------------------------------------
   * OVERALL PROJECT SEGMENTS
   * ----------------------------------------------------
   */

  const overallSegments = [
    {
      percent: 56,
      color: "#4F46E5",
    },
    {
      percent: 20,
      color: "#F59E0B",
    },
    {
      percent: 16,
      color: "#10B981",
    },
    {
      percent: 8,
      color: "#D1D5DB",
    },
  ];

  /*
   * ----------------------------------------------------
   * PROJECT FILTERING
   *
   * Same logic as Projects page
   * ----------------------------------------------------
   */

  const filteredProjects = projects.filter((project) => {
    const stats = taskStats[project._id] || {
      total: 0,
      done: 0,
      inProgress: 0,
      todo: 0,
    };

    const percent =
      stats.total > 0
        ? Math.round(
            (stats.done / stats.total) * 100
          )
        : 0;

    // All Projects
    if (activeTab === "All Projects") {
      return true;
    }

    // In Progress
    if (activeTab === "In Progress") {
      return percent > 0 && percent < 100;
    }

    // Completed
    if (activeTab === "Completed") {
      return stats.total > 0 && percent === 100;
    }

    // On Hold
    // Same meaning as Projects page:
    // project has no tasks
    if (activeTab === "On Hold") {
      return stats.total === 0;
    }

    return true;
  });

  /*
   * ----------------------------------------------------
   * EDIT PROJECT
   * ----------------------------------------------------
   */

  const handleEditProject = (project) => {
    setOpenMenu(null);

    navigate(`/projects/${project._id}/edit`);
  };

  /*
   * ----------------------------------------------------
   * DELETE PROJECT
   * ----------------------------------------------------
   */

  const handleDeleteProject = async (project) => {
    setOpenMenu(null);

    const confirmed = window.confirm(
      `Delete "${project.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingProject(project._id);

      await api.delete(
        `/projects/${project._id}`
      );

      setProjects((prev) =>
        prev.filter(
          (item) => item._id !== project._id
        )
      );

      setTaskStats((prev) => {
        const next = { ...prev };

        delete next[project._id];

        return next;
      });
    } catch (err) {
      console.error(err);

      window.alert(
        "Unable to delete this project. Please try again."
      );
    } finally {
      setDeletingProject(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-surface flex"
      onClick={() =>
        openMenu && setOpenMenu(null)
      }
    >
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <AppTopbar />

        <div className="p-6 grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* =====================================================
              MAIN CONTENT
          ====================================================== */}

          <div className="xl:col-span-3 space-y-6">

            {/* PAGE HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">
                  Good morning,{" "}
                  {user?.name?.split(" ")[0]} 👋
                </h1>

                <p className="text-sm text-gray-500">
                  Here's what's happening with your projects today.
                </p>
              </div>

              <div className="flex items-center gap-2">

                <button
                  onClick={() =>
                    setShowModal(true)
                  }
                  className="
                    bg-primary
                    text-white
                    text-sm
                    font-semibold
                    px-4
                    py-2.5
                    rounded-lg
                    hover:bg-indigo-700
                    transition-all
                    hover:scale-105
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  + Create Project
                </button>

              </div>
            </div>

            {/* =====================================================
                STATS CARDS
            ====================================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {[
                {
                  icon: "folder",
                  bg: "bg-indigo-50",
                  color: "text-primary",
                  label: "Total Projects",
                  value: projects.length,
                  delta: "+12% from last month",
                },

                {
                  icon: "check",
                  bg: "bg-emerald-50",
                  color: "text-emerald-600",
                  label: "Tasks Completed",
                  value: totals.done,
                  delta: "+8% from last month",
                },

                {
                  icon: "clock",
                  bg: "bg-amber-50",
                  color: "text-amber-600",
                  label: "In Progress",
                  value: totals.inProgress,
                  delta: "+5% from last month",
                },

                {
                  icon: "target",
                  bg: "bg-pink-50",
                  color: "text-pink-600",
                  label: "Team Efficiency",
                  value: `${efficiency}%`,
                  delta: "+10% from last month",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="
                    bg-white
                    rounded-2xl
                    border
                    border-gray-100
                    p-4
                    card-lift
                  "
                >
                  <div className="flex items-center gap-3 mb-3">

                    <span
                      className={`
                        w-10
                        h-10
                        rounded-lg
                        ${s.bg}
                        ${s.color}
                        flex
                        items-center
                        justify-center
                      `}
                    >
                      <Icon
                        name={s.icon}
                        size={20}
                        strokeWidth={1.9}
                      />
                    </span>

                    <p className="text-xs text-gray-500">
                      {s.label}
                    </p>

                  </div>

                  <p className="text-2xl font-extrabold text-gray-900 mb-1">
                    {s.value}
                  </p>

                  <p className="text-xs text-emerald-500">
                    ↑ {s.delta}
                  </p>
                </div>
              ))}

            </div>

            {/* =====================================================
                PROJECTS
            ====================================================== */}

            <div
              id="projects"
              className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                p-5
              "
            >

              {/* PROJECT HEADER */}

              <div className="flex items-center justify-between mb-4">

                <h2 className="font-bold text-gray-900">
                  Projects
                </h2>

                <Link
                  to="/projects"
                  className="
                    text-sm
                    text-primary
                    font-medium
                  "
                >
                  View all →
                </Link>

              </div>

              {/* =====================================================
                  PROJECT TABS
              ====================================================== */}

              <div
                className="
                  flex
                  items-center
                  gap-5
                  border-b
                  border-gray-100
                  mb-4
                  text-sm
                  font-medium
                  text-gray-400
                  overflow-x-auto
                "
              >

                {[
                  "All Projects",
                  "In Progress",
                  "Completed",
                  "On Hold",
                ].map((tab) => (

                  <button
                    key={tab}
                    type="button"
                    onClick={() =>
                      setActiveTab(tab)
                    }
                    className={`
                      pb-3
                      whitespace-nowrap
                      border-b-2
                      transition-colors
                      ${
                        activeTab === tab
                          ? "text-primary border-primary"
                          : "border-transparent hover:text-gray-600"
                      }
                    `}
                  >
                    {tab}
                  </button>

                ))}

              </div>

              {/* =====================================================
                  LOADING
              ====================================================== */}

              {loading ? (

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                  "
                >

                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="
                        h-32
                        rounded-xl
                        shimmer
                      "
                    />
                  ))}

                </div>

              ) : filteredProjects.length === 0 ? (

                /* =====================================================
                    EMPTY CATEGORY
                ====================================================== */

                <div className="py-10 text-center">

                  <div
                    className="
                      w-12
                      h-12
                      rounded-full
                      bg-indigo-50
                      text-primary
                      flex
                      items-center
                      justify-center
                      mx-auto
                      mb-3
                    "
                  >
                    <Icon
                      name="folder"
                      size={22}
                      strokeWidth={1.8}
                    />
                  </div>

                  <p className="text-sm text-gray-500">
                    No projects in this category.
                  </p>

                  {activeTab !== "All Projects" && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTab("All Projects")
                      }
                      className="
                        mt-3
                        text-sm
                        text-primary
                        font-medium
                        hover:underline
                      "
                    >
                      View all projects
                    </button>
                  )}

                </div>

              ) : (

                /* =====================================================
                    FILTERED PROJECT CARDS
                ====================================================== */

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                  "
                >

                  {filteredProjects
                    .slice(0, 4)
                    .map((p) => {

                      const s =
                        taskStats[p._id] || {
                          total: 0,
                          done: 0,
                          inProgress: 0,
                          todo: 0,
                        };

                      const percent =
                        s.total > 0
                          ? Math.round(
                              (s.done / s.total) *
                                100
                            )
                          : 0;

                      const isDeleting =
                        deletingProject ===
                        p._id;

                      return (
                        <div
                          key={p._id}
                          className={`
                            relative
                            border
                            border-gray-100
                            rounded-xl
                            p-4
                            card-lift
                            bg-white
                            ${
                              isDeleting
                                ? "opacity-60 pointer-events-none"
                                : ""
                            }
                          `}
                        >

                          {/* PROJECT CARD HEADER */}

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              mb-2
                            "
                          >

                            <Link
                              to={`/projects/${p._id}`}
                              className="
                                text-xs
                                font-medium
                                bg-indigo-50
                                text-primary
                                px-2
                                py-0.5
                                rounded-full
                                hover:bg-indigo-100
                                transition-colors
                              "
                            >
                              Project
                            </Link>

                            {/* MENU */}

                            <div className="relative">

                              <button
                                type="button"
                                aria-label={`Project actions for ${p.name}`}
                                aria-expanded={
                                  openMenu ===
                                  p._id
                                }
                                onClick={(e) => {
                                  e.stopPropagation();

                                  setOpenMenu(
                                    (current) =>
                                      current ===
                                      p._id
                                        ? null
                                        : p._id
                                  );
                                }}
                                className="
                                  w-8
                                  h-8
                                  rounded-lg
                                  text-gray-300
                                  hover:text-gray-600
                                  hover:bg-gray-50
                                  flex
                                  items-center
                                  justify-center
                                  transition-colors
                                "
                              >
                                <Icon
                                  name="more"
                                  size={18}
                                  strokeWidth={2}
                                />
                              </button>

                              {openMenu === p._id && (

                                <div
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                  className="
                                    absolute
                                    right-0
                                    top-9
                                    z-30
                                    w-40
                                    rounded-xl
                                    border
                                    border-gray-100
                                    bg-white
                                    p-1.5
                                    shadow-lg
                                    shadow-gray-200/60
                                  "
                                >

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditProject(
                                        p
                                      )
                                    }
                                    className="
                                      w-full
                                      flex
                                      items-center
                                      gap-2.5
                                      px-3
                                      py-2
                                      rounded-lg
                                      text-sm
                                      text-gray-700
                                      hover:bg-gray-50
                                      transition-colors
                                      text-left
                                    "
                                  >
                                    <Icon
                                      name="edit"
                                      size={16}
                                      className="text-gray-500"
                                    />

                                    <span>
                                      Edit Project
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteProject(
                                        p
                                      )
                                    }
                                    className="
                                      w-full
                                      flex
                                      items-center
                                      gap-2.5
                                      px-3
                                      py-2
                                      rounded-lg
                                      text-sm
                                      text-red-600
                                      hover:bg-red-50
                                      transition-colors
                                      text-left
                                    "
                                  >
                                    <Icon
                                      name="trash"
                                      size={16}
                                      className="text-red-500"
                                    />

                                    <span>
                                      Delete Project
                                    </span>
                                  </button>

                                </div>

                              )}

                            </div>

                          </div>

                          {/* PROJECT CONTENT */}

                          <Link
                            to={`/projects/${p._id}`}
                            className="block"
                          >

                            <p className="font-semibold text-gray-900 mb-3">
                              {p.name}
                            </p>

                            {/* PROGRESS */}

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                                mb-3
                              "
                            >

                              <div
                                className="
                                  flex-1
                                  h-1.5
                                  bg-gray-100
                                  rounded-full
                                  overflow-hidden
                                "
                              >
                                <div
                                  className="
                                    h-full
                                    bg-primary
                                    rounded-full
                                    transition-all
                                    duration-300
                                  "
                                  style={{
                                    width:
                                      percent +
                                      "%",
                                  }}
                                />
                              </div>

                              <span
                                className="
                                  text-xs
                                  text-gray-500
                                  font-medium
                                "
                              >
                                {percent}%
                              </span>

                            </div>

                            {/* MEMBERS + TASKS */}

                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                text-xs
                                text-gray-400
                              "
                            >

                              <div className="flex -space-x-2">

                                {(p.members || [])
                                  .slice(0, 3)
                                  .map((m) => (

                                    <span
                                      key={m._id}
                                      className="
                                        w-6
                                        h-6
                                        rounded-full
                                        bg-gradient-to-br
                                        from-primary
                                        to-purple-400
                                        text-white
                                        text-[9px]
                                        font-bold
                                        flex
                                        items-center
                                        justify-center
                                        ring-2
                                        ring-white
                                      "
                                    >
                                      {initials(
                                        m.name
                                      )}
                                    </span>

                                  ))}

                                {(p.members || [])
                                  .length > 3 && (

                                  <span
                                    className="
                                      w-6
                                      h-6
                                      rounded-full
                                      bg-gray-100
                                      text-gray-500
                                      text-[9px]
                                      font-bold
                                      flex
                                      items-center
                                      justify-center
                                      ring-2
                                      ring-white
                                    "
                                  >
                                    +
                                    {p.members.length -
                                      3}
                                  </span>

                                )}

                              </div>

                              <span>
                                ✓ {s.total} tasks
                              </span>

                            </div>

                          </Link>

                        </div>
                      );
                    })}

                </div>

              )}

            </div>

            {/* =====================================================
                TASK OVERVIEW + RECENT ACTIVITY
            ====================================================== */}

            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-6
              "
            >

              {/* TASK OVERVIEW */}

              <div
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-gray-100
                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-4
                  "
                >

                  <h2 className="font-bold text-gray-900">
                    Task Overview
                  </h2>

                  <select
                    className="
                      text-xs
                      border
                      border-gray-200
                      rounded-lg
                      px-2
                      py-1
                      text-gray-500
                    "
                  >
                    <option>
                      This Week
                    </option>
                  </select>

                </div>

                <div className="flex items-center gap-6">

                  <ConicDonut
                    segments={
                      taskDonutSegments
                    }
                    centerLabel={
                      totals.total
                    }
                    centerSub="Total Tasks"
                  />

                  <ul
                    className="
                      space-y-2
                      text-sm
                      flex-1
                    "
                  >

                    {[
                      {
                        label:
                          "Completed",
                        value:
                          totals.done,
                        color:
                          "bg-primary",
                      },
                      {
                        label:
                          "In Progress",
                        value:
                          totals.inProgress,
                        color:
                          "bg-amber-400",
                      },
                      {
                        label:
                          "To Do",
                        value:
                          totals.todo,
                        color:
                          "bg-emerald-500",
                      },
                    ].map((r) => (

                      <li
                        key={r.label}
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >

                        <span
                          className="
                            flex
                            items-center
                            gap-2
                            text-gray-600
                          "
                        >

                          <span
                            className={`
                              w-2.5
                              h-2.5
                              rounded-full
                              ${r.color}
                            `}
                          />

                          {r.label}

                        </span>

                        <span
                          className="
                            font-semibold
                            text-gray-800
                          "
                        >
                          {r.value}
                        </span>

                      </li>

                    ))}

                  </ul>

                </div>

              </div>

              {/* RECENT ACTIVITY */}

              <div
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-gray-100
                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-4
                  "
                >

                  <h2 className="font-bold text-gray-900">
                    Recent Activity
                  </h2>

                  <Link
                    to="#"
                    className="
                      text-sm
                      text-primary
                      font-medium
                    "
                  >
                    View all →
                  </Link>

                </div>

                <ul className="space-y-4">

                  {recentActivity.map(
                    (a, i) => (

                      <li
                        key={i}
                        className="
                          flex
                          items-start
                          gap-3
                        "
                      >

                        <span
                          className={`
                            w-8
                            h-8
                            rounded-full
                            bg-gradient-to-br
                            ${a.color}
                            text-white
                            text-[10px]
                            font-bold
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                          `}
                        >
                          {initials(a.who)}
                        </span>

                        <div
                          className="
                            flex-1
                            min-w-0
                          "
                        >

                          <p
                            className="
                              text-sm
                              text-gray-700
                            "
                          >

                            <span className="font-semibold">
                              {a.who}
                            </span>{" "}

                            {a.action}{" "}

                            {a.target && (
                              <span className="font-semibold text-gray-900">
                                {a.target}
                              </span>
                            )}

                          </p>

                          <p className="text-xs text-primary">
                            {a.project}
                          </p>

                        </div>

                        <span
                          className="
                            text-xs
                            text-gray-400
                            flex-shrink-0
                          "
                        >
                          {a.time}
                        </span>

                      </li>

                    )
                  )}

                </ul>

              </div>

            </div>

          </div>

          {/* =====================================================
              RIGHT SIDEBAR
          ====================================================== */}

          <div className="space-y-6">

            {/* OVERALL PROGRESS */}

            <div
              className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                p-5
              "
            >

              <h2 className="font-bold text-gray-900 mb-4">
                Overall Progress
              </h2>

              <div
                className="
                  flex
                  flex-col
                  items-center
                "
              >

                <ConicDonut
                  segments={
                    overallSegments
                  }
                  centerLabel="72%"
                  centerSub="Overall Progress"
                  size={140}
                />

              </div>

              <ul
                className="
                  space-y-2
                  mt-4
                  text-sm
                "
              >

                {[
                  {
                    label: "Completed",
                    value: 56,
                    color: "bg-primary",
                  },
                  {
                    label: "In Progress",
                    value: 72,
                    color: "bg-amber-400",
                  },
                  {
                    label: "On Hold",
                    value: 12,
                    color: "bg-emerald-500",
                  },
                  {
                    label: "Not Started",
                    value: 8,
                    color: "bg-gray-300",
                  },
                ].map((r) => (

                  <li
                    key={r.label}
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <span
                      className="
                        flex
                        items-center
                        gap-2
                        text-gray-600
                      "
                    >

                      <span
                        className={`
                          w-2.5
                          h-2.5
                          rounded-full
                          ${r.color}
                        `}
                      />

                      {r.label}

                    </span>

                    <span
                      className="
                        font-semibold
                        text-gray-800
                      "
                    >
                      {r.value}
                    </span>

                  </li>

                ))}

              </ul>

            </div>

            {/* UPCOMING DEADLINES */}

            <div
              className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                p-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-4
                "
              >

                <h2 className="font-bold text-gray-900">
                  Upcoming Deadlines
                </h2>

                <Link
                  to="#"
                  className="
                    text-sm
                    text-primary
                    font-medium
                  "
                >
                  View all →
                </Link>

              </div>

              <ul className="space-y-3">

                {deadlines.map((d) => (

                  <li
                    key={d.title}
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <span
                      className={`
                        w-9
                        h-9
                        rounded-lg
                        ${d.color}
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                      `}
                    >

                      <Icon
                        name={d.icon}
                        size={18}
                        strokeWidth={1.8}
                      />

                    </span>

                    <div
                      className="
                        flex-1
                        min-w-0
                      "
                    >

                      <p
                        className="
                          text-sm
                          font-medium
                          text-gray-800
                          truncate
                        "
                      >
                        {d.title}
                      </p>

                      <p
                        className="
                          text-xs
                          text-gray-400
                          truncate
                        "
                      >
                        {d.sub}
                      </p>

                    </div>

                    <span
                      className="
                        text-xs
                        text-primary
                        font-medium
                        flex-shrink-0
                      "
                    >
                      {d.date}
                    </span>

                  </li>

                ))}

              </ul>

            </div>

            {/* TEAM MEMBERS */}

            <div
              className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                p-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-4
                "
              >

                <h2 className="font-bold text-gray-900">
                  Team Members
                </h2>

                <Link
                  to="#"
                  className="
                    text-sm
                    text-primary
                    font-medium
                  "
                >
                  View all →
                </Link>

              </div>

              <ul className="space-y-3">

                {teamMembers.map((m) => (

                  <li
                    key={m.name}
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <span
                      className={`
                        w-9
                        h-9
                        rounded-full
                        bg-gradient-to-br
                        ${m.color}
                        text-white
                        text-xs
                        font-bold
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                      `}
                    >
                      {initials(m.name)}
                    </span>

                    <div
                      className="
                        flex-1
                        min-w-0
                      "
                    >

                      <p
                        className="
                          text-sm
                          font-medium
                          text-gray-800
                          truncate
                        "
                      >
                        {m.name}
                      </p>

                      <p
                        className="
                          text-xs
                          text-gray-400
                          truncate
                        "
                      >
                        {m.role}
                      </p>

                    </div>

                    <span
                      className={`
                        text-xs
                        font-medium
                        flex-shrink-0
                        ${
                          m.status ===
                          "Online"
                            ? "text-emerald-500"
                            : "text-amber-500"
                        }
                      `}
                    >
                      {m.status}
                    </span>

                  </li>

                ))}

              </ul>

            </div>

            {/* UPGRADE CARD */}

            <div
              className="
                relative
                overflow-hidden
                bg-gradient-to-br
                from-primary
                to-purple-600
                rounded-2xl
                p-5
                text-white
              "
            >

              <p className="font-bold mb-1">
                Boost your productivity
              </p>

              <p
                className="
                  text-xs
                  text-indigo-100/80
                  mb-4
                "
              >
                Upgrade to Pro and unlock powerful features.
              </p>

              <button
                className="
                  bg-white
                  text-primary
                  text-xs
                  font-semibold
                  px-4
                  py-2
                  rounded-lg
                  hover:bg-gray-50
                  transition-colors
                "
              >
                Upgrade Now →
              </button>

              <span
                className="
                  absolute
                  -bottom-4
                  -right-2
                  opacity-20
                "
              >
                <Icon
                  name="rocket"
                  size={72}
                  strokeWidth={1.4}
                />
              </span>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <footer
          className="
            text-center
            text-xs
            text-gray-400
            py-6
          "
        >
          © 2026 PM Tool. All rights reserved.
        </footer>

      </div>

      {/* =====================================================
          CREATE PROJECT MODAL
      ====================================================== */}

      {showModal && (
        <CreateProjectModal
          onClose={() =>
            setShowModal(false)
          }
          onCreated={(project) =>
            setProjects((prev) => [
              project,
              ...prev,
            ])
          }
        />
      )}

    </div>
  );
}