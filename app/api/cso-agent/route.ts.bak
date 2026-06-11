/**
 * CSO Agent (Kong) API route — Phase E.
 *
 * POST /api/cso-agent         → POST cso_agent:8050/cso/chat
 * POST /api/cso-agent?plan=1  → POST cso_agent:8050/cso/plan
 * GET  /api/cso-agent         → GET  cso_agent:8050/cso/plan/{org_id}
 */

import { NextRequest, NextResponse } from 'next/server';

const CSO_AGENT_URL = process.env.CSO_AGENT_URL || 'http://localhost:8050';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isPlan = searchParams.get('plan') === '1';

  try {
    const body = await request.json();
    const endpoint = isPlan ? '/cso/plan' : '/cso/chat';
    const response = await fetch(`${CSO_AGENT_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(45_000),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Kong error: ${error}` },
        { status: response.status },
      );
    }

    return NextResponse.json(await response.json());
  } catch (err) {
    console.error('[cso-agent route] POST failed:', err);
    return NextResponse.json(
      { error: 'Kong (CSO) unavailable' },
      { status: 503 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const org_id = searchParams.get('org_id') || 'default';
  const user_role = searchParams.get('user_role') || 'founder';

  try {
    const response = await fetch(
      `${CSO_AGENT_URL}/cso/plan/${org_id}?user_role=${user_role}`,
      { signal: AbortSignal.timeout(10_000) },
    );

    if (!response.ok) {
      return NextResponse.json({ plan: null }, { status: 200 });
    }

    return NextResponse.json(await response.json());
  } catch (err) {
    console.error('[cso-agent route] GET failed:', err);
    return NextResponse.json({ plan: null });
  }
}
