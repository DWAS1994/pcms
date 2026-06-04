import { prisma } from "@/lib/prisma";

export default async function LicensesPage() {
  const licenses = await prisma.license.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Licenses</h1>
        <p className="text-slate-400">Issued product license keys.</p>
      </div>

      <div className="panel overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Email</th>
              <th>Status</th>
              <th>Order</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((l) => (
              <tr key={l.id}>
                <td className="font-mono text-xs">{l.licenseKey}</td>
                <td>{l.ownerEmail || "-"}</td>
                <td><span className="badge">{l.status}</span></td>
                <td>{l.orderId || "-"}</td>
                <td>{l.expiresAt ? l.expiresAt.toISOString().slice(0, 10) : "-"}</td>
              </tr>
            ))}
            {licenses.length === 0 && (
              <tr>
                <td colSpan={5} className="text-slate-400">No licenses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
