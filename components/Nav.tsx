"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Users, KeyRound, CreditCard, LogOut } from "lucide-react";

export function Nav() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    document.cookie = "guard_token=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <aside className="panel p-4 space-y-4">
      <div className="flex items-center gap-2 text-xl font-bold">
        <Shield className="text-blue-400" />
        Universal Guard
      </div>

      <nav className="grid gap-2 text-sm">
        <Link className="btn btn-secondary justify-start" href="/dashboard">
          <Shield size={16} /> Overview
        </Link>
        <Link className="btn btn-secondary justify-start" href="/dashboard/players">
          <Users size={16} /> Players
        </Link>
        <Link className="btn btn-secondary justify-start" href="/dashboard/licenses">
          <KeyRound size={16} /> Licenses
        </Link>
        <Link className="btn btn-secondary justify-start" href="/checkout">
          <CreditCard size={16} /> Checkout
        </Link>
        <button onClick={logout} className="btn btn-secondary justify-start">
          <LogOut size={16} /> Logout
        </button>
      </nav>
    </aside>
  );
}
