export default function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-1 ring-slate-300 focus:ring-2 focus:ring-purple-400 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
