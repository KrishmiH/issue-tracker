export default function Button({ variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.97]";

  const styles = {
    primary:
      "bg-purple-600 text-white hover:bg-purple-500 shadow-md shadow-purple-400/30",
    secondary:
      "bg-slate-200 text-slate-900 hover:bg-slate-300",
    danger:
      "bg-rose-500 text-white hover:bg-rose-400 shadow-md shadow-rose-300/30",
    warning:
      "bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-md shadow-amber-300/30",
  };

  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
