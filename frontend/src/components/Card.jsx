export default function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-2xl bg-slate-100 shadow-md shadow-slate-300/50 ${className}`}
    >
      {children}
    </div>
  );
}
