async function getConnectorStatus() {
  const base = process.env.NEXT_PUBLIC_BD_API || "http://localhost:8022";
  const user = process.env.NEXT_PUBLIC_DEMO_USER_ID || "demo_user";
  try {
    const r = await fetch(`${base}/bd/connectors/status?user_id=${encodeURIComponent(user)}`, {
      next: { revalidate: 0 },
    });
    if (!r.ok) return [] as any[];
    return (await r.json()) as any[];
  } catch (e) {
    return [] as any[];
  }
}

import BDClient from './Client';

export default async function BDPage() {
  const status = await getConnectorStatus();
  return (
    <main style={{ padding: 24 }}>
      <h1>BD Dashboard</h1>
      <p>Connector status for demo user:</p>
      <ul>
        {status.length === 0 && <li>No connectors configured.</li>}
        {status.map((s: any, i: number) => (
          <li key={i}>
            {s.provider}: {s.connected ? "connected" : "not connected"}
            {s.last_sync && ` • last sync: ${s.last_sync}`}
          </li>
        ))}
      </ul>
      <BDClient />
    </main>
  );
}
