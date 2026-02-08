export default function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 outline-none ring-1 ring-slate-300 focus:ring-2 focus:ring-purple-400 ${className}`}
      {...props}
    />
  );
}
