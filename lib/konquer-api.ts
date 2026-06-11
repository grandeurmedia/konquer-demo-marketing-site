/**
 * konquer-api.ts
 *
 * Typed fetch wrappers for every backend endpoint the prototype consumes.
 * Base URL: NEXT_PUBLIC_ORCHESTRATOR_URL (defaults to http://localhost:8011)
 *
 * All methods return { data: T | null, error: string | null } — never throw.
 * Timeout: 5s per request.
 */

import type {
  OrchestrateRequest,
  OrchestrateResponse,
  GenerateBriefRequest,
  DailyBrief,
  LeverageScoreResponse,
  InternalLeverageScore,
  AnalyticsSummary,
  JournalItem,
  LedgerQueryResponse,
  LogOutcomeRequest,
} from './konquer-types';

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_ORCHESTRATOR_URL?.replace(/\/$/, '') ??
  'http://localhost:8011';

const TIMEOUT_MS = 5_000;

// ─── Core fetch helper ────────────────────────────────────────────────────────

interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

async function apiFetch<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { data: null, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
    }

    const data = (await res.json()) as T;
    return { data, error: null };
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === 'AbortError') {
      return { data: null, error: 'Request timed out after 5s' };
    }
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown network error',
    };
  }
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

/**
 * POST /run
 * Orchestrates today's move. Returns focus card, cascading impact, revelation,
 * and a journal_id used for outcome recording.
 */
export async function runOrchestration(
  payload: OrchestrateRequest
): Promise<ApiResult<OrchestrateResponse>> {
  return apiFetch<OrchestrateResponse>(`${BASE_URL}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/**
 * POST /daily_brief/generate
 * Generates the daily brief (Stories content: wins, moves, insights).
 */
export async function generateDailyBrief(
  payload: GenerateBriefRequest
): Promise<ApiResult<DailyBrief>> {
  return apiFetch<DailyBrief>(`${BASE_URL}/daily_brief/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/**
 * GET /metrics/leverage?org_id=&move_id=
 * Returns the leverage score + multiplier for the current move.
 */
export async function getLeverageScore(
  orgId: string,
  moveId: string
): Promise<ApiResult<LeverageScoreResponse>> {
  const params = new URLSearchParams({ org_id: orgId, move_id: moveId });
  return apiFetch<LeverageScoreResponse>(`${BASE_URL}/metrics/leverage?${params}`);
}

/**
 * GET /api/internal/leverage/score?org_id=
 * Returns the raw 4-week leverage trajectory (used by the Leverage tab chart).
 */
export async function getInternalLeverageScore(
  orgId: string
): Promise<ApiResult<InternalLeverageScore[]>> {
  const params = new URLSearchParams({ org_id: orgId });
  return apiFetch<InternalLeverageScore[]>(
    `${BASE_URL}/api/internal/leverage/score?${params}`
  );
}

/**
 * GET /analytics/summary?window_days=7
 * Returns time-to-first-value, conversion rate, move ROI summary.
 */
export async function getAnalyticsSummary(
  windowDays = 7
): Promise<ApiResult<AnalyticsSummary>> {
  const params = new URLSearchParams({ window_days: String(windowDays) });
  return apiFetch<AnalyticsSummary>(`${BASE_URL}/analytics/summary?${params}`);
}

/**
 * GET /metrics/journal/latest?org_id=&limit=10
 * Returns the most recent decisions and outcome events.
 */
export async function getJournalLatest(
  orgId: string,
  limit = 10
): Promise<ApiResult<JournalItem[]>> {
  const params = new URLSearchParams({
    org_id: orgId,
    limit: String(limit),
  });
  return apiFetch<JournalItem[]>(`${BASE_URL}/metrics/journal/latest?${params}`);
}

/**
 * GET /ledger/decisions?org_id=&limit=20
 * Returns the immutable decision log for the Decisions tab.
 */
export async function getLedgerDecisions(
  orgId: string,
  limit = 20
): Promise<ApiResult<LedgerQueryResponse>> {
  const params = new URLSearchParams({
    org_id: orgId,
    limit: String(limit),
  });
  return apiFetch<LedgerQueryResponse>(`${BASE_URL}/ledger/decisions?${params}`);
}

/**
 * POST /orchestrator/log/outcome
 * Records the user's self-reported outcome for a journaled decision.
 * Fire-and-forget — callers should not block on this.
 */
export async function logOutcome(
  payload: LogOutcomeRequest
): Promise<ApiResult<{ journal_id: string; status: string }>> {
  return apiFetch<{ journal_id: string; status: string }>(
    `${BASE_URL}/orchestrator/log/outcome`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
}
