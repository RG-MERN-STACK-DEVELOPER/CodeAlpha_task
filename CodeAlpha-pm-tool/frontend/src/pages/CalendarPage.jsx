import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarCheck2,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Mail,
  Users,
  UserRound,
  CheckCircle2,
  Clock3,
  Link2,
} from "lucide-react";

import Sidebar from "../components/Sidebar.jsx";
import AppTopbar from "../components/AppTopbar.jsx";
import AddTaskModal from "../components/AddTaskModal.jsx";
import api from "../api/axios";

const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chipPalette = [
  "bg-blue-50 text-blue-600 border-blue-100",
  "bg-amber-50 text-amber-600 border-amber-100",
  "bg-purple-50 text-purple-600 border-purple-100",
  "bg-emerald-50 text-emerald-600 border-emerald-100",
  "bg-pink-50 text-pink-600 border-pink-100",
  "bg-indigo-50 text-indigo-600 border-indigo-100",
];

const teamAvailability = [
  {
    name: "Sarah Johnson",
    role: "UI/UX Designer",
    status: "Available",
    color: "from-pink-400 to-rose-500",
  },
  {
    name: "Ali Hassan",
    role: "Frontend Developer",
    status: "Available",
    color: "from-blue-400 to-indigo-500",
  },
  {
    name: "John Smith",
    role: "Backend Developer",
    status: "In a meeting",
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "Fatima Khan",
    role: "QA Engineer",
    status: "Available",
    color: "from-emerald-400 to-teal-500",
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

function sameDay(dateStr, y, m, d) {
  const dt = new Date(dateStr);

  return (
    dt.getFullYear() === y &&
    dt.getMonth() === m &&
    dt.getDate() === d
  );
}

export default function CalendarPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());
  const [showAddTask, setShowAddTask] = useState(false);

  const today = new Date();

  const loadAll = async () => {
    setLoading(true);

    try {
      const { data: projectData } = await api.get("/projects");

      setProjects(projectData);

      const results = await Promise.all(
        projectData.map((p) =>
          api
            .get(`/tasks/project/${p._id}`)
            .then((r) => ({
              project: p,
              tasks: r.data,
            }))
        )
      );

      const flat = results
        .flatMap(({ project, tasks }) =>
          tasks.map((t) => ({
            ...t,
            projectName: project.name,
            projectId: project._id,
          }))
        )
        .filter((t) => !!t.dueDate);

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

  const projectColor = (projectId) => {
    const idx = projects.findIndex(
      (p) => p._id === projectId
    );

    return (
      chipPalette[idx % chipPalette.length] ||
      chipPalette[0]
    );
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayIndex = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const daysInPrevMonth = new Date(
    year,
    month,
    0
  ).getDate();

  const cells = [];

  // Previous month days
  for (
    let i = firstDayIndex - 1;
    i >= 0;
    i--
  ) {
    cells.push({
      day: daysInPrevMonth - i,
      muted: true,
    });
  }

  // Current month days
  for (
    let d = 1;
    d <= daysInMonth;
    d++
  ) {
    cells.push({
      day: d,
      muted: false,
      isToday:
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear(),

      events: tasks.filter((t) =>
        sameDay(t.dueDate, year, month, d)
      ),
    });
  }

  // Next month days
  while (cells.length % 7 !== 0) {
    cells.push({
      day:
        cells.length -
        (firstDayIndex + daysInMonth) +
        1,
      muted: true,
    });
  }

  const upcomingEvents = useMemo(() => {
    const now = new Date();

    now.setHours(0, 0, 0, 0);

    return tasks
      .filter(
        (t) => new Date(t.dueDate) >= now
      )
      .sort(
        (a, b) =>
          new Date(a.dueDate) -
          new Date(b.dueDate)
      )
      .slice(0, 4);
  }, [tasks]);

  const goPrev = () => {
    setViewDate(
      new Date(year, month - 1, 1)
    );
  };

  const goNext = () => {
    setViewDate(
      new Date(year, month + 1, 1)
    );
  };

  const goToday = () => {
    setViewDate(new Date());
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <AppTopbar />

        <div className="p-6 grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* =========================
              MAIN CALENDAR
          ========================= */}

          <div className="xl:col-span-3 space-y-6">

            {/* PAGE HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">
                  Calendar
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Plan your schedule and never miss an important deadline.
                </p>
              </div>

              <div className="flex items-center gap-2">

                {/* TODAY */}
                <button
                  onClick={goToday}
                  className="inline-flex items-center gap-2 text-sm border border-gray-200 bg-white px-3 py-2 rounded-lg text-gray-600 hover:bg-surface transition-colors"
                >
                  <CalendarCheck2 size={16} />
                  Today
                </button>

                {/* PREVIOUS MONTH */}
                <button
                  onClick={goPrev}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-surface transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* NEXT MONTH */}
                <button
                  onClick={goNext}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-surface transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight size={18} />
                </button>

                {/* MONTH */}
                <span className="text-sm font-semibold text-gray-700 px-2 whitespace-nowrap">
                  {monthNames[month]} {year}
                </span>

                {/* ADD EVENT */}
                <button
                  onClick={() =>
                    setShowAddTask(true)
                  }
                  disabled={!projects.length}
                  className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
                >
                  <CalendarPlus size={17} />
                  Add Event
                </button>
              </div>
            </div>

            {/* CALENDAR */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 overflow-x-auto">

              {loading ? (
                <div className="h-96 rounded-xl shimmer" />
              ) : (
                <div className="min-w-[700px]">

                  {/* WEEK DAYS */}
                  <div className="grid grid-cols-7 mb-2">

                    {weekDays.map((d) => (
                      <div
                        key={d}
                        className="text-center text-xs font-semibold text-gray-400 py-2"
                      >
                        {d}
                      </div>
                    ))}

                  </div>

                  {/* CALENDAR CELLS */}
                  <div className="grid grid-cols-7 gap-2">

                    {cells.map((c, i) => (
                      <div
                        key={i}
                        className={`min-h-[100px] rounded-xl p-2 border transition-colors ${
                          c.isToday
                            ? "border-primary bg-indigo-50/40"
                            : c.muted
                            ? "border-transparent"
                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                        }`}
                      >

                        {/* DATE */}
                        <p
                          className={`text-sm mb-1.5 ${
                            c.isToday
                              ? "font-bold text-primary"
                              : c.muted
                              ? "text-gray-300"
                              : "font-semibold text-gray-700"
                          }`}
                        >
                          {c.day}
                        </p>

                        {/* EVENTS */}
                        {!c.muted && (
                          <div className="space-y-1">

                            {(c.events || [])
                              .slice(0, 2)
                              .map((e) => (
                                <div
                                  key={e._id}
                                  title={e.title}
                                  className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-1 rounded-md border truncate ${projectColor(
                                    e.projectId
                                  )}`}
                                >
                                  <CalendarDays
                                    size={10}
                                    className="flex-shrink-0"
                                  />

                                  <span className="truncate">
                                    {e.title}
                                  </span>
                                </div>
                              ))}

                            {(c.events || []).length >
                              2 && (
                              <p className="text-[10px] text-gray-400 pl-1">
                                +
                                {c.events.length - 2}{" "}
                                more
                              </p>
                            )}

                          </div>
                        )}
                      </div>
                    ))}

                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =========================
              RIGHT SIDEBAR
          ========================= */}

          <div className="space-y-6">

            {/* UPCOMING EVENTS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">

              <div className="flex items-center justify-between mb-4">

                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-50 text-primary flex items-center justify-center">
                    <CalendarDays size={16} />
                  </span>

                  <h2 className="font-bold text-gray-900">
                    Upcoming Events
                  </h2>
                </div>

                <span className="text-sm text-primary font-medium cursor-pointer hover:underline">
                  View all →
                </span>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="text-center py-6">

                  <CalendarDays
                    size={30}
                    className="mx-auto text-gray-300 mb-2"
                  />

                  <p className="text-sm text-gray-400">
                    No upcoming due dates.
                  </p>

                </div>
              ) : (
                <ul className="space-y-3">

                  {upcomingEvents.map((e) => (
                    <li
                      key={e._id}
                      className="flex items-center gap-3"
                    >

                      {/* EVENT ICON */}
                      <span
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${projectColor(
                          e.projectId
                        )}`}
                      >
                        <CalendarDays size={16} />
                      </span>

                      {/* EVENT DETAILS */}
                      <div className="flex-1 min-w-0">

                        <p className="text-sm font-medium text-gray-800 truncate">
                          {e.title}
                        </p>

                        <p className="text-xs text-gray-400 truncate">
                          {e.projectName}
                        </p>

                      </div>

                      {/* DATE */}
                      <span className="text-xs text-primary font-medium flex-shrink-0">
                        {new Date(
                          e.dueDate
                        ).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>

                    </li>
                  ))}

                </ul>
              )}
            </div>

            {/* TEAM AVAILABILITY */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">

              <div className="flex items-center justify-between mb-4">

                <div className="flex items-center gap-2">

                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users size={16} />
                  </span>

                  <h2 className="font-bold text-gray-900">
                    Team Availability
                  </h2>

                </div>

                <span className="text-sm text-primary font-medium cursor-pointer hover:underline">
                  View all →
                </span>

              </div>

              <ul className="space-y-3">

                {teamAvailability.map((m) => (
                  <li
                    key={m.name}
                    className="flex items-center gap-3"
                  >

                    {/* AVATAR */}
                    <span
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${m.color} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}
                    >
                      {initials(m.name)}
                    </span>

                    {/* MEMBER */}
                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-medium text-gray-800 truncate">
                        {m.name}
                      </p>

                      <p className="text-xs text-gray-400 truncate">
                        {m.role}
                      </p>

                    </div>

                    {/* STATUS */}
                    <span
                      className={`text-xs font-medium flex-shrink-0 flex items-center gap-1 ${
                        m.status === "Available"
                          ? "text-emerald-500"
                          : "text-amber-500"
                      }`}
                    >

                      {m.status === "Available" ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <Clock3 size={13} />
                      )}

                      {m.status}
                    </span>

                  </li>
                ))}

              </ul>
            </div>

            {/* CALENDAR SYNC */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">

              <div className="flex items-center gap-2 mb-2">

                <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Link2 size={16} />
                </span>

                <h2 className="font-bold text-gray-900">
                  Calendar Sync
                </h2>

              </div>

              <p className="text-xs text-gray-500 mb-4">
                Connect your calendar and stay in sync with your team.
              </p>

              {/* CALENDAR SERVICES */}
              <div className="flex items-center gap-2 mb-4">

                <span className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-gray-500">
                  <CalendarDays size={17} />
                </span>

                <span className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-gray-500">
                  <Mail size={17} />
                </span>

                <span className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-gray-500">
                  <Users size={17} />
                </span>

              </div>

              {/* CONNECT BUTTON */}
              <button className="w-full inline-flex items-center justify-center gap-2 border border-primary text-primary text-sm font-semibold py-2.5 rounded-lg hover:bg-indigo-50 transition-colors">
                <Link2 size={15} />
                Connect Calendar
              </button>

            </div>

          </div>
        </div>

        {/* FOOTER */}
        <footer className="text-center text-xs text-gray-400 py-6">
          © 2026 PM Tool. All rights reserved.
        </footer>
      </div>

      {/* ADD TASK MODAL */}
      {showAddTask && (
        <AddTaskModal
          projects={projects}
          onClose={() =>
            setShowAddTask(false)
          }
          onCreated={() => loadAll()}
        />
      )}
    </div>
  );
}