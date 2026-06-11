import { NextResponse } from 'next/server';

const MAX_LEN = 255;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimOrNull(v: unknown): string | null {
  if (v == null || typeof v !== 'string') return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'Waitlist is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const emailRaw = trimOrNull(o.email);
  const name = trimOrNull(o.name);
  const company = trimOrNull(o.company);

  if (!emailRaw) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }
  if (emailRaw.length > MAX_LEN || !EMAIL_RE.test(emailRaw)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (name && name.length > MAX_LEN) {
    return NextResponse.json({ error: 'Name is too long.' }, { status: 400 });
  }
  if (company && company.length > MAX_LEN) {
    return NextResponse.json({ error: 'Company is too long.' }, { status: 400 });
  }

  const payload = {
    email: emailRaw.toLowerCase(),
    name,
    company,
  };

  const res = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 201 || res.status === 204) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (res.status === 409) {
    return NextResponse.json(
      { error: 'This email is already on the waitlist.' },
      { status: 409 }
    );
  }

  const text = await res.text();
  console.error('waitlist insert failed', res.status, text);

  return NextResponse.json(
    { error: 'Could not save your signup. Try again later.' },
    { status: 500 }
  );
}
