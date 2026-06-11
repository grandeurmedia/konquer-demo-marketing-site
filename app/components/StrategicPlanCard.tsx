/**
 * StrategicPlanCard — Phase E
 *
 * Renders a StrategicPlan as a compact, scannable card.
 *
 * - Priority 1 always visible; 2 and 3 collapsed by default (protects focus)
 * - Confidence badge on each priority
 * - "Act on this" → opens CFO chat with priority pre-loaded
 * - Data age warning surfaced when present
 */

'use client';

import React, { useState } from 'react';
import type { StrategicPlan, StrategicPriority } from '../hooks/useCsoSession';

// ---------------------------------------------------------------------------
// Confidence badges
// ---------------------------------------------------------------------------

const TIER_BADGE: Record<string, { label: string; cls: string }> = {
  measured:  { label: 'Measured',  cls: 'bg-green-100 text-green-700'  },
  benchmark: { label: 'Benchmark', cls: 'bg-blue-100 text-blue-700'    },
  estimated: { label: 'Estimated', cls: 'bg-amber-100 text-amber-700'  },
};

function ConfidenceBadge({ tier }: { tier: string }) {
  const b = TIER_BADGE[tier] ?? { label: tier, cls: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${b.cls}`}>
      {b.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Priority row
// ---------------------------------------------------------------------------

function PriorityRow({
  priority,
  isOpen,
  onToggle,
  onActOn,
}: {
  priority: StrategicPriority;
  isOpen: boolean;
  onToggle: () => void;
  onActOn: (priority: StrategicPriority) => void;
}) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition"
      >
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center mt-0.5">
          {priority.rank}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-snug">{priority.what}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ConfidenceBadge tier={priority.confidence_tier} />
          <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Expanded detail */}
      {isOpen && (
        <div className="px-4 pb-4 pt-1 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-600 leading-relaxed mb-2">{priority.why}</p>
          {priority.framework && (
            <p className="text-xs text-indigo-500 mb-2">Framework: {priority.framework}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs font-medium text-gray-700">
              Next: <span className="text-gray-900">{priority.next_action}</span>
            </p>
            <button
              onClick={() => onActOn(priority)}
              className="text-xs rounded-lg bg-indigo-600 text-white px-3 py-1.5 hover:bg-indigo-700 transition font-medium"
            >
              Act on this
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main card
// ---------------------------------------------------------------------------

export default function StrategicPlanCard({
  plan,
  onActOn,
}: {
  plan: StrategicPlan;
  onActOn?: (priority: StrategicPriority) => void;
}) {
  // Priority 1 open by default, rest collapsed
  const [openIdx, setOpenIdx] = useState<Set<number>>(new Set([0]));

  const toggle = (idx: number) => {
    setOpenIdx((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleActOn = (priority: StrategicPriority) => {
    onActOn?.(priority);
  };

  const producedDate = new Date(plan.produced_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1">
              Strategic Plan
            </p>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug">
              Bottleneck: {plan.bottleneck}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-400">{plan.horizon_weeks}w horizon</p>
            <p className="text-xs text-gray-400 mt-0.5">{producedDate}</p>
          </div>
        </div>

        {plan.data_age_warning && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
            <span className="text-amber-500 text-xs mt-0.5">!</span>
            <p className="text-xs text-amber-700">{plan.data_age_warning}</p>
          </div>
        )}
      </div>

      {/* Priorities */}
      <div className="px-4 py-3 flex flex-col gap-2">
        {plan.top_priorities.map((priority, idx) => (
          <PriorityRow
            key={priority.rank}
            priority={priority}
            isOpen={openIdx.has(idx)}
            onToggle={() => toggle(idx)}
            onActOn={handleActOn}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-2 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-400">
          Kong's plan · {plan.top_priorities.length} priorit{plan.top_priorities.length === 1 ? 'y' : 'ies'}
        </p>
      </div>
    </div>
  );
}
