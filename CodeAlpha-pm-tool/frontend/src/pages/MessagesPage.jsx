import { useState } from "react";
import {
  Search,
  Users,
  Pin,
  Phone,
  Video,
  Star,
  Paperclip,
  Smile,
  Send,
  Download,
  Mail,
  MoreHorizontal,
  Palette,
  Package,
  FileText,
} from "lucide-react";

import Sidebar from "../components/Sidebar.jsx";
import AppTopbar from "../components/AppTopbar.jsx";

const conversations = [
  {
    id: 1,
    name: "Developer",
    role: "Frontend Developer",
    avatarColor: "from-blue-400 to-indigo-500",
    online: true,
    time: "10:30 AM",
    preview: "Please review the updated design file and let me know...",
    unread: 2,
    pinned: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "UI/UX Designer",
    avatarColor: "from-pink-400 to-rose-500",
    online: true,
    time: "9:45 AM",
    preview: "The homepage design is ready for your review.",
    unread: 1,
  },
  {
    id: 3,
    name: "Design Team",
    isGroup: true,
    avatarColor: "from-purple-400 to-fuchsia-500",
    time: "Yesterday",
    preview: "John: Don't forget our meeting at 3 PM today.",
    unread: 3,
  },
  {
    id: 4,
    name: "John Smith",
    role: "Backend Developer",
    avatarColor: "from-amber-400 to-orange-500",
    time: "Yesterday",
    preview: "Great work on the latest update! Let's discuss next steps.",
  },
  {
    id: 5,
    name: "Project Updates",
    isGroup: true,
    avatarColor: "from-amber-300 to-yellow-500",
    time: "May 18",
    preview: "Project deadline has been updated to May 30.",
    unread: 2,
  },
  {
    id: 6,
    name: "Fatima Khan",
    role: "QA Engineer",
    avatarColor: "from-emerald-400 to-teal-500",
    time: "May 17",
    preview: "Can we reschedule the meeting for tomorrow?",
  },
];

const initialMessages = [
  {
    from: "them",
    text: "Hey Rukhsana! 👋",
    time: "10:28 AM",
  },
  {
    from: "them",
    text: "Please review the updated design file and let me know your feedback.",
    time: "10:29 AM",
  },
  {
    from: "me",
    text: "Hi  Sure, I'll check it out right away.",
    time: "10:30 AM",
  },
  {
    from: "them",
    file: {
      name: "Landing_Page_Design.fig",
      size: "24.5 MB",
      icon: Palette,
    },
    time: "10:30 AM",
  },
  {
    from: "them",
    text: "Thanks! Also, please check the new components I added.",
    time: "10:31 AM",
  },
  {
    from: "me",
    text: "Looks great! The new components will improve the user experience. 🚀",
    time: "10:32 AM",
  },
  {
    from: "them",
    text: "Awesome! Let me know if you have any suggestions.",
    time: "10:33 AM",
    reaction: "👍",
  },
];

const sharedFiles = [
  {
    name: "Landing_Page_Design.fig",
    meta: "Figma File · 24.5 MB",
    icon: Palette,
  },
  {
    name: "UI_Components.zip",
    meta: "ZIP · 12.8 MB",
    icon: Package,
  },
  {
    name: "Design_System.pdf",
    meta: "PDF · 3.2 MB",
    icon: FileText,
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

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(1);
  const [tab, setTab] = useState("All");
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [muted, setMuted] = useState(false);

  const active = conversations.find((c) => c.id === activeId);

  const unreadTotal = conversations.reduce(
    (sum, c) => sum + (c.unread || 0),
    0
  );

  const handleSend = (e) => {
    e.preventDefault();

    if (!draft.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        from: "me",
        text: draft,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setDraft("");
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        <AppTopbar />

        <div className="p-6 pb-3">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Messages
              </h1>

              <p className="text-sm text-gray-500">
                Communicate with your team and keep everything in one place.
              </p>
            </div>

            <button className="bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all hover:scale-105">
              + New Message
            </button>
          </div>
        </div>

        <div className="flex-1 px-6 pb-6 grid grid-cols-1 lg:grid-cols-[320px_1fr_300px] gap-4 min-h-0">

          {/* Conversations */}
          <div className="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">

            <div className="p-3 border-b border-gray-100">

              <div className="relative mb-3">

                <Search
                  size={16}
                  strokeWidth={1.8}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  placeholder="Search messages..."
                  className="w-full bg-surface border border-gray-100 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-gray-400 overflow-x-auto">

                {[
                  {
                    label: "All",
                    count: conversations.length,
                  },
                  {
                    label: "Unread",
                    count: unreadTotal,
                  },
                  {
                    label: "Starred",
                    count: 0,
                  },
                  {
                    label: "Archived",
                    count: 0,
                  },
                ].map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setTab(t.label)}
                    className={`pb-2 border-b-2 whitespace-nowrap flex items-center gap-1 ${
                      tab === t.label
                        ? "text-primary border-primary"
                        : "border-transparent hover:text-gray-600"
                    }`}
                  >
                    {t.label}

                    <span className="text-[10px]">
                      {t.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">

              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full flex items-start gap-3 p-3 text-left border-l-2 transition-colors ${
                    activeId === c.id
                      ? "bg-indigo-50/60 border-primary"
                      : "border-transparent hover:bg-surface"
                  }`}
                >

                  <div className="relative flex-shrink-0">

                    <span
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.avatarColor} text-white text-xs font-bold flex items-center justify-center`}
                    >
                      {c.isGroup ? (
                        <Users size={17} strokeWidth={1.8} />
                      ) : (
                        initials(c.name)
                      )}
                    </span>

                    {c.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center justify-between gap-2">

                      <p className="text-sm font-semibold text-gray-800 truncate flex items-center gap-1">

                        {c.name}

                        {c.pinned && (
                          <Pin
                            size={12}
                            strokeWidth={1.8}
                            className="text-gray-300"
                          />
                        )}
                      </p>

                      <span className="text-[10px] text-gray-400 flex-shrink-0">
                        {c.time}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 truncate">
                      {c.preview}
                    </p>
                  </div>

                  {c.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-1">
                      {c.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Chat */}
          <div className="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">

            <div className="flex items-center justify-between p-4 border-b border-gray-100">

              <div className="flex items-center gap-3">

                <span
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${active.avatarColor} text-white text-xs font-bold flex items-center justify-center`}
                >
                  {active.isGroup ? (
                    <Users size={17} strokeWidth={1.8} />
                  ) : (
                    initials(active.name)
                  )}
                </span>

                <div>

                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">

                    {active.name}

                    {active.online && (
                      <span className="text-[10px] text-emerald-500 font-medium">
                        ● Online
                      </span>
                    )}
                  </p>

                  <p className="text-xs text-gray-400">
                    {active.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-400">

                <button className="w-9 h-9 rounded-lg hover:bg-surface flex items-center justify-center">
                  <Phone size={17} strokeWidth={1.8} />
                </button>

                <button className="w-9 h-9 rounded-lg hover:bg-surface flex items-center justify-center">
                  <Video size={17} strokeWidth={1.8} />
                </button>

                <button className="w-9 h-9 rounded-lg hover:bg-surface flex items-center justify-center">
                  <Star size={17} strokeWidth={1.8} />
                </button>

              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">

              <p className="text-center text-xs text-gray-400">
                Today
              </p>

              {messages.map((m, i) => (

                <div
                  key={i}
                  className={`flex ${
                    m.from === "me"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  {m.file ? (

                    <div className="bg-surface border border-gray-100 rounded-xl p-3 flex items-center gap-3 max-w-xs">

                      <span className="text-gray-500">
                        <m.file.icon size={20} strokeWidth={1.8} />
                      </span>

                      <div className="min-w-0">

                        <p className="text-sm font-medium text-gray-800 truncate">
                          {m.file.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {m.file.size}
                        </p>
                      </div>

                      <Download
                        size={16}
                        strokeWidth={1.8}
                        className="text-gray-400 ml-auto"
                      />

                    </div>

                  ) : (

                    <div
                      className={`max-w-xs sm:max-w-sm rounded-2xl px-4 py-2.5 text-sm ${
                        m.from === "me"
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-surface text-gray-700 rounded-bl-sm"
                      }`}
                    >
                      {m.text}

                      {m.reaction && (
                        <span className="ml-1">
                          {m.reaction}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 p-3 border-t border-gray-100"
            >

              <button
                type="button"
                className="w-9 h-9 rounded-lg hover:bg-surface flex items-center justify-center text-gray-400 flex-shrink-0"
              >
                <Paperclip size={17} strokeWidth={1.8} />
              </button>

              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-surface border border-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="button"
                className="w-9 h-9 rounded-lg hover:bg-surface flex items-center justify-center text-gray-400 flex-shrink-0"
              >
                <Smile size={18} strokeWidth={1.8} />
              </button>

              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 hover:bg-indigo-700 transition-colors"
              >
                <Send size={17} strokeWidth={1.8} />
              </button>

            </form>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:flex flex-col gap-4 overflow-y-auto">

            {/* Profile */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">

              <span
                className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${active.avatarColor} text-white text-lg font-bold flex items-center justify-center mb-3`}
              >
                {active.isGroup ? (
                  <Users size={24} strokeWidth={1.8} />
                ) : (
                  initials(active.name)
                )}
              </span>

              <p className="font-bold text-gray-900">
                {active.name}
              </p>

              <p className="text-xs text-gray-400 mb-2">
                {active.role}
              </p>

              {active.online && (
                <p className="text-xs text-emerald-500 font-medium mb-4">
                  ● Online
                </p>
              )}

              <div className="grid grid-cols-4 gap-2">

                {[
                  { icon: Phone, label: "Call" },
                  { icon: Video, label: "Video" },
                  { icon: Mail, label: "Email" },
                  { icon: MoreHorizontal, label: "More" },
                ].map((a) => {

                  const Icon = a.icon;

                  return (
                    <div
                      key={a.label}
                      className="flex flex-col items-center gap-1"
                    >
                      <span className="w-9 h-9 rounded-lg border border-gray-100 flex items-center justify-center text-sm text-primary">
                        <Icon size={16} strokeWidth={1.8} />
                      </span>

                      <span className="text-[10px] text-gray-500">
                        {a.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shared Files */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">

              <div className="flex items-center justify-between mb-3">

                <h3 className="text-sm font-bold text-gray-900">
                  Shared Files
                </h3>

                <span className="text-xs text-primary font-medium cursor-pointer">
                  View all
                </span>
              </div>

              <ul className="space-y-2.5">

                {sharedFiles.map((f) => {

                  const Icon = f.icon;

                  return (
                    <li
                      key={f.name}
                      className="flex items-center gap-2.5"
                    >

                      <span className="text-gray-500">
                        <Icon size={18} strokeWidth={1.8} />
                      </span>

                      <div className="min-w-0 flex-1">

                        <p className="text-xs font-medium text-gray-800 truncate">
                          {f.name}
                        </p>

                        <p className="text-[10px] text-gray-400">
                          {f.meta}
                        </p>
                      </div>

                      <Download
                        size={14}
                        strokeWidth={1.8}
                        className="text-gray-300"
                      />

                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Media */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">

              <div className="flex items-center justify-between mb-3">

                <h3 className="text-sm font-bold text-gray-900">
                  Media
                </h3>

                <span className="text-xs text-primary font-medium cursor-pointer">
                  View all
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">

                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-surface"
                  />
                ))}

                <div className="aspect-square rounded-lg bg-indigo-900 text-white text-xs flex items-center justify-center font-medium">
                  +16
                </div>

              </div>
            </div>

            {/* Conversation Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">

              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Conversation Info
              </h3>

              <ul className="space-y-2 text-xs mb-4">

                <li className="flex justify-between">
                  <span className="text-gray-400">
                    First message
                  </span>

                  <span className="text-gray-700">
                    May 10, 2026
                  </span>
                </li>

                <li className="flex justify-between">
                  <span className="text-gray-400">
                    Total messages
                  </span>

                  <span className="text-gray-700">
                    {messages.length}
                  </span>
                </li>

              </ul>

              <div className="flex items-center justify-between">

                <span className="text-xs text-gray-500">
                  Mute notifications
                </span>

                <button
                  onClick={() => setMuted((m) => !m)}
                  className={`w-9 h-5 rounded-full relative transition-colors ${
                    muted
                      ? "bg-primary"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                      muted
                        ? "left-4"
                        : "left-0.5"
                    }`}
                  />
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}