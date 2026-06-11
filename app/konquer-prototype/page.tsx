'use client';

import React, { useState, useEffect, useRef } from 'react';
import { logOutcome as apiLogOutcome } from '@/lib/konquer-api';
import { useKonquerData } from '@/lib/use-konquer-data';

type AppView = 'home' | 'insights' | 'leverage' | 'team' | 'decisions';
type MoveState = 'stories' | 'idle' | 'context' | 'committed' | 'feedback' | 'win' | 'learn';

const MOVE = {
  action: "Raise your price floor to $25K today so next quarter's pipeline is built on real margin.",
  why: "This closes faster than anything on your board right now. Sarah's been responsive, the contract's ready, and your window is today. Locking this in protects your monthly number and frees your focus for growth moves the rest of the week.",
  metrics: [
    { value: '$18K', label: 'Revenue' },
    { value: '30 min', label: 'Time' },
    { value: 'Low', label: 'Effort' },
    { value: '72%', label: 'Certainty' },
  ],
  prep: [
    "Sarah's last email and contract notes",
    'Renewal pricing — locked at current rate',
    'Your call script and 3 talking points',
    'Calendar blocked for 2:00 PM today',
  ],
};

const PAST_MOVES: Array<{ date: string; action: string; outcome: 'won' | 'progress' | 'lost'; value: string }> = [
  { date: 'Friday, Mar 28', action: 'Send revised proposal to Nexus Corp', outcome: 'won', value: '$24K' },
  { date: 'Thursday, Mar 27', action: 'Follow up with Marcus on Q2 expansion', outcome: 'progress', value: '$31K' },
  { date: 'Wednesday, Mar 26', action: 'Resolve billing issue for Harlow account', outcome: 'won', value: '$8K' },
  { date: 'Tuesday, Mar 25', action: 'Close intro call with DataSync team', outcome: 'lost', value: '$19K' },
  { date: 'Monday, Mar 24', action: 'Send board deck to Meridian Ventures', outcome: 'won', value: '$0' },
];

const SOURCES = [
  { name: 'Stripe', status: 'connected', last: '2 min ago' },
  { name: 'HubSpot', status: 'connected', last: '5 min ago' },
  { name: 'Gmail', status: 'connected', last: '1 min ago' },
  { name: 'Google Calendar', status: 'connected', last: 'Live' },
  { name: 'Slack', status: 'disconnected', last: '—' },
  { name: 'QuickBooks', status: 'disconnected', last: '—' },
];

// ── Leverage tab data ────────────────────────────────────────────
// All data references actual moves, deals, and people from this week.
// Production source: Analytics service → leverage_score, execution_rate, outcome_quality_index
const LEVERAGE_WEEKS = [
  { week: 'Mar 3',  score: 41, driver: '2 of 5 moves executed. No closed deals.' },
  { week: 'Mar 10', score: 52, driver: 'Harlow retention secured. Consistency improving.' },
  { week: 'Mar 17', score: 63, driver: 'Pipeline coverage reached 2.8×. Margins held.' },
  { week: 'Mar 24', score: 79, driver: 'Nexus closed. Ripple into Marcus Q2 pipeline.' },
];

// Production source: Journal service → move.execution_duration_min grouped by outcome category
// Hours represent Konquer-tracked execution time only — not total work hours
const TIME_SEGMENTS = [
  { label: 'Revenue-generating execution', hours: 2.5, pct: 26, color: '#4ADE80',
    note: '$50K produced. $20K per focused hour.' },
  { label: 'Strategic positioning',        hours: 4.0, pct: 42, color: '#C4976A',
    note: 'Investor deck, Q2 planning, pricing defense.' },
  { label: 'Reactive & absorbed',          hours: 3.0, pct: 32, color: 'rgba(248,113,113,0.75)',
    note: 'Billing dispute, DataSync reschedule, status updates.' },
];

// Production source: HubSpot connector + Neo4j causal graph → causal decision chains per team member
const TEAM_RIPPLE = [
  { name: 'Marcus T.',  initial: 'M', role: 'Q2 Expansion · $31K', impact: 'positive' as const,
    decision: 'Closed Nexus Corp proposal (Mar 28)',
    consequence: 'Nexus close gave Marcus a revenue anchor for his Q2 expansion pitch. He advanced the deal — board sign-off now pending.',
    betterOption: 'No better option available — this was the optimal sequence. Closing Nexus first de-risked the Marcus ask.',
    tradeoff: null,
    forward: 'Send Marcus the term sheet by Apr 2. The window closes with the quarter.' },
  { name: 'Jordan L.',  initial: 'J', role: 'Harlow Account · $8K', impact: 'positive' as const,
    decision: 'Resolved Harlow billing dispute personally (Mar 26)',
    consequence: 'Removed her primary deal blocker. Q3 renewal pipeline is now clear — she can close without a discount conversation.',
    betterOption: 'Could have delegated the billing dispute to Jordan directly — she knows the account.',
    tradeoff: 'Delegation would have saved you 45 minutes but risked a weaker resolution. Doing it yourself held the margin.',
    forward: null },
  { name: 'Priya K.',   initial: 'P', role: 'Investor Relations', impact: 'neutral' as const,
    decision: 'Delivered board deck to Meridian Ventures (Mar 24)',
    consequence: 'Opened a warm investor channel. Meridian expressed interest but no commitment. Outcome pending.',
    betterOption: 'Schedule the follow-up before sending the deck — investors respond faster when they have a meeting on the calendar.',
    tradeoff: 'Would have required 30 min of prep time to coordinate, but would have increased response rate and compressed the timeline.',
    forward: 'Follow-up call due Apr 3. Letting this go cold wastes the setup entirely.' },
  { name: 'Alex R.',    initial: 'A', role: 'DataSync · $19K', impact: 'negative' as const,
    decision: 'Rescheduled DataSync intro call (Mar 25)',
    consequence: '4 days without a decision-maker touchpoint. Deal is stalled. Every day this stays open raises deal loss probability.',
    betterOption: 'Delegate the intro call to Jordan — she has capacity and has met Alex before at a previous event.',
    tradeoff: 'Jordan hasn\'t led a deal this size. Risk of a weaker first impression, but the deal stays alive vs. compounding stall.',
    forward: 'Reschedule today or delegate to Jordan by EOD. This is the highest-urgency recovery on the board.' },
  { name: 'Casey W.',   initial: 'C', role: 'New Hire · Onboarding', impact: 'negative' as const,
    decision: 'Delayed Week 2 onboarding check-in (Mar 20)',
    consequence: 'Casey missed her Week 2 activation milestone by 3 days. Delayed onboarding correlates with ~40% higher 90-day churn.',
    betterOption: 'A 20-minute async Loom check-in would have kept the milestone on track without requiring a live meeting.',
    tradeoff: 'Async is less effective than live for relationship-building in week 2. But it preserves momentum when schedule blocks a live call.',
    forward: 'Schedule her check-in this week. This is a retention risk, not a scheduling preference.' },
];

// Production source: HubSpot contacts + Journal moves + Neo4j causal chains per team member
const TEAM_DETAIL = [
  {
    name: 'Marcus T.', initial: 'M', role: 'Account Executive', status: 'on-track' as const,
    pipeline: 'Q2 Expansion — $31K',
    pipelineNote: 'Budget approved. Board sign-off pending. Close probability: high.',
    thisWeek: [
      { decision: 'Closed Nexus Corp (Mar 28)', impact: 'Gave Marcus a revenue anchor for his Q2 pitch. He advanced the deal the same day.' },
    ],
    nextAction: 'Send Marcus the term sheet by Apr 2.',
    deadline: 'Apr 2',
    urgency: 'high' as const,
    multiplierNote: 'One term sheet now closes a $31K deal already in motion. Delay resets the quarter.',
  },
  {
    name: 'Jordan L.', initial: 'J', role: 'Account Manager', status: 'on-track' as const,
    pipeline: 'Harlow Renewal — $8K',
    pipelineNote: 'Billing dispute resolved. Renewal path is clear. Q3 pipeline unblocked.',
    thisWeek: [
      { decision: 'Resolved Harlow billing dispute (Mar 26)', impact: 'Removed her deal blocker. She can now close the renewal without a discount negotiation.' },
    ],
    nextAction: 'Let Jordan run point on the Harlow close — she\'s unblocked and ready.',
    deadline: 'End of Q2',
    urgency: 'low' as const,
    multiplierNote: 'Delegating this close frees your time for higher-leverage moves while keeping the $8K in motion.',
  },
  {
    name: 'Priya K.', initial: 'P', role: 'Investor Relations', status: 'pending' as const,
    pipeline: 'Meridian Ventures — Series A',
    pipelineNote: 'Board deck delivered. Warm channel opened. No commitment yet.',
    thisWeek: [
      { decision: 'Delivered board deck (Mar 24)', impact: 'Opened the Meridian relationship. Response pending — no meeting scheduled yet.' },
    ],
    nextAction: 'Schedule a follow-up call with Meridian before Apr 3.',
    deadline: 'Apr 3',
    urgency: 'medium' as const,
    multiplierNote: 'A single follow-up converts a warm lead to a live conversation. Skipping it wastes the entire setup.',
  },
  {
    name: 'Alex R.', initial: 'A', role: 'BDR', status: 'at-risk' as const,
    pipeline: 'DataSync Intro — $19K',
    pipelineNote: 'Stalled. No decision-maker contact in 4 days. Risk compounds daily.',
    thisWeek: [
      { decision: 'Rescheduled DataSync intro call (Mar 25)', impact: '4 days without a decision-maker touchpoint. Alex has no path forward until this is resolved.' },
    ],
    nextAction: 'Reschedule the DataSync call today or delegate to Jordan by EOD.',
    deadline: 'Today',
    urgency: 'critical' as const,
    multiplierNote: '$19K deal. Every day stalled raises loss probability. This is the highest-leverage recovery available.',
  },
  {
    name: 'Casey W.', initial: 'C', role: 'New Hire', status: 'at-risk' as const,
    pipeline: 'Onboarding — 90-day retention',
    pipelineNote: 'Week 2 activation missed. Retention risk active.',
    thisWeek: [
      { decision: 'Delayed Week 2 onboarding check-in (Mar 20)', impact: 'She missed the Week 2 activation milestone. Research shows this pattern raises 90-day churn risk by ~40%.' },
    ],
    nextAction: 'Run a 20-minute check-in with Casey this week — live or async.',
    deadline: 'This week',
    urgency: 'high' as const,
    multiplierNote: 'Losing a new hire in week 4-8 costs 3-6 months of recruiting time. This 20-minute check-in is the cheapest insurance available.',
  },
];

// Production source: Journal service moves + outcome webhooks + LLM synthesis
// betterOption = alternative that was available at decision time
// tradeoff = what the alternative would have cost
const DECISIONS = [
  { date: 'Mar 28', text: 'Sent revised proposal to Nexus Corp',
    consequence: 'Closed $24K. Also unblocked Marcus\'s Q2 expansion — the ripple is already moving through the pipeline.',
    betterOption: 'This was the right call at the right time. No better option available.',
    tradeoff: null,
    forward: 'Send Marcus the term sheet by Apr 2 to sustain momentum.',
    type: 'won' as const },
  { date: 'Mar 27', text: 'Followed up with Marcus on Q2 expansion',
    consequence: 'Budget approval confirmed. $31K now pending board sign-off.',
    betterOption: 'Could have sent the term sheet on the same call rather than waiting.',
    tradeoff: 'Sending without review risks errors. But the delay creates a window for Marcus\'s board to go cold.',
    forward: 'Term sheet due Apr 2. Missing this window resets the Q2 timeline.',
    type: 'progress' as const },
  { date: 'Mar 26', text: 'Resolved Harlow billing dispute personally',
    consequence: 'Kept $8K and held margins at 34%. Jordan can close the Q3 renewal without a discount conversation.',
    betterOption: 'Could have delegated to Jordan — she knows the account and had capacity.',
    tradeoff: 'Delegation saves 45 minutes but risks a weaker resolution. Doing it yourself held the margin.',
    forward: null,
    type: 'won' as const },
  { date: 'Mar 25', text: 'Rescheduled DataSync intro call',
    consequence: '$19K opportunity is 4 days stalled. Alex has no decision-maker contact. Risk escalates daily.',
    betterOption: 'Delegate the intro call to Jordan — she has capacity and has met Alex before.',
    tradeoff: 'Jordan hasn\'t led a deal this size. Risk of a weaker first impression. But the deal stays alive vs. an escalating stall.',
    forward: 'Reschedule today or delegate to Jordan by EOD. This is the highest-urgency recovery on the board.',
    type: 'lost' as const },
  { date: 'Mar 24', text: 'Delivered board deck to Meridian Ventures',
    consequence: 'Warm investor channel opened. No Q2 revenue impact — positions a Series A conversation.',
    betterOption: 'Schedule the follow-up call before sending the deck. Investors respond faster with a meeting on the calendar.',
    tradeoff: '30 extra minutes of coordination upfront, but it compresses the response cycle by days.',
    forward: 'Follow-up call due Apr 3. Letting this go cold wastes the entire setup.',
    type: 'progress' as const },
  { date: 'Mar 21', text: 'Held Harlow renewal pricing at 34%',
    consequence: 'Prevented a $2.7K margin concession. This discipline compounded into the billing resolution on Mar 26.',
    betterOption: 'This was the right call. Holding price here protected the entire account relationship.',
    tradeoff: null,
    forward: null,
    type: 'won' as const },
  { date: 'Mar 20', text: 'Delayed Casey\'s Week 2 onboarding check-in',
    consequence: 'Casey missed her activation milestone by 3 days. Delayed onboarding raises 90-day churn risk by ~40%.',
    betterOption: 'A 20-minute async Loom check-in would have kept the milestone on track.',
    tradeoff: 'Async is less effective for relationship-building in week 2. But it preserves momentum when a live call isn\'t possible.',
    forward: 'Schedule her check-in this week. This is a retention risk, not a scheduling preference.',
    type: 'lost' as const },
];
// ─────────────────────────────────────────────────────────────────

const KONG_MESSAGES = [
  'Lock this in and we notch a clean win today.',
  "This one's yours. Make the call.",
  "You've done harder. This is 30 minutes.",
];

const ORB_THOUGHTS = [
  'You know what to do. Just begin.',
  'Clarity is a choice. You already made it.',
  'One move. Everything else waits.',
];

/**
 * StorySlide — data contract for each daily brief slide.
 *
 * In production, slides are composed by:
 *   GET /api/v1/daily-brief?user_id={id}&date={today}
 *   → Orchestrator (port 8011): /daily_brief endpoint
 *
 * Each slide type pulls from a specific source:
 *   'win'       → Journal service (port 8014): move outcomes + Stripe/HubSpot outcome events
 *   'milestone' → Analytics service: cumulative outcome aggregation, threshold events
 *   'time'      → Journal service: execution_duration vs. median for deal-type (benchmark from analytics)
 *   'ripple'    → HubSpot connector: downstream pipeline momentum; Neo4j causal graph for impact chains
 *   'streak'    → Journal service: consecutive daily_execution events + analytics streak counter
 */
interface StorySlide {
  id: string;
  label: string;
  headline: string;
  sub: string;
  accentColor: string;
  glowColor: string;
}

const STORIES: StorySlide[] = [
  {
    // Journal (port 8014) + HubSpot/Stripe outcome webhook → move.outcome, move.value, move.closed_at
    id: 'win',
    label: 'Friday · Mar 28',
    headline: '$24K won.',
    sub: 'Nexus Corp proposal — closed. Clean execution.',
    accentColor: '#4ADE80',
    glowColor: 'rgba(74, 222, 128, 0.09)',
  },
  {
    // Analytics service → weekly_revenue_total, moves_executed_count; threshold triggers milestone event
    id: 'milestone',
    label: 'Milestone Unlocked',
    headline: '$50K Week.',
    sub: 'Five moves. $50K protected. You showed up every day this week.',
    accentColor: '#C4976A',
    glowColor: 'rgba(196, 151, 106, 0.13)',
  },
  {
    // Journal (port 8014) → move.execution_duration_min; Analytics → p50 duration for deal_type='renewal'
    // Sub-text credits the user's timing — Konquer's recommendation is implied, never stated
    id: 'time',
    label: 'Time Leverage',
    headline: '30 minutes.',
    sub: "One call. $24K closed. Most deals this size stay open for weeks — this one moved because you showed up at exactly the right moment.",
    accentColor: '#A8C4B0',
    glowColor: 'rgba(168, 196, 176, 0.08)',
  },
  {
    // HubSpot connector → downstream contact/deal pipeline changes after win; Neo4j causal graph → ripple_impact_score
    id: 'ripple',
    label: 'Ripple Effect',
    headline: 'The momentum spreads.',
    sub: "Your Nexus close gave Marcus's Q2 expansion a revenue anchor. One win is already compounding into the next.",
    accentColor: '#DDB896',
    glowColor: 'rgba(221, 184, 150, 0.09)',
  },
  {
    // Analytics service → streak_days (consecutive days with executed move); daily_execution event from Journal
    id: 'streak',
    label: 'Day 3',
    headline: "You're on a run.",
    sub: "Three days of execution. Your focus is building something real. Today's move is ready.",
    accentColor: '#EDEAE4',
    glowColor: 'rgba(237, 234, 228, 0.05)',
  },
];

const NAV = [
  {
    id: 'home' as AppView,
    label: "Today's Move",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M10 2l2.4 5.2 5.6.8-4 3.9.9 5.5L10 14.8l-4.9 2.6.9-5.5L2 8l5.6-.8L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'insights' as AppView,
    label: 'Insights',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="12" width="3" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8.5" y="7" width="3" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="15" y="3" width="3" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'leverage' as AppView,
    label: 'Leverage',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <line x1="2" y1="15" x2="18" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="10,17 8,14 12,14" fill="currentColor" opacity="0.7" />
        <circle cx="18" cy="5" r="1.5" fill="currentColor" />
        <circle cx="2" cy="15" r="1.5" fill="currentColor" opacity="0.45" />
      </svg>
    ),
  },
  {
    id: 'team' as AppView,
    label: 'Team',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="7.5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 16c0-3 2.5-5 5.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="13.5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13.5 11c3 0 5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10.5 16h-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'decisions' as AppView,
    label: 'Decisions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7h6M7 10.5h6M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function KonquerPrototype() {
  const {
    move,
    stories,
    pastMoves,
    leverageWeeks,
    timeSegments,
    teamRipple,
    teamDetail,
    decisions,
    journalId,
  } = useKonquerData({
    move: MOVE,
    stories: STORIES,
    pastMoves: PAST_MOVES,
    leverageWeeks: LEVERAGE_WEEKS,
    timeSegments: TIME_SEGMENTS,
    teamRipple: TEAM_RIPPLE,
    teamDetail: TEAM_DETAIL,
    decisions: DECISIONS,
  });

  const [view, setView] = useState<AppView>('home');
  const [decFilter, setDecFilter] = useState<'all' | 'won' | 'risk' | 'recovery'>('all');
  const [moveState, setMoveState] = useState<MoveState>('stories');
  const [showKong, setShowKong] = useState(false);
  const [kongDismissed, setKongDismissed] = useState(false);
  const [showOrbThought, setShowOrbThought] = useState(false);
  const [orbThoughtIdx, setOrbThoughtIdx] = useState(0);
  // Initialized to 0; randomized after mount to avoid SSR/client hydration mismatch
  const [kongMsgIdx, setKongMsgIdx] = useState(0);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyPaused, setStoryPaused] = useState(false);
  const [storyExiting, setStoryExiting] = useState(false);
  const orbThoughtTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storyHoldTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storyIsHolding = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const [shareToast, setShareToast] = useState(false);

  // Randomize kong message after mount — avoids SSR/hydration mismatch
  useEffect(() => {
    setKongMsgIdx(Math.floor(Math.random() * KONG_MESSAGES.length));
  }, []);


  // Stories: auto-advance every 3s unless paused
  useEffect(() => {
    if (moveState !== 'stories' || storyPaused) return;
    const t = setTimeout(() => {
      setStoryExiting(true);
      setTimeout(() => {
        setStoryExiting(false);
        if (storyIndex < stories.length - 1) {
          setStoryIndex((i) => i + 1);
        } else {
          setMoveState('idle');
          setStoryIndex(0);
        }
      }, 320);
    }, 3000);
    return () => clearTimeout(t);
  }, [moveState, storyPaused, storyIndex, stories.length]);

  // Variable Reward: Kong appears at 30% chance, 2s after home loads
  useEffect(() => {
    if (view !== 'home') return;
    const t = setTimeout(() => {
      if (Math.random() < 0.3 && !kongDismissed && moveState === 'idle') {
        setShowKong(true);
      }
    }, 2000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // Variable Reward: subtle encouragement 20% chance during committed
  useEffect(() => {
    if (moveState !== 'committed') return;
    const t = setTimeout(() => {
      if (Math.random() < 0.2) {
        setShowEncouragement(true);
        setTimeout(() => setShowEncouragement(false), 5000);
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [moveState]);

  const handleStoryNext = () => {
    setStoryExiting(true);
    setTimeout(() => {
      setStoryExiting(false);
      if (storyIndex < stories.length - 1) {
        setStoryIndex((i) => i + 1);
      } else {
        setMoveState('idle');
        setStoryIndex(0);
      }
    }, 320);
  };

  const handleStoryBack = () => {
    if (storyIndex > 0) {
      setStoryExiting(true);
      setTimeout(() => {
        setStoryExiting(false);
        setStoryIndex((i) => i - 1);
      }, 320);
    }
  };

  const handleStorySkip = () => {
    setStoryExiting(false);
    setMoveState('idle');
    setStoryIndex(0);
  };

  const handleStoryShare = async (slide: StorySlide) => {
    const text = `${slide.headline}\n${slide.sub}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Konquer', text });
      } catch {
        // dismissed — no action needed
      }
    } else {
      await navigator.clipboard.writeText(text);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  const onStoryPressStart = () => {
    storyIsHolding.current = false;
    storyHoldTimer.current = setTimeout(() => {
      storyIsHolding.current = true;
      setStoryPaused(true);
    }, 150);
  };

  const onStoryPressEnd = (isRight: boolean) => {
    if (storyHoldTimer.current) clearTimeout(storyHoldTimer.current);
    if (storyIsHolding.current) {
      setStoryPaused(false);
      storyIsHolding.current = false;
    } else {
      if (isRight) handleStoryNext();
      else handleStoryBack();
    }
  };

  const handleLetsDoIt = () => {
    setMoveState('committed');
    setShowKong(false);
  };

  const handleOrbClick = () => {
    if (orbThoughtTimer.current) clearTimeout(orbThoughtTimer.current);
    setOrbThoughtIdx(Math.floor(Math.random() * ORB_THOUGHTS.length));
    setShowOrbThought(true);
    orbThoughtTimer.current = setTimeout(() => setShowOrbThought(false), 4000);
  };

  const handleReset = () => {
    setMoveState('idle');
    setShowKong(false);
    setKongDismissed(false);
    setShowEncouragement(false);
  };

  const handleNavClick = (v: AppView) => {
    setView(v);
    setSidebarHovered(false);
  };

  return (
    <>
      {/* Google Fonts — loaded via link so React 19 hoists them correctly */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=DM+Serif+Display&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .app * { box-sizing: border-box; margin: 0; padding: 0; }

        .app {
          font-family: 'DM Sans', -apple-system, sans-serif;
          display: flex;
          height: 100vh;
          background: #0D0D10;
          color: #EDEAE4;
          -webkit-font-smoothing: antialiased;
          overflow: hidden;
        }

        /* ─── SIDEBAR ─────────────────────────────────────── */
        .sidebar {
          width: 60px;
          flex-shrink: 0;
          background: #09090C;
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.25rem 0 1.5rem;
          transition: width 0.22s cubic-bezier(0.22, 1, 0.36, 1);
          overflow: hidden;
          position: relative;
          z-index: 20;
        }

        .sidebar.expanded {
          width: 200px;
          align-items: flex-start;
        }

        .sidebar-logo {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: #C4976A;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-left: 14px;
          margin-bottom: 2rem;
          transition: margin 0.22s;
        }

        .sidebar.expanded .sidebar-logo { margin-left: 14px; }
        .sidebar-logo svg { width: 16px; height: 16px; }

        .nav-list {
          flex: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6875rem 0.75rem;
          border-radius: 10px;
          cursor: pointer;
          background: none;
          border: none;
          color: #4A4A52;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          width: 100%;
          text-align: left;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: #9A9898;
        }

        .nav-item.active {
          background: rgba(196,151,106,0.12);
          color: #C4976A;
        }

        .nav-item-icon {
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-item-label {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s;
        }

        .sidebar.expanded .nav-item-label {
          opacity: 1;
          pointer-events: auto;
        }

        .sidebar-bottom { padding: 0 8px; width: 100%; }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #1C1C22;
          border: 1.5px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-left: 6px;
        }

        .user-info {
          opacity: 0;
          transition: opacity 0.15s;
          pointer-events: none;
        }

        .sidebar.expanded .user-info {
          opacity: 1;
          pointer-events: auto;
        }

        .user-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #EDEAE4;
          white-space: nowrap;
        }

        .user-role {
          font-size: 0.6875rem;
          color: #4A4A52;
          white-space: nowrap;
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 0.625rem;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s;
          width: 100%;
          background: none;
          border: none;
          text-align: left;
        }

        .sidebar-user:hover { background: rgba(255,255,255,0.04); }

        /* ─── MAIN AREA ────────────────────────────────────── */
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        /* ─── TOP BAR ──────────────────────────────────────── */
        .topbar {
          height: 54px;
          flex-shrink: 0;
          background: #0D0D10;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          z-index: 10;
        }

        .topbar-view-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #EDEAE4;
          letter-spacing: -0.01em;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .topbar-date {
          font-size: 0.8125rem;
          color: #4A4A52;
        }

        .topbar-streak {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: rgba(196,151,106,0.1);
          border: 1px solid rgba(196,151,106,0.2);
          border-radius: 100px;
          padding: 0.3125rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #C4976A;
        }

        .streak-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C4976A;
        }

        /* ─── CONTENT AREA ─────────────────────────────────── */
        .content {
          flex: 1;
          overflow-y: auto;
          position: relative;
        }

        /* ─── HOME VIEW ────────────────────────────────────── */
        .home-stage {
          min-height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem 10rem;
        }

        .move-card {
          width: 100%;
          max-width: 540px;
          background: #16161B;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 2px 40px rgba(0,0,0,0.4);
          padding: 2.25rem 2.25rem 1.75rem;
          animation: cardIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .move-label {
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #C4976A;
          text-transform: uppercase;
          margin-bottom: 1.125rem;
        }

        .move-action {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(1.625rem, 3.5vw, 2.125rem);
          font-weight: 400;
          color: #EDEAE4;
          line-height: 1.35;
          margin-bottom: 1.75rem;
        }

        .move-action.committed-style {
          font-size: clamp(0.9375rem, 2.5vw, 1.125rem);
          color: #6B6B72;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
        }

        .committed-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .committed-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: rgba(196,151,106,0.15);
          color: #C4976A;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 0.3125rem 0.625rem;
          border-radius: 100px;
          border: 1px solid rgba(196,151,106,0.25);
        }

        .divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 1.5rem 0;
        }

        /* Metrics */
        .metrics-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }

        .metric {
          text-align: center;
          padding: 0 0.25rem;
          position: relative;
        }

        .metric + .metric::before {
          content: '';
          position: absolute;
          left: 0;
          top: 12%;
          height: 76%;
          width: 1px;
          background: rgba(255,255,255,0.06);
        }

        .metric-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: #EDEAE4;
          letter-spacing: -0.02em;
          margin-bottom: 0.25rem;
          font-variant-numeric: tabular-nums;
        }

        .metric-label {
          font-size: 0.625rem;
          color: #4A4A52;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        /* Buttons */
        .why-btn {
          display: inline-block;
          margin-top: 1.25rem;
          font-size: 0.8125rem;
          color: #C4976A;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
          text-decoration: underline;
          text-decoration-color: transparent;
          transition: color 0.15s, text-decoration-color 0.15s;
        }

        .why-btn:hover {
          color: #D4A77A;
          text-decoration-color: rgba(196,151,106,0.4);
        }

        .primary-btn {
          width: 100%;
          margin-top: 1.25rem;
          padding: 0.9375rem;
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #0D0D10;
          background: #C4976A;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s, transform 0.12s;
          letter-spacing: -0.01em;
        }

        .primary-btn:hover {
          background: #D4A77A;
          transform: translateY(-1px);
        }

        .primary-btn:active { transform: translateY(0); }

        .secondary-btn {
          width: 100%;
          margin-top: 0.625rem;
          padding: 0.9375rem;
          font-size: 0.9375rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          color: #9A9898;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .secondary-btn:hover { background: rgba(255,255,255,0.08); }

        /* Bottom sheet */
        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 30;
          animation: fadeIn 0.2s ease;
        }

        .overlay.muted {
          background: rgba(0,0,0,0.3);
          pointer-events: none;
          animation: none;
        }

        .sheet {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 31;
          background: #1A1A20;
          border-radius: 22px 22px 0 0;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 1.375rem 1.75rem 2.5rem;
          animation: sheetUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.5);
        }

        .sheet-handle {
          width: 2.25rem;
          height: 3px;
          background: rgba(255,255,255,0.12);
          border-radius: 2px;
          margin: 0 auto 1.25rem;
        }

        .sheet-title {
          font-size: 1rem;
          font-weight: 600;
          color: #EDEAE4;
          margin-bottom: 0.75rem;
        }

        .sheet-body {
          font-size: 0.9375rem;
          color: #8A8888;
          line-height: 1.65;
        }

        /* Prep list */
        .prep-list {
          list-style: none;
          padding: 0;
          margin: 1rem 0 0;
        }

        .prep-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 0;
          font-size: 0.9375rem;
          color: #EDEAE4;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .prep-item:last-child { border-bottom: none; }

        .prep-icon {
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 50%;
          background: rgba(196,151,106,0.12);
          border: 1px solid rgba(196,151,106,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Kong */
        .kong {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          z-index: 25;
          width: 252px;
          background: #1A1A20;
          border: 1px solid rgba(255,255,255,0.07);
          border-left: 3px solid #C4976A;
          border-radius: 14px;
          padding: 0.875rem 2rem 0.875rem 0.875rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: kongIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .kong-inner {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .kong-avatar {
          width: 1.625rem;
          height: 1.625rem;
          background: rgba(196,151,106,0.15);
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .kong-name {
          font-size: 0.5625rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          color: #C4976A;
          text-transform: uppercase;
          margin-bottom: 0.1875rem;
        }

        .kong-msg {
          font-size: 0.8125rem;
          color: #EDEAE4;
          line-height: 1.5;
        }

        .kong-x {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #3A3A42;
          font-size: 1rem;
          line-height: 1;
          padding: 2px 5px;
          border-radius: 4px;
          font-family: sans-serif;
          transition: color 0.12s;
        }

        .kong-x:hover { color: #6B6B72; }

        /* Encouragement */
        .encouragement {
          position: absolute;
          bottom: 5.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 25;
          background: rgba(196,151,106,0.15);
          color: #C4976A;
          border: 1px solid rgba(196,151,106,0.25);
          font-size: 0.8125rem;
          font-weight: 500;
          padding: 0.5625rem 1.125rem;
          border-radius: 100px;
          white-space: nowrap;
          box-shadow: 0 3px 20px rgba(0,0,0,0.3);
          animation: floatIn 0.3s ease both;
          font-family: 'DM Sans', sans-serif;
        }

        /* Orb */
        .orb-wrap {
          position: absolute;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 25;
        }

        .orb {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #EDD4A8, #C4976A 65%, #9E6F3C);
          cursor: pointer;
          border: none;
          display: block;
          box-shadow: 0 0 0 4px rgba(196,151,106,0.1), 0 4px 20px rgba(196,151,106,0.35);
          animation: orbPulse 3.5s ease-in-out infinite;
        }

        .orb-thought {
          position: absolute;
          bottom: 56px;
          right: 0;
          width: 210px;
          background: #1A1A20;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          padding: 0.8125rem 0.9375rem;
          font-size: 0.8125rem;
          color: #EDEAE4;
          line-height: 1.6;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: thoughtUp 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .orb-thought::after {
          content: '';
          position: absolute;
          bottom: -6px;
          right: 13px;
          width: 10px;
          height: 10px;
          background: #1A1A20;
          border-right: 1px solid rgba(255,255,255,0.07);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transform: rotate(45deg);
        }

        /* Win / Learn state */
        .result-stage {
          min-height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
        }

        .result-wrap {
          text-align: center;
          max-width: 460px;
          animation: cardIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .result-headline {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(2.75rem, 6vw, 3.75rem);
          color: #EDEAE4;
          margin-bottom: 0.625rem;
          animation: popIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .result-sub {
          font-size: 1rem;
          color: #6B6B72;
          line-height: 1.65;
          margin-bottom: 1.75rem;
        }

        .result-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: rgba(196,151,106,0.1);
          border: 1px solid rgba(196,151,106,0.2);
          border-radius: 100px;
          padding: 0.4375rem 0.875rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #C4976A;
          margin-bottom: 2rem;
        }

        .next-btn {
          display: inline-block;
          padding: 0.9375rem 2.25rem;
          background: #C4976A;
          color: #0D0D10;
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s, transform 0.12s;
        }

        .next-btn:hover {
          background: #D4A77A;
          transform: translateY(-1px);
        }

        /* ─── SECONDARY VIEWS ──────────────────────────────── */
        .secondary-view {
          padding: 2rem;
          max-width: 680px;
          margin: 0 auto;
          animation: cardIn 0.35s ease both;
        }

        .section-title {
          font-size: 1.0625rem;
          font-weight: 600;
          color: #EDEAE4;
          margin-bottom: 0.375rem;
        }

        .section-sub {
          font-size: 0.875rem;
          color: #4A4A52;
          margin-bottom: 1.5rem;
        }

        .card {
          background: #16161B;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
        }

        .move-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          gap: 1rem;
        }

        .move-row:last-child { border-bottom: none; }

        .move-row-date {
          font-size: 0.6875rem;
          color: #4A4A52;
          font-weight: 500;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .move-row-text {
          font-size: 0.9375rem;
          color: #EDEAE4;
          line-height: 1.45;
        }

        .outcome-badge {
          flex-shrink: 0;
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 0.3125rem 0.625rem;
          border-radius: 100px;
          white-space: nowrap;
          margin-top: 2px;
        }

        .outcome-badge.won { background: rgba(34,197,94,0.12); color: #4ADE80; }
        .outcome-badge.progress { background: rgba(196,151,106,0.12); color: #C4976A; }
        .outcome-badge.lost { background: rgba(239,68,68,0.1); color: #F87171; }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: #16161B;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 1.125rem 1.125rem;
        }

        .stat-value {
          font-size: 1.625rem;
          font-weight: 600;
          color: #EDEAE4;
          letter-spacing: -0.02em;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #4A4A52;
          font-weight: 500;
        }

        /* ─── MOMENTUM VIEW ────────────────────────────────── */
        .momentum-card {
          background: #16161B;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .momentum-title {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 1.375rem;
          color: #EDEAE4;
          line-height: 1.4;
          margin-bottom: 0.75rem;
        }

        .momentum-body {
          font-size: 0.9375rem;
          color: #6B6B72;
          line-height: 1.65;
        }

        .momentum-metric {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .momentum-metric:last-child { border-bottom: none; }

        .mm-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #C4976A;
          flex-shrink: 0;
        }

        .mm-label { flex: 1; font-size: 0.9375rem; color: #8A8888; }
        .mm-value { font-size: 0.9375rem; font-weight: 600; color: #EDEAE4; }

        /* ─── LEVERAGE VIEW ────────────────────────────────── */
        .lev-section {
          margin-bottom: 2rem;
        }

        .lev-section-header {
          margin-bottom: 1rem;
        }

        /* Weekly synthesis card */
        .lev-synthesis-card {
          background: rgba(196,151,106,0.07);
          border: 1px solid rgba(196,151,106,0.18);
          border-radius: 16px;
          padding: 1.375rem 1.5rem;
        }

        .lev-synthesis-title {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #C4976A;
          margin-bottom: 0.75rem;
        }

        .lev-synthesis-body {
          font-size: 0.9375rem;
          color: #A8A5A0;
          line-height: 1.65;
        }

        .lev-synthesis-body strong {
          color: #EDEAE4;
          font-weight: 600;
        }

        /* Driver list under line chart */
        .lev-driver-list {
          margin-top: 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .lev-driver-row {
          display: flex;
          gap: 0.75rem;
          align-items: baseline;
        }

        .lev-driver-week {
          font-size: 0.75rem;
          font-weight: 600;
          color: #C4976A;
          flex-shrink: 0;
          width: 44px;
        }

        .lev-driver-text {
          font-size: 0.8125rem;
          color: #5A5A62;
          line-height: 1.45;
        }

        /* Legend note line */
        .lev-legend-note {
          font-size: 0.75rem;
          color: #4A4A52;
          line-height: 1.4;
          padding-left: 1.375rem;
          margin-top: 0.125rem;
        }

        /* Ripple role + insight */
        .lev-ripple-role {
          font-size: 0.6875rem;
          color: #4A4A52;
          font-weight: 500;
        }

        .lev-ripple-insight {
          font-size: 0.8125rem;
          color: #5A5A62;
          line-height: 1.5;
          margin-top: 0.5rem;
        }

        /* Forward action on decisions */
        .lev-decision-forward {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-top: 0.5rem;
          font-size: 0.8125rem;
          color: #C4976A;
          line-height: 1.5;
        }

        .lev-forward-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #C4976A;
          flex-shrink: 0;
          margin-top: 5px;
        }

        /* Line chart */
        .lev-chart-wrap {
          background: #16161B;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 1.375rem 1.375rem 1rem;
          overflow: hidden;
        }

        .lev-chart-svg {
          width: 100%;
          display: block;
        }

        .lev-score-label {
          font-size: 0.8125rem;
          color: #6B6B72;
          line-height: 1.55;
          margin-top: 1rem;
          padding: 0 0.125rem;
        }

        .lev-score-label strong {
          color: #C4976A;
          font-weight: 600;
        }

        @keyframes pulseRing {
          0%   { r: 5; opacity: 0.7; }
          70%  { r: 10; opacity: 0; }
          100% { r: 10; opacity: 0; }
        }

        /* Donut chart */
        .lev-donut-wrap {
          background: #16161B;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 1.375rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .lev-donut-svg {
          flex-shrink: 0;
          width: 120px;
          height: 120px;
        }

        .lev-donut-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .lev-donut-container {
          position: relative;
          width: 120px;
          height: 120px;
          flex-shrink: 0;
        }

        .lev-donut-hrs {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 1.5rem;
          color: #EDEAE4;
          line-height: 1;
        }

        .lev-donut-unit {
          font-size: 0.6875rem;
          color: #4A4A52;
          font-weight: 500;
          margin-top: 2px;
        }

        .lev-legend {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .lev-legend-row {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .lev-legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .lev-legend-label {
          flex: 1;
          font-size: 0.8125rem;
          color: #8A8888;
          line-height: 1.3;
        }

        .lev-legend-pct {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #EDEAE4;
        }

        /* Team ripple */
        /* Causal ripple cards */
        .ripple-causal-card {
          background: #16161B;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 1.25rem;
        }

        .ripple-positive { border-left: 3px solid #4ADE80; }
        .ripple-negative { border-left: 3px solid rgba(248,113,113,0.6); }
        .ripple-neutral  { border-left: 3px solid #C4976A; }

        .ripple-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .lev-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #EDEAE4;
          flex-shrink: 0;
        }

        .lev-ripple-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #EDEAE4;
        }

        .ripple-impact-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.25rem 0.625rem;
          border-radius: 100px;
          flex-shrink: 0;
        }

        .ripple-tag-positive { background: rgba(74,222,128,0.1);  color: #4ADE80; }
        .ripple-tag-negative { background: rgba(248,113,113,0.1); color: rgba(248,113,113,0.9); }
        .ripple-tag-neutral  { background: rgba(196,151,106,0.1); color: #C4976A; }

        .ripple-causal-rows {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .ripple-causal-row {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 0.75rem;
          align-items: baseline;
        }

        .ripple-field-label {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #4A4A52;
          flex-shrink: 0;
        }

        .ripple-field-value {
          font-size: 0.875rem;
          color: #A8A5A0;
          line-height: 1.55;
        }

        .ripple-tradeoff {
          color: #6B6B72;
          font-style: italic;
        }

        /* Keep bar styles for Team tab reuse */
        .lev-bar-track {
          flex: 1;
          height: 6px;
          background: rgba(255,255,255,0.06);
          border-radius: 100px;
          overflow: hidden;
          display: flex;
        }

        .lev-bar-pos {
          height: 100%;
          background: #4ADE80;
          border-radius: 100px 0 0 100px;
        }

        .lev-bar-neg {
          height: 100%;
          background: rgba(248,113,113,0.6);
          border-radius: 0 100px 100px 0;
        }

        .lev-ripple-pct {
          font-size: 0.75rem;
          font-weight: 600;
          color: #4ADE80;
          width: 32px;
          text-align: right;
          flex-shrink: 0;
        }

        /* Decision timeline */
        .lev-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          background: #16161B;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
        }

        .lev-decision-row {
          display: flex;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative;
        }

        .lev-decision-row:last-child { border-bottom: none; }

        .lev-decision-border {
          width: 3px;
          border-radius: 100px;
          flex-shrink: 0;
          align-self: stretch;
          min-height: 100%;
        }

        .lev-decision-border.won      { background: #4ADE80; }
        .lev-decision-border.progress { background: #C4976A; }
        .lev-decision-border.lost     { background: rgba(248,113,113,0.55); }

        .lev-decision-body { flex: 1; }

        .lev-decision-date {
          font-size: 0.6875rem;
          color: #4A4A52;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .lev-decision-text {
          font-size: 0.9375rem;
          color: #EDEAE4;
          line-height: 1.45;
          margin-bottom: 0.375rem;
        }

        .lev-decision-consequence {
          font-size: 0.8125rem;
          color: #5A5A62;
          line-height: 1.5;
        }

        /* ─── TEAM VIEW ────────────────────────────────────── */
        .team-card {
          background: #16161B;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 1.375rem;
          margin-bottom: 0.875rem;
        }

        .team-card-header {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          margin-bottom: 1.125rem;
        }

        .team-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 700;
          color: #EDEAE4;
          flex-shrink: 0;
        }

        .team-name {
          font-size: 1rem;
          font-weight: 600;
          color: #EDEAE4;
          line-height: 1.2;
        }

        .team-role {
          font-size: 0.8125rem;
          color: #4A4A52;
          margin-top: 1px;
        }

        .team-status-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 0.25rem 0.625rem;
          border-radius: 100px;
          flex-shrink: 0;
          margin-left: auto;
        }

        .badge-on-track  { background: rgba(74,222,128,0.1);  color: #4ADE80; }
        .badge-pending   { background: rgba(196,151,106,0.1); color: #C4976A; }
        .badge-at-risk   { background: rgba(248,113,113,0.1); color: rgba(248,113,113,0.9); }
        .badge-critical  { background: rgba(248,113,113,0.15); color: rgba(248,113,113,1); }

        .team-pipeline {
          font-size: 0.875rem;
          font-weight: 600;
          color: #EDEAE4;
          margin-bottom: 0.25rem;
        }

        .team-pipeline-note {
          font-size: 0.8125rem;
          color: #5A5A62;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .team-section-label {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: #4A4A52;
          margin-bottom: 0.5rem;
        }

        .team-week-item {
          margin-bottom: 0.75rem;
          padding-left: 0.875rem;
          border-left: 2px solid rgba(255,255,255,0.08);
        }

        .team-week-decision {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #8A8888;
          margin-bottom: 0.2rem;
        }

        .team-week-impact {
          font-size: 0.8125rem;
          color: #5A5A62;
          line-height: 1.5;
        }

        .team-next-action {
          background: rgba(196,151,106,0.07);
          border: 1px solid rgba(196,151,106,0.15);
          border-radius: 10px;
          padding: 0.875rem 1rem;
          margin-top: 1rem;
        }

        .team-next-label {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: #C4976A;
          margin-bottom: 0.375rem;
        }

        .team-next-deadline {
          font-size: 0.75rem;
          color: #C4976A;
          font-weight: 600;
          margin-bottom: 0.375rem;
        }

        .team-next-text {
          font-size: 0.875rem;
          color: #A8A5A0;
          line-height: 1.55;
        }

        .team-multiplier {
          margin-top: 0.875rem;
          font-size: 0.8125rem;
          color: #4A4A52;
          line-height: 1.5;
          font-style: italic;
        }

        /* urgency overrides for critical */
        .team-card.urgent-critical {
          border-color: rgba(248,113,113,0.2);
        }

        .team-card.urgent-critical .team-next-action {
          background: rgba(248,113,113,0.06);
          border-color: rgba(248,113,113,0.2);
        }

        .team-card.urgent-critical .team-next-label,
        .team-card.urgent-critical .team-next-deadline,
        .team-card.urgent-critical .team-next-text {
          color: rgba(248,113,113,0.85);
        }

        /* ─── DECISIONS VIEW ────────────────────────────────── */
        .dec-risk-bar {
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 12px;
          padding: 0.875rem 1.125rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          color: rgba(248,113,113,0.85);
          line-height: 1.5;
        }

        .dec-risk-bar strong { color: rgba(248,113,113,1); font-weight: 600; }

        .dec-filter-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .dec-filter-btn {
          font-size: 0.8125rem;
          font-weight: 500;
          padding: 0.375rem 0.875rem;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: #6B6B72;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s, background 0.15s, border-color 0.15s;
        }

        .dec-filter-btn.active {
          background: rgba(196,151,106,0.12);
          border-color: rgba(196,151,106,0.3);
          color: #C4976A;
        }

        .dec-card {
          background: #16161B;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 1.375rem;
          margin-bottom: 0.875rem;
        }

        .dec-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .dec-date {
          font-size: 0.75rem;
          font-weight: 600;
          color: #4A4A52;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .dec-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #EDEAE4;
          line-height: 1.4;
          margin-bottom: 1rem;
        }

        .dec-field-row {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 0.625rem 0.875rem;
          margin-bottom: 0.625rem;
          align-items: baseline;
        }

        .dec-field-label {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #4A4A52;
        }

        .dec-field-value {
          font-size: 0.875rem;
          color: #8A8888;
          line-height: 1.55;
        }

        .dec-field-value.italic { font-style: italic; color: #6B6B72; }

        .dec-forward {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-top: 0.875rem;
          padding-top: 0.875rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-size: 0.875rem;
          color: #C4976A;
          line-height: 1.5;
        }

        .dec-forward-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #C4976A;
          flex-shrink: 0;
          margin-top: 6px;
        }

        /* ─── CONNECT VIEW ─────────────────────────────────── */
        .source-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .source-row:last-child { border-bottom: none; }
        .source-name { font-size: 0.9375rem; font-weight: 500; color: #EDEAE4; }
        .source-last { font-size: 0.75rem; color: #4A4A52; margin-top: 1px; }

        .source-status {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          font-weight: 500;
        }

        .source-status.connected { color: #4ADE80; }
        .source-status.disconnected { color: #4A4A52; }

        .status-dot { width: 7px; height: 7px; border-radius: 50%; }
        .status-dot.connected {
          background: #4ADE80;
          animation: livePulse 2s ease-in-out infinite;
        }
        .status-dot.disconnected { background: #2A2A32; }

        .connect-btn {
          padding: 0.4375rem 0.875rem;
          font-size: 0.8125rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #C4976A;
          background: rgba(196,151,106,0.1);
          border: 1px solid rgba(196,151,106,0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }

        .connect-btn:hover {
          background: rgba(196,151,106,0.18);
          border-color: rgba(196,151,106,0.4);
        }

        /* Feedback overlay */
        .feedback-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.65);
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: fadeIn 0.2s ease both;
        }

        .feedback-card {
          background: #1A1A20;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 22px;
          padding: 1.75rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: cardIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .feedback-title {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 1.625rem;
          color: #EDEAE4;
          margin-bottom: 0.3125rem;
        }

        .feedback-sub {
          font-size: 0.875rem;
          color: #4A4A52;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .feedback-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .feedback-opt {
          width: 100%;
          padding: 0.875rem 1.125rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 11px;
          font-size: 0.9375rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          color: #EDEAE4;
          cursor: pointer;
          text-align: left;
          transition: background 0.12s, border-color 0.12s, transform 0.1s;
        }

        .feedback-opt:hover {
          background: rgba(196,151,106,0.1);
          border-color: rgba(196,151,106,0.3);
          transform: translateX(3px);
        }

        /* ─── STORIES ────────────────────────────────────── */
        .story-screen {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: #09090C;
          display: flex;
          flex-direction: column;
          user-select: none;
          -webkit-user-select: none;
        }

        .story-bars {
          display: flex;
          gap: 5px;
          padding: 0.875rem 1.125rem 0;
          flex-shrink: 0;
          position: relative;
          z-index: 2;
        }

        .story-bar-track {
          flex: 1;
          height: 2px;
          background: rgba(255,255,255,0.18);
          border-radius: 2px;
          overflow: hidden;
        }

        .story-bar-fill {
          height: 100%;
          background: #EDEAE4;
          border-radius: 2px;
          width: 0%;
        }

        .story-bar-fill.completed { width: 100%; }

        .story-bar-fill.active {
          animation: storyFill 3s linear forwards;
        }

        .story-bar-fill.active.paused {
          animation-play-state: paused;
        }

        @keyframes storyFill {
          from { width: 0%; }
          to { width: 100%; }
        }

        .story-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 1.125rem 0;
          flex-shrink: 0;
          position: relative;
          z-index: 2;
        }

        .story-brand {
          font-size: 1rem;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          letter-spacing: -0.03em;
          font-family: 'DM Sans', sans-serif;
        }

        .story-skip {
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.07);
          border: none;
          border-radius: 100px;
          padding: 0.3125rem 0.875rem;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s, background 0.15s;
          position: relative;
          z-index: 3;
        }

        .story-skip:hover {
          color: rgba(255,255,255,0.75);
          background: rgba(255,255,255,0.11);
        }

        .story-header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .story-share-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(255,255,255,0.07);
          border: none;
          border-radius: 50%;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
          position: relative;
          z-index: 3;
        }

        .story-share-btn:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.13);
        }

        .story-toast {
          position: absolute;
          bottom: 6rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(30,30,30,0.92);
          color: rgba(255,255,255,0.85);
          font-size: 0.75rem;
          font-family: 'DM Sans', sans-serif;
          padding: 0.5rem 1.25rem;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          z-index: 10;
          white-space: nowrap;
          animation: toastIn 0.2s ease;
        }

        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .story-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          transition: background 0.6s ease;
        }

        .story-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 2rem 2.25rem 5rem;
          position: relative;
          z-index: 2;
          animation: storySlideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .story-content.exiting {
          animation: storySlideOut 0.32s cubic-bezier(0.4, 0, 0.6, 1) forwards !important;
        }

        .story-label {
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          margin-bottom: 1.125rem;
          opacity: 0.6;
        }

        .story-headline {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(3rem, 9vw, 4.5rem);
          line-height: 1.05;
          color: #EDEAE4;
          margin-bottom: 1.25rem;
          letter-spacing: -0.01em;
        }

        .story-sub {
          font-size: clamp(0.9375rem, 2.5vw, 1.0625rem);
          color: rgba(237,234,228,0.55);
          line-height: 1.7;
          max-width: 420px;
        }

        .story-tap-zones {
          position: absolute;
          inset: 0;
          display: flex;
          z-index: 1;
        }

        .story-tap-left  { flex: 0 0 35%; cursor: pointer; }
        .story-tap-right { flex: 1; cursor: pointer; }

        @keyframes storySlideIn {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes storySlideOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-16px); }
        }

        /* ── Celebrating: last slide ── */
        .story-screen.celebrating .story-glow {
          animation: celebGlowPulse 2.2s ease-in-out infinite;
        }
        @keyframes celebGlowPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.5); }
        }

        .story-headline-celebrate {
          animation: headlineGlow 2.2s ease-in-out infinite;
        }
        @keyframes headlineGlow {
          0%, 100% { text-shadow: none; }
          50%       { text-shadow: 0 0 48px rgba(237, 234, 228, 0.6), 0 0 100px rgba(196, 151, 106, 0.4); }
        }

        /* Ember particles */
        .story-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        .sp {
          position: absolute;
          border-radius: 50%;
        }

        /* 5 drift directions — reused across 10 particles */
        @keyframes pDriftA { 0% { opacity:0; transform:scale(0); } 12% { opacity:1; transform:scale(1); } 100% { opacity:0; transform:translate(-90px,-240px) scale(0.3); } }
        @keyframes pDriftB { 0% { opacity:0; transform:scale(0); } 12% { opacity:1; transform:scale(1); } 100% { opacity:0; transform:translate(110px,-220px) scale(0.4); } }
        @keyframes pDriftC { 0% { opacity:0; transform:scale(0); } 12% { opacity:1; transform:scale(1); } 100% { opacity:0; transform:translate(-14px,-270px) scale(0.25); } }
        @keyframes pDriftD { 0% { opacity:0; transform:scale(0); } 12% { opacity:1; transform:scale(1); } 100% { opacity:0; transform:translate(-140px,-180px) scale(0.45); } }
        @keyframes pDriftE { 0% { opacity:0; transform:scale(0); } 12% { opacity:1; transform:scale(1); } 100% { opacity:0; transform:translate(130px,-195px) scale(0.35); } }

        .sp1  { width:10px; height:10px; left:15%; top:80%; background:#C4976A; animation:pDriftA 2.6s ease-out 0.0s  infinite; }
        .sp2  { width:8px;  height:8px;  left:80%; top:72%; background:#EDEAE4; animation:pDriftB 2.5s ease-out 0.18s infinite; }
        .sp3  { width:6px;  height:6px;  left:50%; top:88%; background:#4ADE80; animation:pDriftC 2.7s ease-out 0.35s infinite; }
        .sp4  { width:12px; height:12px; left:8%;  top:55%; background:#D4A77A; animation:pDriftD 2.4s ease-out 0.08s infinite; }
        .sp5  { width:8px;  height:8px;  left:88%; top:60%; background:#C4976A; animation:pDriftE 2.5s ease-out 0.22s infinite; }
        .sp6  { width:6px;  height:6px;  left:35%; top:92%; background:#EDEAE4; animation:pDriftB 2.8s ease-out 0.5s  infinite; }
        .sp7  { width:10px; height:10px; left:65%; top:85%; background:#4ADE80; animation:pDriftA 2.6s ease-out 0.62s infinite; }
        .sp8  { width:7px;  height:7px;  left:22%; top:40%; background:#C4976A; animation:pDriftD 2.5s ease-out 0.38s infinite; }
        .sp9  { width:8px;  height:8px;  left:75%; top:35%; background:#EDEAE4; animation:pDriftC 2.7s ease-out 0.55s infinite; }
        .sp10 { width:11px; height:11px; left:48%; top:50%; background:#D4A77A; animation:pDriftE 2.6s ease-out 0.72s infinite; }

        /* Animations */
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes sheetUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        @keyframes kongIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes floatIn {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        @keyframes orbPulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(196,151,106,0.1), 0 4px 20px rgba(196,151,106,0.35); }
          50% { box-shadow: 0 0 0 9px rgba(196,151,106,0.06), 0 4px 28px rgba(196,151,106,0.48); }
        }

        @keyframes thoughtUp {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.94); }
          60% { transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* ─── MOBILE BOTTOM NAV ───────────────────────────── */
        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          height: calc(60px + env(safe-area-inset-bottom));
          padding-bottom: env(safe-area-inset-bottom);
          background: #09090C;
          border-top: 1px solid rgba(255,255,255,0.05);
          align-items: stretch;
          justify-content: space-around;
        }

        .bnav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          background: none;
          border: none;
          cursor: pointer;
          color: #3A3A42;
          padding: 0.5rem 0;
          transition: color 0.15s;
          min-width: 0;
        }

        .bnav-item.active { color: #C4976A; }
        .bnav-item:hover { color: #6B6B72; }

        .bnav-label {
          font-size: 0.625rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 64px;
        }

        /* Logo in topbar — shown only on mobile */
        .topbar-logo-mobile {
          display: none;
          width: 26px;
          height: 26px;
          border-radius: 7px;
          background: #C4976A;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-right: 0.625rem;
        }

        .topbar-left { display: flex; align-items: center; }

        /* ─── MOBILE HEADER (Opal-style wordmark row) ──────── */
        .mobile-header {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1.375rem 0.375rem;
          flex-shrink: 0;
        }

        .mobile-wordmark {
          font-size: 1.5625rem;
          font-weight: 700;
          color: #EDEAE4;
          letter-spacing: -0.04em;
          font-family: 'DM Sans', sans-serif;
        }

        /* ─── TABLET: 640px–1023px ────────────────────────── */
        @media (min-width: 640px) and (max-width: 1023px) {
          .sidebar { width: 60px !important; align-items: center !important; }
          .nav-item-label { opacity: 0 !important; pointer-events: none !important; }
          .user-info { opacity: 0 !important; pointer-events: none !important; }
          .topbar-date { display: none; }
          .topbar-right { gap: 0.625rem; }
          .secondary-view { padding: 1.5rem 1.5rem 2rem; }
          .stats-row { gap: 0.75rem; }
        }

        /* ─── MOBILE: < 640px ─────────────────────────────── */
        @media (max-width: 639px) {
          /* Hide sidebar + standard topbar */
          .sidebar { display: none; }
          .topbar { display: none !important; }

          /* Show Opal-style wordmark header */
          .mobile-header { display: flex; }

          /* Show icon-only bottom nav */
          .bottom-nav { display: flex; height: calc(56px + env(safe-area-inset-bottom)); }
          .bnav-label { display: none; }
          .content { padding-bottom: calc(56px + env(safe-area-inset-bottom)); }

          /* ── HOME: hero layout ───────────────── */

          /* Stage is a vertical column, top-aligned */
          .home-stage {
            padding: 0 !important;
            align-items: stretch;
            justify-content: flex-start;
            flex-direction: column;
            min-height: calc(100dvh - 56px - env(safe-area-inset-bottom) - 56px);
            position: relative;
            overflow: hidden;
          }

          /* Atmospheric amber glow — replaces gem */
          .home-stage::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 340px;
            height: 340px;
            background: radial-gradient(circle, rgba(196,151,106,0.13) 0%, transparent 65%);
            pointer-events: none;
            z-index: 0;
          }

          /* Card becomes transparent — content floats on dark bg */
          .move-card {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 2.25rem 1.375rem 0 !important;
            max-width: 100% !important;
            position: relative;
            z-index: 1;
          }

          /* Label centered */
          .move-label { text-align: center; }

          /* Hero move text — large, centered */
          .move-action {
            font-size: clamp(1.875rem, 7vw, 2.375rem) !important;
            text-align: center;
            margin-bottom: 2.25rem !important;
          }

          /* Committed text — centered */
          .move-action.committed-style {
            font-size: clamp(1rem, 3.5vw, 1.125rem) !important;
            text-align: center;
          }
          .committed-header { justify-content: center; }

          /* Divider — flush, no side margin */
          .divider { margin: 0; }

          /* Stats row — directly on dark bg, prominent */
          .metrics-row { padding: 1.375rem 0 1.125rem; }
          .metric-value { font-size: 1.375rem !important; }
          .metric-label { font-size: 0.5625rem; }

          /* Why btn — centered block */
          .why-btn {
            display: block !important;
            text-align: center;
            width: 100%;
            padding: 0.5rem 0;
          }

          /* CTA */
          .primary-btn {
            border-radius: 14px !important;
            padding: 1rem !important;
            font-size: 1rem !important;
            margin-top: 1.125rem !important;
          }
          .secondary-btn { border-radius: 14px !important; }

          /* ── SHEETS ──────────────────────────── */
          .sheet {
            padding: 1.25rem 1.375rem;
            padding-bottom: calc(1.75rem + env(safe-area-inset-bottom));
            border-radius: 20px 20px 0 0;
          }

          /* ── OVERLAYS ──────────────────────────── */
          .kong {
            left: 1rem; right: 1rem; width: auto;
            bottom: calc(56px + env(safe-area-inset-bottom) + 0.75rem);
          }
          .orb-wrap {
            right: 1rem;
            bottom: calc(56px + env(safe-area-inset-bottom) + 0.75rem);
          }
          .orb-thought {
            right: 0; left: auto;
            width: min(210px, calc(100vw - 2rem));
          }
          .encouragement {
            white-space: normal; text-align: center;
            max-width: calc(100vw - 4rem);
            bottom: calc(56px + env(safe-area-inset-bottom) + 4.5rem);
          }
          .feedback-overlay {
            padding: 0; align-items: flex-end;
            background: rgba(0,0,0,0.75);
          }
          .feedback-card {
            max-width: 100%;
            border-radius: 22px 22px 0 0;
            padding: 1.75rem 1.5rem;
            padding-bottom: calc(1.75rem + env(safe-area-inset-bottom));
          }

          /* ── RESULT STATE ────────────────────── */
          .result-stage { padding: 2rem 1.375rem 3rem; }
          .result-headline { font-size: clamp(2.25rem, 10vw, 3.25rem); }

          /* ── SECONDARY VIEWS ─────────────────── */
          .secondary-view { padding: 1.5rem 1.25rem 2rem; }
          .section-title { font-size: 1.25rem; }
          .stats-row { gap: 0.5rem; }
          .stat-card { padding: 0.875rem 0.75rem; }
          .stat-value { font-size: 1.25rem; }
          .stat-label { font-size: 0.6875rem; }
          .move-row { padding: 0.875rem 1rem; gap: 0.75rem; }
          .move-row-text { font-size: 0.875rem; }
          .momentum-card { padding: 1.125rem; }
          .momentum-title { font-size: 1.125rem; }
          /* Leverage mobile */
          .lev-donut-wrap { flex-direction: column; align-items: flex-start; gap: 1.25rem; }
          .lev-donut-container { align-self: center; }
          .lev-legend { width: 100%; }
          .lev-ripple-name { width: 56px; font-size: 0.8125rem; }
          .lev-decision-text { font-size: 0.875rem; }
          .lev-decision-consequence { font-size: 0.75rem; }
        }
      `}</style>

      {/* ─── STORIES OVERLAY — fixed, covers everything ─── */}
      {moveState === 'stories' && (() => {
        const s = stories[storyIndex];
        return (
          <div className={`story-screen${storyIndex === stories.length - 1 ? ' celebrating' : ''}`}>
            {/* Atmospheric glow — unique per slide */}
            <div
              className="story-glow"
              style={{
                background: `radial-gradient(ellipse 60% 50% at 50% 30%, ${s.glowColor} 0%, transparent 70%)`,
              }}
            />

            {/* Ember particles — last slide only */}
            {storyIndex === stories.length - 1 && (
              <div className="story-particles" aria-hidden="true">
                <span className="sp sp1" /><span className="sp sp2" /><span className="sp sp3" />
                <span className="sp sp4" /><span className="sp sp5" /><span className="sp sp6" />
                <span className="sp sp7" /><span className="sp sp8" /><span className="sp sp9" />
                <span className="sp sp10" />
              </div>
            )}

            {/* Progress bars */}
            <div className="story-bars">
              {STORIES.map((_, i) => (
                <div className="story-bar-track" key={i}>
                  {i < storyIndex ? (
                    <div className="story-bar-fill completed" />
                  ) : i === storyIndex ? (
                    <div
                      key={`active-${storyIndex}`}
                      className={`story-bar-fill active${storyPaused ? ' paused' : ''}`}
                    />
                  ) : (
                    <div className="story-bar-fill" />
                  )}
                </div>
              ))}
            </div>

            {/* Header: brand + share + skip */}
            <div className="story-header">
              <span className="story-brand">Konquer</span>
              <div className="story-header-actions">
                <button className="story-share-btn" onClick={() => handleStoryShare(s)} aria-label="Share">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2v10M10 2l-3 3M10 2l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 8H4a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2h-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </button>
                <button className="story-skip" onClick={handleStorySkip}>Skip</button>
              </div>
            </div>

            {/* Clipboard fallback toast */}
            {shareToast && (
              <div className="story-toast">Copied to clipboard</div>
            )}

            {/* Content — keyed to storyIndex so it re-animates on each slide */}
            <div className={`story-content${storyExiting ? ' exiting' : ''}`} key={`content-${storyIndex}`}>
              <div className="story-label" style={{ color: s.accentColor }}>{s.label}</div>
              <div
                className={`story-headline${storyIndex === stories.length - 1 ? ' story-headline-celebrate' : ''}`}
                style={{ color: s.accentColor === '#EDEAE4' ? '#EDEAE4' : s.accentColor }}
              >
                {s.headline}
              </div>
              <div className="story-sub">{s.sub}</div>
            </div>

            {/* Invisible tap zones — swipe handled at parent level on touch, tap on child level for mouse */}
            <div
              className="story-tap-zones"
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
                touchStartY.current = e.touches[0].clientY;
                onStoryPressStart();
              }}
              onTouchEnd={(e) => {
                const deltaX = e.changedTouches[0].clientX - touchStartX.current;
                const deltaY = e.changedTouches[0].clientY - touchStartY.current;
                if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
                  // horizontal swipe — cancel hold and navigate
                  if (storyHoldTimer.current) clearTimeout(storyHoldTimer.current);
                  if (storyIsHolding.current) { setStoryPaused(false); storyIsHolding.current = false; }
                  if (deltaX < 0) handleStoryNext(); else handleStoryBack();
                } else {
                  // treat as tap
                  const isRight = e.changedTouches[0].clientX > window.innerWidth / 2;
                  onStoryPressEnd(isRight);
                }
              }}
            >
              <div
                className="story-tap-left"
                onMouseDown={onStoryPressStart}
                onMouseUp={() => onStoryPressEnd(false)}
                onMouseLeave={() => { if (storyIsHolding.current) { setStoryPaused(false); storyIsHolding.current = false; } if (storyHoldTimer.current) clearTimeout(storyHoldTimer.current); }}
              />
              <div
                className="story-tap-right"
                onMouseDown={onStoryPressStart}
                onMouseUp={() => onStoryPressEnd(true)}
                onMouseLeave={() => { if (storyIsHolding.current) { setStoryPaused(false); storyIsHolding.current = false; } if (storyHoldTimer.current) clearTimeout(storyHoldTimer.current); }}
              />
            </div>
          </div>
        );
      })()}

      <div className="app">

        {/* ─── SIDEBAR ─────────────────────────────────────── */}
        <div
          className={`sidebar${sidebarHovered ? ' expanded' : ''}`}
          onMouseEnter={() => setSidebarHovered(true)}
          onMouseLeave={() => setSidebarHovered(false)}
        >
          {/* Logo mark */}
          <div className="sidebar-logo">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M10 2l2 5h5l-4 3 1.5 5L10 13l-4.5 2L7 10 3 7h5L10 2z" fill="#FFFFFF" />
            </svg>
          </div>

          {/* Nav items */}
          <nav className="nav-list">
            {NAV.map((item) => (
              <button
                key={item.id}
                className={`nav-item${view === item.id ? ' active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                title={item.label}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="sidebar-bottom">
            <button className="sidebar-user">
              <div className="user-avatar">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7" r="3.5" stroke="#6B6B5A" strokeWidth="1.5" />
                  <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#6B6B5A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="user-info">
                <div className="user-name">Dallas</div>
                <div className="user-role">Founder</div>
              </div>
            </button>
          </div>
        </div>

        {/* ─── MAIN AREA ────────────────────────────────────── */}
        <div className="main">

          {/* Mobile wordmark header — Opal-style, replaces topbar on small screens */}
          <div className="mobile-header">
            <span className="mobile-wordmark">Konquer</span>
          </div>

          {/* Top bar */}
          <div className="topbar">
            <div className="topbar-left">
              {/* Logo mark visible only on mobile (sidebar hidden) */}
              <div className="topbar-logo-mobile" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
                  <path d="M10 2l2 5h5l-4 3 1.5 5L10 13l-4.5 2L7 10 3 7h5L10 2z" fill="#FFFFFF" />
                </svg>
              </div>
              <span className="topbar-view-label">
                {view === 'home' && "Today's Move"}
                {view === 'insights' && 'Insights'}
                {view === 'leverage' && 'Leverage'}
                {view === 'team' && 'Team'}
                {view === 'decisions' && 'Decisions'}
              </span>
            </div>
            <div className="topbar-right">
              <span className="topbar-date">Mon, Mar 30</span>
            </div>
          </div>

          {/* ─── CONTENT ──────────────────────────────────── */}
          <div className="content">

            {/* HOME VIEW */}
            {view === 'home' && (
              <>
                {(moveState === 'idle' || moveState === 'context' || moveState === 'committed') && (
                  <div className="home-stage">
                    <div className="move-card">
                      {moveState !== 'committed' ? (
                        <>
                          <div className="move-label">Today&apos;s Move</div>
                          <div className="move-action">{move.action}</div>
                        </>
                      ) : (
                        <>
                          <div className="committed-header">
                            <div className="committed-badge">
                              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="#C4976A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              Locked in
                            </div>
                          </div>
                          <div className="move-action committed-style">{move.action}</div>
                        </>
                      )}

                      <div className="divider" />

                      <div className="metrics-row">
                        {move.metrics.map((m) => (
                          <div className="metric" key={m.label}>
                            <div className="metric-value">{m.value}</div>
                            <div className="metric-label">{m.label}</div>
                          </div>
                        ))}
                      </div>

                      {moveState !== 'committed' && (
                        <button className="why-btn" onClick={() => setMoveState('context')}>
                          Why this move?
                        </button>
                      )}

                      {moveState !== 'committed' ? (
                        <button className="primary-btn" onClick={handleLetsDoIt}>
                          Let&apos;s do it
                        </button>
                      ) : (
                        <button className="primary-btn" onClick={() => setMoveState('feedback')}>
                          Mark complete
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Win / Learn state */}
                {(moveState === 'win' || moveState === 'learn') && (
                  <div className="result-stage">
                    <div className="result-wrap">
                      <div className="result-headline">
                        {moveState === 'win' ? 'Clean win.' : 'Noted.'}
                      </div>
                      <p className="result-sub">
                        {moveState === 'win'
                          ? '$18K secured. Your focus is compounding — this is what momentum looks like up close.'
                          : "Tomorrow's move will account for it. Every outcome makes the system sharper."}
                      </p>
                      <button className="next-btn" onClick={() => { setMoveState('stories'); setStoryIndex(0); setShowKong(false); setKongDismissed(false); }}>
                        See tomorrow&apos;s move
                      </button>
                    </div>
                  </div>
                )}

                {/* Context sheet — Why this? */}
                {moveState === 'context' && (
                  <>
                    <div className="overlay" onClick={() => setMoveState('idle')} />
                    <div className="sheet">
                      <div className="sheet-handle" />
                      <div className="sheet-title">Why this move?</div>
                      <div className="sheet-body">{move.why}</div>
                      <button className="secondary-btn" onClick={() => setMoveState('idle')}>
                        Got it
                      </button>
                    </div>
                  </>
                )}

                {/* Prep sheet — after committing */}
                {moveState === 'committed' && (
                  <>
                    <div className="overlay muted" />
                    <div className="sheet">
                      <div className="sheet-handle" />
                      <div className="sheet-title">Everything&apos;s ready.</div>
                      <ul className="prep-list">
                        {move.prep.map((item, i) => (
                          <li className="prep-item" key={i}>
                            <div className="prep-icon">
                              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                                <path d="M1.5 4.5l2.25 2.25L7.5 2" stroke="#C4976A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* Kong companion — variable reward */}
                {showKong && !kongDismissed && (
                  <div className="kong">
                    <div className="kong-inner">
                      <div className="kong-avatar">
                        <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                          <ellipse cx="10" cy="13" rx="5" ry="4" fill="#C4976A" />
                          <circle cx="10" cy="7" r="4.5" fill="#C4976A" />
                          <circle cx="8" cy="6.5" r="1" fill="#1A1A1A" />
                          <circle cx="12" cy="6.5" r="1" fill="#1A1A1A" />
                          <path d="M8.5 9.5q1.5 1 3 0" stroke="#1A1A1A" strokeWidth="0.75" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <div className="kong-name">Kong</div>
                        <div className="kong-msg">{KONG_MESSAGES[kongMsgIdx]}</div>
                      </div>
                    </div>
                    <button
                      className="kong-x"
                      onClick={() => { setShowKong(false); setKongDismissed(true); }}
                      aria-label="Dismiss"
                    >×</button>
                  </div>
                )}

                {/* Encouragement bubble */}
                {showEncouragement && (
                  <div className="encouragement">You&apos;ve got this — just make the call.</div>
                )}

                {/* Mentor Orb — hidden during stories */}
                {moveState !== 'stories' && (
                  <div className="orb-wrap">
                    {showOrbThought && (
                      <div className="orb-thought">{ORB_THOUGHTS[orbThoughtIdx]}</div>
                    )}
                    <button className="orb" onClick={handleOrbClick} aria-label="Mentor" />
                  </div>
                )}

                {/* Feedback overlay */}
                {moveState === 'feedback' && (
                  <div className="feedback-overlay">
                    <div className="feedback-card">
                      <div className="feedback-title">How did it go?</div>
                      <div className="feedback-sub">Takes 2 seconds. Helps the system get sharper.</div>
                      <div className="feedback-options">
                        <button className="feedback-opt" onClick={() => {
                          setMoveState('win');
                          if (journalId) {
                            apiLogOutcome({ journal_id: journalId, actual_money_lift: 1, actual_time_to_value_days: 1, notes: 'won' });
                          }
                        }}>Won it</button>
                        <button className="feedback-opt" onClick={() => {
                          setMoveState('learn');
                          if (journalId) {
                            apiLogOutcome({ journal_id: journalId, actual_money_lift: 0, actual_time_to_value_days: 999, notes: 'not_closed' });
                          }
                        }}>Didn&apos;t close — not yet</button>
                        <button className="feedback-opt" onClick={() => {
                          setMoveState('committed');
                          if (journalId) {
                            apiLogOutcome({ journal_id: journalId, actual_money_lift: 0, actual_time_to_value_days: 30, notes: 'in_progress' });
                          }
                        }}>Still in progress</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* INSIGHTS VIEW */}
            {view === 'insights' && (
              <div className="secondary-view">
                <div className="stats-row">
                  <div className="stat-card">
                    <div className="stat-value">$50K</div>
                    <div className="stat-label">Won this week</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">4 / 5</div>
                    <div className="stat-label">Moves executed</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">3 days</div>
                    <div className="stat-label">Current streak</div>
                  </div>
                </div>

                <div className="section-title">Past Moves</div>
                <div className="section-sub">Last 5 days</div>
                <div className="card">
                  {pastMoves.map((m, i) => (
                    <div className="move-row" key={i}>
                      <div style={{ flex: 1 }}>
                        <div className="move-row-date">{m.date}</div>
                        <div className="move-row-text">{m.action}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <div className={`outcome-badge ${m.outcome}`}>
                          {m.outcome === 'won' ? 'Won' : m.outcome === 'progress' ? 'In progress' : 'Missed'}
                        </div>
                        {m.value !== '$0' && (
                          <span style={{ fontSize: '0.75rem', color: '#4A4A52', fontWeight: 500 }}>{m.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Week in focus — absorbed from Momentum */}
                <div className="section-title" style={{ marginTop: '2rem' }}>Week in Focus</div>
                <div className="section-sub">What this week&apos;s execution protected and where it&apos;s heading</div>
                <div className="momentum-card" style={{ marginBottom: '1rem' }}>
                  <div className="momentum-title">
                    You protected $50K and kept your pipeline moving — in under 3 hours of focused effort.
                  </div>
                  <div className="momentum-body">
                    Every move you committed to this week was the highest-leverage action available. You didn&apos;t get distracted. That&apos;s not luck — that&apos;s the system working.
                  </div>
                </div>
                <div className="card">
                  {[
                    { label: 'Revenue protected', value: '$50K' },
                    { label: 'Time invested', value: '2h 20min' },
                    { label: 'Pipeline coverage', value: '3.2x' },
                    { label: 'Next highest-leverage move', value: 'DataSync close' },
                  ].map((item, i) => (
                    <div className="momentum-metric" key={i}>
                      <div className="mm-dot" />
                      <span className="mm-label">{item.label}</span>
                      <span className="mm-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LEVERAGE VIEW */}
            {view === 'leverage' && (() => {
              // Line chart geometry
              const vW = 320, padX = 20, padY = 16, chartW = vW - padX * 2, chartH = 84, vH = chartH + padY * 2 + 18;
              const pts = leverageWeeks.map((d, i) => ({
                x: padX + (i / (leverageWeeks.length - 1)) * chartW,
                y: padY + (1 - d.score / 100) * chartH,
              }));
              const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
              const areaPath = `M${pts[0].x},${pts[0].y} ${pts.slice(1).map(p => `L${p.x},${p.y}`).join(' ')} L${pts[pts.length-1].x},${padY + chartH} L${pts[0].x},${padY + chartH} Z`;
              const lastPt = pts[pts.length - 1];

              // Donut geometry
              const r = 44, cx = 60, cy = 60;
              const c = 2 * Math.PI * r; // 276.46
              const totalHrs = timeSegments.reduce((s, t) => s + t.hours, 0);
              let cumulLen = 0;
              const arcs = timeSegments.map(seg => {
                const len = (seg.pct / 100) * c;
                const gap = 3;
                const arc = { dasharray: `${len - gap} ${c - (len - gap)}`, dashoffset: -cumulLen, color: seg.color };
                cumulLen += len;
                return arc;
              });

              return (
                <div className="secondary-view">

                  {/* ── Weekly Synthesis ── */}
                  <div className="lev-section">
                    <div className="lev-synthesis-card">
                      <div className="lev-synthesis-title">Week of Mar 24 — Brief</div>
                      <p className="lev-synthesis-body">
                        You generated <strong>$50K in 2.5 hours</strong> of focused execution — $20K per hour of your highest-leverage time. Nexus is closed and already compounding into Marcus&apos;s pipeline.
                      </p>
                      <p className="lev-synthesis-body" style={{ marginTop: '0.625rem' }}>
                        Two decisions are creating drag: <strong>DataSync is 4 days stalled</strong> ($19K at risk, compounding) and <strong>Casey&apos;s onboarding is behind</strong> (a retention risk you control). Both are recoverable — but only this week.
                      </p>
                    </div>
                  </div>

                  {/* ── Section 1: Execution Trajectory ── */}
                  <div className="lev-section">
                    <div className="lev-section-header">
                      <div className="section-title">Execution Trajectory</div>
                      <div className="section-sub">Leverage score — driven by execution rate and outcome quality</div>
                    </div>
                    <div className="lev-chart-wrap">
                      <svg
                        className="lev-chart-svg"
                        viewBox={`0 0 ${vW} ${vH}`}
                        preserveAspectRatio="none"
                        aria-label="Leverage score line chart"
                      >
                        <defs>
                          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#C4976A" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#C4976A" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {[25, 50, 75].map(v => {
                          const gy = padY + (1 - v / 100) * chartH;
                          return <line key={v} x1={padX} y1={gy} x2={vW - padX} y2={gy} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />;
                        })}
                        <path d={areaPath} fill="url(#areaGrad)" />
                        <polyline points={polyline} fill="none" stroke="#C4976A" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                        {pts.map((p, i) => (
                          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#C4976A" />
                        ))}
                        <circle cx={lastPt.x} cy={lastPt.y} r="3.5" fill="#C4976A" />
                        <circle cx={lastPt.x} cy={lastPt.y} r="3.5" fill="none" stroke="#C4976A" strokeWidth="1.5" opacity="0.5">
                          <animate attributeName="r" values="5;13;5" dur="2.4s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
                        </circle>
                        {pts.map((p, i) => (
                          <text key={i} x={p.x} y={p.y - 8} textAnchor="middle" fill="#C4976A" fontSize="9" fontWeight="600" opacity="0.8">
                            {leverageWeeks[i].score}
                          </text>
                        ))}
                        {pts.map((p, i) => (
                          <text key={i} x={p.x} y={vH - 2} textAnchor="middle" fill="#4A4A52" fontSize="9">
                            {leverageWeeks[i].week}
                          </text>
                        ))}
                      </svg>
                      <div className="lev-driver-list">
                        {leverageWeeks.map((w, i) => (
                          <div className="lev-driver-row" key={i}>
                            <span className="lev-driver-week">{w.week}</span>
                            <span className="lev-driver-text">{w.driver}</span>
                          </div>
                        ))}
                      </div>
                      <p className="lev-score-label">
                        <strong>Up 38 points in 4 weeks.</strong> Consistent execution is the only variable that moved this score. Letting DataSync or Casey slip would reverse the trajectory.
                      </p>
                    </div>
                  </div>

                  {/* ── Section 2: Time ROI ── */}
                  <div className="lev-section">
                    <div className="lev-section-header">
                      <div className="section-title">Time ROI</div>
                      <div className="section-sub">{totalHrs}h of tracked execution this week</div>
                    </div>
                    <div className="lev-donut-wrap">
                      <div className="lev-donut-container">
                        <svg className="lev-donut-svg" viewBox="0 0 120 120">
                          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
                          {arcs.map((arc, i) => (
                            <circle
                              key={i}
                              cx={cx} cy={cy} r={r}
                              fill="none"
                              stroke={arc.color}
                              strokeWidth="14"
                              strokeDasharray={arc.dasharray}
                              strokeDashoffset={arc.dashoffset}
                              strokeLinecap="butt"
                              transform={`rotate(-90, ${cx}, ${cy})`}
                            />
                          ))}
                        </svg>
                        <div className="lev-donut-center">
                          <span className="lev-donut-hrs">$20K</span>
                          <span className="lev-donut-unit">per hr</span>
                        </div>
                      </div>
                      <div className="lev-legend">
                        {timeSegments.map((seg, i) => (
                          <div key={i} style={{ marginBottom: '0.625rem' }}>
                            <div className="lev-legend-row">
                              <div className="lev-legend-dot" style={{ background: seg.color }} />
                              <span className="lev-legend-label">{seg.label}</span>
                              <span className="lev-legend-pct">{seg.hours}h</span>
                            </div>
                            <div className="lev-legend-note">{seg.note}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="lev-score-label" style={{ marginTop: '1rem' }}>
                      Cutting 1 hour of reactive time next week would free capacity for one more high-leverage move — at this week&apos;s rate, that&apos;s worth ~$20K.
                    </p>
                  </div>

                  {/* ── Section 3: Ripple Effect ── */}
                  <div className="lev-section">
                    <div className="lev-section-header">
                      <div className="section-title">Ripple Effect</div>
                      <div className="section-sub">How each decision reached your team — and what you could have done differently</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {teamRipple.map((member, i) => (
                        <div className={`ripple-causal-card ripple-${member.impact}`} key={i}>
                          <div className="ripple-card-header">
                            <div className="lev-avatar">{member.initial}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <span className="lev-ripple-name">{member.name}</span>
                              <span className="lev-ripple-role" style={{ marginLeft: '0.5rem' }}>{member.role}</span>
                            </div>
                            <div className={`ripple-impact-tag ripple-tag-${member.impact}`}>
                              {member.impact === 'positive' ? 'Unblocked' : member.impact === 'negative' ? 'Stalled' : 'Pending'}
                            </div>
                          </div>
                          <div className="ripple-causal-rows">
                            <div className="ripple-causal-row">
                              <span className="ripple-field-label">Decision</span>
                              <span className="ripple-field-value">{member.decision}</span>
                            </div>
                            <div className="ripple-causal-row">
                              <span className="ripple-field-label">Consequence</span>
                              <span className="ripple-field-value">{member.consequence}</span>
                            </div>
                            <div className="ripple-causal-row">
                              <span className="ripple-field-label">Better option</span>
                              <span className="ripple-field-value">{member.betterOption}</span>
                            </div>
                            {member.tradeoff && (
                              <div className="ripple-causal-row">
                                <span className="ripple-field-label">Tradeoff</span>
                                <span className="ripple-field-value ripple-tradeoff">{member.tradeoff}</span>
                              </div>
                            )}
                          </div>
                          {member.forward && (
                            <div className="lev-decision-forward" style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                              <span className="lev-forward-dot" />
                              {member.forward}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Section 4: Decision Ledger ── */}
                  <div className="lev-section">
                    <div className="lev-section-header">
                      <div className="section-title">Decision Ledger</div>
                      <div className="section-sub">What you decided and what it caused — 7 days</div>
                    </div>
                    <div className="lev-timeline">
                      {decisions.map((d, i) => (
                        <div className="lev-decision-row" key={i}>
                          <div className={`lev-decision-border ${d.type}`} />
                          <div className="lev-decision-body">
                            <div className="lev-decision-date">{d.date}</div>
                            <div className="lev-decision-text">{d.text}</div>
                            <div className="lev-decision-consequence">{d.consequence}</div>
                            {d.forward && (
                              <div className="lev-decision-forward">
                                <span className="lev-forward-dot" />
                                {d.forward}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* DECISIONS VIEW */}
            {view === 'decisions' && (() => {
              const atRisk = decisions.filter(d => d.type === 'lost' || (d.type === 'progress' && d.forward));
              const filtered = decisions.filter(d => {
                if (decFilter === 'won')     return d.type === 'won';
                if (decFilter === 'risk')    return d.type === 'lost';
                if (decFilter === 'recovery') return d.forward !== null && d.forward !== undefined;
                return true;
              });
              return (
                <div className="secondary-view">
                  <div className="section-title">Decisions</div>
                  <div className="section-sub">What you decided, what it caused, and what you could have done differently</div>

                  {atRisk.length > 0 && (
                    <div className="dec-risk-bar">
                      <strong>{atRisk.filter(d => d.type === 'lost').length} decision{atRisk.filter(d => d.type === 'lost').length !== 1 ? 's' : ''} compounding negatively</strong> — DataSync and Casey&apos;s onboarding are both recoverable, but only this week. The longer these stay open, the more expensive they become.
                    </div>
                  )}

                  <div className="dec-filter-row">
                    {([
                      { id: 'all',      label: 'All' },
                      { id: 'won',      label: 'Won' },
                      { id: 'risk',     label: 'At Risk' },
                      { id: 'recovery', label: 'Recovery Needed' },
                    ] as const).map(f => (
                      <button
                        key={f.id}
                        className={`dec-filter-btn${decFilter === f.id ? ' active' : ''}`}
                        onClick={() => setDecFilter(f.id)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {filtered.map((d, i) => (
                    <div className="dec-card" key={i}>
                      <div className="dec-card-header">
                        <span className="dec-date">{d.date}</span>
                        <div className={`outcome-badge ${d.type}`}>
                          {d.type === 'won' ? 'Won' : d.type === 'progress' ? 'In Progress' : 'Missed'}
                        </div>
                      </div>
                      <div className="dec-title">{d.text}</div>
                      <div className="dec-field-row">
                        <span className="dec-field-label">Consequence</span>
                        <span className="dec-field-value">{d.consequence}</span>
                      </div>
                      <div className="dec-field-row">
                        <span className="dec-field-label">Better option</span>
                        <span className="dec-field-value">{d.betterOption}</span>
                      </div>
                      {d.tradeoff && (
                        <div className="dec-field-row">
                          <span className="dec-field-label">Tradeoff</span>
                          <span className="dec-field-value italic">{d.tradeoff}</span>
                        </div>
                      )}
                      {d.forward && (
                        <div className="dec-forward">
                          <span className="dec-forward-dot" />
                          {d.forward}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* TEAM VIEW */}
            {view === 'team' && (
              <div className="secondary-view">
                <div className="section-title">Team</div>
                <div className="section-sub">How your decisions are landing — and what each person needs from you</div>

                {teamDetail.map((member, i) => (
                  <div className={`team-card${member.urgency === 'critical' ? ' urgent-critical' : ''}`} key={i}>
                    <div className="team-card-header">
                      <div className="team-avatar">{member.initial}</div>
                      <div style={{ flex: 1 }}>
                        <div className="team-name">{member.name}</div>
                        <div className="team-role">{member.role}</div>
                      </div>
                      <div className={`team-status-badge ${
                        member.status === 'on-track' ? 'badge-on-track' :
                        member.status === 'pending'  ? 'badge-pending'  :
                        member.urgency === 'critical' ? 'badge-critical' : 'badge-at-risk'
                      }`}>
                        {member.status === 'on-track' ? 'On Track' : member.status === 'pending' ? 'Pending' : member.urgency === 'critical' ? 'Critical' : 'At Risk'}
                      </div>
                    </div>

                    <div className="team-pipeline">{member.pipeline}</div>
                    <div className="team-pipeline-note">{member.pipelineNote}</div>

                    <div className="team-section-label">This week</div>
                    {member.thisWeek.map((item, j) => (
                      <div className="team-week-item" key={j}>
                        <div className="team-week-decision">{item.decision}</div>
                        <div className="team-week-impact">{item.impact}</div>
                      </div>
                    ))}

                    <div className="team-next-action">
                      <div className="team-next-label">Next action</div>
                      <div className="team-next-deadline">Due: {member.deadline}</div>
                      <div className="team-next-text">{member.nextAction}</div>
                    </div>

                    <div className="team-multiplier">{member.multiplierNote}</div>
                  </div>
                ))}
              </div>
            )}


          </div>
        </div>

        {/* MOBILE BOTTOM NAV — replaces sidebar on small screens */}
        <nav className="bottom-nav" aria-label="Main navigation" suppressHydrationWarning>
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`bnav-item${view === item.id ? ' active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              aria-label={item.label}
              aria-current={view === item.id ? 'page' : undefined}
              suppressHydrationWarning
            >
              {item.icon}
              <span className="bnav-label">
                {item.id === 'home' ? 'Today' : item.label}
              </span>
            </button>
          ))}
        </nav>

      </div>
    </>
  );
}
