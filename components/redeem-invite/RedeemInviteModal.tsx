'use client';

import React, { useEffect, useId } from 'react';
import RedeemForm from '@/components/RedeemForm';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function RedeemInviteModal({ open, onClose }: Props) {
  const titleId = useId();

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
        className="modal-glass-invite-panel flex w-full max-w-lg flex-col rounded-2xl p-4 shadow-2xl transition-all duration-300 ease-out"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-lg font-semibold tracking-tight text-gray-900">
            Enter your invite code
          </h2>
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

        <div className="min-h-0 flex-1 overflow-y-auto rounded-xl px-1 py-1">
          <RedeemForm />
        </div>
      </div>
    </div>
  );
}
