import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Crown,
  FolderKanban,
  BarChart3,
  Search,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Upload,
  MessageSquare,
  CheckCircle2,
  UserRound,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar.jsx";
import AppTopbar from "../components/AppTopbar.jsx";
import ConicDonut from "../components/ConicDonut.jsx";
import TeamAddMemberModal from "../components/TeamAddMemberModal.jsx";
import api from "../api/axios";

const PAGE_SIZE = 8;

const avatarColors = [
  "from-pink-400 to-rose-500",
  "from-blue-400 to-indigo-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-purple-400 to-fuchsia-500",
  "from-cyan-400 to-blue-500",
];

const teamActivity = [
  {
    who: "Developer",
    action: "completed a task",
    target: "API Integration",
    time: "2h ago",
    icon: CheckCircle2,
  },
  {
    who: "Sarah Johnson",
    action: "uploaded a file",
    target: "Design System",
    time: "4h ago",
    icon: Upload,
  },
  {
    who: "John Smith",
    action: "commented on",
    target: "Mobile App Design",
    time: "6h ago",
    icon: MessageSquare,
  },
  {
    who: "Fatima Khan",
    action: "completed a task",
    target: "Unit Testing",
    time: "1d ago",
    icon: CheckCircle2,
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

export default function TeamPage() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadProjects = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const members = useMemo(() => {
    const map = new Map();

    projects.forEach((p) => {
      const ownerId = p.owner?._id;

      (p.members || []).forEach((m) => {
        if (!map.has(m._id)) {
          map.set(m._id, {
            ...m,
            projectCount: 0,
            isOwnerOfAny: false,
          });
        }

        const entry = map.get(m._id);

        entry.projectCount += 1;

        if (m._id === ownerId) {
          entry.isOwnerOfAny = true;
        }
      });

      if (ownerId && !map.has(ownerId) && p.owner) {
        map.set(ownerId, {
          ...p.owner,
          projectCount: 1,
          isOwnerOfAny: true,
        });
      }
    });

    return Array.from(map.values());
  }, [projects]);

  const filtered = members.filter((m) => {
    const name = m.name?.toLowerCase() || "";
    const email = m.email?.toLowerCase() || "";
    const query = search.toLowerCase();

    return name.includes(query) || email.includes(query);
  });

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
  }, [search]);

  const ownerCount = members.filter(
    (m) => m.isOwnerOfAny
  ).length;

  const memberCount = members.length - ownerCount;

  const avgPerProject =
    projects.length > 0
      ? (members.length / projects.length).toFixed(1)
      : 0;

  const ownedProjects = projects.filter(
    (p) =>
      p.owner?._id === user?.id ||
      p.owner?.id === user?.id
  );

  const overviewSegments =
    members.length > 0
      ? [
          {
            percent: (ownerCount / members.length) * 100,
            color: "#4F46E5",
          },
          {
            percent: (memberCount / members.length) * 100,
            color: "#10B981",
          },
        ]
      : [
          {
            percent: 100,
            color: "#E5E7EB",
          },
        ];

  const stats = [
    {
      icon: Users,
      bg: "bg-indigo-50",
      color: "text-primary",
      label: "Total Members",
      value: members.length,
    },
    {
      icon: Crown,
      bg: "bg-amber-50",
      color: "text-amber-600",
      label: "Project Owners",
      value: ownerCount,
    },
    {
      icon: FolderKanban,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
      label: "Total Projects",
      value: projects.length,
    },
    {
      icon: BarChart3,
      bg: "bg-pink-50",
      color: "text-pink-600",
      label: "Avg. Members/Project",
      value: avgPerProject,
    },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <AppTopbar />

        <div className="p-6 grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* LEFT CONTENT */}
          <div className="xl:col-span-3 space-y-6">

            {/* HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">
                  Team Members
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Everyone collaborating across your projects.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all hover:scale-105"
              >
                <UserPlus size={17} strokeWidth={2.2} />
                Add Member
              </button>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => {
                const Icon = s.icon;

                return (
                  <div
                    key={s.label}
                    className="bg-white rounded-2xl border border-gray-100 p-4 card-lift"
                  >
                    <div className="flex items-center gap-3 mb-3">

                      <span
                        className={`w-10 h-10 rounded-lg ${s.bg} ${s.color} flex items-center justify-center`}
                      >
                        <Icon size={19} strokeWidth={2} />
                      </span>

                      <p className="text-xs text-gray-500">
                        {s.label}
                      </p>
                    </div>

                    <p className="text-2xl font-extrabold text-gray-900">
                      {s.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* MEMBERS TABLE */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">

              {/* SEARCH */}
              <div className="mb-4">
                <div className="relative max-w-xs">

                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    placeholder="Search members..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="w-full bg-surface border border-gray-100 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* LOADING */}
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-14 rounded-lg shimmer"
                    />
                  ))}
                </div>
              ) : paginated.length === 0 ? (
                <div className="text-center py-10">
                  <Users
                    size={32}
                    className="mx-auto text-gray-300 mb-2"
                  />

                  <p className="text-sm text-gray-400">
                    No members found.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">

                      <thead>
                        <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                          <th className="pb-2 pr-3 font-medium">
                            Member
                          </th>

                          <th className="pb-2 px-3 font-medium">
                            Role
                          </th>

                          <th className="pb-2 pl-3 font-medium">
                            Projects
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginated.map((m, i) => (
                          <tr
                            key={m._id}
                            className="border-b border-gray-50 hover:bg-surface/60 transition-colors"
                          >
                            {/* MEMBER */}
                            <td className="py-3 pr-3">
                              <div className="flex items-center gap-3">

                                <span
                                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${
                                    avatarColors[
                                      i % avatarColors.length
                                    ]
                                  } text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}
                                >
                                  {initials(m.name)}
                                </span>

                                <div className="min-w-0">

                                  <p className="font-medium text-gray-800 truncate flex items-center gap-1.5">
                                    {m.name}

                                    {m._id === user?.id && (
                                      <span className="text-[10px] bg-indigo-50 text-primary px-1.5 py-0.5 rounded-full">
                                        You
                                      </span>
                                    )}
                                  </p>

                                  <p className="text-xs text-gray-400 truncate">
                                    {m.email}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* ROLE */}
                            <td className="px-3">
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                                  m.isOwnerOfAny
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-indigo-50 text-primary"
                                }`}
                              >
                                {m.isOwnerOfAny ? (
                                  <>
                                    <Crown size={12} />
                                    Owner
                                  </>
                                ) : (
                                  <>
                                    <UserRound size={12} />
                                    Member
                                  </>
                                )}
                              </span>
                            </td>

                            {/* PROJECT COUNT */}
                            <td className="pl-3 text-gray-600">
                              {m.projectCount}
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
                      {(page - 1) * PAGE_SIZE + 1}
                      –
                      {Math.min(
                        page * PAGE_SIZE,
                        filtered.length
                      )}{" "}
                      of {filtered.length} members
                    </p>

                    <div className="flex items-center gap-1">

                      <button
                        onClick={() =>
                          setPage((p) =>
                            Math.max(1, p - 1)
                          )
                        }
                        disabled={page === 1}
                        className="w-8 h-8 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-surface flex items-center justify-center"
                      >
                        <ChevronLeft size={16} />
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
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            {/* TEAM OVERVIEW */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">

              <h2 className="font-bold text-gray-900 mb-4">
                Team Overview
              </h2>

              <div className="flex flex-col items-center">
                <ConicDonut
                  segments={overviewSegments}
                  centerLabel={members.length}
                  centerSub="Total Members"
                  size={140}
                />
              </div>

              <ul className="space-y-2 mt-4 text-sm">

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    Owners
                  </span>

                  <span className="font-semibold text-gray-800">
                    {ownerCount}
                  </span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Members
                  </span>

                  <span className="font-semibold text-gray-800">
                    {memberCount}
                  </span>
                </li>

              </ul>
            </div>

            {/* TEAM ACTIVITY */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">

              <div className="flex items-center justify-between mb-4">

                <h2 className="font-bold text-gray-900">
                  Team Activity
                </h2>

                <span className="text-sm text-primary font-medium cursor-pointer hover:underline">
                  View all →
                </span>
              </div>

              <ul className="space-y-4">

                {teamActivity.map((a, i) => {
                  const ActivityIcon = a.icon;

                  return (
                    <li
                      key={i}
                      className="flex items-start gap-3"
                    >

                      <span
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                          avatarColors[
                            i % avatarColors.length
                          ]
                        } text-white flex items-center justify-center flex-shrink-0`}
                      >
                        <ActivityIcon
                          size={14}
                          strokeWidth={2}
                        />
                      </span>

                      <div className="flex-1 min-w-0">

                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">
                            {a.who}
                          </span>{" "}
                          {a.action}{" "}
                          <span className="font-semibold text-gray-900">
                            {a.target}
                          </span>
                        </p>
                      </div>

                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {a.time}
                      </span>
                    </li>
                  );
                })}

              </ul>
            </div>

            {/* GROW TEAM CARD */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-5 text-white">

              <div className="relative z-10">

                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                  <UserPlus size={20} />
                </div>

                <p className="font-bold mb-1">
                  Grow your team
                </p>

                <p className="text-xs text-indigo-100/80 mb-4">
                  Invite your team members and collaborate effectively.
                </p>

                <button
                  onClick={() =>
                    setShowAddModal(true)
                  }
                  className="inline-flex items-center gap-2 bg-white text-primary text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Invite Now
                  <ArrowRight size={14} />
                </button>
              </div>

              <Users
                size={100}
                strokeWidth={1}
                className="absolute -bottom-5 -right-4 text-white opacity-10"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="text-center text-xs text-gray-400 py-6">
          © 2026 PM Tool. All rights reserved.
        </footer>
      </div>

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <TeamAddMemberModal
          ownedProjects={ownedProjects}
          onClose={() =>
            setShowAddModal(false)
          }
          onAdded={() => loadProjects()}
        />
      )}
    </div>
  );
}