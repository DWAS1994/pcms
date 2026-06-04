import { notFound } from "next/navigation";

type PlayerPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-10">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
        Player Details
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-2xl">
        <p className="text-sm text-slate-400">Player ID</p>
        <p className="text-xl font-mono text-emerald-400">{id}</p>
      </div>
    </main>
  );
}
