"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    document.cookie = "guard_token=" + data.token + "; path=/; max-age=28800; SameSite=Lax";
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={submit} className="panel w-full max-w-md p-8 space-y-5">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-400" size={34} />
          <div>
            <h1 className="text-3xl font-bold">Universal Guard</h1>
            <p className="text-slate-400 text-sm">Production admin console</p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm text-slate-400">Username</label>
          <input className="input mt-1" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div>
          <label className="text-sm text-slate-400">Password</label>
          <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-xs text-slate-500">
          Default credentials: admin / admin123. Change before production use.
        </p>
      </form>
    </main>
  );
}
