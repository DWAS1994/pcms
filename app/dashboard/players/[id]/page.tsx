// app/dashboard/players/[id]/page.tsx

type Params = Promise<{ id: string }>;

export default async function PlayerPage(props: { params: Params }) {
  // We must 'await' the params in Next.js 15
  const params = await props.params;
  const id = params.id;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Player Details</h1>
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <p className="text-gray-400">Viewing details for Player ID:</p>
        <code className="text-blue-400 text-xl font-mono">{id}</code>
        
        {/* Your player management logic (Ban, Edit, etc.) goes here */}
        <div className="mt-8">
            <button className="bg-red-600 px-4 py-2 rounded text-sm">
                Issue HWID Ban for this ID
            </button>
        </div>
      </div>
    </div>
  );
}
