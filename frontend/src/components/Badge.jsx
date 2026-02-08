const map = {
  status: {
    Open: "bg-sky-200 text-sky-900",
    "In Progress": "bg-indigo-200 text-indigo-900",
    Resolved: "bg-emerald-200 text-emerald-900",
    Closed: "bg-amber-200 text-amber-900",
  },
  priority: {
    Low: "bg-slate-300 text-slate-900",
    Medium: "bg-purple-200 text-purple-900",
    High: "bg-rose-200 text-rose-900",
  },
  severity: {
    Minor: "bg-slate-300 text-slate-900",
    Major: "bg-amber-200 text-amber-900",
    Critical: "bg-rose-200 text-rose-900",
  },
};

export default function Badge({ type, value }) {
  const cls = map[type]?.[value] || "bg-slate-300 text-slate-900";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {value}
    </span>
  );
}
