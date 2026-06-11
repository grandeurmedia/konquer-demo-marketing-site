/**
 * KongChat — Phase E
 *
 * Chat interface for Kong (CSO) + CEO sequential session.
 * Kong goes first. CEO appears after Kong produces a plan (founder only).
 *
 * Role behavior:
 *   founder    → sees Kong (full strategy) + CEO panel + StrategicPlanCard
 *   team_lead  → sees Kong (operational direction), no CEO panel
 *   team_member → sees Kong (their move + encouragement), no CEO panel
 *
 * Positioned bottom-left (hero journey design: non-intrusive companion).
 *
 * Props:
 *   orgId:        string
 *   companyName:  string
 *   userRole:     UserRole
 *   dataConfidence: number (0–1) — drives CEO mode detection
 */

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import StrategicPlanCard from './StrategicPlanCard';
import { useCsoSession } from '../hooks/useCsoSession';
import type { SessionMessage, SessionStage, StrategicPriority, UserRole } from '../hooks/useCsoSession';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const AGENT_STYLES: Record<string, { label: string; bubble: string; name: string }> = {
  user: {
    label: '',
    name: 'You',
    bubble: 'bg-indigo-600 text-white ml-auto',
  },
  kong: {
    label: 'K',
    name: 'Kong',
    bubble: 'bg-white border border-gray-200 text-gray-800 shadow-sm',
  },
  ceo: {
    label: 'C',
    name: 'CEO Advisor',
    bubble: 'bg-violet-50 border border-violet-200 text-gray-800 shadow-sm',
  },
};

const TIER_BADGE: Record<string, { label: string; cls: string }> = {
  measured:  { label: 'Measured',  cls: 'bg-green-100 text-green-700'  },
  benchmark: { label: 'Benchmark', cls: 'bg-blue-100 text-blue-700'    },
  estimated: { label: 'Estimated', cls: 'bg-amber-100 text-amber-700'  },
};

function AgentAvatar({ agent }: { agent: string }) {
  const style = AGENT_STYLES[agent] ?? AGENT_STYLES.kong;
  if (agent === 'user') return null;
  return (
    <div
      className={`
        flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
        text-xs font-bold
        ${agent === 'ceo' ? 'bg-violet-100 text-violet-700' : 'bg-indigo-100 text-indigo-700'}
      `}
    >
      {style.label}
    </div>
  );
}

function MessageBubble({ msg }: { msg: SessionMessage }) {
  const style = AGENT_STYLES[msg.agent] ?? AGENT_STYLES.kong;
  const isUser = msg.agent === 'user';

  return (
    <div className={`flex items-end gap-2 mb-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <AgentAvatar agent={msg.agent} />
      <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${style.bubble}`}>
        {!isUser && (
          <p className="text-xs font-semibold mb-1 opacity-60">{style.name}</p>
        )}
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
        {msg.confidenceTier && !isUser && (
          <span className={`inline-flex items-center mt-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${TIER_BADGE[msg.confidenceTier]?.cls ?? 'bg-gray-100 text-gray-600'}`}>
            {TIER_BADGE[msg.confidenceTier]?.label ?? msg.confidenceTier}
          </span>
        )}
      </div>
    </div>
  );
}

function StageIndicator({ stage }: { stage: SessionStage }) {
  const labels: Record<SessionStage, string> = {
    ordinary_world:     'Ready',
    call_to_adventure:  'Diagnosing...',
    meeting_mentor:     'Plan ready',
    crossing_threshold: 'CEO advised',
    tests_and_allies:   'In session',
  };
  const dots: Record<SessionStage, number> = {
    ordinary_world: 1,
    call_to_adventure: 2,
    meeting_mentor: 3,
    crossing_threshold: 4,
    tests_and_allies: 5,
  };
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              n <= dots[stage] ? 'bg-indigo-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400">{labels[stage]}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

type ActiveAgent = 'kong' | 'ceo';

export default function KongChat({
  orgId,
  companyName = 'your company',
  userRole = 'founder',
  dataConfidence = 0.5,
}: {
  orgId: string;
  companyName?: string;
  userRole?: UserRole;
  dataConfidence?: number;
}) {
  const {
    messages,
    strategicPlan,
    ceoAdvice,
    sessionStage,
    loading,
    error,
    sendToKong,
    sendToCEO,
    requestPlan,
  } = useCsoSession({ orgId, companyName, userRole, dataConfidence });

  const [input, setInput]               = useState('');
  const [activeAgent, setActiveAgent]   = useState<ActiveAgent>('kong');
  const [showPlan, setShowPlan]         = useState(false);
  const bottomRef                       = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Surface plan card when plan arrives
  useEffect(() => {
    if (strategicPlan && !showPlan) setShowPlan(true);
  }, [strategicPlan]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;
    const text = input;
    setInput('');
    if (activeAgent === 'ceo') {
      await sendToCEO(text);
    } else {
      await sendToKong(text);
    }
  }, [input, loading, activeAgent, sendToKong, sendToCEO]);

  const handleActOnPriority = useCallback((priority: StrategicPriority) => {
    sendToKong(`Let's focus on: ${priority.what}. Next action: ${priority.next_action}`);
    setShowPlan(false);
  }, [sendToKong]);

  const canUseCEO = userRole === 'founder';
  const planReady = !!strategicPlan;

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-900">Kong</h2>
            {canUseCEO && (
              <span className="text-gray-300 text-xs">+</span>
            )}
            {canUseCEO && (
              <h2 className="text-sm font-semibold text-violet-600">CEO Advisor</h2>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Your strategic compass</p>
        </div>
        <div className="flex items-center gap-2">
          <StageIndicator stage={sessionStage} />
          {planReady && (
            <button
              onClick={() => setShowPlan((v) => !v)}
              className="text-xs rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 px-3 py-1.5 hover:bg-indigo-100 transition font-medium"
            >
              {showPlan ? 'Hide plan' : 'View plan'}
            </button>
          )}
          {userRole === 'founder' && !planReady && (
            <button
              onClick={requestPlan}
              disabled={loading}
              className="text-xs rounded-full border border-gray-200 px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition disabled:opacity-40"
            >
              Get strategic plan
            </button>
          )}
        </div>
      </div>

      {/* Strategic Plan Card (collapsible) */}
      {showPlan && strategicPlan && (
        <div className="px-4 pt-3 pb-1">
          <StrategicPlanCard
            plan={strategicPlan}
            onActOn={handleActOnPriority}
          />
        </div>
      )}

      {/* CEO advice summary (crossing_threshold+) */}
      {ceoAdvice && sessionStage !== 'ordinary_world' && (
        <div className="mx-4 mt-2 rounded-xl bg-violet-50 border border-violet-100 px-4 py-3">
          <p className="text-xs font-semibold text-violet-500 mb-1 uppercase tracking-wide">
            CEO · {ceoAdvice.mode === 'socratic' ? 'Question' : 'Directive'}
          </p>
          <p className="text-sm text-gray-800 leading-relaxed">{ceoAdvice.response}</p>
          {ceoAdvice.what_would_change_this && (
            <p className="text-xs text-gray-500 mt-2 italic">{ceoAdvice.what_would_change_this}</p>
          )}
        </div>
      )}

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-4 py-3 mt-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 text-sm gap-2 px-4">
            <p className="font-medium text-gray-600">Kong is ready.</p>
            <p className="text-xs leading-relaxed">
              {userRole === 'founder'
                ? 'Ask anything strategic, or request your plan to get started.'
                : userRole === 'team_lead'
                ? 'Ask Kong for your team\'s priorities and direction.'
                : 'Ask Kong what your next move is and why it matters.'}
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {loading && (
          <div className="flex items-end gap-2 mb-3">
            <AgentAvatar agent={activeAgent} />
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

      {/* Agent toggle (founder only, after plan exists) */}
      {canUseCEO && planReady && (
        <div className="px-4 pb-2 bg-white border-t border-gray-100 pt-2 flex gap-1">
          <button
            onClick={() => setActiveAgent('kong')}
            className={`flex-1 text-xs rounded-lg py-1.5 font-medium transition ${
              activeAgent === 'kong'
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Kong
          </button>
          <button
            onClick={() => setActiveAgent('ceo')}
            className={`flex-1 text-xs rounded-lg py-1.5 font-medium transition ${
              activeAgent === 'ceo'
                ? 'bg-violet-600 text-white'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            CEO Advisor
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          className={`flex-1 text-sm rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 bg-gray-50 ${
            activeAgent === 'ceo'
              ? 'border-violet-200 focus:ring-violet-400'
              : 'border-gray-200 focus:ring-indigo-400'
          }`}
          placeholder={
            activeAgent === 'ceo'
              ? 'Ask the CEO advisor…'
              : 'Ask Kong…'
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className={`rounded-xl text-white px-4 py-2.5 text-sm font-medium disabled:opacity-40 transition ${
            activeAgent === 'ceo'
              ? 'bg-violet-600 hover:bg-violet-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
