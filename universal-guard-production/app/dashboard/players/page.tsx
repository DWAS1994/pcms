import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Players</h1>
          <p className="text-slate-400">Manage and review player accounts.</p>
        </div>
        <Link href="/dashboard/players/new" className="btn btn-primary">
          New Player
        </Link>
      </div>

      <div className="panel overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Character</th>
              <th>Level</th>
              <th>Gold</th>
              <th>IP</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id}>
                <td>{p.accountName}</td>
                <td>{p.characterName}</td>
                <td>{p.level}</td>
                <td>{p.gold.toString()}</td>
                <td>{p.ipAddress || "-"}</td>
                <td><span className="badge">{p.status}</span></td>
                <td>
                  <Link className="text-blue-300" href={"/dashboard/players/" + p.id}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr>
                <td colSpan={7} className="text-slate-400">No players found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
