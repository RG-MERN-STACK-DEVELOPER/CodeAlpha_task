import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>`,
    label: "Overview",
    path: "/dashboard",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>`,
    label: "Projects",
    path: "/projects",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 12 2.5 2.5L16 9"/></svg>`,
    label: "Tasks",
    path: "/tasks",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="4" height="16" rx="1"/><rect x="10" y="4" width="4" height="16" rx="1"/><rect x="16" y="4" width="4" height="16" rx="1"/></svg>`,
    label: "Kanban",
    path: "/kanban",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>`,
    label: "Calendar",
    path: "/calendar",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M15 14c3.3 0 6 2 6 5"/></svg>`,
    label: "Team",
    path: "/team",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19V9M10 19V5M16 19v-8M22 19V3"/></svg>`,
    label: "Reports",
    path: "/reports",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h16v12H7l-3 3z"/><path d="M8 9h8M8 13h5"/></svg>`,
    label: "Messages",
    path: "/messages",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.5 1.5-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-2.2v-.3a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.5-1.5.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H7v-2.2h.3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L10 7.3l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V6h2.2v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.5 1.5-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.3V14h-.3a1.7 1.7 0 0 0-1.5 1z"/></svg>`,
    label: "Settings",
    path: "/settings",
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-[#0e0a2e] text-white p-5 sticky top-0 h-screen">

      <div className="flex items-center gap-2 font-bold text-lg mb-8 px-2">
        <span className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-base">
          ▤
        </span>
        PM Tool
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-indigo-100/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className="w-5 h-5 flex items-center justify-center [&>svg]:w-[18px] [&>svg]:h-[18px]"
                dangerouslySetInnerHTML={{ __html: item.icon }}
              />

              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="glass-dark rounded-xl p-4 mt-4">
        <p className="text-xs font-bold text-white mb-1">👑 Upgrade to Pro</p>

        <p className="text-xs text-indigo-100/60 mb-3">
          Unlock advanced features and more control.
        </p>

        <button className="w-full bg-primary text-white text-xs font-semibold py-2 rounded-lg hover:bg-indigo-600 transition-colors">
          Upgrade Now →
        </button>
      </div>

    </aside>
  );
}