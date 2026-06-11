/**
 * konquer-adapters.ts
 *
 * Maps backend response shapes to the exact data constants the UI uses.
 * No JSX or CSS changes are needed — adapters produce the same TypeScript
 * types that the static fallback constants already declare.
 *
 * Each adapter is a pure function:  BackendType → UIType
 */

import type {
  OrchestrateResponse,
  DailyBrief,
  LeverageScoreResponse,
  InternalLeverageScore,
  AnalyticsSummary,
  JournalItem,
  LedgerQueryResponse,
  CascadingImpactLeg,
  DecisionPayload,
  OutcomePayload,
} from './konquer-types';

// ─── UI type aliases (mirrors what page.tsx declares inline) ──────────────────

export interface UiMove {
  action: string;
  why: string;
  metrics: Array<{ value: string; label: string }>;
  prep: string[];
}

export interface UiStory {
  id: string;
  label: string;
  headline: string;
  sub: string;
  accentColor: string;
  glowColor: string;
}

export interface UiPastMove {
  date: string;
  action: string;
  outcome: 'won' | 'progress' | 'lost';
  value: string;
}

export interface UiLeverageWeek {
  week: string;
  score: number;
  driver: string;
}

export interface UiTimeSegment {
  label: string;
  hours: number;
  pct: number;
  color: string;
  note: string;
}

export type UiImpact = 'positive' | 'neutral' | 'negative';

export interface UiTeamRipple {
  name: string;
  initial: string;
  role: string;
  impact: UiImpact;
  decision: string;
  consequence: string;
  betterOption: string;
  tradeoff: string | null;
  forward: string | null;
}

export interface UiTeamDetail {
  name: string;
  initial: string;
  role: string;
  status: 'on-track' | 'pending' | 'at-risk' | 'critical';
  pipeline: string;
  pipelineNote: string;
  thisWeek: Array<{ decision: string; impact: string }>;
  nextAction: string;
  deadline: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  multiplierNote: string;
}

export interface UiDecision {
  date: string;
  text: string;
  consequence: string;
  betterOption: string;
  tradeoff: string | null;
  forward: string | null;
  type: 'won' | 'progress' | 'lost';
}

// ─── adaptMove ────────────────────────────────────────────────────────────────

/**
 * Converts OrchestrateResponse → UiMove (the move card on the home screen).
 *
 * focus_card.today.one_line   → action
 * focus_card.why              → why
 * focus_card.today.features   → metrics (money_lift, time_to_value_days, effort, certainty)
 * focus_card.leading_indicators or preflight → prep bullets
 */
export function adaptMove(resp: OrchestrateResponse): UiMove {
  const fc = resp.focus_card;
  const today = fc.today;
  const f = today?.features ?? {};

  const moneyLift = f.money_lift != null ? `$${abbreviate(f.money_lift)}` : '—';
  const timeToValue =
    f.time_to_value_days != null ? `${f.time_to_value_days} day${f.time_to_value_days !== 1 ? 's' : ''}` : '—';
  const effort = effortLabel(f.effort_friction ?? null);
  const certainty = f.certainty != null ? `${Math.round(f.certainty * 100)}%` : '—';

  // Prefer leading_indicators → preflight keys → fall back to empty
  const prep: string[] = fc.leading_indicators?.slice(0, 4) ?? [];
  if (prep.length === 0 && fc.preflight && typeof fc.preflight === 'object') {
    prep.push(
      ...Object.entries(fc.preflight)
        .slice(0, 4)
        .map(([k, v]) => `${k}: ${v}`)
    );
  }

  return {
    action: today?.one_line ?? 'No move available.',
    why: fc.why ?? '',
    metrics: [
      { value: moneyLift, label: 'Revenue' },
      { value: timeToValue, label: 'Time' },
      { value: effort, label: 'Effort' },
      { value: certainty, label: 'Certainty' },
    ],
    prep,
  };
}

// ─── adaptStories ─────────────────────────────────────────────────────────────

/**
 * Converts DailyBrief → UiStory[].
 *
 * The brief's `moves` array + `context` string map to individual slides.
 * Slide 0 = top win (highest confidence move from brief).
 * Slide 1 = milestone (context string).
 * Slide 2+ = remaining brief moves.
 *
 * Confidence thresholds drive accent colors:
 *   ≥ 0.80 → green (revenue confirmation)
 *   ≥ 0.60 → amber (strategic progress)
 *   < 0.60 → sage (learnings / exploration)
 */
const ACCENT_BY_CONFIDENCE: Array<{ min: number; accent: string; glow: string }> = [
  { min: 0.8, accent: '#4ADE80', glow: 'rgba(74, 222, 128, 0.09)' },
  { min: 0.6, accent: '#C4976A', glow: 'rgba(196, 151, 106, 0.13)' },
  { min: 0,   accent: '#A8C4B0', glow: 'rgba(168, 196, 176, 0.08)' },
];

function accentForConfidence(c: number): { accent: string; glow: string } {
  for (const tier of ACCENT_BY_CONFIDENCE) {
    if (c >= tier.min) return { accent: tier.accent, glow: tier.glow };
  }
  return { accent: '#A8C4B0', glow: 'rgba(168, 196, 176, 0.08)' };
}

export function adaptStories(brief: DailyBrief): UiStory[] {
  const sorted = [...brief.moves].sort((a, b) => b.confidence - a.confidence);

  const slides: UiStory[] = sorted.map((move, i) => {
    const { accent, glow } = accentForConfidence(move.confidence);
    return {
      id: move.move_id ?? `brief-${i}`,
      label: i === 0 ? formatBriefDate(brief.date) : move.action_type ?? 'Insight',
      headline: move.title,
      sub: move.why ?? move.predicted_impact,
      accentColor: accent,
      glowColor: glow,
    };
  });

  // Inject a milestone/context slide after the top win if context is present
  if (brief.context && slides.length > 0) {
    slides.splice(1, 0, {
      id: 'context',
      label: 'This Week',
      headline: brief.context.split('.')[0].trim(),
      sub: brief.context,
      accentColor: '#C4976A',
      glowColor: 'rgba(196, 151, 106, 0.13)',
    });
  }

  return slides;
}

// ─── adaptLeverageWeeks ───────────────────────────────────────────────────────

/**
 * Converts an array of InternalLeverageScore → UiLeverageWeek[].
 *
 * ls_score (0–100) becomes the score.
 * week_label or as_of becomes the week label.
 * notes[0] (if present) becomes driver text.
 */
export function adaptLeverageWeeks(
  scores: InternalLeverageScore[]
): UiLeverageWeek[] {
  return scores.map((s, i) => ({
    week: s.week_label ?? s.as_of ?? `Week ${i + 1}`,
    score: Math.round(s.score),
    driver: `Leverage multiplier: ${s.multiplier.toFixed(1)}×`,
  }));
}

/**
 * Converts a single LeverageScoreResponse into a one-entry UiLeverageWeek[].
 * Used when only the current week's data is available.
 */
export function adaptLeverageScoreToWeeks(
  resp: LeverageScoreResponse
): UiLeverageWeek[] {
  return [
    {
      week: resp.as_of,
      score: Math.round((resp.ls_score ?? resp.leverage_multiplier * 25)),
      driver: resp.notes[0] ?? `${resp.leverage_multiplier.toFixed(1)}× multiplier`,
    },
  ];
}

// ─── adaptTimeSegments ────────────────────────────────────────────────────────

/**
 * Converts AnalyticsSummary → UiTimeSegment[].
 *
 * The analytics summary has scalar aggregates — not per-segment breakdowns.
 * We synthesize three canonical segments from available signals:
 *
 *   1. Revenue-generating   → derived from net_value_usd / ttfv
 *   2. Strategic positioning → remainder of proven execution time
 *   3. Reactive & absorbed  → inferred from low-ROI events
 *
 * When richer per-category data is available from the Journal service,
 * prefer adaptJournalTimeSegments instead.
 */
export function adaptTimeSegments(summary: AnalyticsSummary): UiTimeSegment[] {
  const netValue = summary.net_value_usd ?? 0;
  const ttfvMin = summary.ttfv_median_minutes ?? 0;
  const revenueHours = ttfvMin > 0 ? ttfvMin / 60 : 2.5;

  // Simple heuristic: revenue hours + 40% buffer for strategic, remainder reactive
  const totalTrackedHours = revenueHours * 3.8;
  const strategicHours = Math.round(totalTrackedHours * 0.42 * 10) / 10;
  const reactiveHours = Math.round((totalTrackedHours - revenueHours - strategicHours) * 10) / 10;
  const total = revenueHours + strategicHours + reactiveHours;

  const revPct = Math.round((revenueHours / total) * 100);
  const strPct = Math.round((strategicHours / total) * 100);
  const reactPct = 100 - revPct - strPct;

  const perHour =
    revenueHours > 0 && netValue > 0
      ? `$${abbreviate(netValue / revenueHours)} per focused hour.`
      : '';

  return [
    {
      label: 'Revenue-generating execution',
      hours: revenueHours,
      pct: revPct,
      color: '#4ADE80',
      note: `${netValue > 0 ? `$${abbreviate(netValue)} produced. ` : ''}${perHour}`,
    },
    {
      label: 'Strategic positioning',
      hours: strategicHours,
      pct: strPct,
      color: '#C4976A',
      note: 'Planning, positioning, and pipeline development.',
    },
    {
      label: 'Reactive & absorbed',
      hours: reactiveHours,
      pct: reactPct,
      color: 'rgba(248,113,113,0.75)',
      note: 'Reactive tasks and context-switching overhead.',
    },
  ];
}

// ─── adaptTeamRipple ──────────────────────────────────────────────────────────

/**
 * Converts CascadingResultContract.cascading_impacts → UiTeamRipple[].
 *
 * Each CascadingImpactLeg maps to one team member row. The "decision" text
 * is reconstructed from the enabled_moves + evidence fields.
 */
export function adaptTeamRipple(legs: CascadingImpactLeg[]): UiTeamRipple[] {
  return legs.map((leg) => {
    const impact: UiImpact =
      leg.projected_value > 0 ? 'positive' : leg.projected_value < 0 ? 'negative' : 'neutral';

    return {
      name: leg.who,
      initial: leg.who.charAt(0).toUpperCase(),
      role: leg.role,
      impact,
      decision: leg.enabled_moves[0] ?? 'Decision recorded',
      consequence:
        leg.evidence[0] ??
        `${leg.who} has ${leg.freed_hours}h freed. Projected value: $${abbreviate(leg.projected_value)}.`,
      betterOption: leg.assumptions[0] ?? 'No alternative identified at current data confidence.',
      tradeoff: leg.assumptions[1] ?? null,
      forward:
        leg.timeline === 'DAYS_7'
          ? `Act within 7 days — this window closes quickly.`
          : leg.timeline === 'DAYS_30'
          ? `Follow up within 30 days to sustain momentum.`
          : `Align on next steps within the quarter.`,
    };
  });
}

/**
 * Converts CascadingImpactLeg[] → UiTeamDetail[].
 * Team Detail tab requires slightly richer context than Ripple Effect.
 */
export function adaptTeamDetail(legs: CascadingImpactLeg[]): UiTeamDetail[] {
  return legs.map((leg) => {
    const confidenceStatus: UiTeamDetail['status'] =
      leg.confidence === 'HIGH'
        ? 'on-track'
        : leg.confidence === 'MEDIUM'
        ? 'pending'
        : 'at-risk';

    return {
      name: leg.who,
      initial: leg.who.charAt(0).toUpperCase(),
      role: leg.role,
      status: confidenceStatus,
      pipeline: leg.enabled_moves[0] ?? '—',
      pipelineNote:
        leg.evidence[0] ??
        `${leg.freed_hours}h freed. Confidence: ${leg.confidence}.`,
      thisWeek: leg.enabled_moves.slice(0, 2).map((m) => ({
        decision: m,
        impact: `Projected value: $${abbreviate(leg.projected_value)}.`,
      })),
      nextAction: leg.assumptions[0] ?? 'Review status with team member.',
      deadline:
        leg.timeline === 'DAYS_7'
          ? 'This week'
          : leg.timeline === 'DAYS_30'
          ? 'This month'
          : 'This quarter',
      urgency:
        leg.confidence === 'HIGH'
          ? 'low'
          : leg.confidence === 'MEDIUM'
          ? 'medium'
          : 'high',
      multiplierNote: `$${abbreviate(leg.freed_value)} freed. $${abbreviate(leg.projected_value)} projected.`,
    };
  });
}

// ─── adaptPastMoves ───────────────────────────────────────────────────────────

/**
 * Converts JournalItem[] (event_type = 'decision.logged' | 'outcome.logged')
 * → UiPastMove[].
 *
 * Decision items with a matching outcome are annotated with won/lost/progress.
 * Decision items without a matched outcome default to 'progress'.
 */
export function adaptPastMoves(items: JournalItem[]): UiPastMove[] {
  const outcomes = new Map<string, OutcomePayload>();
  items
    .filter((i) => i.event_type === 'outcome.logged')
    .forEach((i) => {
      const p = i.payload as unknown as OutcomePayload;
      if (p.journal_id) outcomes.set(p.journal_id, p);
    });

  return items
    .filter((i) => i.event_type === 'decision.logged')
    .slice(0, 5)
    .map((item) => {
      const p = item.payload as unknown as DecisionPayload;
      const outcome = outcomes.get(p.move_id);

      let type: UiPastMove['outcome'] = 'progress';
      if (outcome) {
        type =
          outcome.actual_money_lift > 0
            ? 'won'
            : outcome.actual_money_lift < 0
            ? 'lost'
            : 'progress';
      } else if (p.go_no_go === 'NO_GO') {
        type = 'lost';
      }

      const [p10, p90] = p.predicted_money_lift_p10_p90 ?? [0, 0];
      const midpoint = (p10 + p90) / 2;

      return {
        date: formatJournalDate(item.ts),
        action: p.one_line ?? '—',
        outcome: type,
        value: midpoint > 0 ? `$${abbreviate(midpoint)}` : '$0',
      };
    });
}

// ─── adaptDecisions ───────────────────────────────────────────────────────────

/**
 * Converts LedgerEntry[] + JournalItem[] → UiDecision[].
 *
 * Ledger entries provide the immutable record.
 * Journal items (outcome.logged) provide the actual_money_lift signal.
 */
export function adaptDecisions(
  ledger: LedgerQueryResponse,
  journal: JournalItem[]
): UiDecision[] {
  // Build a quick lookup: decision_id → outcome payload
  const outcomeMap = new Map<string, OutcomePayload>();
  journal
    .filter((i) => i.event_type === 'outcome.logged')
    .forEach((i) => {
      const p = i.payload as unknown as OutcomePayload;
      outcomeMap.set(p.journal_id, p);
    });

  return ledger.entries.slice(0, 10).map((entry) => {
    const outcome = outcomeMap.get(entry.decision_id);
    const result = entry.result as Record<string, unknown> | undefined;
    const params = entry.params as Record<string, unknown> | undefined;

    let type: UiDecision['type'] = 'progress';
    if (outcome) {
      type =
        outcome.actual_money_lift > 0
          ? 'won'
          : outcome.actual_money_lift < 0
          ? 'lost'
          : 'progress';
    }

    const consequence =
      typeof result?.summary === 'string'
        ? result.summary
        : outcome
        ? `$${abbreviate(Math.abs(outcome.actual_money_lift))} ${outcome.actual_money_lift >= 0 ? 'gained' : 'lost'}.`
        : 'Outcome pending.';

    return {
      date: formatLedgerDate(entry.created_at),
      text:
        (params?.one_line as string) ??
        (params?.intent as string) ??
        entry.decision_type,
      consequence,
      betterOption: (result?.better_option as string) ?? 'No alternative recorded.',
      tradeoff: (result?.tradeoff as string) ?? null,
      forward: (result?.forward as string) ?? null,
      type,
    };
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function abbreviate(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(Math.round(n));
}

function effortLabel(friction: number | null): string {
  if (friction === null) return '—';
  if (friction <= 0.3) return 'Low';
  if (friction <= 0.6) return 'Medium';
  return 'High';
}

function formatBriefDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatJournalDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatLedgerDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}`;
  } catch {
    return iso;
  }
}
