import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Button from "./Button";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function Layout({ title, children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  function doLogout() {
    logout();
    nav("/login");
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-purple-600 shadow-md shadow-purple-400/40">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900">
                Issue Tracker
              </div>
              <div className="text-xs text-slate-600">
                Modern • Clean • User Friendly
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="text-sm text-slate-700">
                {user.email}
              </span>
            )}
            <Button variant="secondary" onClick={doLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900">
              {title}
            </h1>
            <p className="text-sm text-slate-700">
              Track, assign and manage issues effectively
            </p>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
