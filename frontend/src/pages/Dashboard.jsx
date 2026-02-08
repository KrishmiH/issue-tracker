import { useEffect, useMemo, useState } from "react";
import client from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import { exportIssuesCSV, exportIssuesJSON } from "../utils/exporters";
import {
  Plus,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
  Bug,
  Activity,
  CheckCircle2,
  Lock,
  User,
  X,
  Download,
} from "lucide-react";

function useDebounced(value, delay = 450) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({
    Open: 0,
    "In Progress": 0,
    Resolved: 0,
    Closed: 0,
  });

  const [q, setQ] = useState("");
  const debouncedQ = useDebounced(q, 450);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [page, setPage] = useState(1);
  const limit = 9;
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);

  async function loadCounts() {
    const res = await client.get("/issues/counts");
    setCounts(res.data);
  }

  async function loadIssues() {
    setLoading(true);
    try {
      const res = await client.get("/issues", {
        params: {
          page,
          limit,
          q: debouncedQ || undefined,
          status: status || undefined,
          priority: priority || undefined,
        },
      });
      setItems(res.data.items);
      setTotalPages(res.data.totalPages);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) nav("/login");
  }, [user, nav]);

  useEffect(() => {
    loadCounts();
  }, []);

  useEffect(() => {
    loadIssues();
  }, [page, debouncedQ, status, priority]);

  const stats = [
    { label: "Open", value: counts.Open, icon: Bug, bg: "bg-sky-100", fg: "text-sky-900" },
    { label: "In Progress", value: counts["In Progress"], icon: Activity, bg: "bg-indigo-100", fg: "text-indigo-900" },
    { label: "Resolved", value: counts.Resolved, icon: CheckCircle2, bg: "bg-emerald-100", fg: "text-emerald-900" },
    { label: "Closed", value: counts.Closed, icon: Lock, bg: "bg-amber-100", fg: "text-amber-900" },
  ];

  const hasFilters = useMemo(() => !!(q || status || priority), [q, status, priority]);

  function clearFilters() {
    setQ("");
    setStatus("");
    setPriority("");
    setPage(1);
  }

  return (
    <Layout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{c.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{c.value}</p>
                  <p className="mt-1 text-xs text-slate-700">Total issues</p>
                </div>
                <div className={`grid h-11 w-11 place-items-center rounded-2xl ${c.bg}`}>
                  <Icon className={`h-5 w-5 ${c.fg}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="mt-5 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
            <Input
              className="pl-9"
              placeholder="Search issues..."
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
              <Select
                className="pl-9"
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
              >
                <option value="">All Status</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </Select>
            </div>

            <Select
              value={priority}
              onChange={(e) => {
                setPage(1);
                setPriority(e.target.value);
              }}
            >
              <option value="">All Priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Select>

            {hasFilters && (
              <Button variant="secondary" onClick={clearFilters} className="col-span-2 sm:col-span-1">
                <X className="h-4 w-4" /> Clear
              </Button>
            )}

            {/* Export JSON & CSV buttons */}
            <Button
              variant="secondary"
              onClick={() => exportIssuesJSON(items)}
              className="col-span-2 sm:col-span-1"
            >
              <Download className="h-4 w-4" /> Export JSON
            </Button>

            <Button
              variant="secondary"
              onClick={() => exportIssuesCSV(items)}
              className="col-span-2 sm:col-span-1"
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>

            <Link to="/new" className="col-span-2 sm:col-span-1">
              <Button className="w-full">
                <Plus className="h-4 w-4" /> Create
              </Button>
            </Link>
          </div>
        </div>

        {/* Results line */}
        <div className="mt-3 text-sm text-slate-800">
          {loading ? "Loading issues..." : `${items.length} issue(s) shown`}
        </div>
      </Card>

      {/* List (Skeleton / Empty / Normal) */}
      <div className="mt-5">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-5">
                <Skeleton className="h-5 w-2/3" />
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-20 rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No matching issues"
            message="Try clearing filters or create a new issue to get started."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((it) => (
              <Card key={it._id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold leading-snug text-slate-900 line-clamp-2">
                    {it.title}
                  </h3>
                  <Badge type="status" value={it.status} />
                </div>

                <p className="mt-2 text-sm text-slate-800 line-clamp-3">
                  {it.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge type="priority" value={it.priority} />
                  <Badge type="severity" value={it.severity} />

                  {it.assignedTo && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-900">
                      <User className="h-3.5 w-3.5" />
                      {it.assignedTo}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-700">
                    {new Date(it.createdAt).toLocaleString()}
                  </span>
                  <Link to={`/issues/${it._id}`}>
                    <Button variant="secondary">View</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && items.length > 0 && (
        <div className="mt-7 flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ArrowLeft className="h-4 w-4" /> Prev
          </Button>

          <span className="text-sm font-medium text-slate-900">
            Page {page} / {totalPages}
          </span>

          <Button
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Layout>
  );
}
