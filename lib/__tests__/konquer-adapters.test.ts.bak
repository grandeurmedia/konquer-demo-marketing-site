/**
 * konquer-adapters.test.ts  (Law 6 — Validate Before You Proceed)
 *
 * Unit tests for every adapter function in konquer-adapters.ts.
 * Tests validate transformation logic — not that the function "runs",
 * but that specific inputs produce specific, correct outputs.
 *
 * Each adapter has:
 *   1. Happy path — correct transformation of a complete response
 *   2. Edge/missing data — graceful fallback when optional fields are absent
 *   3. Logic-specific — tests for non-trivial branching (confidence thresholds,
 *      outcome classification, time segment math, etc.)
 */

import {
  adaptMove,
  adaptStories,
  adaptLeverageWeeks,
  adaptLeverageScoreToWeeks,
  adaptTimeSegments,
  adaptTeamRipple,
  adaptTeamDetail,
  adaptPastMoves,
  adaptDecisions,
} from '../konquer-adapters';

import type {
  OrchestrateResponse,
  DailyBrief,
  InternalLeverageScore,
  LeverageScoreResponse,
  AnalyticsSummary,
  JournalItem,
  LedgerQueryResponse,
  CascadingImpactLeg,
} from '../konquer-types';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockFocusCard = {
  today: {
    id: 'move-001',
    one_line: 'Call Sarah to close her $18K renewal.',
    features: {
      money_lift: 18000,
      time_to_value_days: 1,
      effort_friction: 0.2,
      certainty: 0.72,
    },
  },
  why: 'This closes faster than anything on your board right now.',
  leading_indicators: ['Review last email', 'Lock renewal pricing', 'Block 2:00 PM'],
};

const mockOrchestrateResponse: OrchestrateResponse = {
  scenario_used: 'cash_crunch',
  features: {},
  blindspots: [],
  detectors_fired: [],
  moves_count: 3,
  clarifiers: [],
  focus_card: mockFocusCard,
  journal_id: 'jrn-abc123',
  cascading_result: null,
  revelation: null,
};

const mockBriefMove = {
  move_id: 'move-001',
  title: '$24K won.',
  predicted_impact: 'Nexus closed.',
  confidence: 0.92,
  why: 'Clean execution.',
  action_type: 'win',
};

const mockDailyBrief: DailyBrief = {
  brief_id: 'brief-001',
  user_id: 'demo',
  date: '2026-03-28',
  moves: [mockBriefMove],
  context: 'You generated $50K this week. Nexus is closed and compounding.',
  generated_at: '2026-03-28T09:00:00Z',
};

const mockLeverageScores: InternalLeverageScore[] = [
  { score: 41, multiplier: 1.5, week_label: 'Mar 3' },
  { score: 63, multiplier: 2.3, week_label: 'Mar 17' },
  { score: 79, multiplier: 3.1, week_label: 'Mar 24' },
];

const mockLeverageScoreResponse: LeverageScoreResponse = {
  org_id: 'demo',
  move_id: 'move-001',
  leverage_multiplier: 3.1,
  ls_score: 79,
  guardrails: {},
  inputs_used: ['journal'],
  notes: ['Nexus closed. Ripple into Marcus Q2 pipeline.'],
  as_of: '2026-03-24',
  calc_version: 'leverage_v1',
};

const mockAnalyticsSummary: AnalyticsSummary = {
  window_days: 7,
  ttfv_median_minutes: 150,
  net_value_usd: 50000,
  move_conversion_rate: 0.8,
  agent_roi_median: 12.5,
  rescope_success_rate: null,
};

const mockJournalDecision: JournalItem = {
  ts: '2026-03-28T14:00:00Z',
  event_type: 'decision.logged',
  user_id: 'demo',
  payload: {
    move_id: 'move-001',
    one_line: 'Send revised proposal to Nexus Corp',
    predicted_money_lift_p10_p90: [18000, 26000],
    predicted_time_to_value_p10_p90: [1, 3],
    confidence: 0.82,
    go_no_go: 'GO',
    risks: [],
  },
};

const mockJournalOutcome: JournalItem = {
  ts: '2026-03-28T18:00:00Z',
  event_type: 'outcome.logged',
  user_id: 'demo',
  payload: {
    journal_id: 'move-001',
    actual_money_lift: 24000,
    actual_time_to_value_days: 1,
    notes: 'won',
  },
};

const mockCascadingLeg: CascadingImpactLeg = {
  who: 'Marcus T.',
  role: 'Account Executive',
  freed_hours: 3,
  freed_value: 6000,
  enabled_moves: ['Closed Nexus Corp gave Marcus a revenue anchor'],
  projected_value: 31000,
  confidence: 'HIGH',
  assumptions: ['Close Nexus before Q2 pitch', 'Send term sheet by Apr 2'],
  evidence: ['Marcus advanced the deal the same day the Nexus close was confirmed'],
  timeline: 'DAYS_7',
};

const mockLedgerResponse: LedgerQueryResponse = {
  entries: [
    {
      id: 'led-001',
      decision_id: 'move-001',
      org_id: 'demo',
      decision_type: 'move.executed',
      params: { one_line: 'Sent revised proposal to Nexus Corp' },
      result: {
        summary: 'Closed $24K. Unblocked Marcus Q2 expansion.',
        better_option: 'This was the right call.',
        tradeoff: null,
        forward: 'Send Marcus the term sheet by Apr 2.',
      },
      created_at: '2026-03-28T14:00:00Z',
      is_rolled_back: false,
    },
  ],
  total: 1,
};

// ─── adaptMove ────────────────────────────────────────────────────────────────

describe('adaptMove', () => {
  it('maps one_line to action', () => {
    const result = adaptMove(mockOrchestrateResponse);
    expect(result.action).toBe('Call Sarah to close her $18K renewal.');
  });

  it('maps why from focus_card', () => {
    const result = adaptMove(mockOrchestrateResponse);
    expect(result.why).toContain('closes faster');
  });

  it('formats money_lift as abbreviated dollar string', () => {
    const result = adaptMove(mockOrchestrateResponse);
    const revenue = result.metrics.find(m => m.label === 'Revenue');
    expect(revenue?.value).toBe('$18K');
  });

  it('formats time_to_value_days correctly for 1 day', () => {
    const result = adaptMove(mockOrchestrateResponse);
    const time = result.metrics.find(m => m.label === 'Time');
    expect(time?.value).toBe('1 day');
  });

  it('formats time_to_value_days correctly for plural days', () => {
    const resp = {
      ...mockOrchestrateResponse,
      focus_card: {
        ...mockFocusCard,
        today: { ...mockFocusCard.today, features: { ...mockFocusCard.today.features, time_to_value_days: 5 } },
      },
    };
    const result = adaptMove(resp);
    const time = result.metrics.find(m => m.label === 'Time');
    expect(time?.value).toBe('5 days');
  });

  it('classifies low effort_friction as "Low"', () => {
    const result = adaptMove(mockOrchestrateResponse);
    const effort = result.metrics.find(m => m.label === 'Effort');
    expect(effort?.value).toBe('Low');
  });

  it('classifies medium effort_friction as "Medium"', () => {
    const resp = {
      ...mockOrchestrateResponse,
      focus_card: {
        ...mockFocusCard,
        today: { ...mockFocusCard.today, features: { ...mockFocusCard.today.features, effort_friction: 0.5 } },
      },
    };
    const result = adaptMove(resp);
    const effort = result.metrics.find(m => m.label === 'Effort');
    expect(effort?.value).toBe('Medium');
  });

  it('formats certainty as a percentage', () => {
    const result = adaptMove(mockOrchestrateResponse);
    const certainty = result.metrics.find(m => m.label === 'Certainty');
    expect(certainty?.value).toBe('72%');
  });

  it('uses leading_indicators as prep bullets', () => {
    const result = adaptMove(mockOrchestrateResponse);
    expect(result.prep).toContain('Review last email');
    expect(result.prep.length).toBeGreaterThan(0);
  });

  it('falls back gracefully when features are missing', () => {
    const resp = {
      ...mockOrchestrateResponse,
      focus_card: {
        ...mockFocusCard,
        today: { id: 'x', one_line: 'Do something' },
      },
    };
    const result = adaptMove(resp);
    expect(result.metrics.find(m => m.label === 'Revenue')?.value).toBe('—');
    expect(result.metrics.find(m => m.label === 'Certainty')?.value).toBe('—');
  });
});

// ─── adaptStories ─────────────────────────────────────────────────────────────

describe('adaptStories', () => {
  it('returns at least as many slides as moves', () => {
    const result = adaptStories(mockDailyBrief);
    expect(result.length).toBeGreaterThanOrEqual(mockDailyBrief.moves.length);
  });

  it('injects a context slide when context is present', () => {
    const result = adaptStories(mockDailyBrief);
    const contextSlide = result.find(s => s.id === 'context');
    expect(contextSlide).toBeDefined();
  });

  it('assigns green accent for confidence >= 0.80', () => {
    const result = adaptStories(mockDailyBrief);
    const topSlide = result[0];
    expect(topSlide.accentColor).toBe('#4ADE80');
  });

  it('assigns amber accent for confidence >= 0.60 and < 0.80', () => {
    const brief = {
      ...mockDailyBrief,
      moves: [{ ...mockBriefMove, confidence: 0.65 }],
      context: '',
    };
    const result = adaptStories(brief);
    expect(result[0].accentColor).toBe('#C4976A');
  });

  it('assigns sage accent for confidence < 0.60', () => {
    const brief = {
      ...mockDailyBrief,
      moves: [{ ...mockBriefMove, confidence: 0.45 }],
      context: '',
    };
    const result = adaptStories(brief);
    expect(result[0].accentColor).toBe('#A8C4B0');
  });

  it('does not inject context slide when context is empty', () => {
    const brief = { ...mockDailyBrief, context: '' };
    const result = adaptStories(brief);
    const contextSlide = result.find(s => s.id === 'context');
    expect(contextSlide).toBeUndefined();
  });

  it('sorts moves by confidence descending', () => {
    const brief = {
      ...mockDailyBrief,
      moves: [
        { ...mockBriefMove, move_id: 'b', confidence: 0.55 },
        { ...mockBriefMove, move_id: 'a', confidence: 0.90 },
      ],
      context: '',
    };
    const result = adaptStories(brief);
    expect(result[0].id).toBe('a');
  });
});

// ─── adaptLeverageWeeks ───────────────────────────────────────────────────────

describe('adaptLeverageWeeks', () => {
  it('maps score and week_label for each entry', () => {
    const result = adaptLeverageWeeks(mockLeverageScores);
    expect(result).toHaveLength(3);
    expect(result[0].week).toBe('Mar 3');
    expect(result[0].score).toBe(41);
  });

  it('rounds fractional scores', () => {
    const scores: InternalLeverageScore[] = [{ score: 41.7, multiplier: 1.5 }];
    const result = adaptLeverageWeeks(scores);
    expect(result[0].score).toBe(42);
  });

  it('includes multiplier in driver text', () => {
    const result = adaptLeverageWeeks(mockLeverageScores);
    expect(result[0].driver).toContain('1.5×');
  });

  it('falls back to week index when week_label is missing', () => {
    const scores: InternalLeverageScore[] = [{ score: 50, multiplier: 2.0 }];
    const result = adaptLeverageWeeks(scores);
    expect(result[0].week).toContain('Week');
  });
});

describe('adaptLeverageScoreToWeeks', () => {
  it('converts a single LeverageScoreResponse to a one-entry array', () => {
    const result = adaptLeverageScoreToWeeks(mockLeverageScoreResponse);
    expect(result).toHaveLength(1);
    expect(result[0].score).toBe(79);
    expect(result[0].week).toBe('2026-03-24');
  });

  it('uses notes[0] as driver when present', () => {
    const result = adaptLeverageScoreToWeeks(mockLeverageScoreResponse);
    expect(result[0].driver).toContain('Nexus closed');
  });

  it('falls back to multiplier text when no notes', () => {
    const resp = { ...mockLeverageScoreResponse, notes: [] };
    const result = adaptLeverageScoreToWeeks(resp);
    expect(result[0].driver).toContain('3.1×');
  });
});

// ─── adaptTimeSegments ────────────────────────────────────────────────────────

describe('adaptTimeSegments', () => {
  it('returns exactly 3 segments', () => {
    const result = adaptTimeSegments(mockAnalyticsSummary);
    expect(result).toHaveLength(3);
  });

  it('percentages sum to 100', () => {
    const result = adaptTimeSegments(mockAnalyticsSummary);
    const total = result.reduce((s, seg) => s + seg.pct, 0);
    expect(total).toBe(100);
  });

  it('revenue segment includes net_value_usd in the note', () => {
    const result = adaptTimeSegments(mockAnalyticsSummary);
    const revSeg = result.find(s => s.label.includes('Revenue'));
    expect(revSeg?.note).toContain('50K');
  });

  it('handles null ttfv and null net_value gracefully', () => {
    const summary: AnalyticsSummary = {
      window_days: 7,
      ttfv_median_minutes: null,
      net_value_usd: null,
      move_conversion_rate: null,
      agent_roi_median: null,
      rescope_success_rate: null,
    };
    const result = adaptTimeSegments(summary);
    expect(result).toHaveLength(3);
    const total = result.reduce((s, seg) => s + seg.pct, 0);
    expect(total).toBe(100);
  });
});

// ─── adaptTeamRipple ──────────────────────────────────────────────────────────

describe('adaptTeamRipple', () => {
  it('sets impact to "positive" when projected_value > 0', () => {
    const result = adaptTeamRipple([mockCascadingLeg]);
    expect(result[0].impact).toBe('positive');
  });

  it('sets impact to "negative" when projected_value < 0', () => {
    const leg = { ...mockCascadingLeg, projected_value: -5000 };
    const result = adaptTeamRipple([leg]);
    expect(result[0].impact).toBe('negative');
  });

  it('sets impact to "neutral" when projected_value = 0', () => {
    const leg = { ...mockCascadingLeg, projected_value: 0 };
    const result = adaptTeamRipple([leg]);
    expect(result[0].impact).toBe('neutral');
  });

  it('maps who and role correctly', () => {
    const result = adaptTeamRipple([mockCascadingLeg]);
    expect(result[0].name).toBe('Marcus T.');
    expect(result[0].role).toBe('Account Executive');
    expect(result[0].initial).toBe('M');
  });

  it('uses evidence[0] as consequence when present', () => {
    const result = adaptTeamRipple([mockCascadingLeg]);
    expect(result[0].consequence).toContain('Marcus advanced the deal');
  });

  it('sets a 7-day forward message for DAYS_7 timeline', () => {
    const result = adaptTeamRipple([mockCascadingLeg]);
    expect(result[0].forward).toContain('7 days');
  });

  it('sets a 30-day forward message for DAYS_30 timeline', () => {
    const leg = { ...mockCascadingLeg, timeline: 'DAYS_30' as const };
    const result = adaptTeamRipple([leg]);
    expect(result[0].forward).toContain('30 days');
  });
});

// ─── adaptTeamDetail ──────────────────────────────────────────────────────────

describe('adaptTeamDetail', () => {
  it('maps HIGH confidence to "on-track" status', () => {
    const result = adaptTeamDetail([mockCascadingLeg]);
    expect(result[0].status).toBe('on-track');
  });

  it('maps MEDIUM confidence to "pending" status', () => {
    const leg = { ...mockCascadingLeg, confidence: 'MEDIUM' as const };
    const result = adaptTeamDetail([leg]);
    expect(result[0].status).toBe('pending');
  });

  it('maps LOW confidence to "at-risk" status', () => {
    const leg = { ...mockCascadingLeg, confidence: 'LOW' as const };
    const result = adaptTeamDetail([leg]);
    expect(result[0].status).toBe('at-risk');
  });

  it('maps DAYS_7 timeline to "This week" deadline', () => {
    const result = adaptTeamDetail([mockCascadingLeg]);
    expect(result[0].deadline).toBe('This week');
  });

  it('maps DAYS_30 timeline to "This month" deadline', () => {
    const leg = { ...mockCascadingLeg, timeline: 'DAYS_30' as const };
    const result = adaptTeamDetail([leg]);
    expect(result[0].deadline).toBe('This month');
  });

  it('includes freed_value and projected_value in multiplierNote', () => {
    const result = adaptTeamDetail([mockCascadingLeg]);
    expect(result[0].multiplierNote).toContain('6K');
    expect(result[0].multiplierNote).toContain('31K');
  });
});

// ─── adaptPastMoves ───────────────────────────────────────────────────────────

describe('adaptPastMoves', () => {
  it('returns only decision.logged items (max 5)', () => {
    const items = [mockJournalDecision, mockJournalOutcome];
    const result = adaptPastMoves(items);
    expect(result).toHaveLength(1);
  });

  it('marks outcome as "won" when actual_money_lift > 0', () => {
    const items = [mockJournalDecision, mockJournalOutcome];
    const result = adaptPastMoves(items);
    expect(result[0].outcome).toBe('won');
  });

  it('marks outcome as "lost" when actual_money_lift < 0', () => {
    const lostOutcome: JournalItem = {
      ...mockJournalOutcome,
      payload: { ...mockJournalOutcome.payload, actual_money_lift: -5000 },
    };
    const items = [mockJournalDecision, lostOutcome];
    const result = adaptPastMoves(items);
    expect(result[0].outcome).toBe('lost');
  });

  it('defaults to "progress" when no outcome is logged', () => {
    const result = adaptPastMoves([mockJournalDecision]);
    expect(result[0].outcome).toBe('progress');
  });

  it('formats value from predicted midpoint', () => {
    const result = adaptPastMoves([mockJournalDecision]);
    expect(result[0].value).toBe('$22K');
  });

  it('maps go_no_go=NO_GO to "lost" when no outcome logged', () => {
    const noGoDecision: JournalItem = {
      ...mockJournalDecision,
      payload: { ...mockJournalDecision.payload, go_no_go: 'NO_GO' },
    };
    const result = adaptPastMoves([noGoDecision]);
    expect(result[0].outcome).toBe('lost');
  });
});

// ─── adaptDecisions ───────────────────────────────────────────────────────────

describe('adaptDecisions', () => {
  it('maps ledger entry to a decision record', () => {
    const result = adaptDecisions(mockLedgerResponse, [mockJournalDecision, mockJournalOutcome]);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Sent revised proposal to Nexus Corp');
  });

  it('classifies as "won" when outcome actual_money_lift > 0', () => {
    const result = adaptDecisions(mockLedgerResponse, [mockJournalDecision, mockJournalOutcome]);
    expect(result[0].type).toBe('won');
  });

  it('uses result.summary as consequence', () => {
    const result = adaptDecisions(mockLedgerResponse, []);
    expect(result[0].consequence).toContain('Closed $24K');
  });

  it('maps result.better_option to betterOption', () => {
    const result = adaptDecisions(mockLedgerResponse, []);
    expect(result[0].betterOption).toBe('This was the right call.');
  });

  it('maps result.forward to forward', () => {
    const result = adaptDecisions(mockLedgerResponse, []);
    expect(result[0].forward).toContain('term sheet');
  });

  it('defaults to "progress" when no outcome is present', () => {
    const result = adaptDecisions(mockLedgerResponse, []);
    expect(result[0].type).toBe('progress');
  });

  it('falls back to decision_type when params.one_line is missing', () => {
    const ledger: LedgerQueryResponse = {
      ...mockLedgerResponse,
      entries: [{ ...mockLedgerResponse.entries[0], params: {} }],
    };
    const result = adaptDecisions(ledger, []);
    expect(result[0].text).toBe('move.executed');
  });
});
