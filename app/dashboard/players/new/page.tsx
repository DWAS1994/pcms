"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPlayerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    accountName: "",
    characterName: "",
    level: 1,
    gold: "0",
    ipAddress: "",
    status: "active",
    notes: ""
  });
  const [error, setError] = useState("");

  function setField(key: string, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Could not create player");
      return;
    }

    router.push("/dashboard/players");
  }

  return (
    <form onSubmit={submit} className="panel p-5 space-y-4 max-w-2xl">
      <h1 className="text-3xl font-bold">New Player</h1>
      {error && <div className="text-red-300">{error}</div>}

      <input className="input" placeholder="Account name" value={form.accountName} onChange={(e) => setField("accountName", e.target.value)} />
      <input className="input" placeholder="Character name" value={form.characterName} onChange={(e) => setField("characterName", e.target.value)} />
      <input className="input" type="number" placeholder="Level" value={form.level} onChange={(e) => setField("level", Number(e.target.value))} />
      <input className="input" placeholder="Gold" value={form.gold} onChange={(e) => setField("gold", e.target.value)} />
      <input className="input" placeholder="IP address" value={form.ipAddress} onChange={(e) => setField("ipAddress", e.target.value)} />
      <select className="input" value={form.status} onChange={(e) => setField("status", e.target.value)}>
        <option value="active">active</option>
        <option value="flagged">flagged</option>
        <option value="banned">banned</option>
      </select>
      <textarea className="input" placeholder="Notes" value={form.notes} onChange={(e) => setField("notes", e.target.value)} />

      <button className="btn btn-primary">Create Player</button>
    </form>
  );
}
