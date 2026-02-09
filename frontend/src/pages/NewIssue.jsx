import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Select from "../components/Select";
import Button from "../components/Button";
import { ArrowLeft, User } from "lucide-react";
import { useToast } from "../components/ToastProvider";

export default function NewIssue() {
  const nav = useNavigate();
  const { show } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    severity: "Minor",
    assignedTo: "",
  });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      await client.post("/issues", form);
      show({ type: "success", title: "Issue created", message: "Your issue was added successfully." });
      nav("/");
    } catch (e) {
      const msg = e.response?.data?.message || "Create failed";
      setErr(msg);
      show({ type: "error", title: "Create failed", message: msg });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout title="Create Issue">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <Card className="mt-4 max-w-2xl p-6">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-900">Title</label>
            <Input
              placeholder="Title here"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900">Description</label>
            <Textarea
              rows={6}
              placeholder="Description here"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-900">Priority</label>
              <Select
                value={form.priority}
                onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-900">Severity</label>
              <Select
                value={form.severity}
                onChange={(e) => setForm((p) => ({ ...p, severity: e.target.value }))}
              >
                <option>Minor</option>
                <option>Major</option>
                <option>Critical</option>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-900">Assigned To</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                <Input
                  className="pl-9"
                  placeholder="Person / Team"
                  value={form.assignedTo}
                  onChange={(e) => setForm((p) => ({ ...p, assignedTo: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {err && <p className="text-sm text-rose-700">{err}</p>}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create Issue"}
            </Button>
            <Link to="/">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </Layout>
  );
}
