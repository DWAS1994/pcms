import { Nav } from "./Nav";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen p-5 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5 max-w-7xl mx-auto">
        <Nav />
        <section>{children}</section>
      </div>
    </main>
  );
}
