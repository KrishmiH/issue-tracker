import { useState } from "react";
import client from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { ShieldCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { setAuth } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await client.post("/auth/login", { email, password });
      setAuth(res.data.token, res.data.user);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-purple-600">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Welcome back
          </h2>
          <p className="text-sm text-slate-700">
            Login to continue
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-900">
                Email
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-900">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {err && (
              <p className="text-sm text-rose-700">
                {err}
              </p>
            )}

            <Button className="w-full">Login</Button>
          </form>

          <p className="mt-4 text-sm text-slate-800">
            No account?{" "}
            <Link className="font-medium text-purple-700 hover:underline" to="/register">
              Register
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
