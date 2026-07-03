'use client';

import React, { useEffect, useId } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MemberLoginModal({ open, onClose }: Props) {
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-100/70 p-4 backdrop-blur-md transition-opacity duration-300 ease-out"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="modal-glass-invite-panel w-full max-w-md rounded-2xl p-6 shadow-2xl transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="text-xl font-semibold tracking-tight text-gray-900">
              Member Login
            </h2>
            <p id={descId} className="mt-2 text-sm leading-relaxed text-gray-600">
              Member sign-in is not available yet. If you already have access, you&apos;ll sign in here when
              the member portal opens.
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

        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}
