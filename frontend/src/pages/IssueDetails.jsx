import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import client from "../api/client";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Select from "../components/Select";
import Button from "../components/Button";
import Badge from "../components/Badge";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../components/ToastProvider";
import { ArrowLeft, Save, Trash2, CheckCircle2, Timer, Lock, User } from "lucide-react";

export default function IssueDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { show } = useToast();

  const [issue, setIssue] = useState(null);
  const [edit, setEdit] = useState({
    title: "",
    description: "",
    priority: "Medium",
    severity: "Minor",
    status: "Open",
    assignedTo: "",
  });

  const [saving, setSaving] = useState(false);

  // confirm modal state
  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    tone: "warning",
    icon: "warning",
    action: null,
  });

  function openConfirm(cfg) {
    setConfirm({
      open: true,
      title: cfg.title,
      message: cfg.message,
      confirmText: cfg.confirmText || "Confirm",
      tone: cfg.tone || "warning",
      icon: cfg.icon || "warning",
      action: cfg.action,
    });
  }

  function closeConfirm() {
    setConfirm((p) => ({ ...p, open: false, action: null }));
  }

  async function load() {
    const res = await client.get(`/issues/${id}`);
    setIssue(res.data);
    setEdit({
      title: res.data.title,
      description: res.data.description,
      priority: res.data.priority,
      severity: res.data.severity,
      status: res.data.status,
      assignedTo: res.data.assignedTo || "",
    });
  }

  useEffect(() => {
    load();
  }, [id]);

  async function save() {
    setSaving(true);
    try {
      await client.put(`/issues/${id}`, edit);
      await load();
      show({ type: "success", title: "Saved", message: "Issue updated successfully." });
    } catch (e) {
      show({ type: "error", title: "Save failed", message: e.response?.data?.message || "Update failed" });
    } finally {
      setSaving(false);
    }
  }

  function confirmStatus(status) {
    openConfirm({
      title: "Change status?",
      message: `This will mark the issue as "${status}".`,
      confirmText: "Yes, change",
      tone: status === "Closed" ? "warning" : "info",
      icon: status === "Closed" ? "close" : "warning",
      action: async () => {
        await client.patch(`/issues/${id}/status`, { status });
        await load();
        show({ type: "success", title: "Status updated", message: `Marked as ${status}.` });
      },
    });
  }

  function confirmDelete() {
    openConfirm({
      title: "Delete this issue?",
      message: "This action cannot be undone.",
      confirmText: "Yes, delete",
      tone: "danger",
      icon: "delete",
      action: async () => {
        await client.delete(`/issues/${id}`);
        show({ type: "success", title: "Deleted", message: "Issue removed successfully." });
        nav("/");
      },
    });
  }

  async function runConfirmAction() {
    try {
      if (confirm.action) await confirm.action();
    } catch (e) {
      show({ type: "error", title: "Action failed", message: e.response?.data?.message || "Something went wrong" });
    } finally {
      closeConfirm();
    }
  }

  if (!issue) return <div className="p-6 text-slate-900">Loading...</div>;

  return (
    <Layout title="Issue Details">
      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        confirmText={confirm.confirmText}
        cancelText="Cancel"
        tone={confirm.tone}
        icon={confirm.icon}
        onCancel={closeConfirm}
        onConfirm={runConfirmAction}
      />

      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="flex flex-wrap gap-2">
          <Badge type="status" value={issue.status} />
          <Badge type="priority" value={issue.priority} />
          <Badge type="severity" value={issue.severity} />
        </div>
      </div>

      <Card className="max-w-3xl p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-900">Title</label>
            <Input value={edit.title} onChange={(e) => setEdit((p) => ({ ...p, title: e.target.value }))} />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900">Description</label>
            <Textarea rows={7} value={edit.description} onChange={(e) => setEdit((p) => ({ ...p, description: e.target.value }))} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div>
              <label className="text-sm font-medium text-slate-900">Priority</label>
              <Select value={edit.priority} onChange={(e) => setEdit((p) => ({ ...p, priority: e.target.value }))}>
                <option>Low</option><option>Medium</option><option>High</option>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-900">Severity</label>
              <Select value={edit.severity} onChange={(e) => setEdit((p) => ({ ...p, severity: e.target.value }))}>
                <option>Minor</option><option>Major</option><option>Critical</option>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-900">Status</label>
              <Select value={edit.status} onChange={(e) => setEdit((p) => ({ ...p, status: e.target.value }))}>
                <option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-900">Assigned To</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                <Input
                  className="pl-9"
                  value={edit.assignedTo}
                  onChange={(e) => setEdit((p) => ({ ...p, assignedTo: e.target.value }))}
                  placeholder="Person / Team"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={save} disabled={saving}>
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save"}
            </Button>

            <Button variant="secondary" onClick={() => confirmStatus("In Progress")}>
              <Timer className="h-4 w-4" /> In Progress
            </Button>

            <Button variant="secondary" onClick={() => confirmStatus("Resolved")}>
              <CheckCircle2 className="h-4 w-4" /> Resolved
            </Button>

            <Button variant="warning" onClick={() => confirmStatus("Closed")}>
              <Lock className="h-4 w-4" /> Close
            </Button>

            <Button variant="danger" onClick={confirmDelete} className="ml-auto">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
      </Card>
    </Layout>
  );
}
