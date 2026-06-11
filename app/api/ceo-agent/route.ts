/**
 * CEO Agent API route — Phase E.
 *
 * POST /api/ceo-agent              → POST ceo_agent:8051/ceo/advise
 * POST /api/ceo-agent?directive=1  → POST ceo_agent:8051/ceo/directive
 */

import { NextRequest, NextResponse } from 'next/server';

const CEO_AGENT_URL = process.env.CEO_AGENT_URL || 'http://localhost:8051';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isDirective = searchParams.get('directive') === '1';

  try {
    const body = await request.json();
    const endpoint = isDirective ? '/ceo/directive' : '/ceo/advise';
    const response = await fetch(`${CEO_AGENT_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(45_000),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `CEO agent error: ${error}` },
        { status: response.status },
      );
    }

    return NextResponse.json(await response.json());
  } catch (err) {
    console.error('[ceo-agent route] POST failed:', err);
    return NextResponse.json(
      { error: 'CEO agent unavailable' },
      { status: 503 },
    );
  }
}
