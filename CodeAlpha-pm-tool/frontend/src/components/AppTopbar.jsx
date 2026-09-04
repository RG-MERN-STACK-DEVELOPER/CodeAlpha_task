import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* =========================================================
   SVG ICONS
========================================================= */

function SearchIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function BellIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function CalendarIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

function UserIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.7-4 3.3-6 8-6s7.3 2 8 6" />
    </svg>
  );
}

function SettingsIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V22h-2.54v-.1a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 8.1 17a1.7 1.7 0 0 0-1.56-1.03H6.4v-2.54h.14A1.7 1.7 0 0 0 8.1 12.4a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.8-1.8.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V7h2.54v.5a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.8 1.8-.06.06A1.7 1.7 0 0 0 19.4 12c.2.5.7.87 1.25.87h.35v2.54h-.35c-.55 0-1.05.37-1.25.87Z" />
    </svg>
  );
}

function LogoutIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* =========================================================
   APP TOPBAR
========================================================= */

export default function AppTopbar({
  searchPlaceholder = "Search projects, tasks, teams...",
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  /* =========================================================
     SEARCH KEYWORDS
  ========================================================= */

  const searchKeywords = [
    "Projects",
    "Tasks",
    "Teams",
    "Dashboard",
    "Calendar",
    "Completed Tasks",
    "Pending Tasks",
    "In Progress",
    "High Priority",
    "Due Today",
    "Due This Week",
  ];

  /* =========================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    try {
      if (typeof logout === "function") {
        await logout();
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setShowProfileMenu(false);
      navigate("/login", { replace: true });
    }
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const handleProfile = () => {
    setShowProfileMenu(false);
    navigate("/profile");
  };

  const handleSettings = () => {
    setShowProfileMenu(false);
    navigate("/settings");
  };

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-30">

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="flex-1 relative max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <SearchIcon />
        </span>

        <input
          list="topbar-search-keywords"
          type="text"
          placeholder={searchPlaceholder}
          className="w-full bg-surface border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />

        <datalist id="topbar-search-keywords">
          {searchKeywords.map((keyword) => (
            <option key={keyword} value={keyword} />
          ))}
        </datalist>
      </div>

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="flex items-center gap-2 ml-auto">

        {/* NOTIFICATION */}

        <button
          type="button"
          title="Notifications"
          className="relative w-10 h-10 rounded-xl hover:bg-surface flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
        >
          <BellIcon />

          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-white" />
        </button>

        {/* CALENDAR */}

        <button
          type="button"
          title="Calendar"
          onClick={() => navigate("/calendar")}
          className="w-10 h-10 rounded-xl hover:bg-surface flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
        >
          <CalendarIcon />
        </button>

        {/* ===================================================
            PROFILE DROPDOWN
        =================================================== */}

        <div
          ref={profileRef}
          className="relative ml-2 pl-3 border-l border-gray-100"
        >
          <button
            type="button"
            onClick={() =>
              setShowProfileMenu((prev) => !prev)
            }
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-surface transition-colors"
          >
            {/* AVATAR */}

            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
              {initials(user?.name || "User")}
            </span>

            {/* USER INFO */}

            <div className="hidden sm:block text-left">
              <p className="font-semibold text-gray-800 text-sm leading-tight max-w-[120px] truncate">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-gray-400 leading-tight">
                {user?.role || "Admin"}
              </p>
            </div>

            <ChevronDownIcon
              className={`hidden sm:block text-gray-400 transition-transform duration-200 ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* =================================================
              DROPDOWN MENU
          ================================================= */}

          {showProfileMenu && (
            <div className="absolute right-0 top-[calc(100%+10px)] w-60 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">

              {/* USER HEADER */}

              <div className="px-4 py-3 bg-surface border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 text-white text-xs font-bold flex items-center justify-center">
                    {initials(user?.name || "User")}
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user?.name || "User"}
                    </p>

                    <p className="text-xs text-gray-400 truncate">
                      {user?.email || "Admin Account"}
                    </p>
                  </div>
                </div>
              </div>

              {/* MENU ITEMS */}

              <div className="p-2">

                {/* PROFILE */}

                <button
                  type="button"
                  onClick={handleProfile}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-surface hover:text-primary transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-indigo-50 text-primary flex items-center justify-center">
                    <UserIcon />
                  </span>

                  <span>My Profile</span>
                </button>

                {/* SETTINGS */}

                <button
                  type="button"
                  onClick={handleSettings}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-surface hover:text-primary transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center">
                    <SettingsIcon />
                  </span>

                  <span>Settings</span>
                </button>

                <div className="h-px bg-gray-100 my-2" />

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                    <LogoutIcon />
                  </span>

                  <span className="font-medium">
                    Logout
                  </span>
                </button>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}