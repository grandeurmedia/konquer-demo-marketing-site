'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function WaitlistModal({ open, onClose }: Props) {
  const titleId = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!open) return;
    setStatus('idle');
    setErrorMsg('');
    setEmail('');
    setName('');
    setCompany('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || status === 'success') return;
    const id = requestAnimationFrame(() => {
      emailRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open, status]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || null, company: company || null }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong.');
        return;
      }
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Try again.');
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity duration-300 ease-out"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="modal-glass-waitlist-panel w-full max-w-md rounded-2xl p-8 shadow-2xl transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-xl font-semibold tracking-tight text-gray-900">
              Join the waitlist
            </h2>
            <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
              Be first to know when Konquer opens for your team.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-black/5 hover:text-gray-700"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {status === 'success' ? (
          <div className="py-2">
            <div className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white/50 px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">You&apos;re on the list</p>
                <p className="text-xs text-gray-600 mt-0.5">We&apos;ll be in touch soon.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="waitlist-email" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Email
              </label>
              <input
                ref={emailRef}
                id="waitlist-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="w-full rounded-xl border border-gray-200/90 bg-white/60 px-3.5 py-2.5 text-sm text-gray-900 shadow-inner outline-none transition-[border,box-shadow] placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 disabled:opacity-60"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label htmlFor="waitlist-name" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Name <span className="font-normal normal-case text-gray-400">(optional)</span>
              </label>
              <input
                id="waitlist-name"
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === 'loading'}
                className="w-full rounded-xl border border-gray-200/90 bg-white/60 px-3.5 py-2.5 text-sm text-gray-900 shadow-inner outline-none transition-[border,box-shadow] placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 disabled:opacity-60"
                placeholder="Jordan Lee"
              />
            </div>
            <div>
              <label htmlFor="waitlist-company" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Company <span className="font-normal normal-case text-gray-400">(optional)</span>
              </label>
              <input
                id="waitlist-company"
                type="text"
                name="company"
                autoComplete="organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={status === 'loading'}
                className="w-full rounded-xl border border-gray-200/90 bg-white/60 px-3.5 py-2.5 text-sm text-gray-900 shadow-inner outline-none transition-[border,box-shadow] placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 disabled:opacity-60"
                placeholder="Acme Inc."
              />
            </div>

            {status === 'error' && errorMsg && (
              <p className="text-sm text-red-700" role="alert">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
            >
              {status === 'loading' ? 'Joining…' : 'Join waitlist'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
