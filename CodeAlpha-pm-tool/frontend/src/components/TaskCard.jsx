const priorityColors = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
};

export default function TaskCard({ task, onClick, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 p-3.5 mb-3 cursor-pointer card-lift"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-800">{task.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      {task.dueDate && (
        <p className="text-xs text-gray-400 mb-2">Due {new Date(task.dueDate).toLocaleDateString()}</p>
      )}
      <div className="flex -space-x-2">
        {(task.assignees || []).slice(0, 4).map((a) => (
          <div
            key={a._id}
            title={a.name}
            className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center border-2 border-white"
          >
            {a.name?.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}
