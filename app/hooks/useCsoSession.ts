/**
 * useCsoSession — Phase E
 *
 * Manages the CSO (Kong) → CEO sequential session state.
 * Kong always runs first. CEO is blocked until Kong produces a plan.
 *
 * Usage:
 *   const { messages, strategicPlan, ceoAdvice, sendToKong, sendToCEO, sessionStage, loading } =
 *     useCsoSession({ orgId, companyName, userRole });
 *
 * Session stages (mirrors HeroJourneyStage on the backend):
 *   ordinary_world     — no plan yet, Kong has not spoken
 *   call_to_adventure  — user has sent first message, Kong is producing plan
 *   meeting_mentor     — Kong has produced a plan, awaiting CEO
 *   crossing_threshold — CEO has issued advice or directive
 *   tests_and_allies   — ongoing conversation, plan exists
 */

'use client';

import { useCallback, useRef, useState } from 'react';

export type SessionStage =
  | 'ordinary_world'
  | 'call_to_adventure'
  | 'meeting_mentor'
  | 'crossing_threshold'
  | 'tests_and_allies';

export type UserRole = 'founder' | 'team_lead' | 'team_member';

export interface StrategicPriority {
  rank: number;
  what: string;
  why: string;
  framework?: string;
  next_action: string;
  confidence_tier: 'measured' | 'benchmark' | 'estimated';
}

export interface StrategicPlan {
  org_id: string;
  session_id: string;
  bottleneck: string;
  top_priorities: StrategicPriority[];
  horizon_weeks: number;
  produced_at: string;
  data_age_warning?: string;
}

export interface CEOAdvice {
  session_id: string;
  mode: 'socratic' | 'directive';
  response: string;
  grounded_in: string[];
  what_would_change_this?: string;
  confidence_tier: 'measured' | 'benchmark' | 'estimated';
  cso_plan_used: boolean;
  tool_calls_made: string[];
}

export interface SessionMessage {
  agent: 'kong' | 'ceo' | 'user';
  content: string;
  ts: number;
  confidenceTier?: string;
  lessonTriggered?: string;
}

interface UseCsoSessionOptions {
  orgId: string;
  companyName?: string;
  userRole?: UserRole;
  dataConfidence?: number;
}

interface UseCsoSessionResult {
  messages: SessionMessage[];
  strategicPlan: StrategicPlan | null;
  ceoAdvice: CEOAdvice | null;
  sessionStage: SessionStage;
  loading: boolean;
  error: string | null;
  sendToKong: (text: string) => Promise<void>;
  sendToCEO: (text: string) => Promise<void>;
  requestPlan: () => Promise<void>;
  kongSessionId: string | null;
  ceoSessionId: string | null;
}

export function useCsoSession({
  orgId,
  companyName = 'your company',
  userRole = 'founder',
  dataConfidence = 0.5,
}: UseCsoSessionOptions): UseCsoSessionResult {
  const [messages, setMessages]         = useState<SessionMessage[]>([]);
  const [strategicPlan, setStrategicPlan] = useState<StrategicPlan | null>(null);
  const [ceoAdvice, setCeoAdvice]       = useState<CEOAdvice | null>(null);
  const [sessionStage, setSessionStage] = useState<SessionStage>('ordinary_world');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const kongSessionIdRef                = useRef<string | null>(null);
  const ceoSessionIdRef                 = useRef<string | null>(null);

  const addMessage = useCallback((msg: SessionMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  // Request Kong to produce a structured plan (POST /cso/plan)
  const requestPlan = useCallback(async () => {
    if (userRole !== 'founder') return;
    setError(null);
    setLoading(true);
    setSessionStage('call_to_adventure');

    try {
      const res = await fetch('/api/cso-agent?plan=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_id:       orgId,
          company_name: companyName,
          user_role:    userRole,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Kong unavailable');
      }

      const data = await res.json();
      const plan: StrategicPlan = data.strategic_plan;
      setStrategicPlan(plan);
      setSessionStage('meeting_mentor');

      addMessage({
        agent:   'kong',
        content: data.kong_summary || 'Here's the strategic plan.',
        ts:      Date.now(),
      });

      if (data.lesson_triggered) {
        addMessage({
          agent:          'kong',
          content:        `[Lesson triggered: ${data.lesson_triggered}]`,
          ts:             Date.now(),
          lessonTriggered: data.lesson_triggered,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      setSessionStage('ordinary_world');
    } finally {
      setLoading(false);
    }
  }, [orgId, companyName, userRole, addMessage]);

  // Chat with Kong (POST /cso/chat)
  const sendToKong = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);
    setLoading(true);

    addMessage({ agent: 'user', content: text, ts: Date.now() });
    if (sessionStage === 'ordinary_world') setSessionStage('call_to_adventure');

    try {
      const res = await fetch('/api/cso-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_id:       orgId,
          company_name: companyName,
          user_role:    userRole,
          message:      text,
          session_id:   kongSessionIdRef.current,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Kong unavailable');
      }

      const data = await res.json();

      if (data.session_id && !kongSessionIdRef.current) {
        kongSessionIdRef.current = data.session_id;
      }

      if (data.strategic_plan) {
        setStrategicPlan(data.strategic_plan);
        setSessionStage('meeting_mentor');
      }

      addMessage({
        agent:           'kong',
        content:         data.message || '',
        ts:              Date.now(),
        confidenceTier:  data.confidence_tier,
        lessonTriggered: data.lesson_triggered,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      addMessage({ agent: 'kong', content: `Error: ${msg}`, ts: Date.now() });
    } finally {
      setLoading(false);
    }
  }, [orgId, companyName, userRole, loading, sessionStage, addMessage]);

  // Chat with CEO (POST /ceo/advise) — founder only, requires plan
  const sendToCEO = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    if (userRole !== 'founder') {
      setError('CEO advisor is founder-only.');
      return;
    }
    setError(null);
    setLoading(true);

    addMessage({ agent: 'user', content: text, ts: Date.now() });

    try {
      const res = await fetch('/api/ceo-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_id:          orgId,
          company_name:    companyName,
          user_role:       userRole,
          user_message:    text,
          session_id:      ceoSessionIdRef.current,
          data_confidence: dataConfidence,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'CEO agent unavailable');
      }

      const data: CEOAdvice = await res.json();

      if (data.session_id && !ceoSessionIdRef.current) {
        ceoSessionIdRef.current = data.session_id;
      }

      setCeoAdvice(data);
      setSessionStage(
        sessionStage === 'meeting_mentor' ? 'crossing_threshold' : 'tests_and_allies',
      );

      addMessage({
        agent:          'ceo',
        content:        data.response,
        ts:             Date.now(),
        confidenceTier: data.confidence_tier,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      addMessage({ agent: 'ceo', content: `Error: ${msg}`, ts: Date.now() });
    } finally {
      setLoading(false);
    }
  }, [orgId, companyName, userRole, dataConfidence, loading, sessionStage, addMessage]);

  return {
    messages,
    strategicPlan,
    ceoAdvice,
    sessionStage,
    loading,
    error,
    sendToKong,
    sendToCEO,
    requestPlan,
    kongSessionId: kongSessionIdRef.current,
    ceoSessionId:  ceoSessionIdRef.current,
  };
}
