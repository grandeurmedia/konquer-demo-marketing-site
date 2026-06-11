/**
 * CfoChat — Phase 3A
 *
 * Chat interface for the CFO/COO agent.
 * Follows the visual language of OrbMentorPanel.tsx.
 *
 * Features:
 *   - Multi-turn conversation with session continuity
 *   - Confidence tier badges on assistant messages
 *   - "Why?" quick-action button on move recommendations
 *   - Alert badge via AlertInbox
 *   - Scenario input widget ("What if...")
 *
 * Props:
 *   orgId:        string — organisation identifier
 *   companyName:  string — used in agent system prompt
 *   initialAlert: Alert | null — pre-loaded context from AlertInbox "Act on this"
 */

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import AlertInbox from './AlertInbox';
import { useCfoAgent } from '../hooks/useCfoAgent';
import type { Alert, ChatMessage } from '../hooks/useCfoAgent';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const TIER_BADGE: Record<string, { label: string; cls: string }> = {
  measured:  { label: 'Measured',  cls: 'bg-green-100 text-green-800'  },
  benchmark: { label: 'Benchmark', cls: 'bg-blue-100 text-blue-800'    },
  estimated: { label: 'Estimated', cls: 'bg-amber-100 text-amber-800'  },
};

function ConfidenceBadges({ tiers }: { tiers?: Record<string, string> }) {
  if (!tiers || Object.keys(tiers).length === 0) return null;
  const unique = [...new Set(Object.values(tiers))];
  return (
    <div className="flex gap-1 mt-1 flex-wrap">
      {unique.map((tier) => {
        const b = TIER_BADGE[tier] ?? { label: tier, cls: 'bg-gray-100 text-gray-700' };
        return (
          <span key={tier} className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${b.cls}`}>
            {b.label}
          </span>
        );
      })}
    </div>
  );
}

function MessageBubble({
  msg,
  onWhy,
}: {
  msg: ChatMessage;
  onWhy: (content: string) => void;
}) {
  const isUser = msg.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
        {!isUser && (
          <>
            <ConfidenceBadges tiers={msg.confidenceTiers} />
            {/* "Why?" button if message contains a move recommendation */}
            {/move[-_]\w+/i.test(msg.content) && (
              <button
                onClick={() => {
                  const match = msg.content.match(/move[-_]\w+/i);
                  if (match) onWhy(`Why was ${match[0]} recommended?`);
                }}
                className="mt-2 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
              >
                Why? →
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ScenarioWidget({ onSubmit }: { onSubmit: (q: string) => void }) {
  const [val, setVal] = useState('');
  const templates = [
    'What if we cut marketing spend by 30%?',
    'What if we added 20 hours per week?',
    'What if runway drops below 2 months?',
  ];
  return (
    <div className="border-t border-gray-100 pt-2 mt-1">
      <p className="text-xs text-gray-400 mb-1 px-1">What if…</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {templates.map((t) => (
          <button
            key={t}
            onClick={() => onSubmit(t)}
            className="text-xs rounded-full border border-gray-200 px-2 py-1 text-gray-600 hover:bg-gray-50 transition"
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 text-xs rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          placeholder="Custom scenario…"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && val.trim()) { onSubmit(val); setVal(''); } }}
        />
        <button
          onClick={() => { if (val.trim()) { onSubmit(val); setVal(''); } }}
          className="text-xs rounded-lg bg-indigo-600 text-white px-3 py-1.5 hover:bg-indigo-700 transition"
        >
          Ask
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function CfoChat({
  orgId,
  companyName = 'your company',
  initialAlert = null,
}: {
  orgId: string;
  companyName?: string;
  initialAlert?: Alert | null;
}) {
  const { messages, send, loading, error, alerts, clearAlerts } = useCfoAgent({
    orgId,
    companyName,
  });

  const [input, setInput]             = useState('');
  const [showScenario, setShowScenario] = useState(false);
  const bottomRef                     = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Pre-load context from alert inbox
  useEffect(() => {
    if (initialAlert) {
      send(`I have an alert: ${initialAlert.message}. What should I do?`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;
    const text = input;
    setInput('');
    await send(text);
  }, [input, loading, send]);

  const handleWhy = useCallback((q: string) => {
    send(q);
  }, [send]);

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">CFO / COO Agent</h2>
          <p className="text-xs text-gray-400">Deterministic intelligence, conversational interface</p>
        </div>
        <div className="flex items-center gap-2">
          <AlertInbox
            alerts={alerts}
            onDismiss={clearAlerts}
            onActOn={(a) => send(`I have an alert: ${a.message}. What should I do?`)}
          />
          <button
            onClick={() => setShowScenario((v) => !v)}
            className="text-xs rounded-full border border-gray-200 px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition"
          >
            What if…
          </button>
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 text-sm gap-2">
            <p className="font-medium text-gray-600">Your CFO is ready.</p>
            <p className="text-xs">Ask about runway, portfolio, risks, or "what if" scenarios.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} onWhy={handleWhy} />
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        {error && (
          <p className="text-xs text-red-500 text-center mb-2">{error}</p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Scenario widget */}
      {showScenario && (
        <div className="px-4 pb-2 bg-white border-t border-gray-100">
          <ScenarioWidget onSubmit={(q) => { send(q); setShowScenario(false); }} />
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          className="flex-1 text-sm rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
          placeholder="Ask your CFO anything…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
