/**
 * CFO Agent API route — Phase 3C.
 *
 * Proxies chat, alerts, provenance, and feedback to the cfo_agent service.
 * The Next.js API layer handles auth and keeps the service URL server-side.
 *
 * POST /api/cfo-agent        → POST cfo_agent:8016/cfo/chat
 * GET  /api/cfo-agent/alerts → GET  cfo_agent:8016/cfo/alerts/{org_id}
 */

import { NextRequest, NextResponse } from 'next/server';

const CFO_AGENT_URL = process.env.CFO_AGENT_URL || 'http://localhost:8016';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${CFO_AGENT_URL}/cfo/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `CFO agent error: ${error}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[cfo-agent route] POST failed:', err);
    return NextResponse.json(
      { error: 'CFO agent unavailable' },
      { status: 503 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const org_id = searchParams.get('org_id') || 'default';
  const path   = searchParams.get('path') || 'alerts';

  try {
    const url =
      path === 'alerts'
        ? `${CFO_AGENT_URL}/cfo/alerts/${org_id}`
        : `${CFO_AGENT_URL}/cfo/${path}?org_id=${org_id}`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return NextResponse.json({ alerts: [] }, { status: 200 });
    }

    return NextResponse.json(await response.json());
  } catch (err) {
    console.error('[cfo-agent route] GET failed:', err);
    return NextResponse.json({ alerts: [] });
  }
}
