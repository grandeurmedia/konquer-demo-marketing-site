import { NextResponse } from 'next/server';
import { isValidCode } from '@/lib/invite-codes';

export async function POST(req: Request) {
  const { name, email, code } = await req.json();

  if (!name || !email || !code) {
    return NextResponse.json(
      { ok: false, message: 'Please fill out all fields.' },
      { status: 400 },
    );
  }

  if (!isValidCode(code)) {
    return NextResponse.json(
      { ok: false, message: "That code isn't valid. Check it and try again." },
      { status: 400 },
    );
  }

  await fetch(process.env.NICHEFIT_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, code: code.trim().toUpperCase() }),
  });

  return NextResponse.json({
    ok: true,
    message:
      'Your code is being verified and your request has been received.',
  });
}
