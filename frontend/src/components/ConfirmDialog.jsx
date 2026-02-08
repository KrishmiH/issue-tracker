import Button from "./Button";
import Card from "./Card";
import { AlertTriangle, Trash2, Lock } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  tone = "warning", // warning | danger | info
  icon = "warning", // warning | delete | close
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const iconNode =
    icon === "delete" ? (
      <Trash2 className="h-6 w-6 text-rose-600" />
    ) : icon === "close" ? (
      <Lock className="h-6 w-6 text-amber-600" />
    ) : (
      <AlertTriangle className="h-6 w-6 text-amber-600" />
    );

  const confirmVariant = tone === "danger" ? "danger" : tone === "warning" ? "warning" : "secondary";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* modal */}
      <div className="relative w-full max-w-md">
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-200">
              {iconNode}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-slate-900">{title}</p>
              {message && <p className="mt-1 text-sm text-slate-800">{message}</p>}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 justify-end">
            <Button variant="secondary" onClick={onCancel}>
              {cancelText}
            </Button>
            <Button variant={confirmVariant} onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
