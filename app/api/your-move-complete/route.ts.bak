import { NextResponse } from 'next/server';

/**
 * Records Your Next Move demo completion. Requires Supabase table `user_move_completions`
 * (see plan) when persisting; otherwise returns ok without storage.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const o = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
  const taskKey = typeof o.taskKey === 'string' ? o.taskKey : 'your_next_move_demo';
  const completedAt = typeof o.completedAt === 'string' ? o.completedAt : new Date().toISOString();

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { ok: true, persisted: false, message: 'Supabase not configured; completion not stored.' },
      { status: 200 }
    );
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/user_move_completions`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      task_key: taskKey,
      completed_at: completedAt,
      surface: 'landing',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.warn('your-move-complete insert failed', res.status, text);
    return NextResponse.json(
      { ok: true, persisted: false, warning: 'Create table user_move_completions or check RLS.' },
      { status: 200 }
    );
  }

  return NextResponse.json({ ok: true, persisted: true });
}
