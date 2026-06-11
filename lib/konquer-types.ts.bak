/**
 * konquer-types.ts
 *
 * TypeScript interfaces that mirror the backend Python contracts.
 * Sources:
 *   contracts/orchestrator_models.py   → OrchestrateResponse
 *   contracts/cascading_models.py      → CascadingResultContract, CascadingImpactLeg
 *   contracts/focus_models.py          → FocusResponseContract
 *   services/journal/main.py           → LogDecisionRequest, LogOutcomeRequest, JournalItem
 *   services/daily_brief/main.py       → DailyBrief, BriefMove
 *   services/orchestrator/routes_value_v2.py → LeverageScoreResponse, ValueScoreResponse, JournalItem
 *   services/analytics/main.py         → AnalyticsSummary
 *   services/ledger/                   → LedgerEntry
 */

// ─── Orchestrator /run ────────────────────────────────────────────────────────

export interface OrchestrateRequest {
  scenario?: string;
  features?: Record<string, unknown>;
  blindspots?: Array<Record<string, string>>;
  signals_used?: string[];
  founder_id?: string;
  capacity_weekly?: { hours: number; budget: number; slots: number; risk: number };
  dependencies?: Array<[string, string]>;
  horizon_weeks?: number;
  execute?: boolean;
  auto_approve?: boolean;
  user_profile?: Record<string, unknown>;
  company_metrics?: Record<string, unknown>;
  enable_memory_context?: boolean;
}

export interface OrchestrateResponse {
  scenario_used: string;
  features: Record<string, unknown>;
  blindspots: Array<Record<string, string>>;
  detectors_fired: Array<Record<string, unknown>>;
  moves_count: number;
  clarifiers: Array<Record<string, unknown>>;
  /** Focus card — today's ranked move + why + context */
  focus_card: FocusCard;
  validation?: ValidationResult;
  journal_id?: string;
  ve_breakdown?: Record<string, unknown>;
  cascading_result?: CascadingResult;
  revelation?: RevelationObject;
  integration_hints?: string[];
}

export interface FocusCard {
  /** The one-line action the user should take today */
  today: FocusMove;
  /** Next-best move after today */
  next?: FocusMove;
  /** Narrative explanation for why this move */
  why: string;
  why_score?: Record<string, number>;
  leading_indicators?: string[];
  preflight?: Record<string, unknown>;
  lesson?: string;
  strategy_stack?: StrategyStack[];
  clarifiers?: Array<Record<string, unknown>>;
  rejected_count?: number;
  timeline?: { series: unknown[]; ci: unknown };
  trust?: { money_ci?: number[]; calibration_status?: string };
  cascade_hint?: string;
}

export interface FocusMove {
  id: string;
  one_line: string;
  outcome?: string;
  features?: MoveFeatures;
  owner?: string;
  expiry_days?: number;
}

export interface MoveFeatures {
  money_lift?: number;
  time_to_value_days?: number;
  effort_friction?: number;
  certainty?: number;
  unblocks_count?: number;
  cost_of_delay_per_week?: number;
  raw?: Record<string, unknown>;
}

export interface StrategyStack {
  strategy: string;
  north_star_metric: string;
  value_velocity_per_week: number;
  time_to_first_value_days: number;
  moves: Array<{
    id: string;
    one_line: string;
    money_lift: number;
    time_to_value_days: number;
    cost_of_delay_per_week: number;
  }>;
}

export interface ValidationResult {
  go_no_go: string;
  confidence: number;
  risks: string[];
  expected_outcome?: string;
}

// ─── Revelation (Ôr) ─────────────────────────────────────────────────────────

export interface RevelationObject {
  problem_name: string;
  symptoms: string[];
  data_assessment: DataAssessment;
  anticipated_next: string[];
  produced_at: string;
  revelation_source: string;
  founder_id?: string;
}

export interface DataAssessment {
  signals_present: string[];
  signals_missing: string[];
  sufficiency: string;
  confidence_qualifier: string;
}

// ─── Cascading / Team Impact ──────────────────────────────────────────────────

export interface CascadingResult {
  direct_impact: number;
  cascading_impacts: CascadingImpactLeg[];
  total_direct: number;
  total_cascading: number;
  multiplier: number;
  confidence_weighted_value: number;
  assumptions: string[];
  verification_plan: Record<string, unknown>;
  insufficient_data: boolean;
  insufficient_data_message?: string;
}

export interface CascadingImpactLeg {
  who: string;
  role: string;
  freed_hours: number;
  freed_value: number;
  enabled_moves: string[];
  projected_value: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  assumptions: string[];
  evidence: string[];
  timeline: 'DAYS_7' | 'DAYS_30' | 'DAYS_90';
}

// ─── Daily Brief ─────────────────────────────────────────────────────────────

export interface GenerateBriefRequest {
  user_id: string;
  date?: string;
  max_moves?: number;
}

export interface BriefMove {
  move_id: string;
  title: string;
  predicted_impact: string;
  confidence: number;
  why: string;
  action_type?: string;
  action_params?: Record<string, unknown>;
}

export interface DailyBrief {
  brief_id: string;
  user_id: string;
  date: string;
  moves: BriefMove[];
  context: string;
  generated_at: string;
}

// ─── Leverage Score ───────────────────────────────────────────────────────────

export interface LeverageScoreResponse {
  org_id: string;
  move_id: string;
  leverage_multiplier: number;
  ls_score?: number;
  certainty_value?: number;
  certainty_adjusted_value?: number;
  guardrails: { capital_gate?: boolean; wip_overload?: boolean };
  leverage_delta_percent?: number;
  inputs_used: string[];
  notes: string[];
  as_of: string;
  calc_version: string;
}

export interface InternalLeverageScore {
  /** Raw score 0–100 */
  score: number;
  /** Multiplier 1–4x */
  multiplier: number;
  /** Component breakdown — optional; not all endpoints return sub-components */
  components?: {
    code?: number;
    media?: number;
    capital?: number;
    people?: number;
  };
  week_label?: string;
  as_of?: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  window_days: number;
  ttfv_median_minutes: number | null;
  net_value_usd: number | null;
  move_conversion_rate: number | null;
  agent_roi_median: number | null;
  rescope_success_rate: number | null;
}

// ─── Journal (via /metrics/journal/latest) ───────────────────────────────────

export interface JournalItem {
  ts: string;
  event_type: string;
  user_id?: string;
  payload: Record<string, unknown>;
}

/** Payload shape when event_type = 'decision.logged' */
export interface DecisionPayload {
  move_id: string;
  one_line: string;
  predicted_money_lift_p10_p90: [number, number];
  predicted_time_to_value_p10_p90: [number, number];
  confidence: number;
  go_no_go: string;
  risks: string[];
  decided_at?: string;
}

/** Payload shape when event_type = 'outcome.logged' */
export interface OutcomePayload {
  journal_id: string;
  actual_money_lift: number;
  actual_time_to_value_days: number;
  notes?: string;
}

// ─── Outcome recording ────────────────────────────────────────────────────────

export interface LogOutcomeRequest {
  journal_id: string;
  actual_money_lift: number;
  actual_time_to_value_days: number;
  notes?: string;
  cohort_id?: string;
}

// ─── Ledger ───────────────────────────────────────────────────────────────────

export interface LedgerEntry {
  id: string;
  decision_id: string;
  org_id: string;
  user_id?: string;
  pack_id?: string;
  decision_type: string;
  params?: Record<string, unknown>;
  result?: Record<string, unknown>;
  before_state?: Record<string, unknown>;
  after_state?: Record<string, unknown>;
  request_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  is_rolled_back: boolean;
}

export interface LedgerQueryResponse {
  entries: LedgerEntry[];
  total: number;
}
