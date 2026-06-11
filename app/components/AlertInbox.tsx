/**
 * AlertInbox — Phase 3B
 *
 * Badge + expandable alert cards for proactive CFO agent notifications.
 * Follows the visual language of OrbMentorPanel.tsx.
 *
 * Props:
 *   alerts:      Alert[] from useCfoAgent
 *   onDismiss:   () => void — clears all alerts
 *   onActOn:     (alert: Alert) => void — opens CfoChat with pre-loaded context
 */

'use client';

import React, { useState } from 'react';
import type { Alert } from '../hooks/useCfoAgent';

const TYPE_STYLES: Record<string, { bg: string; border: string; label: string }> = {
  priority_shift: { bg: 'bg-amber-50', border: 'border-amber-400',  label: 'Priority Shift'    },
  data_stale:     { bg: 'bg-blue-50',  border: 'border-blue-400',   label: 'Data Stale'        },
  runway_critical: { bg: 'bg-red-50',  border: 'border-red-500',    label: 'Runway Critical'   },
  opportunity:    { bg: 'bg-green-50', border: 'border-green-400',  label: 'New Opportunity'   },
};

function AlertCard({
  alert,
  onActOn,
}: {
  alert: Alert;
  onActOn: (a: Alert) => void;
}) {
  const style = TYPE_STYLES[alert.type] ?? {
    bg: 'bg-gray-50', border: 'border-gray-300', label: alert.type,
  };
  const age = Math.round((Date.now() / 1000 - alert.ts) / 60);
  const ageLabel = age < 60 ? `${age}m ago` : `${Math.round(age / 60)}h ago`;

  return (
    <div className={`rounded-lg border ${style.border} ${style.bg} p-3 mb-2`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
          {style.label}
        </span>
        <span className="text-xs text-gray-400">{ageLabel}</span>
      </div>
      <p className="text-sm text-gray-800 mb-2">{alert.message}</p>
      <button
        onClick={() => onActOn(alert)}
        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        Act on this →
      </button>
    </div>
  );
}

export default function AlertInbox({
  alerts,
  onDismiss,
  onActOn,
}: {
  alerts: Alert[];
  onDismiss: () => void;
  onActOn: (alert: Alert) => void;
}) {
  const [open, setOpen] = useState(false);
  const count = alerts.length;

  if (count === 0) return null;

  return (
    <div className="relative inline-block">
      {/* Badge trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
      >
        <span>Alerts</span>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
          {count}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-10 z-50 w-80 bg-white rounded-xl border border-gray-200 shadow-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-800">
              {count} pending alert{count !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => { onDismiss(); setOpen(false); }}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Dismiss all
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {alerts.map((a, i) => (
              <AlertCard key={`${a.type}-${i}`} alert={a} onActOn={(alert) => {
                onActOn(alert);
                setOpen(false);
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
