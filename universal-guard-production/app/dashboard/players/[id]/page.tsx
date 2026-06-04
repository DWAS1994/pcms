"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPlayerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/players/" + params.id)
      .then((r) => r.json())
      .then((data) => setForm(data.player));
  }, [params.id]);

  function setField(key: string, value: any) {
    setForm((f: any) => ({ ...f, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/players/" + params.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Could not save player");
      return;
    }

    router.push("/dashboard/players");
  }

  async function remove() {
    if (!confirm("Delete this player?")) return;

    await fetch("/api/players/" + params.id, { method: "DELETE" });
    router.push("/dashboard/players");
  }

  if (!form) return <div className="panel p-5">Loading...</div>;

  return (
    <form onSubmit={save} className="panel p-5 space-y-4 max-w-2xl">
      <h1 className="text-3xl font-bold">Edit Player</h1>
      {error && <div className="text-red-300">{error}</div>}

      <input className="input" value={form.accountName} onChange={(e) => setField("accountName", e.target.value)} />
      <input className="input" value={form.characterName} onChange={(e) => setField("characterName", e.target.value)} />
      <input className="input" type="number" value={form.level} onChange={(e) => setField("level", Number(e.target.value))} />
      <input className="input" value={String(form.gold)} onChange={(e) => setField("gold", e.target.value)} />
      <input className="input" value={form.ipAddress || ""} onChange={(e) => setField("ipAddress", e.target.value)} />
      <select className="input" value={form.status} onChange={(e) => setField("status", e.target.value)}>
        <option value="active">active</option>
        <option value="flagged">flagged</option>
        <option value="banned">banned</option>
      </select>
      <textarea className="input" value={form.notes || ""} onChange={(e) => setField("notes", e.target.value)} />

      <div className="flex gap-3">
        <button className="btn btn-primary">Save</button>
        <button type="button" onClick={remove} className="btn btn-secondary">Delete</button>
      </div>
    </form>
  );
}
