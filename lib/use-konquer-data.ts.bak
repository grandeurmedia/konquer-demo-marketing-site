/**
 * use-konquer-data.ts  (Law 3 — Separation of Concerns)
 *
 * Data-fetching hook for the Konquer prototype. Owns all API orchestration
 * and maps backend responses to UI shapes via konquer-adapters.
 *
 * This file has no knowledge of React component structure or JSX.
 * It knows only: fetch data → adapt → return state.
 *
 * Usage:
 *   const data = useKonquerData(staticFallbacks);
 *
 * Behaviour:
 *   - When NEXT_PUBLIC_DEMO_MODE=true or NEXT_PUBLIC_ORCHESTRATOR_URL is unset,
 *     the hook returns the static fallbacks immediately (zero API calls).
 *   - When the URL is configured and demo mode is off, all endpoints are fetched
 *     in parallel. Each succeeds or fails independently — any failure leaves the
 *     corresponding slice at its static fallback value.
 */

'use client';

import { useState, useEffect } from 'react';
import {
  runOrchestration,
  generateDailyBrief,
  getInternalLeverageScore,
  getAnalyticsSummary,
  getJournalLatest,
  getLedgerDecisions,
} from '@/lib/konquer-api';
import {
  adaptMove,
  adaptStories,
  adaptLeverageWeeks,
  adaptTimeSegments,
  adaptTeamRipple,
  adaptTeamDetail,
  adaptPastMoves,
  adaptDecisions,
  type UiMove,
  type UiStory,
  type UiPastMove,
  type UiLeverageWeek,
  type UiTimeSegment,
  type UiTeamRipple,
  type UiTeamDetail,
  type UiDecision,
} from '@/lib/konquer-adapters';

// ─── Env ─────────────────────────────────────────────────────────────────────

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const ORCHESTRATOR_URL = process.env.NEXT_PUBLIC_ORCHESTRATOR_URL;
const DEFAULT_ORG_ID = process.env.NEXT_PUBLIC_DEFAULT_ORG_ID ?? 'demo';

// ─── Contract ─────────────────────────────────────────────────────────────────

/**
 * Static fallback data passed in by the caller (page.tsx).
 * The hook never imports these values directly — it only receives them,
 * ensuring full separation between data-fetching logic and demo data.
 */
export interface KonquerFallbacks {
  move: UiMove;
  stories: UiStory[];
  pastMoves: UiPastMove[];
  leverageWeeks: UiLeverageWeek[];
  timeSegments: UiTimeSegment[];
  teamRipple: UiTeamRipple[];
  teamDetail: UiTeamDetail[];
  decisions: UiDecision[];
}

export interface KonquerData extends KonquerFallbacks {
  loading: boolean;
  /** journal_id from the last /run call — used by outcome recording */
  journalId: string | null;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useKonquerData(fallbacks: KonquerFallbacks): KonquerData {
  const [move, setMove] = useState<UiMove>(fallbacks.move);
  const [stories, setStories] = useState<UiStory[]>(fallbacks.stories);
  const [pastMoves, setPastMoves] = useState<UiPastMove[]>(fallbacks.pastMoves);
  const [leverageWeeks, setLeverageWeeks] = useState<UiLeverageWeek[]>(fallbacks.leverageWeeks);
  const [timeSegments, setTimeSegments] = useState<UiTimeSegment[]>(fallbacks.timeSegments);
  const [teamRipple, setTeamRipple] = useState<UiTeamRipple[]>(fallbacks.teamRipple);
  const [teamDetail, setTeamDetail] = useState<UiTeamDetail[]>(fallbacks.teamDetail);
  const [decisions, setDecisions] = useState<UiDecision[]>(fallbacks.decisions);
  const [loading, setLoading] = useState(false);
  const [journalId, setJournalId] = useState<string | null>(null);

  useEffect(() => {
    // Prototype / demo mode — return static fallbacks, no API calls
    if (DEMO_MODE || !ORCHESTRATOR_URL) return;

    let cancelled = false;
    setLoading(true);

    (async () => {
      const [
        orchResult,
        briefResult,
        leverageResult,
        analyticsResult,
        journalResult,
        ledgerResult,
      ] = await Promise.all([
        runOrchestration({ founder_id: DEFAULT_ORG_ID }),
        generateDailyBrief({ user_id: DEFAULT_ORG_ID }),
        getInternalLeverageScore(DEFAULT_ORG_ID),
        getAnalyticsSummary(7),
        getJournalLatest(DEFAULT_ORG_ID, 20),
        getLedgerDecisions(DEFAULT_ORG_ID, 20),
      ]);

      if (cancelled) return;

      // Each slice is set only on success — failure leaves the fallback in place
      if (orchResult.data) {
        setMove(adaptMove(orchResult.data));

        if (orchResult.data.journal_id) {
          setJournalId(orchResult.data.journal_id);
        }

        const legs = orchResult.data.cascading_result?.cascading_impacts;
        if (legs?.length) {
          setTeamRipple(adaptTeamRipple(legs) as UiTeamRipple[]);
          setTeamDetail(adaptTeamDetail(legs) as UiTeamDetail[]);
        }
      }

      if (briefResult.data) {
        setStories(adaptStories(briefResult.data) as UiStory[]);
      }

      if (leverageResult.data) {
        setLeverageWeeks(adaptLeverageWeeks(leverageResult.data) as UiLeverageWeek[]);
      }

      if (analyticsResult.data) {
        setTimeSegments(adaptTimeSegments(analyticsResult.data) as UiTimeSegment[]);
      }

      if (journalResult.data) {
        setPastMoves(adaptPastMoves(journalResult.data) as UiPastMove[]);

        if (ledgerResult.data) {
          setDecisions(
            adaptDecisions(ledgerResult.data, journalResult.data) as UiDecision[]
          );
        }
      }

      setLoading(false);
    })();

    return () => { cancelled = true; };
     
  }, []);

  return {
    move,
    stories,
    pastMoves,
    leverageWeeks,
    timeSegments,
    teamRipple,
    teamDetail,
    decisions,
    loading,
    journalId,
  };
}
