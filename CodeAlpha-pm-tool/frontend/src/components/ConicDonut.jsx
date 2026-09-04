export default function ConicDonut({ segments, size = 130, thickness = 14, centerLabel, centerSub }) {
  let cumulative = 0;
  const stops = segments
    .map((s) => {
      const start = cumulative;
      cumulative += s.percent;
      return `${s.color} ${start}% ${cumulative}%`;
    })
    .join(", ");

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div
        className="rounded-full"
        style={{ width: size, height: size, background: `conic-gradient(${stops})` }}
      />
      <div
        className="absolute rounded-full bg-white flex flex-col items-center justify-center"
        style={{
          width: size - thickness * 2,
          height: size - thickness * 2,
          top: thickness,
          left: thickness,
        }}
      >
        <span className="text-2xl font-extrabold text-gray-900">{centerLabel}</span>
        {centerSub && <span className="text-[10px] text-gray-400 text-center px-2">{centerSub}</span>}
      </div>
    </div>
  );
}
