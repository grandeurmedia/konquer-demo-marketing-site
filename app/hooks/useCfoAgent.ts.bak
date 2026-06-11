/**
 * useCfoAgent — Phase 3C
 *
 * React hook for CFO agent chat, alerts, and provenance.
 *
 * Usage:
 *   const { messages, send, loading, alerts } = useCfoAgent({ orgId, companyName });
 *
 * Manages:
 *   - Conversation history (local state, not persisted across page refresh)
 *   - Session ID (server-side session continuity via cfo_agent Redis store)
 *   - Pending alerts (polled on mount and after each send)
 *   - Loading state per message
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  toolCallsMade?: string[];
  confidenceTiers?: Record<string, string>;
  pendingAlertsSurfaced?: number;
  ts: number;
}

export interface Alert {
  type: string;
  message: string;
  org_id: string;
  ts: number;
}

interface UseCfoAgentOptions {
  orgId: string;
  companyName?: string;
  pollAlertsIntervalMs?: number;
}

interface UseCfoAgentResult {
  messages: ChatMessage[];
  send: (text: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  alerts: Alert[];
  clearAlerts: () => void;
  sessionId: string | null;
}

export function useCfoAgent({
  orgId,
  companyName = 'your company',
  pollAlertsIntervalMs = 30_000,
}: UseCfoAgentOptions): UseCfoAgentResult {
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [alerts, setAlerts]       = useState<Alert[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const pollerRef                 = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch(`/api/cfo-agent?path=alerts&org_id=${orgId}`);
      if (res.ok) {
        const data = await res.json();
        const incoming: Alert[] = data.alerts || [];
        if (incoming.length > 0) {
          setAlerts((prev) => [...prev, ...incoming]);
        }
      }
    } catch {
      // non-fatal — alerts are best-effort
    }
  }, [orgId]);

  // Poll alerts on mount
  useEffect(() => {
    fetchAlerts();
    pollerRef.current = setInterval(fetchAlerts, pollAlertsIntervalMs);
    return () => {
      if (pollerRef.current) clearInterval(pollerRef.current);
    };
  }, [fetchAlerts, pollAlertsIntervalMs]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      setError(null);
      setLoading(true);

      const userMsg: ChatMessage = { role: 'user', content: text, ts: Date.now() };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const res = await fetch('/api/cfo-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            org_id:       orgId,
            company_name: companyName,
            message:      text,
            session_id:   sessionId,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: res.statusText }));
          throw new Error(err.error || 'CFO agent error');
        }

        const data = await res.json();

        if (data.session_id && !sessionId) {
          setSessionId(data.session_id);
        }

        const assistantMsg: ChatMessage = {
          role:                   'assistant',
          content:                data.message || '',
          toolCallsMade:          data.tool_calls_made || [],
          confidenceTiers:        data.confidence_tiers || {},
          pendingAlertsSurfaced:  data.pending_alerts_surfaced || 0,
          ts: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        // Re-poll alerts after each message in case new ones were generated
        fetchAlerts();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Error: ${msg}`, ts: Date.now() },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [orgId, companyName, sessionId, loading, fetchAlerts],
  );

  const clearAlerts = useCallback(() => setAlerts([]), []);

  return { messages, send, loading, error, alerts, clearAlerts, sessionId };
}
