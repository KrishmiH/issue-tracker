import { useState } from "react";
import client from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import Button from "../components/Button";
import { UserPlus } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const { setAuth } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }
    
    try {
      const res = await client.post("/auth/register", { email, password });
      setAuth(res.data.token, res.data.user);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Register failed");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-purple-600">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Create account
          </h2>
          <p className="text-sm text-slate-700">
            Start tracking issues
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-900">
                Email
              </label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-900">
                Password
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-slate-700">
                Minimum 6 characters
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-900">
                Confirm Password
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {err && <p className="text-sm text-rose-700">{err}</p>}

            <Button className="w-full">Create account</Button>
          </form>

          <p className="mt-4 text-sm text-slate-800">
            Already have an account?{" "}
            <Link className="font-medium text-purple-700 hover:underline" to="/login">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
