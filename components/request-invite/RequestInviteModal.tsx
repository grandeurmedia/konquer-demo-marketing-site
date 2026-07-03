'use client';

import React, { useEffect, useId } from 'react';
import Script from 'next/script';

type Props = {
  open: boolean;
  onClose: () => void;
};

const GHL_FORM_ID = 'rtQUDDyOPsACJkPfEFty';
const GHL_FORM_HEIGHT = 947;

export function RequestInviteModal({ open, onClose }: Props) {
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
            Request an invite
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

        <div className="min-h-0 flex-1 overflow-y-auto rounded-xl">
          <iframe
            src={`https://link.nichefit.ai/widget/form/${GHL_FORM_ID}`}
            style={{ width: '100%', height: `${GHL_FORM_HEIGHT}px`, border: 'none', borderRadius: '4px', display: 'block' }}
            id={`inline-${GHL_FORM_ID}`}
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="Konquer - Invite Request"
            data-height={`${GHL_FORM_HEIGHT}`}
            data-layout-iframe-id={`inline-${GHL_FORM_ID}`}
            data-form-id={GHL_FORM_ID}
            title="Konquer - Invite Request"
          />
        </div>

        <Script src="https://link.nichefit.ai/js/form_embed.js" strategy="afterInteractive" />
      </div>
    </div>
  );
}
