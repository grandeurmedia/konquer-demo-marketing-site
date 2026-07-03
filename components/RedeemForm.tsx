'use client';

import { useState } from 'react';

export default function RedeemForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        code: form.get('code'),
      }),
    });
    const data = await res.json();
    setMessage(data.message);
    setStatus(data.ok ? 'done' : 'error');
  }

  if (status === 'done') {
    return (
      <p className="text-sm leading-relaxed text-gray-700">{message}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="redeem-name" className="text-sm font-medium text-gray-900">
          What&apos;s Your Name?
        </label>
        <input
          id="redeem-name"
          name="name"
          placeholder="First, Last Name"
          required
          autoComplete="name"
          className="w-full rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-black/25"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="redeem-email" className="text-sm font-medium text-gray-900">
          Enter Your Email Address
        </label>
        <input
          id="redeem-email"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-black/25"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="redeem-code" className="text-sm font-medium text-gray-900">
          Invite Code
        </label>
        <input
          id="redeem-code"
          name="code"
          placeholder="KQR-"
          required
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="w-full rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-sm uppercase tracking-wider text-gray-900 outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-400 focus:border-black/25"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-1 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-wait disabled:opacity-70"
      >
        {status === 'sending' ? 'Verifying...' : 'Submit'}
      </button>

      {status === 'error' && (
        <p role="alert" className="text-sm text-red-600">
          {message}
        </p>
      )}
    </form>
  );
}
