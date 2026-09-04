import { useState } from "react";

const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function MiniCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, muted: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      muted: false,
      isToday: d === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - (firstDayIndex + daysInMonth) + 1, muted: true });
  }

  const goPrev = () => setViewDate(new Date(year, month - 1, 1));
  const goNext = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900">Calendar</h2>
      </div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-700">
          {monthNames[month]} {year}
        </p>
        <div className="flex items-center gap-1">
          <button onClick={goPrev} className="w-6 h-6 rounded hover:bg-surface flex items-center justify-center text-gray-400">
            ‹
          </button>
          <button onClick={goNext} className="w-6 h-6 rounded hover:bg-surface flex items-center justify-center text-gray-400">
            ›
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-gray-400 mb-1">
        {weekDays.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, i) => (
          <span
            key={i}
            className={`text-xs py-1.5 rounded-lg ${
              c.isToday
                ? "bg-primary text-white font-bold"
                : c.muted
                ? "text-gray-300"
                : "text-gray-600 hover:bg-surface cursor-pointer"
            }`}
          >
            {c.day}
          </span>
        ))}
      </div>
    </div>
  );
}
