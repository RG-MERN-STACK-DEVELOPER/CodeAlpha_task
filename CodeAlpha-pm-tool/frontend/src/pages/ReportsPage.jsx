import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
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

const projectTagPalette = [
  "bg-blue-50 text-blue-600",
  "bg-amber-50 text-amber-600",
  "bg-purple-50 text-purple-600",
  "bg-emerald-50 text-emerald-600",
  "bg-pink-50 text-pink-600",
];

// SVG Icons
const FolderIcon = () => (
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
    <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H10l2 2h6.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z" />
  </svg>
);

const CheckCircleIcon = () => (
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
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.3 2.3 4.8-5" />
  </svg>
);

const ClipboardIcon = () => (
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
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4.5V3h6v1.5" />
    <path d="M9 10h6M9 14h6M9 18h3" />
  </svg>
);

const ClockIcon = () => (
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
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const LightningIcon = () => (
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
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </svg>
);

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Illustrative trend shape
const trendData = [
  { day: "Week 1", completed: 20, inProgress: 14, todo: 8 },
  { day: "Week 2", completed: 34, inProgress: 18, todo: 10 },
  { day: "Week 3", completed: 48, inProgress: 22, todo: 9 },
  { day: "Week 4", completed: 62, inProgress: 20, todo: 7 },
];

const productivityData = [
  { period: "Week 1", value: 62 },
  { period: "Week 2", value: 75 },
  { period: "Week 3", value: 68 },
  { period: "Week 4", value: 80 },
];

export default function ReportsPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: projectData } = await api.get("/projects");
        setProjects(projectData);

        const results = await Promise.all(
          projectData.map((p) =>
            api
              .get(`/tasks/project/${p._id}`)
              .then((r) => ({ project: p, tasks: r.data }))
          )
        );

        const flat = results.flatMap(({ project, tasks }) =>
          tasks.map((t) => ({
            ...t,
            projectName: project.name,
            projectId: project._id,
          }))
        );

        setTasks(flat);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totals = useMemo(() => {
    const now = new Date();

    return {
      total: tasks.length,
      done: tasks.filter((t) => t.status === "Done").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      todo: tasks.filter((t) => t.status === "To Do").length,
      overdue: tasks.filter(
        (t) =>
          t.dueDate &&
          new Date(t.dueDate) < now &&
          t.status !== "Done"
      ).length,
    };
  }, [tasks]);

  const efficiency =
    totals.total > 0
      ? Math.round((totals.done / totals.total) * 100)
      : 0;

  const topProjects = useMemo(() => {
    return projects
      .map((p) => {
        const pTasks = tasks.filter((t) => t.projectId === p._id);

        const percent =
          pTasks.length > 0
            ? Math.round(
                (pTasks.filter((t) => t.status === "Done").length /
                  pTasks.length) *
                  100
              )
            : 0;

        return { ...p, percent };
      })
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 5);
  }, [projects, tasks]);

  const teamPerformance = useMemo(() => {
    const map = new Map();

    tasks.forEach((t) => {
      (t.assignees || []).forEach((a) => {
        if (!map.has(a._id)) {
          map.set(a._id, {
            ...a,
            total: 0,
            done: 0,
          });
        }

        const entry = map.get(a._id);

        entry.total += 1;

        if (t.status === "Done") {
          entry.done += 1;
        }
      });
    });

    return Array.from(map.values())
      .map((m) => ({
        ...m,
        percent:
          m.total > 0
            ? Math.round((m.done / m.total) * 100)
            : 0,
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 4);
  }, [tasks]);

  const statusSegments =
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
                <h1 className="text-2xl font-extrabold text-gray-900">
                  Reports
                </h1>

                <p className="text-sm text-gray-500">
                  Track performance, analyze productivity and make
                  data-driven decisions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  icon: <FolderIcon />,
                  bg: "bg-indigo-50",
                  color: "text-primary",
                  label: "Total Projects",
                  value: projects.length,
                },
                {
                  icon: <CheckCircleIcon />,
                  bg: "bg-emerald-50",
                  color: "text-emerald-600",
                  label: "Tasks Completed",
                  value: totals.done,
                },
                {
                  icon: <ClipboardIcon />,
                  bg: "bg-blue-50",
                  color: "text-blue-600",
                  label: "Total Tasks",
                  value: totals.total,
                },
                {
                  icon: <ClockIcon />,
                  bg: "bg-red-50",
                  color: "text-red-500",
                  label: "Overdue Tasks",
                  value: totals.overdue,
                },
                {
                  icon: <LightningIcon />,
                  bg: "bg-pink-50",
                  color: "text-pink-600",
                  label: "Team Efficiency",
                  value: `${efficiency}%`,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white rounded-2xl border border-gray-100 p-4 card-lift"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`w-9 h-9 rounded-lg ${s.bg} ${s.color} flex items-center justify-center`}
                    >
                      {s.icon}
                    </span>

                    <p className="text-xs text-gray-500">
                      {s.label}
                    </p>
                  </div>

                  <p className="text-2xl font-extrabold text-gray-900">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">
                  Tasks Overview
                </h2>

                <span className="text-xs text-gray-400">
                  Last 4 weeks (illustrative trend)
                </span>
              </div>

              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient
                        id="completedGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#4F46E5"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4F46E5"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F1F5F9"
                    />

                    <XAxis
                      dataKey="day"
                      tick={{
                        fontSize: 12,
                        fill: "#9CA3AF",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fontSize: 12,
                        fill: "#9CA3AF",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E5E7EB",
                        fontSize: 12,
                      }}
                    />

                    <Legend wrapperStyle={{ fontSize: 12 }} />

                    <Area
                      type="monotone"
                      dataKey="completed"
                      name="Completed"
                      stroke="#4F46E5"
                      fill="url(#completedGrad)"
                      strokeWidth={2.5}
                    />

                    <Area
                      type="monotone"
                      dataKey="inProgress"
                      name="In Progress"
                      stroke="#F59E0B"
                      fill="transparent"
                      strokeWidth={2}
                    />

                    <Area
                      type="monotone"
                      dataKey="todo"
                      name="To Do"
                      stroke="#10B981"
                      fill="transparent"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-bold text-gray-900 mb-4">
                  Tasks by Status
                </h2>

                <div className="flex items-center gap-6">
                  <ConicDonut
                    segments={statusSegments}
                    centerLabel={totals.total}
                    centerSub="Total Tasks"
                  />

                  <ul className="space-y-2 text-sm flex-1">
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
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="flex items-center gap-2 text-gray-600">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${r.color}`}
                          />

                          {r.label}
                        </span>

                        <span className="font-semibold text-gray-800">
                          {r.value}{" "}
                          {totals.total > 0 &&
                            `(${Math.round(
                              (r.value / totals.total) * 100
                            )}%)`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">
                    Productivity Trend
                  </h2>

                  <span className="text-xs text-gray-400">
                    Illustrative
                  </span>
                </div>

                <div style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer>
                    <BarChart data={productivityData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#F1F5F9"
                      />

                      <XAxis
                        dataKey="period"
                        tick={{
                          fontSize: 11,
                          fill: "#9CA3AF",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fontSize: 11,
                          fill: "#9CA3AF",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #E5E7EB",
                          fontSize: 12,
                        }}
                      />

                      <Bar
                        dataKey="value"
                        fill="#4F46E5"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Average productivity:{" "}
                  <span className="font-semibold text-gray-700">
                    {Math.round(
                      productivityData.reduce(
                        (a, b) => a + b.value,
                        0
                      ) / productivityData.length
                    )}
                    %
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">
                Top Projects
              </h2>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-10 rounded-lg shimmer"
                    />
                  ))}
                </div>
              ) : topProjects.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No projects yet.
                </p>
              ) : (
                <ul className="space-y-4">
                  {topProjects.map((p, i) => (
                    <li
                      key={p._id}
                      className="flex items-center gap-3"
                    >
                      <span
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          projectTagPalette[
                            i % projectTagPalette.length
                          ]
                        }`}
                      >
                        <FolderIcon />
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {p.name}
                        </p>

                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: p.percent + "%",
                            }}
                          />
                        </div>
                      </div>

                      <span className="text-xs font-semibold text-gray-500 flex-shrink-0">
                        {p.percent}%
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">
                Team Performance
              </h2>

              {teamPerformance.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No assigned tasks yet.
                </p>
              ) : (
                <ul className="space-y-4">
                  {teamPerformance.map((m, i) => (
                    <li key={m._id}>
                      <div className="flex items-center gap-3 mb-1.5">
                        <span
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                            avatarColors[
                              i % avatarColors.length
                            ]
                          } text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}
                        >
                          {initials(m.name)}
                        </span>

                        <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                          {m.name}
                        </span>

                        <span className="text-xs font-semibold text-gray-500">
                          {m.percent}%
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden ml-11">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: m.percent + "%",
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <footer className="text-center text-xs text-gray-400 py-6">
          © 2026 PM Tool. All rights reserved.
        </footer>
      </div>
    </div>
  );
}