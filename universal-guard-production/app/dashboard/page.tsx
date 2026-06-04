import { prisma } from "@/lib/prisma";
import { Users, KeyRound, AlertTriangle, Activity } from "lucide-react";

export default async function DashboardPage() {
  const [players, licenses, flagged, activeLicenses] = await Promise.all([
    prisma.player.count(),
    prisma.license.count(),
    prisma.player.count({ where: { status: "flagged" } }),
    prisma.license.count({ where: { status: "active" } })
  ]);

  const cards = [
    { label: "Players", value: players, icon: Users },
    { label: "Licenses", value: licenses, icon: KeyRound },
    { label: "Flagged Players", value: flagged, icon: AlertTriangle },
    { label: "Active Licenses", value: activeLicenses, icon: Activity }
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-slate-400">Live platform summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="panel p-5">
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-sm">{card.label}</p>
                <Icon className="text-blue-400" size={20} />
              </div>
              <div className="text-3xl font-bold mt-3">{card.value}</div>
            </div>
          );
        })}
      </div>

      <div className="panel p-5">
        <h2 className="text-xl font-semibold mb-2">System Notes</h2>
        <ul className="list-disc pl-5 text-slate-300 space-y-1">
          <li>Authentication uses signed JWT cookies.</li>
          <li>Database access uses Prisma.</li>
          <li>PayPal checkout creates and captures orders server-side.</li>
          <li>License keys are generated after successful payment capture.</li>
        </ul>
      </div>
    </div>
  );
}
