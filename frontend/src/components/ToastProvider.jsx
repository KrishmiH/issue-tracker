import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((toast) => {
    const id = crypto?.randomUUID?.() || String(Date.now() + Math.random());
    const t = {
      id,
      type: toast.type || "success", // success | error | warning | info
      title: toast.title || "",
      message: toast.message || "",
      duration: toast.duration ?? 3200,
    };

    setToasts((prev) => [t, ...prev]);

    if (t.duration > 0) {
      setTimeout(() => remove(id), t.duration);
    }
  }, [remove]);

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* Toast container */}
      <div className="fixed right-4 top-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

function ToastItem({ toast, onClose }) {
  const styles = {
    success: {
      ring: "ring-emerald-200",
      bg: "bg-white",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      title: "text-slate-900",
      msg: "text-slate-700",
    },
    error: {
      ring: "ring-rose-200",
      bg: "bg-white",
      icon: <XCircle className="h-5 w-5 text-rose-600" />,
      title: "text-slate-900",
      msg: "text-slate-700",
    },
    warning: {
      ring: "ring-amber-200",
      bg: "bg-white",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
      title: "text-slate-900",
      msg: "text-slate-700",
    },
    info: {
      ring: "ring-slate-200",
      bg: "bg-white",
      icon: <AlertTriangle className="h-5 w-5 text-slate-600" />,
      title: "text-slate-900",
      msg: "text-slate-700",
    },
  };

  const s = styles[toast.type] || styles.success;

  return (
    <div className={`rounded-2xl ${s.bg} p-4 shadow-lg ring-1 ${s.ring}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{s.icon}</div>
        <div className="min-w-0 flex-1">
          {toast.title && <p className={`text-sm font-medium ${s.title}`}>{toast.title}</p>}
          {toast.message && <p className={`text-sm ${s.msg}`}>{toast.message}</p>}
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
