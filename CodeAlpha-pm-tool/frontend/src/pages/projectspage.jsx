import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe2,
  Smartphone,
  BarChart3,
  Settings,
} from "lucide-react";

import Sidebar from "../components/Sidebar.jsx";
import AppTopbar from "../components/AppTopbar.jsx";
import ConicDonut from "../components/ConicDonut.jsx";
import CreateProjectModal from "../components/CreateProjectModal.jsx";
import api from "../api/axios";


const deadlines = [
  {
    icon: Globe2,
    color: "bg-blue-50 text-blue-500",
    title: "Website Redesign",
    sub: "Design system update",
    date: "May 25",
  },
  {
    icon: Smartphone,
    color: "bg-amber-50 text-amber-500",
    title: "Mobile Application",
    sub: "API integration",
    date: "May 28",
  },
  {
    icon: BarChart3,
    color: "bg-purple-50 text-purple-500",
    title: "Analytics Dashboard",
    sub: "Unit testing",
    date: "May 30",
  },
];


const workload = [40, 55, 65, 50, 70, 60, 80];


function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}


export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [taskStats, setTaskStats] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Projects");


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
            done: tasks.filter((t) => t.status === "Done").length,
            inProgress: tasks.filter(
              (t) => t.status === "In Progress"
            ).length,
            todo: tasks.filter((t) => t.status === "To Do").length,
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


  const withPercent = projects.map((p) => {
    const s = taskStats[p._id] || {
      total: 0,
      done: 0,
      inProgress: 0,
      todo: 0,
    };

    const percent =
      s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;

    return {
      ...p,
      stats: s,
      percent,
    };
  });


  const completedCount = withPercent.filter(
    (p) => p.stats.total > 0 && p.percent === 100
  ).length;


  const inProgressCount = withPercent.filter(
    (p) => p.percent > 0 && p.percent < 100
  ).length;


  const notStartedCount = withPercent.filter(
    (p) => p.stats.total === 0
  ).length;


  const filtered = withPercent.filter((p) => {
    if (activeTab === "All Projects") return true;

    if (activeTab === "In Progress") {
      return p.percent > 0 && p.percent < 100;
    }

    if (activeTab === "Completed") {
      return p.stats.total > 0 && p.percent === 100;
    }

    if (activeTab === "On Hold") {
      return p.stats.total === 0;
    }

    return true;
  });


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


  const overallPercent =
    totals.total > 0
      ? Math.round((totals.done / totals.total) * 100)
      : 0;


  const overviewSegments =
    totals.total > 0
      ? [
          {
            percent: (totals.done / totals.total) * 100,
            color: "#4F46E5",
          },
          {
            percent: (totals.inProgress / totals.total) * 100,
            color: "#F59E0B",
          },
          {
            percent: (totals.todo / totals.total) * 100,
            color: "#10B981",
          },
        ]
      : [
          {
            percent: 100,
            color: "#E5E7EB",
          },
        ];


  return (
    <div className="min-h-screen bg-surface flex">

      {/* Sidebar */}
      <Sidebar />


      <div className="flex-1 min-w-0">

        {/* Topbar */}
        <AppTopbar />


        <div className="p-6 grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">

            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">
                  Projects
                </h1>

                <p className="text-sm text-gray-500">
                  Manage and track all your team projects in one place.
                </p>
              </div>


              <div className="flex items-center gap-2">

                {/* Settings */}
                <button
                  className="
                    w-10 h-10
                    rounded-lg
                    border border-gray-200
                    bg-white
                    flex items-center justify-center
                    text-gray-500
                    hover:text-primary
                    hover:border-indigo-200
                    transition-colors
                  "
                  title="Project Settings"
                >
                  <Settings
                    size={18}
                    strokeWidth={1.8}
                  />
                </button>


                {/* Create Project */}
                <button
                  onClick={() => setShowModal(true)}
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
                  "
                >
                  + Create Project
                </button>

              </div>
            </div>


            {/* Projects Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">

              {/* Tabs */}
              <div className="
                flex flex-wrap
                items-center
                justify-between
                gap-3
                border-b
                border-gray-100
                mb-5
                pb-1
              ">

                <div className="
                  flex
                  items-center
                  gap-5
                  text-sm
                  font-medium
                  text-gray-400
                  overflow-x-auto
                ">

                  {[
                    "All Projects",
                    "In Progress",
                    "Completed",
                    "On Hold",
                  ].map((tab) => (

                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
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


                {/* Sort */}
                <select
                  className="
                    text-xs
                    border
                    border-gray-200
                    rounded-lg
                    px-2
                    py-1.5
                    text-gray-500
                  "
                >
                  <option>Recent</option>
                  <option>Name</option>
                  <option>Progress</option>
                </select>

              </div>


              {/* Loading */}
              {loading ? (

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  gap-4
                ">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-40 rounded-xl shimmer"
                    />
                  ))}
                </div>

              ) : filtered.length === 0 ? (

                <p className="
                  text-sm
                  text-gray-400
                  text-center
                  py-10
                ">
                  No projects in this category.
                </p>

              ) : (

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  gap-4
                ">

                  {filtered.map((p) => (

                    <Link
                      key={p._id}
                      to={`/projects/${p._id}`}
                      className="
                        border
                        border-gray-100
                        rounded-xl
                        p-4
                        card-lift
                        block
                      "
                    >

                      {/* Project Header */}
                      <div className="
                        flex
                        items-center
                        justify-between
                        mb-2
                      ">

                        <span className="
                          text-xs
                          font-medium
                          bg-indigo-50
                          text-primary
                          px-2
                          py-0.5
                          rounded-full
                        ">
                          Project
                        </span>

                        <span className="text-gray-300">
                          ⋯
                        </span>

                      </div>


                      {/* Project Name */}
                      <p className="
                        font-semibold
                        text-gray-900
                        mb-1
                      ">
                        {p.name}
                      </p>


                      {/* Description */}
                      <p className="
                        text-xs
                        text-gray-400
                        mb-3
                        line-clamp-2
                      ">
                        {p.description || "No description"}
                      </p>


                      {/* Progress */}
                      <div className="
                        flex
                        items-center
                        gap-2
                        mb-3
                      ">

                        <div className="
                          flex-1
                          h-1.5
                          bg-gray-100
                          rounded-full
                          overflow-hidden
                        ">
                          <div
                            className="
                              h-full
                              bg-primary
                              rounded-full
                            "
                            style={{
                              width: p.percent + "%",
                            }}
                          />
                        </div>

                        <span className="
                          text-xs
                          text-gray-500
                          font-medium
                        ">
                          {p.percent}%
                        </span>

                      </div>


                      {/* Members + Tasks */}
                      <div className="
                        flex
                        items-center
                        justify-between
                        text-xs
                        text-gray-400
                      ">

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
                                {initials(m.name)}
                              </span>

                            ))}


                          {(p.members || []).length > 3 && (

                            <span className="
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
                            ">
                              +{p.members.length - 3}
                            </span>

                          )}

                        </div>


                        <span>
                          ✓ {p.stats.total} tasks
                        </span>

                      </div>

                    </Link>

                  ))}

                </div>

              )}

            </div>

          </div>


          {/* Right Sidebar */}
          <div className="space-y-6">

            {/* Project Overview */}
            <div className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              p-5
            ">

              <h2 className="
                font-bold
                text-gray-900
                mb-4
              ">
                Project Overview
              </h2>


              <div className="
                flex
                flex-col
                items-center
              ">
                <ConicDonut
                  segments={overviewSegments}
                  centerLabel={`${overallPercent}%`}
                  centerSub="Overall Progress"
                  size={140}
                />
              </div>


              <ul className="
                space-y-2
                mt-4
                text-sm
              ">

                {[
                  {
                    label: "Completed",
                    value: totals.done,
                    color: "bg-primary",
                  },
                  {
                    label: "In Progress",
                    value: totals.inProgress,
                    color: "bg-amber-400",
                  },
                  {
                    label: "To Do",
                    value: totals.todo,
                    color: "bg-emerald-500",
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

                    <span className="
                      flex
                      items-center
                      gap-2
                      text-gray-600
                    ">

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


                    <span className="
                      font-semibold
                      text-gray-800
                    ">
                      {r.value}
                    </span>

                  </li>

                ))}

              </ul>

            </div>


            {/* Projects Summary */}
            <div className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              p-5
            ">

              <h2 className="
                font-bold
                text-gray-900
                mb-4
              ">
                Projects Summary
              </h2>


              <div className="
                grid
                grid-cols-2
                gap-3
              ">

                {[
                  {
                    label: "TOTAL",
                    value: projects.length,
                    bg: "bg-surface",
                  },
                  {
                    label: "COMPLETED",
                    value: completedCount,
                    bg: "bg-emerald-50",
                  },
                  {
                    label: "IN PROGRESS",
                    value: inProgressCount,
                    bg: "bg-indigo-50",
                  },
                  {
                    label: "NOT STARTED",
                    value: notStartedCount,
                    bg: "bg-amber-50",
                  },
                ].map((s) => (

                  <div
                    key={s.label}
                    className={`${s.bg} rounded-xl p-3`}
                  >

                    <p className="
                      text-[10px]
                      font-semibold
                      text-gray-500
                      tracking-wide
                      mb-1
                    ">
                      {s.label}
                    </p>

                    <p className="
                      text-xl
                      font-extrabold
                      text-gray-900
                    ">
                      {s.value}
                    </p>

                  </div>

                ))}

              </div>

            </div>


            {/* Upcoming Deadlines */}
            <div className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              p-5
            ">

              <div className="
                flex
                items-center
                justify-between
                mb-4
              ">

                <h2 className="
                  font-bold
                  text-gray-900
                ">
                  Upcoming Deadlines
                </h2>

                <Link
                  to="/dashboard"
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

                {deadlines.map((d) => {

                  const Icon = d.icon;

                  return (
                    <li
                      key={d.title}
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      {/* SVG Icon */}
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
                          size={17}
                          strokeWidth={1.8}
                        />
                      </span>


                      <div className="
                        flex-1
                        min-w-0
                      ">

                        <p className="
                          text-sm
                          font-medium
                          text-gray-800
                          truncate
                        ">
                          {d.title}
                        </p>

                        <p className="
                          text-xs
                          text-gray-400
                          truncate
                        ">
                          {d.sub}
                        </p>

                      </div>


                      <span className="
                        text-xs
                        text-primary
                        font-medium
                        flex-shrink-0
                      ">
                        {d.date}
                      </span>

                    </li>
                  );

                })}

              </ul>

            </div>


            {/* Team Workload */}
            <div className="
              relative
              overflow-hidden
              bg-gradient-to-br
              from-primary
              to-purple-600
              rounded-2xl
              p-5
              text-white
            ">

              <div className="
                flex
                items-center
                justify-between
                mb-3
              ">

                <p className="font-bold">
                  Team Workload
                </p>

                <Link
                  to="#"
                  className="
                    text-xs
                    text-indigo-100
                    underline
                  "
                >
                  View report
                </Link>

              </div>


              <p className="text-sm mb-1">
                Your team is balanced
              </p>

              <p className="
                text-xs
                text-indigo-100/70
                mb-4
              ">
                No one is overloaded
              </p>


              <div className="
                flex
                items-end
                gap-1.5
                h-14
              ">

                {workload.map((h, i) => (

                  <div
                    key={i}
                    className="
                      flex-1
                      bg-white/30
                      rounded-t
                    "
                    style={{
                      height: `${h}%`,
                    }}
                  />

                ))}

              </div>

            </div>

          </div>

        </div>


        {/* Footer */}
        <footer className="
          text-center
          text-xs
          text-gray-400
          py-6
        ">
          © 2026 PM Tool. All rights reserved.
        </footer>

      </div>


      {/* Create Project Modal */}
      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
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