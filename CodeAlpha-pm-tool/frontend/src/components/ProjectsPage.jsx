import { useAuth } from "../context/AuthContext";

function initials(name = "") {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function AppTopbar({ searchPlaceholder = "Search projects, tasks, teams..." }) {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-20">
      <div className="flex-1 relative max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          placeholder={searchPlaceholder}
          className="w-full bg-surface border border-gray-100 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <button className="relative w-9 h-9 rounded-lg hover:bg-surface flex items-center justify-center text-gray-500">
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>
        <button className="w-9 h-9 rounded-lg hover:bg-surface flex items-center justify-center text-gray-500">📅</button>
        <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 text-white text-xs font-bold flex items-center justify-center">
            {initials(user?.name)}
          </span>
          <div className="hidden sm:block text-sm">
            <p className="font-semibold text-gray-800 leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-400 leading-tight">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
