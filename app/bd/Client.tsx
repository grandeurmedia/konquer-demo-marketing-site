'use client';

import React, { useCallback, useEffect, useState } from 'react';

type ConnectorStatus = {
  provider: string;
  connected: boolean;
  last_sync?: string;
  webhook_active?: boolean;
};

export default function BDClient() {
  const apiBase = process.env.NEXT_PUBLIC_BD_API || 'http://localhost:8022';
  const userId = process.env.NEXT_PUBLIC_DEMO_USER_ID || 'demo_user';
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<ConnectorStatus[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = useCallback(async () => {
    setError(null);
    try {
      const r = await fetch(`${apiBase}/bd/connectors/status?user_id=${encodeURIComponent(userId)}`);
      if (!r.ok) throw new Error(`status ${r.status}`);
      setStatus(await r.json());
    } catch (e: any) {
      setError(String(e?.message || e));
    }
  }, [apiBase, userId]);

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  async function configureHubSpotPAT(ev: React.FormEvent) {
    ev.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${apiBase}/bd/connectors/hubspot/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, private_app_token: token }),
      });
      if (!r.ok) throw new Error(`config failed ${r.status}`);
      await refreshStatus();
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function hubspotOAuth() {
    setError(null);
    try {
      const r = await fetch(`${apiBase}/bd/connectors/hubspot/authorize?user_id=${encodeURIComponent(userId)}`);
      if (!r.ok) throw new Error(`authorize failed ${r.status}`);
      const j = await r.json();
      if (j.authorization_url) {
        window.open(j.authorization_url, '_blank');
      }
    } catch (e: any) {
      setError(String(e?.message || e));
    }
  }

  async function sync(provider: string) {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${apiBase}/bd/connectors/${provider}/sync?user_id=${encodeURIComponent(userId)}`, {
        method: 'POST',
      });
      if (!r.ok) throw new Error(`sync failed ${r.status}`);
      await refreshStatus();
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ marginTop: 24 }}>
      <h2>Connectors</h2>
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
      <div style={{ display: 'flex', gap: 24 }}>
        <form onSubmit={configureHubSpotPAT} style={{ border: '1px solid #ddd', padding: 16 }}>
          <h3>HubSpot (Private App Token)</h3>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="hs_pat_..."
            style={{ width: 280 }}
          />
          <div>
            <button disabled={loading || !token} type="submit">Save Token</button>
            <button disabled={loading} type="button" onClick={() => sync('hubspot')} style={{ marginLeft: 8 }}>Sync</button>
          </div>
          <div style={{ marginTop: 8 }}>
            <button disabled={loading} type="button" onClick={hubspotOAuth}>Authorize via OAuth</button>
          </div>
        </form>

        <div style={{ border: '1px solid #ddd', padding: 16 }}>
          <h3>HighLevel</h3>
          <button disabled={loading} onClick={() => sync('highlevel')}>Sync</button>
        </div>

        <div style={{ border: '1px solid #ddd', padding: 16 }}>
          <h3>ClickFunnels</h3>
          <button disabled={loading} onClick={() => sync('clickfunnels')}>Sync</button>
        </div>
      </div>

      <h2 style={{ marginTop: 24 }}>Status</h2>
      <ul>
        {status.map((s) => (
          <li key={s.provider}>
            {s.provider}: {s.connected ? 'connected' : 'not connected'}
            {s.last_sync ? ` • last sync: ${s.last_sync}` : ''}
          </li>
        ))}
        {status.length === 0 && <li>No connectors configured.</li>}
      </ul>
    </section>
  );
}

