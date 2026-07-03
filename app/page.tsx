'use client';

/**
 * Primary marketing landing: invite request, countdown, and interactive demo.
 * Route: /
 */

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { RequestInviteModal } from '@/components/request-invite/RequestInviteModal';
import { MemberLoginModal } from '@/components/member-login/MemberLoginModal';

/* ─── Demo animation constants (unchanged from original) ─── */
const TRADEOFFS_FINAL_STEP = 6;
const COMMITTED_CONFIRM_MS = 3000;
const AGENT_SIM_AFTER_SLIDE_MS = 400;
const AGENT_ASSEMBLING_MS = 6500;
/** Extra time in Executing with all lines “working” before the first strike completes. */
const AGENT_EXECUTING_LEAD_MS = 1000;
const AGENT_STRIKE_GAP_MS = 2400;
const AGENT_READY_AFTER_LAST_STRIKE_MS = 500;
/** Extra hold after last strike so executing lines finish before Ready phase. */
const AGENT_READY_AFTER_EXECUTION_MS = 2000;
/** Gap between each dot “step” on the user-action progress track. */
const USER_ACTION_DOT_GAP_MS = 720;
/** Footer appears this long after all user-action dots are complete. */
const COMMITTED_FOOTER_AFTER_USER_ACTION_MS = 1000;
/** Delay after confetti before Framed→Close line sweep (must match UX). */
const CLOSE_CONFETTI_TO_LINE_MS = 320;
/** Last narrative beat (“That signature…”) waits this long after confetti has finished. */
const LAST_BEAT_AFTER_CONFETTI_MS = 1000;
/** ~duration of canvas-confetti with `ticks: 140` at ~60fps (see handleCloseConfirmClick). */
const CONFETTI_ANIMATION_MS = Math.round((140 / 60) * 1000);
/** Must match `.animate-user-move-framed-close-sweep` duration in globals.css */
const USER_MOVE_LINE_SWEEP_MS = 650;
/** Momentum nodes before completion (grey ring / label). */
const USER_MOVE_TRACK_GREY = '#AEAEB2';
const USER_MOVE_TRACK_GREY_LABEL = '#9C9C9C';
/** Track dot size (px); inner check scaled to match. */
const USER_MOVE_DOT_SIZE_PX = 8;
const USER_MOVE_CHECK_SVG_PX = 5;

const USER_ACTION_SECTION_LABEL = 'Your Next Move';
const USER_ACTION_ANCHOR = 'Your pricing floor changes today. Update pricing now!';
const USER_ACTION_BEATS = [
  'Push $25K minimum live on your pricing page.',
  'Brief the team. Flag sub-$25K pipeline deals—grandfather existing, qualify new at the floor.',
] as const;
/** Momentum stages (not 1:1 with narrative beats). Third stays open on the track. */
const USER_ACTION_DOT_LABELS = ['Aligned', 'Framed', 'Close'] as const;

const COMMITTED_CARD =
  'rounded-[10px] border border-gray-200 bg-white px-3 py-3 shadow-[0_1px_4px_1px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out';

/** Top offset so Confirmed card peeks above the Agent sheet (matches prior 48px behavior). */
const COMMITTED_CARD_PEEK_PX = 48;
/** Your Move sheet starts lower so Agent header + status strip stay visible (stacked like Agent over Confirmed). */
const USER_ACTION_SHEET_TOP_PX = COMMITTED_CARD_PEEK_PX + 88;
/**
 * Approximate in-flow height of the Confirmed card block (used to size the spacer under overlays).
 * Spacer + Confirmed height ~= USER_ACTION_SHEET_TOP_PX + USER_MOVE_CARD_BODY_RESERVE_PX so the footer sits under Your Move.
 */
const COMMITTED_CONFIRMED_CARD_FLOW_ROUGH_PX = 200;
/** Approximate Your Move body height from its top offset to bottom (beats + momentum track). */
const USER_MOVE_CARD_BODY_RESERVE_PX = 285;
/** Momentum track line top (px); line height 2px; dot box — centers dot on line. */
const USER_MOVE_TRACK_LINE_TOP_PX = 10;
const USER_MOVE_TRACK_LINE_HEIGHT_PX = 2;
const USER_MOVE_DOT_MARKER_PX = USER_MOVE_DOT_SIZE_PX;
const USER_MOVE_DOT_COLUMN_TOP_PX =
  USER_MOVE_TRACK_LINE_TOP_PX + USER_MOVE_TRACK_LINE_HEIGHT_PX / 2 - USER_MOVE_DOT_MARKER_PX / 2;
/** Floating confirm Close (Your Next Move): smaller than prior 34px; track pad so “Close” sits left of the button. */
const USER_MOVE_CLOSE_CONFIRM_BTN_PX = 28;
const USER_MOVE_CLOSE_CONFIRM_CHECK_SVG_PX = 14;
const USER_MOVE_CLOSE_CONFIRM_TRACK_PAD_RIGHT_PX = 38;
/** Extra in-flow height so the Your Move card content clears the footer link (absolute card can extend past rough reserve). */
const COMMITTED_YOUR_MOVE_CLEARANCE_ABOVE_FOOTER_PX = 16;
/** In-flow spacer height below Confirmed so absolute Your Move + footer do not leave a dead band. */
const COMMITTED_AGENT_STACK_SPACER_PX =
  USER_ACTION_SHEET_TOP_PX +
  USER_MOVE_CARD_BODY_RESERVE_PX -
  COMMITTED_CONFIRMED_CARD_FLOW_ROUGH_PX +
  COMMITTED_YOUR_MOVE_CLEARANCE_ABOVE_FOOTER_PX;
/** Space between in-flow spacer and committed footer (adds visible gap before “See the Impact”). */
const COMMITTED_FOOTER_AFTER_CARD_GAP_PX = 12;

type DemoPhase = 'idle' | 'committed' | 'impact';
type CommittedViewPhase = 'confirmed_only' | 'agent_overlay';
type AgentDemoPhase = 'assembling' | 'executing' | 'ready';
/** Close button: confetti → line sweep → green dot (index 3). */
type CloseSequence = 'idle' | 'confetti' | 'line' | 'complete';
/** Third track segment: hidden until line phase; sweeping then solid (no re-sweep). */
type MomentumThirdSegment = 'hidden' | 'sweeping' | 'solid';

const AGENT_LIST_LINES = [
  "Audit current pricing: lowest deal, average, margins by tier.",
  'Draft new floor messaging: positioning, objection handles, grandfathering.',
  "Update CRM + notify sales: new minimums, effective date, exceptions.",
] as const;

const AGENT_READY_LINES = [
  "Audited current pricing: lowest deal, average, margins by tier.",
  'Drafted new floor messaging: positioning, objection handles, grandfathering.',
  "Updated CRM + notified sales: new minimums, effective date, exceptions.",
] as const;

const AGENT_ASSEMBLE_STAGGER_MS = 1000;
const AGENT_READY_STAGGER_MS = 1000;
/** Must match `agent-line-reveal` duration in globals.css */
const AGENT_LINE_REVEAL_MS = 650;
/** When the last Ready line finishes its staggered reveal. */
const READY_LIST_REVEAL_COMPLETE_MS =
  (AGENT_READY_LINES.length - 1) * AGENT_READY_STAGGER_MS + AGENT_LINE_REVEAL_MS;
/** After Ready list is fully visible, hold 1s then slide Your Next Move in. */
const USER_ACTION_AFTER_READY_MS = READY_LIST_REVEAL_COMPLETE_MS + 1000;
const IMPACT_STAGGER_INITIAL_MS = 400;
const IMPACT_STAGGER_STEP_MS = 500;
/** After scrollIntoView; stagger runs only after this (see impact useEffect). */
const IMPACT_PLAYBACK_DELAY_MS = 900;
const IMPACT_PLAYBACK_DELAY_REDUCED_MS = 250;
const IMPACT_REVENUE_START_K = 1;
const IMPACT_REVENUE_END_K = 18;
const IMPACT_REVENUE_COUNT_MS = 650;

/* ─── Hero headline words ─── */
const HEADLINE_WORDS = ['One', 'Move.', 'More'];

/** Primary accent (demo metrics, icons) — slightly darker than prior #1548FF */
const ACCENT_BLUE = '#0E3AD6';
/** Assembling status label (dark blue; not primary accent). */
const ASSEMBLING_STATUS_DARK_BLUE = '#1e3a8a';
/** Executing phase status label (dark purple). */
const EXECUTING_STATUS_DARK_PURPLE = '#4c1d95';
/** Momentum track / dots (black; not ACCENT_BLUE). */
const USER_MOVE_MOMENTUM_BLACK = '#0A0A0A';
/** Closing beat line in the grey box (success / upside). */
const USER_MOVE_LAST_BEAT_GREEN = '#048d10';
/** Completed momentum steps (Aligned / Framed) — same green family as last beat. */
const USER_MOVE_MOMENTUM_COMPLETE_GREEN = USER_MOVE_LAST_BEAT_GREEN;

/** Rotating hero typewriter — single accent (teal; not demo ACCENT_BLUE) */
const TYPEWRITER_COLOR = '#1d9db2';

const ROTATING_WORDS = [
  'Clarity.',
  'Certainty.',
  'Momentum.',
  'Reassurance.',
  'Peace Of Mind.',
  'Freedom.',
  'Confidence.',
  'Precision.',
  'Dominance.',
  'Authority.',
  'Execution.',
  'Velocity.',
  'Leverage.',
  'Scale.',
] as const;

const TYPEWRITER_CHAR_MS = 55;
const TYPEWRITER_DELETE_MS = 35;
const TYPEWRITER_PAUSE_MS = 1500;
const TYPEWRITER_WORD_GAP_MS = 200;
/** After headline word-reveal + problem fade-in (1.0s delay + 0.7s) + buffer */
const TYPEWRITER_START_DELAY_MS = 1800;

/* ─── Pillar data ─── */
const PILLARS = [
  {
    num: '01',
    title: 'Certainty',
    sub: 'removes the fog',
    body: "Every morning you open Konquer, the fog is gone. You don't decide what to do — you already know. That is not confidence. That is certainty, and it is a different category entirely.",
  },
  {
    num: '02',
    title: 'Confidence',
    sub: 'converts certainty into motion',
    body: 'Knowing the move is only half the equation. Konquer builds the evidence trail behind every recommendation so you execute without second-guessing. The system has already done the work.',
  },
  {
    num: '03',
    title: 'Identity',
    sub: 'what accumulates',
    body: "Every completed move is a data point in a longer story. Over time, the pattern becomes clear: you are the person who knows the move and makes it. That identity compounds.",
  },
];

/** White chess pieces (Unicode): rook, knight, king — one per pillar */
const PILLAR_CHESS_SYMBOLS = ['\u2656', '\u2658', '\u2654'] as const;

/* ─── Difference statements ─── */
const DIFF_ITEMS = [
  { label: 'Not this', text: 'Another dashboard full of charts.' },
  { label: 'Not this', text: 'A chatbot that gives you options.' },
  { label: 'Not this', text: 'An analytics tool that tells you what happened.' },
  { label: 'This', text: 'One move. Auditable certainty. Every day.' },
];

/** Early-access countdown: first cycle ends here; epoch = END − D (30-day cycles). */
const ACCESS_COUNTDOWN_END_MS = Date.parse('2026-05-29T12:00:00-05:00');

/** Length of each repeating countdown cycle; first cycle still ends at `ACCESS_COUNTDOWN_END_MS`. */
const ACCESS_COUNTDOWN_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

const ACCESS_COUNTDOWN_EPOCH_MS = ACCESS_COUNTDOWN_END_MS - ACCESS_COUNTDOWN_DURATION_MS;

/** Cost of Delay Impact label red (used in the tradeoffs modal). */
const DELAY_IMPACT_RED = '#E57373';

/** Strong red for Cost of Delay Impact (not the salmon tint used elsewhere). */
const COST_OF_DELAY_RED = '#C62828';

/** Fast tick for milliseconds display; 1s when reduced motion. */
const ACCESS_COUNTDOWN_TICK_MS = 10;

function getAccessCountdownParts(ms: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  millis: number;
} {
  const clamped = Math.max(0, ms);
  const totalSec = Math.floor(clamped / 1000);
  const days = Math.floor(totalSec / 86400);
  const secAfterDay = totalSec % 86400;
  return {
    days,
    hours: Math.floor(secAfterDay / 3600),
    minutes: Math.floor((secAfterDay % 3600) / 60),
    seconds: secAfterDay % 60,
    millis: Math.floor(clamped % 1000),
  };
}

function formatAccessCountdown(ms: number): string {
  const { days, hours, minutes, seconds, millis } = getAccessCountdownParts(ms);
  const dd = String(days).padStart(2, '0');
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const mmm = String(millis).padStart(3, '0');
  return `${dd}d ${hh}h ${mm}m ${ss}s ${mmm}ms`;
}

function getAccessCycleRemainingMs(now: number): number {
  const d = ACCESS_COUNTDOWN_DURATION_MS;
  const elapsed = now - ACCESS_COUNTDOWN_EPOCH_MS;
  const cycleEnd = ACCESS_COUNTDOWN_EPOCH_MS + (Math.floor(elapsed / d) + 1) * d;
  return Math.max(0, cycleEnd - now);
}

export default function LandingPageSandbox() {
  /* ─── Nav scroll ─── */
  const [isScrolled, setIsScrolled] = useState(false);

  /* ─── Demo state (all reused from original) ─── */
  const [showTradeoffsModal, setShowTradeoffsModal] = useState(false);
  const [showRequestInviteModal, setShowRequestInviteModal] = useState(false);
  const [showMemberLoginModal, setShowMemberLoginModal] = useState(false);
  const [demoState, setDemoState] = useState<DemoPhase>('idle');
  const [committedViewPhase, setCommittedViewPhase] = useState<CommittedViewPhase>('confirmed_only');
  const [agentSheetEntered, setAgentSheetEntered] = useState(false);
  const [impactAnimStep, setImpactAnimStep] = useState(0);
  const [impactRevenueK, setImpactRevenueK] = useState(IMPACT_REVENUE_START_K);
  const [tradeoffsAnimStep, setTradeoffsAnimStep] = useState(0);
  const [agentDemoPhase, setAgentDemoPhase] = useState<AgentDemoPhase>('assembling');
  const [agentStrikeCount, setAgentStrikeCount] = useState(0);
  const [committedFooterVisible, setCommittedFooterVisible] = useState(false);
  const [userActionSheetEntered, setUserActionSheetEntered] = useState(false);
  /** 0 = none; 1–2 = auto; 3 = Close completed only after line sweep + confirm sequence. */
  const [userActionDotIndex, setUserActionDotIndex] = useState(0);
  const [closeSequence, setCloseSequence] = useState<CloseSequence>('idle');
  const [momentumThirdSegment, setMomentumThirdSegment] = useState<MomentumThirdSegment>('hidden');
  const closeConfettiToLineTimerRef = useRef<number | null>(null);
  const signatureBeatTimerRef = useRef<number | null>(null);
  /** Third beat: reveal only after confetti (+ delay); not tied to dot index alone. */
  const [signatureBeatVisible, setSignatureBeatVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  /** null until after mount so SSR/prerender HTML matches client (no Date.now() mismatch). */
  const [accessRemainingMs, setAccessRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      setAccessRemainingMs(getAccessCycleRemainingMs(Date.now()));
    };
    tick();
    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const intervalMs = reduced ? 1000 : ACCESS_COUNTDOWN_TICK_MS;
    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, []);

  /* ─── Hero rotating typewriter (certainty / clarity / …) — starts after headline + fog paragraph ─── */
  const [twWordIndex, setTwWordIndex] = useState(0);
  const [twDisplayText, setTwDisplayText] = useState('');
  const [twPhase, setTwPhase] = useState<'typing' | 'deleting'>('typing');
  const [heroTypewriterReady, setHeroTypewriterReady] = useState(false);
  const twPauseScheduled = useRef(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      twPauseScheduled.current = false;
      setTwWordIndex(0);
      setTwDisplayText('');
      setTwPhase('typing');
      setHeroTypewriterReady(true);
    }, TYPEWRITER_START_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!heroTypewriterReady) return;

    const full = ROTATING_WORDS[twWordIndex % ROTATING_WORDS.length];
    if (twPhase === 'typing') {
      if (twDisplayText.length < full.length) {
        twPauseScheduled.current = false;
        const t = window.setTimeout(
          () => setTwDisplayText(full.slice(0, twDisplayText.length + 1)),
          TYPEWRITER_CHAR_MS
        );
        return () => window.clearTimeout(t);
      }
      if (twDisplayText === full && !twPauseScheduled.current) {
        twPauseScheduled.current = true;
        const t = window.setTimeout(() => setTwPhase('deleting'), TYPEWRITER_PAUSE_MS);
        return () => window.clearTimeout(t);
      }
    }
    if (twPhase === 'deleting') {
      if (twDisplayText.length > 0) {
        const t = window.setTimeout(
          () => setTwDisplayText((s) => s.slice(0, -1)),
          TYPEWRITER_DELETE_MS
        );
        return () => window.clearTimeout(t);
      }
      twPauseScheduled.current = false;
      const t = window.setTimeout(() => {
        setTwWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
        setTwPhase('typing');
      }, TYPEWRITER_WORD_GAP_MS);
      return () => window.clearTimeout(t);
    }
  }, [twDisplayText, twPhase, twWordIndex, heroTypewriterReady]);

  /* ─── Fade-up refs for scroll sections ─── */
  const fogRef = useRef<HTMLElement>(null);
  const pillarsRef = useRef<HTMLElement>(null);
  const diffRef = useRef<HTMLElement>(null);
  const demoCardRef = useRef<HTMLDivElement>(null);
  const [demoChromeReveal, setDemoChromeReveal] = useState(false);

  /* ─── Section fade-up: only after user has scrolled (not on first paint) ─── */
  const scrollUnlockRecorded = useRef(false);

  /* ─── Nav scroll + one-time fade-up IntersectionObserver (stable [] deps; no state-driven effect) ─── */
  useEffect(() => {
    let fadeObserver: IntersectionObserver | null = null;

    const setupFadeObserver = () => {
      if (fadeObserver) return;
      const refs = [fogRef, pillarsRef, diffRef];
      fadeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            if (entry.intersectionRatio < 0.22) return;

            const stagger =
              entry.target === diffRef.current
                ? 0.1
                : pillarsRef.current && entry.target === pillarsRef.current
                  ? 0.15
                  : 0.12;
            entry.target.querySelectorAll<HTMLElement>('.fu').forEach((el, i) => {
              el.style.animationDelay = `${i * stagger}s`;
              el.classList.add('animate-fade-up');
            });
            fadeObserver!.unobserve(entry.target);
          });
        },
        {
          threshold: [0, 0.1, 0.22, 0.35, 0.5],
          rootMargin: '0px 0px -14% 0px',
        }
      );
      refs.forEach((r) => {
        if (r.current) fadeObserver!.observe(r.current);
      });
    };

    const markUnlock = () => {
      if (scrollUnlockRecorded.current) return;
      scrollUnlockRecorded.current = true;
      setupFadeObserver();
    };

    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
      markUnlock();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Restored session / hash jump: scroll position may be set before first scroll event
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (window.scrollY > 24) markUnlock();
      });
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      fadeObserver?.disconnect();
    };
  }, []);

  /* ─── Demo card browser chrome — reveal once when in view ─── */
  useEffect(() => {
    const el = demoCardRef.current;
    if (!el) return;

    const reveal = () => setDemoChromeReveal(true);

    // If any part of the card already overlaps the viewport (e.g. restored scroll),
    // don't wait on IntersectionObserver — threshold 0.2 was too strict for a tall card
    // (often only the top/chrome was visible, so ratio stayed below 0.2 and chrome stayed opacity:0).
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.height > 0 && rect.top < vh && rect.bottom > 0) {
      reveal();
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          obs.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: '0px 0px 48px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  /* ─── Demo effects (all reused verbatim) ─── */
  const resetDemo = () => {
    setDemoState('idle');
    setShowTradeoffsModal(false);
    setShowRequestInviteModal(false);
    setCommittedViewPhase('confirmed_only');
    setAgentSheetEntered(false);
    setAgentDemoPhase('assembling');
    setAgentStrikeCount(0);
    setCommittedFooterVisible(false);
    setUserActionSheetEntered(false);
    setUserActionDotIndex(0);
    setCloseSequence('idle');
    setMomentumThirdSegment('hidden');
    setSignatureBeatVisible(false);
    if (closeConfettiToLineTimerRef.current) {
      clearTimeout(closeConfettiToLineTimerRef.current);
      closeConfettiToLineTimerRef.current = null;
    }
    if (signatureBeatTimerRef.current) {
      clearTimeout(signatureBeatTimerRef.current);
      signatureBeatTimerRef.current = null;
    }
  };

  const openImpact = () => setDemoState('impact');
  const closeImpact = () => resetDemo();

  const userActionSheetVisible =
    userActionSheetEntered ||
    (prefersReducedMotion &&
      demoState === 'committed' &&
      committedViewPhase === 'agent_overlay' &&
      agentDemoPhase === 'ready');

  useEffect(() => {
    if (demoState !== 'committed') { setCommittedViewPhase('confirmed_only'); setAgentSheetEntered(false); return; }
    setCommittedViewPhase('confirmed_only');
    const t = setTimeout(() => setCommittedViewPhase('agent_overlay'), COMMITTED_CONFIRM_MS);
    return () => clearTimeout(t);
  }, [demoState]);

  useEffect(() => {
    if (committedViewPhase !== 'agent_overlay') { setAgentSheetEntered(false); return; }
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setAgentSheetEntered(true); return; }
    setAgentSheetEntered(false);
    const id = requestAnimationFrame(() => { requestAnimationFrame(() => setAgentSheetEntered(true)); });
    return () => cancelAnimationFrame(id);
  }, [committedViewPhase]);

  useEffect(() => {
    if (demoState !== 'impact') {
      setImpactAnimStep(0);
      return;
    }
    setImpactAnimStep(0);
    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const playbackDelay = reduced ? IMPACT_PLAYBACK_DELAY_REDUCED_MS : IMPACT_PLAYBACK_DELAY_MS;
    const scrollBehavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
    requestAnimationFrame(() => {
      demoCardRef.current?.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
    });
    const timers = [1, 2, 3, 4, 5].map((step, i) =>
      setTimeout(
        () => setImpactAnimStep(step),
        playbackDelay + IMPACT_STAGGER_INITIAL_MS + i * IMPACT_STAGGER_STEP_MS
      )
    );
    return () => timers.forEach(clearTimeout);
  }, [demoState]);

  useEffect(() => {
    if (demoState !== 'impact') { setImpactRevenueK(IMPACT_REVENUE_START_K); return; }
    if (impactAnimStep < 2) { setImpactRevenueK(IMPACT_REVENUE_START_K); return; }
    if (impactAnimStep > 2) { setImpactRevenueK(IMPACT_REVENUE_END_K); return; }
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setImpactRevenueK(IMPACT_REVENUE_END_K); return; }
    setImpactRevenueK(IMPACT_REVENUE_START_K);
    const steps = IMPACT_REVENUE_END_K - IMPACT_REVENUE_START_K;
    const harmonic = Array.from({ length: steps }, (_, i) => 1 / (i + 1)).reduce((a, b) => a + b, 0);
    let acc = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= steps; i++) {
      acc += (IMPACT_REVENUE_COUNT_MS / harmonic) * (1 / i);
      const nextK = IMPACT_REVENUE_START_K + i;
      timers.push(setTimeout(() => setImpactRevenueK(nextK), acc));
    }
    return () => timers.forEach(clearTimeout);
  }, [demoState, impactAnimStep]);

  useEffect(() => {
    if (demoState !== 'committed' || committedViewPhase !== 'agent_overlay') {
      setAgentDemoPhase('assembling'); setAgentStrikeCount(0); return;
    }
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setAgentDemoPhase('ready'); setAgentStrikeCount(3); return; }
    setAgentDemoPhase('assembling'); setAgentStrikeCount(0);
    const base = AGENT_SIM_AFTER_SLIDE_MS;
    const execStart = base + AGENT_ASSEMBLING_MS;
    const strikeBase = execStart + AGENT_EXECUTING_LEAD_MS;
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setAgentDemoPhase('executing'), execStart),
      setTimeout(() => setAgentStrikeCount(1), strikeBase + AGENT_STRIKE_GAP_MS),
      setTimeout(() => setAgentStrikeCount(2), strikeBase + AGENT_STRIKE_GAP_MS * 2),
      setTimeout(() => setAgentStrikeCount(3), strikeBase + AGENT_STRIKE_GAP_MS * 3),
      setTimeout(
        () => setAgentDemoPhase('ready'),
        strikeBase +
          AGENT_STRIKE_GAP_MS * 3 +
          AGENT_READY_AFTER_LAST_STRIKE_MS +
          AGENT_READY_AFTER_EXECUTION_MS
      ),
    ];
    return () => timers.forEach(clearTimeout);
  }, [demoState, committedViewPhase]);

  /* User-action sheet: after agent ready, slide in; dots advance after sheet is in. */
  useEffect(() => {
    if (demoState !== 'committed' || committedViewPhase !== 'agent_overlay' || agentDemoPhase !== 'ready') {
      setUserActionSheetEntered(false);
      setUserActionDotIndex(0);
      setCloseSequence('idle');
      setMomentumThirdSegment('hidden');
      setSignatureBeatVisible(false);
      if (closeConfettiToLineTimerRef.current) {
        clearTimeout(closeConfettiToLineTimerRef.current);
        closeConfettiToLineTimerRef.current = null;
      }
      if (signatureBeatTimerRef.current) {
        clearTimeout(signatureBeatTimerRef.current);
        signatureBeatTimerRef.current = null;
      }
      return;
    }
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setUserActionSheetEntered(true);
      setUserActionDotIndex(0);
      return;
    }
    setUserActionSheetEntered(false);
    setUserActionDotIndex(0);
    const t = setTimeout(() => setUserActionSheetEntered(true), USER_ACTION_AFTER_READY_MS);
    return () => clearTimeout(t);
  }, [demoState, committedViewPhase, agentDemoPhase]);

  useEffect(() => {
    if (!userActionSheetEntered) return;
    setCloseSequence('idle');
    setMomentumThirdSegment('hidden');
    setSignatureBeatVisible(false);
    if (signatureBeatTimerRef.current) {
      clearTimeout(signatureBeatTimerRef.current);
      signatureBeatTimerRef.current = null;
    }
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setUserActionDotIndex(2);
      return;
    }
    setUserActionDotIndex(0);
    const timers = [
      setTimeout(() => setUserActionDotIndex(1), USER_ACTION_DOT_GAP_MS),
      setTimeout(() => setUserActionDotIndex(2), USER_ACTION_DOT_GAP_MS * 2),
    ];
    return () => timers.forEach(clearTimeout);
  }, [userActionSheetEntered]);

  /** After Framed→Close sweep animation, flip index 3 + solid segment (no re-sweep). */
  useEffect(() => {
    if (momentumThirdSegment !== 'sweeping') return;
    if (prefersReducedMotion) return;
    const t = window.setTimeout(() => {
      setMomentumThirdSegment('solid');
      setUserActionDotIndex(3);
      setCloseSequence('complete');
    }, USER_MOVE_LINE_SWEEP_MS);
    return () => window.clearTimeout(t);
  }, [momentumThirdSegment, prefersReducedMotion]);

  /* Footer after user-action sequence completes (dots), not only agent ready. */
  useEffect(() => {
    if (demoState !== 'committed') { setCommittedFooterVisible(false); return; }
    if (agentDemoPhase !== 'ready') { setCommittedFooterVisible(false); return; }
    if (userActionDotIndex !== 3) { setCommittedFooterVisible(false); return; }
    const t = setTimeout(() => setCommittedFooterVisible(true), COMMITTED_FOOTER_AFTER_USER_ACTION_MS);
    return () => clearTimeout(t);
  }, [demoState, agentDemoPhase, userActionDotIndex]);

  useEffect(() => {
    if (!showTradeoffsModal) { setTradeoffsAnimStep(0); return; }
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setTradeoffsAnimStep(TRADEOFFS_FINAL_STEP); return; }
    setTradeoffsAnimStep(0);
    const timers = [
      setTimeout(() => setTradeoffsAnimStep(1), 40),
      setTimeout(() => setTradeoffsAnimStep(2), 240),
      setTimeout(() => setTradeoffsAnimStep(3), 520),
      setTimeout(() => setTradeoffsAnimStep(4), 780),
      setTimeout(() => setTradeoffsAnimStep(5), 1040),
      setTimeout(() => setTradeoffsAnimStep(6), 1300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [showTradeoffsModal]);

  useEffect(() => {
    if (!showTradeoffsModal || typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => { if (mq.matches) setTradeoffsAnimStep(TRADEOFFS_FINAL_STEP); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [showTradeoffsModal]);

  const handleCloseConfirmClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (closeSequence !== 'idle' || userActionDotIndex !== 2) return;
    if (signatureBeatTimerRef.current) {
      clearTimeout(signatureBeatTimerRef.current);
      signatureBeatTimerRef.current = null;
    }
    if (prefersReducedMotion) {
      setMomentumThirdSegment('solid');
      setUserActionDotIndex(3);
      setCloseSequence('complete');
      signatureBeatTimerRef.current = window.setTimeout(() => {
        signatureBeatTimerRef.current = null;
        setSignatureBeatVisible(true);
      }, LAST_BEAT_AFTER_CONFETTI_MS);
      return;
    }
    setCloseSequence('confetti');
    void import('canvas-confetti').then(({ default: confetti }) => {
      confetti({
        particleCount: 110,
        spread: 68,
        origin: {
          x: e.clientX / (typeof window !== 'undefined' ? window.innerWidth : 1),
          y: e.clientY / (typeof window !== 'undefined' ? window.innerHeight : 1),
        },
        startVelocity: 26,
        ticks: 140,
        gravity: 1,
        scalar: 0.95,
      });
    });
    signatureBeatTimerRef.current = window.setTimeout(() => {
      signatureBeatTimerRef.current = null;
      setSignatureBeatVisible(true);
    }, CONFETTI_ANIMATION_MS + LAST_BEAT_AFTER_CONFETTI_MS);
    if (closeConfettiToLineTimerRef.current) clearTimeout(closeConfettiToLineTimerRef.current);
    closeConfettiToLineTimerRef.current = window.setTimeout(() => {
      closeConfettiToLineTimerRef.current = null;
      setCloseSequence('line');
      setMomentumThirdSegment('sweeping');
    }, CLOSE_CONFETTI_TO_LINE_MS);
  };

  const accessCountdownParts = getAccessCountdownParts(accessRemainingMs ?? 0);
  const accessCountdownDisplay = formatAccessCountdown(accessRemainingMs ?? 0);

  return (
    <div
      className="min-h-screen bg-white text-black overflow-x-hidden"
      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
    >

      {/* ═══════════════════════════════════════════
          NAV
      ═══════════════════════════════════════════ */}
      <nav
        style={{
          position: 'fixed',
          inset: '0 0 auto',
          zIndex: 100,
          background: '#fff',
          borderBottom: isScrolled ? '1px solid #E4E4E4' : '1px solid transparent',
          transition: 'border-color .25s ease',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="site-gutter nav-inner"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* Logo */}
          <span style={{ fontWeight: 700, fontSize: '22px', letterSpacing: '-0.02em', color: '#0A0A0A' }}>
            Konquer
          </span>

          {/* Spacer (middle column of 1fr auto 1fr grid) */}
          <span aria-hidden />

          {/* Member Login */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowMemberLoginModal(true)}
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#5C5C5C',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                transition: 'color .2s ease',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0A0A0A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#5C5C5C'; }}
            >
              Member Login
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section
        className="site-gutter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: 'clamp(120px, 14vh, 168px)',
          paddingBottom: 'clamp(32px, 5vh, 48px)',
          maxWidth: '880px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Eyebrow */}
        <p
          className="animate-fade-in"
          style={{
            animationDelay: '0.2s',
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: '#414a9b',
            marginBottom: '28px',
          }}
        >
          Precision Intelligence™
        </p>

        {/* Animated headline */}
        <h1
          style={{
            fontSize: 'clamp(48px, 7vw, 88px)',
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            color: '#0A0A0A',
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.25em',
          }}
        >
          {HEADLINE_WORDS.map((word, i) => (
            <span
              key={word}
              className="animate-word-reveal"
              style={{ animationDelay: `${0.5 + i * 0.1}s`, display: 'inline-block' }}
            >
              {word}
            </span>
          ))}
          <span aria-live="polite" className="sr-only">
            {heroTypewriterReady ? twDisplayText : ''}
          </span>
          <span
            aria-hidden
            style={{
              flexBasis: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              color: TYPEWRITER_COLOR,
              fontStyle: 'italic',
              fontWeight: 700,
              minHeight: '1em',
              visibility: heroTypewriterReady ? 'visible' : 'hidden',
            }}
          >
            {twDisplayText}
            <span
              className="animate-tw-blink"
              style={{
                opacity: 0.85,
                fontWeight: 400,
                color: TYPEWRITER_COLOR,
                marginLeft: '0.02em',
              }}
            >
              |
            </span>
          </span>
        </h1>

        {/* Problem paragraph */}
        <p
          className="animate-fade-in"
          style={{
            animationDelay: '1.0s',
            fontSize: 'clamp(17px, 2vw, 20px)',
            fontWeight: 300,
            lineHeight: 1.75,
            color: '#5C5C5C',
            maxWidth: '640px',
            marginBottom: '28px',
            textWrap: 'pretty',
          }}
        >
          You don&rsquo;t lack drive. You don&rsquo;t lack intelligence. But you are
          surrounded by noise. Every morning, you face a hundred competing priorities,
          and the &lsquo;right&rsquo; move is buried in the fog. We provide the
          leverage to find it.
        </p>

        {/* Gate statement — no box, hairlines above/below */}
        <div
          className="animate-fade-in"
          style={{
            animationDelay: '1.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 'min(100%, 720px)',
            width: '100%',
            marginBottom: '32px',
          }}
        >
          <span
            aria-hidden
            style={{
              display: 'block',
              width: '72px',
              height: '1px',
              background: '#E4E4E4',
              marginBottom: '20px',
            }}
          />
          <p
            style={{
              fontSize: 'clamp(14px, 1.6vw, 16px)',
              fontWeight: 500,
              color: '#3C3C43',
              lineHeight: 1.6,
              margin: 0,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            Konquer is invitation-only and built for founders already generating $500K+ annually.
          </p>
          <span
            aria-hidden
            style={{
              display: 'block',
              width: '72px',
              height: '1px',
              background: '#E4E4E4',
              marginTop: '20px',
            }}
          />
        </div>

        {/* CTA block */}
        <div
          className="animate-fade-in"
          style={{
            animationDelay: '1.4s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}
        >
          <button
            type="button"
            onClick={() => setShowRequestInviteModal(true)}
            className="btn-gel-invite btn-gel-invite-animated request-invite-impact-ring"
            style={{
              color: '#ffffff',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '-0.005em',
            }}
          >
            <span
              className="request-invite-impact-ring-inner"
              style={{ padding: '18px 44px' }}
            >
              Request Invite
            </span>
          </button>

          <Link
            href="/redeem"
            style={{
              fontSize: '13px',
              fontWeight: 400,
              color: '#5C5C5C',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              marginTop: '6px',
            }}
          >
            <span className="animate-demo-tagline-gradient" style={{ fontWeight: 400 }}>
              Have an invite code?
            </span>
          </Link>

          <span
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#9C9C9C',
              marginTop: '12px',
            }}
          >
            Starting at $1,000/mo.
          </span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          INTERACTIVE DEMO
      ═══════════════════════════════════════════ */}
      <section
        id="demo"
        style={{
          paddingTop: '88px',
          paddingBottom: '96px',
          background: '#F5F5F7',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="site-gutter" style={{ maxWidth: 'min(100%, 1200px)', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          {/* Editorial header — deference to the product card below */}
          <div
            style={{
              marginBottom: '56px',
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: '820px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#86868B',
                marginBottom: '16px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              }}
            >
              The Prescription
            </p>
            <h2
              style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#1D1D1F',
                marginTop: 0,
                marginBottom: '16px',
                marginLeft: 'auto',
                marginRight: 'auto',
                textAlign: 'center',
                textWrap: 'balance',
                maxWidth: '780px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              }}
            >
              Every morning you open Konquer, the fog is gone.
            </h2>
            <p
              style={{
                fontSize: '19px',
                fontWeight: 400,
                color: '#6E6E73',
                lineHeight: 1.4,
                marginBottom: 0,
                maxWidth: '640px',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              }}
            >
              One move. Auditable certainty. Every day.
            </p>
          </div>

          {/* Product-style card: depth, system chrome, monochrome typography (Apple-like) */}
          <div className="flex justify-center">
            <div
              id="todays-strategic-move"
              ref={demoCardRef}
              className="animate-strategic-product-card"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '28px',
                boxShadow:
                  '0 32px 80px rgba(0,0,0,0.12), 0 12px 32px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.06)',
                width: '100%',
                maxWidth: '720px',
                overflow: 'hidden',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                scrollMarginTop: '80px',
              }}
            >
              <div
                className={`demo-browser-chrome ${demoChromeReveal ? 'animate-demo-chrome-rise' : 'demo-chrome-rise-idle'}`}
                style={{
                  background: 'linear-gradient(180deg, #F6F6F7 0%, #EBEBED 100%)',
                  borderBottom: '1px solid rgba(0,0,0,0.08)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', minWidth: '68px', flexShrink: 0 }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#FF5F57',
                      boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.15)',
                    }}
                  />
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#FEBC2E',
                      boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)',
                    }}
                  />
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#28C840',
                      boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)',
                    }}
                  />
                </div>
                <div style={{ flex: 1, textAlign: 'center', minWidth: 0, padding: '0 6px' }}>
                  <span className="demo-chrome-title">See Konquer In Action - Click To Demo!</span>
                </div>
                <div className="demo-chrome-spacer" style={{ width: '68px', flexShrink: 0 }} />
              </div>

              <div
                style={{
                  padding: 'clamp(24px, 5vw, 48px) clamp(20px, 4vw, 44px) clamp(28px, 5vw, 40px)',
                }}
              >
                {demoState !== 'impact' && (
                  <div className="animate-fade-up">
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px 12px',
                        marginBottom: '16px',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: '#86868B',
                          margin: 0,
                        }}
                      >
                        Today&apos;s Strategic Move
                      </p>
                      {demoState === 'committed' && (
                        <button
                          type="button"
                          onClick={resetDemo}
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#9C9C9C',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            flexShrink: 0,
                            fontFamily: 'inherit',
                          }}
                        >
                          Back
                        </button>
                      )}
                    </div>
                    <h3
                      style={{
                        fontWeight: 600,
                        fontSize: 'calc(clamp(28px, 5vw, 46px) - 8px)',
                        color: '#1D1D1F',
                        margin: 0,
                        lineHeight: 1.05,
                        letterSpacing: '-0.045em',
                      }}
                    >
                      Raise your price floor to $25K today so next quarter&apos;s pipeline is built on real{'\u00A0'}margin.
                    </h3>
                    <div
                      aria-hidden
                      style={{
                        height: '1px',
                        background: 'rgba(0,0,0,0.08)',
                        margin: '36px 0 32px',
                      }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: '19px',
                          fontWeight: 600,
                          color: '#1D1D1F',
                          marginBottom: '12px',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        Why this move first
                      </p>
                      <p style={{ fontSize: '17px', fontWeight: 400, color: '#6E6E73', lineHeight: 1.47, margin: 0 }}>
                        Every deal you close after this decision is more profitable. This single change filters out time-wasters, positions you as premium, and builds a pipeline on real margin—not volume. Make the move now, and next quarter's revenue funds growth instead of covering costs.
                      </p>
                    </div>
                  </div>
                )}

                  {/* Committed state */}
                  {demoState === 'committed' && (
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '28px', marginTop: '12px' }}>
                      <div
                        style={{
                          position: 'relative',
                          minHeight: committedViewPhase === 'agent_overlay' ? 'auto' : 'min(260px, 36vh)',
                          overflow: 'hidden',
                          borderRadius: '10px',
                        }}
                      >
                        <div className={COMMITTED_CARD}>
                          <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9C9C9C', marginBottom: '12px', textAlign: 'center' }}>
                            Confirmed
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                            <div style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                              <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden
                              >
                                <circle
                                  className="animate-confirmed-badge-fill"
                                  cx="12"
                                  cy="12"
                                  r="8.5"
                                  fill="#dcfce7"
                                />
                                <g transform="rotate(-90 12 12)">
                                  <circle
                                    className="animate-confirmed-circle-ring"
                                    cx="12"
                                    cy="12"
                                    r="9.5"
                                    fill="none"
                                    stroke="#bbf7d0"
                                    strokeWidth="1.25"
                                    strokeLinecap="round"
                                  />
                                </g>
                                <path
                                  className="animate-confirmed-check-path"
                                  d="M5 13l4 4L19 7"
                                  fill="none"
                                  stroke={USER_MOVE_LAST_BEAT_GREEN}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  pathLength="1"
                                />
                              </svg>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: USER_MOVE_LAST_BEAT_GREEN }}>Move scheduled</span>
                          </div>
                          <div style={{ background: '#F7F7F7', border: '1px solid #E4E4E4', borderRadius: '8px', padding: '10px 14px' }}>
                            <p style={{ fontSize: '11px', color: '#0A0A0A', lineHeight: 1.6 }}>
                              Calendar blocked for 2pm · Context ready · Call scheduled with Acme
                            </p>
                          </div>
                        </div>

                        {committedViewPhase === 'agent_overlay' && (
                          <>
                          <div
                            style={{
                              position: 'absolute',
                              left: 0,
                              right: 0,
                              top: `${COMMITTED_CARD_PEEK_PX}px`,
                              bottom: 'auto',
                              height: 'auto',
                              zIndex: 20,
                              borderRadius: '10px 10px 0 0',
                              border: '1px solid #E4E4E4',
                              borderBottom: 'none',
                              background: '#fff',
                              padding: '10px 14px 14px',
                              boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
                              transition: 'transform .5s ease-out',
                              transform: agentSheetEntered ? 'translateY(0)' : 'translateY(100%)',
                            }}
                          >
                            <div
                              style={{
                                transition: 'opacity .3s',
                                opacity: agentSheetEntered ? 1 : 0,
                              }}
                            >
                              <p style={{ fontSize: '11px', color: '#5C5C5C', textAlign: 'center', marginBottom: '12px', lineHeight: 1.4 }}>
                                {agentDemoPhase === 'ready'
                                  ? 'Pricing change is ready to deploy!'
                                  : agentDemoPhase === 'executing'
                                    ? 'Agent is implementing the new floor.'
                                    : 'Agent is preparing your pricing change.'}
                              </p>
                              <div style={{ background: '#F7F7F7', border: '1px solid #E4E4E4', borderRadius: '8px', padding: '10px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0A0A0A' }}>
                                    {agentDemoPhase === 'executing'
                                      ? 'Agent is implementing the new floor'
                                      : agentDemoPhase === 'ready'
                                        ? "Pricing change is ready to deploy"
                                        : 'Agent is preparing your pricing change'}
                                  </span>
                                  {agentDemoPhase === 'assembling' && (
                                    <span
                                      style={{
                                        fontSize: '10px',
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: '.08em',
                                        color: ASSEMBLING_STATUS_DARK_BLUE,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                      }}
                                    >
                                      <span className="inline-flex gap-0.5 motion-reduce:hidden" aria-hidden>
                                        <span
                                          className="h-1 w-1 animate-bounce rounded-full [animation-delay:0ms]"
                                          style={{ backgroundColor: ASSEMBLING_STATUS_DARK_BLUE }}
                                        />
                                        <span
                                          className="h-1 w-1 animate-bounce rounded-full [animation-delay:150ms]"
                                          style={{ backgroundColor: ASSEMBLING_STATUS_DARK_BLUE }}
                                        />
                                        <span
                                          className="h-1 w-1 animate-bounce rounded-full [animation-delay:300ms]"
                                          style={{ backgroundColor: ASSEMBLING_STATUS_DARK_BLUE }}
                                        />
                                      </span>
                                      <span className="animate-pulse motion-reduce:animate-none">Assembling</span>
                                    </span>
                                  )}
                                  {agentDemoPhase === 'executing' && (
                                    <span
                                      style={{
                                        fontSize: '10px',
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: '.08em',
                                        color: EXECUTING_STATUS_DARK_PURPLE,
                                        transition: 'color .3s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                      }}
                                    >
                                      <span className="inline-flex gap-0.5 motion-reduce:hidden" aria-hidden>
                                        <span
                                          className="h-1 w-1 animate-bounce rounded-full [animation-delay:0ms]"
                                          style={{ backgroundColor: EXECUTING_STATUS_DARK_PURPLE }}
                                        />
                                        <span
                                          className="h-1 w-1 animate-bounce rounded-full [animation-delay:150ms]"
                                          style={{ backgroundColor: EXECUTING_STATUS_DARK_PURPLE }}
                                        />
                                        <span
                                          className="h-1 w-1 animate-bounce rounded-full [animation-delay:300ms]"
                                          style={{ backgroundColor: EXECUTING_STATUS_DARK_PURPLE }}
                                        />
                                      </span>
                                      <span className="animate-pulse motion-reduce:animate-none">Executing</span>
                                    </span>
                                  )}
                                  {agentDemoPhase === 'ready' && (
                                    <span
                                      style={{
                                        fontSize: '10px',
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: '.08em',
                                        color: '#16a34a',
                                        transition: 'color .3s',
                                      }}
                                    >
                                      Ready
                                    </span>
                                  )}
                                </div>
                                {agentDemoPhase === 'ready' ? (
                                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {AGENT_READY_LINES.map((line, i) => (
                                      <li key={line} className="animate-agent-line-reveal" style={{ animationDelay: `${i * AGENT_READY_STAGGER_MS}ms`, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                        <svg width="16" height="16" fill="none" stroke="#16a34a" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span style={{ fontSize: '11px', lineHeight: 1.5, color: '#0A0A0A' }}>{line}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {AGENT_LIST_LINES.map((line, i) => {
                                      const struck = agentStrikeCount > i;
                                      const pendingPulse = agentDemoPhase === 'executing' && !struck;
                                      return (
                                        <li
                                          key={line}
                                          className={agentDemoPhase === 'assembling' ? 'animate-agent-line-reveal' : ''}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '6px',
                                            ...(agentDemoPhase === 'assembling'
                                              ? { animationDelay: `${i * AGENT_ASSEMBLE_STAGGER_MS}ms` }
                                              : {}),
                                          }}
                                        >
                                          {(agentDemoPhase === 'assembling' || agentDemoPhase === 'executing') && (
                                            <span
                                              aria-hidden
                                              style={{
                                                flexShrink: 0,
                                                fontSize: '11px',
                                                lineHeight: 1.5,
                                                color: '#5C5C5C',
                                              }}
                                            >
                                              •
                                            </span>
                                          )}
                                          <span
                                            className={pendingPulse ? 'animate-pulse motion-reduce:animate-none' : ''}
                                            style={{
                                              fontSize: '11px',
                                              lineHeight: 1.5,
                                              color: struck ? '#9C9C9C' : '#0A0A0A',
                                              textDecoration: struck ? 'line-through' : 'none',
                                              transition: 'color .3s',
                                            }}
                                          >
                                            {line}
                                          </span>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              position: 'absolute',
                              left: 0,
                              right: 0,
                              top: `${USER_ACTION_SHEET_TOP_PX}px`,
                              zIndex: 30,
                              borderRadius: '10px',
                              border: '1px solid #E4E4E4',
                              background: '#fff',
                              padding: '10px 12px 10px',
                              boxShadow: '0 2px 14px rgba(0,0,0,0.07)',
                              transition: prefersReducedMotion ? 'none' : 'transform .5s ease-out, opacity .35s ease-out',
                              transform: userActionSheetVisible ? 'translateY(0)' : 'translateY(100%)',
                              opacity: userActionSheetVisible ? 1 : 0,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                flexShrink: 0,
                              }}
                            >
                              <p
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  color: '#5C5C5C',
                                  textAlign: 'center',
                                  marginBottom: '12px',
                                  lineHeight: 1.4,
                                }}
                              >
                                {USER_ACTION_SECTION_LABEL}
                              </p>
                              <div
                                style={{
                                  background: '#F7F7F7',
                                  border: '1px solid #E4E4E4',
                                  borderRadius: '8px',
                                  padding: '10px 12px',
                                  marginBottom: '8px',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '8px',
                                    margin: 0,
                                    marginBottom: userActionDotIndex >= 1 ? '8px' : 0,
                                  }}
                                >
                                  <span
                                    className="mt-[5px] h-2 w-2 shrink-0 rounded-full animate-pulse motion-reduce:animate-none"
                                    style={{ backgroundColor: '#16a34a' }}
                                    aria-hidden
                                  />
                                  <p
                                    style={{
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      color: closeSequence === 'complete' ? USER_MOVE_LAST_BEAT_GREEN : '#0A0A0A',
                                      lineHeight: 1.5,
                                      margin: 0,
                                      flex: 1,
                                    }}
                                  >
                                    {closeSequence === 'complete' ? '$10K more per deal — every deal, from here forward.' : USER_ACTION_ANCHOR}
                                  </p>
                                </div>
                                {USER_ACTION_BEATS.map((beat, i) => {
                                  const step = i + 1;
                                  const isLast = i === USER_ACTION_BEATS.length - 1;
                                  const visible = userActionSheetEntered;
                                  if (!visible) return null;
                                  return (
                                    <p
                                      key={beat}
                                      style={{
                                        fontSize: '11px',
                                        fontWeight: 500,
                                        color: '#0A0A0A',
                                        lineHeight: 1.55,
                                        margin: 0,
                                        marginTop: i === 0 ? 0 : '6px',
                                        transition: prefersReducedMotion ? 'none' : 'opacity .25s ease-out',
                                        textDecoration: closeSequence === 'complete' ? 'line-through' : 'none',
                                        opacity: closeSequence === 'complete' ? 0.5 : 1,
                                      }}
                                    >
                                      {beat}
                                    </p>
                                  );
                                })}
                              </div>
                              <div
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={3}
                                aria-valuenow={userActionDotIndex}
                                aria-busy={closeSequence === 'confetti' || closeSequence === 'line'}
                                aria-valuetext={
                                  userActionDotIndex === 0
                                    ? 'Momentum — preparing'
                                    : userActionDotIndex === 1
                                      ? 'Aligned complete'
                                      : userActionDotIndex === 2
                                        ? closeSequence === 'line' || closeSequence === 'confetti'
                                          ? 'Drawing close segment'
                                          : 'Aligned and Framed complete — confirm Close'
                                        : 'Close complete — all stages done'
                                }
                                aria-label="Your next move: aligned, framed, close"
                                aria-live="polite"
                                className="motion-reduce:transition-none"
                                style={{
                                  position: 'relative',
                                  marginTop: '12px',
                                  marginBottom: 0,
                                  paddingTop: '4px',
                                  paddingBottom: 0,
                                }}
                              >
                                <div
                                  style={{
                                    position: 'relative',
                                    marginLeft: '8%',
                                    marginRight: '8%',
                                    minHeight: '48px',
                                    paddingBottom: '2px',
                                    paddingRight:
                                      userActionDotIndex === 2 &&
                                      agentDemoPhase === 'ready' &&
                                      closeSequence === 'idle'
                                        ? USER_MOVE_CLOSE_CONFIRM_TRACK_PAD_RIGHT_PX
                                        : undefined,
                                  }}
                                >
                                  <div
                                    aria-hidden
                                    style={{
                                      position: 'absolute',
                                      left: 0,
                                      right: 0,
                                      top: `${USER_MOVE_TRACK_LINE_TOP_PX}px`,
                                      height: USER_MOVE_TRACK_LINE_HEIGHT_PX,
                                      borderRadius: 1,
                                    }}
                                  >
                                    <div
                                      style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: '#E8E8E8',
                                        borderRadius: 1,
                                      }}
                                    />
                                    {userActionDotIndex >= 1 && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          left: 0,
                                          width: '33.333%',
                                          top: 0,
                                          bottom: 0,
                                          background: USER_MOVE_MOMENTUM_BLACK,
                                          borderRadius: '1px 0 0 1px',
                                        }}
                                      />
                                    )}
                                    {userActionDotIndex >= 2 && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          left: '33.333%',
                                          width: '33.333%',
                                          top: 0,
                                          bottom: 0,
                                          background: USER_MOVE_MOMENTUM_BLACK,
                                        }}
                                      />
                                    )}
                                    {(() => {
                                      const isPendingCloseStretch =
                                        userActionDotIndex >= 2 &&
                                        closeSequence === 'idle' &&
                                        agentDemoPhase === 'ready' &&
                                        momentumThirdSegment === 'hidden';
                                      const showThirdTrackCell =
                                        momentumThirdSegment !== 'hidden' || isPendingCloseStretch;
                                      if (!showThirdTrackCell) return null;
                                      return (
                                        <div
                                          style={{
                                            position: 'absolute',
                                            left: '66.666%',
                                            width: '33.334%',
                                            top: 0,
                                            bottom: 0,
                                            borderRadius: '0 1px 1px 0',
                                            overflow: 'hidden',
                                          }}
                                        >
                                          <div
                                            className={
                                              !prefersReducedMotion && isPendingCloseStretch
                                                ? 'animate-user-move-framed-close-pending'
                                                : momentumThirdSegment === 'sweeping' && !prefersReducedMotion
                                                  ? 'animate-user-move-framed-close-sweep'
                                                  : undefined
                                            }
                                            style={{
                                              height: '100%',
                                              width: '100%',
                                              background: USER_MOVE_MOMENTUM_BLACK,
                                              transformOrigin: 'left center',
                                              ...(momentumThirdSegment === 'solid' ||
                                              (prefersReducedMotion &&
                                                momentumThirdSegment !== 'hidden' &&
                                                !isPendingCloseStretch)
                                                ? { transform: 'scaleX(1)' }
                                                : {}),
                                            }}
                                          />
                                        </div>
                                      );
                                    })()}
                                  </div>
                                  {[1, 2, 3].map((step) => {
                                    const label = USER_ACTION_DOT_LABELS[step - 1];
                                    const isFrontier = step === 3;
                                    const filled =
                                      step < 3 ? userActionDotIndex >= step : userActionDotIndex >= 3;
                                    const frontierActive =
                                      isFrontier &&
                                      userActionDotIndex >= 2 &&
                                      userActionDotIndex < 3 &&
                                      closeSequence === 'idle';
                                    const atLineStart = step === 1;
                                    const atLineEnd = step === 3;
                                    return (
                                      <div
                                        key={step}
                                        className="motion-reduce:transition-none flex flex-col gap-1"
                                        style={{
                                          position: 'absolute',
                                          top: `${USER_MOVE_DOT_COLUMN_TOP_PX}px`,
                                          left: atLineStart ? 0 : atLineEnd ? '100%' : '50%',
                                          transform: atLineStart ? 'none' : atLineEnd ? 'translateX(-100%)' : 'translateX(-50%)',
                                          alignItems: atLineStart ? 'flex-start' : atLineEnd ? 'flex-end' : 'center',
                                        }}
                                      >
                                        <div
                                          className={
                                            (frontierActive || (isFrontier && closeSequence === 'complete')) && !prefersReducedMotion ? 'animate-pulse motion-reduce:animate-none' : undefined
                                          }
                                          style={{
                                            width: USER_MOVE_DOT_SIZE_PX,
                                            height: USER_MOVE_DOT_SIZE_PX,
                                            borderRadius: '50%',
                                            border: `2px solid ${
                                              filled ? USER_MOVE_MOMENTUM_COMPLETE_GREEN : USER_MOVE_TRACK_GREY
                                            }`,
                                            background: filled ? USER_MOVE_MOMENTUM_COMPLETE_GREEN : '#fff',
                                            transition: prefersReducedMotion ? 'none' : 'background .25s ease-out, border-color .25s ease-out',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                          }}
                                        >
                                          {filled && (
                                            <svg
                                              width={USER_MOVE_CHECK_SVG_PX}
                                              height={USER_MOVE_CHECK_SVG_PX}
                                              fill="none"
                                              stroke="#fff"
                                              viewBox="0 0 24 24"
                                              aria-hidden
                                            >
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                          )}
                                        </div>
                                        <span
                                          aria-hidden
                                          style={{
                                            fontSize: '9px',
                                            fontWeight: 600,
                                            color: filled ? USER_MOVE_MOMENTUM_COMPLETE_GREEN : USER_MOVE_TRACK_GREY_LABEL,
                                            textAlign: atLineStart ? 'left' : atLineEnd ? 'right' : 'center',
                                            lineHeight: 1.2,
                                            transition: prefersReducedMotion ? 'none' : 'color .2s ease-out',
                                            whiteSpace: 'nowrap',
                                          }}
                                        >
                                          {label}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                            {userActionDotIndex === 2 && agentDemoPhase === 'ready' && closeSequence === 'idle' && (
                              <button
                                type="button"
                                onClick={handleCloseConfirmClick}
                                aria-label="Confirm Close — complete your move"
                                style={{
                                  position: 'absolute',
                                  bottom: '10px',
                                  right: '12px',
                                  width: USER_MOVE_CLOSE_CONFIRM_BTN_PX,
                                  height: USER_MOVE_CLOSE_CONFIRM_BTN_PX,
                                  borderRadius: '50%',
                                  border: `2px solid ${USER_MOVE_TRACK_GREY}`,
                                  background: '#fff',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: 0,
                                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                  zIndex: 2,
                                }}
                              >
                                <svg
                                  width={USER_MOVE_CLOSE_CONFIRM_CHECK_SVG_PX}
                                  height={USER_MOVE_CLOSE_CONFIRM_CHECK_SVG_PX}
                                  fill="none"
                                  stroke={USER_MOVE_TRACK_GREY}
                                  viewBox="0 0 24 24"
                                  aria-hidden
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            )}
                          </div>
                          </>
                        )}
                        {committedViewPhase === 'agent_overlay' && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: `${COMMITTED_FOOTER_AFTER_CARD_GAP_PX}px`,
                            }}
                          >
                            <div
                              aria-hidden
                              style={{
                                height: `${COMMITTED_AGENT_STACK_SPACER_PX}px`,
                                minHeight: 0,
                                flexShrink: 0,
                                pointerEvents: 'none',
                              }}
                            />
                            {demoState === 'committed' && committedFooterVisible && (
                              <div
                                style={{
                                  position: 'relative',
                                  zIndex: 31,
                                  textAlign: 'center',
                                  paddingTop: '8px',
                                  paddingBottom: '2px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '8px',
                                  alignItems: 'center',
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={openImpact}
                                  style={{
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    color: ASSEMBLING_STATUS_DARK_BLUE,
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontFamily: 'inherit',
                                  }}
                                >
                                  See the Impact
                                </button>
                                <button onClick={resetDemo} style={{ fontSize: '11px', color: '#9C9C9C', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Go Back</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Impact state */}
                  {demoState === 'impact' && (
                    <div style={{ borderTop: '1px solid #E4E4E4', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '12px',
                          transition: 'all .7s ease-out',
                          opacity: impactAnimStep >= 1 ? 1 : 0,
                          transform: impactAnimStep >= 1 ? 'translateY(0)' : 'translateY(8px)',
                        }}
                      >
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0A0A0A', marginBottom: '8px' }}>Leverage</h4>
                          <p style={{ fontSize: '13px', fontWeight: 500, color: USER_MOVE_LAST_BEAT_GREEN, lineHeight: 1.5, marginBottom: '6px' }}>$10K more per deal — every deal, from here forward.</p>
                          <p style={{ fontSize: '11px', color: '#5C5C5C', lineHeight: 1.6 }}>
                            Every client you close after today comes in at $10K higher margin. This decision just turned your pipeline from a volume grind into a profit engine.
                          </p>
                        </div>
                        <button onClick={closeImpact} style={{ fontSize: '14px', fontWeight: 500, color: '#9C9C9C', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', flexShrink: 0 }}>
                          Back
                        </button>
                      </div>

                      <div style={{ transition: 'all .7s ease-out', opacity: impactAnimStep >= 2 ? 1 : 0, transform: impactAnimStep >= 2 ? 'translateY(0)' : 'translateY(8px)' }}>
                        <div style={{ border: '1px solid #E4E4E4', borderRadius: '8px', padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0A0A0A', fontVariantNumeric: 'tabular-nums' }}>$10K/deal</div>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                              <path d="M12 19V5M5 12l7-7 7 7" stroke={USER_MOVE_LAST_BEAT_GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9C9C9C', marginTop: '4px' }}>Margin Gained Per Deal</div>
                          <p style={{ fontSize: '11px', color: '#5C5C5C', lineHeight: 1.6, marginTop: '8px' }}>
                            Every client signs at $25K instead of $15K. That's $10K more margin per close without changing your product or adding overhead.
                          </p>
                        </div>
                      </div>

                      <div style={{ transition: 'all .7s ease-out', opacity: impactAnimStep >= 3 ? 1 : 0, transform: impactAnimStep >= 3 ? 'translateY(0)' : 'translateY(8px)' }}>
                        <div style={{ border: '1px solid #E4E4E4', borderRadius: '8px', padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0A0A0A' }}>Filtered</div>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                              <path d="M12 19V5M5 12l7-7 7 7" stroke={USER_MOVE_LAST_BEAT_GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9C9C9C', marginTop: '4px' }}>Pipeline Quality</div>
                          <p style={{ fontSize: '11px', color: '#5C5C5C', lineHeight: 1.6, marginTop: '8px' }}>
                            Budget shoppers self-select out. Your calendar is now reserved for clients worth your time.
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          transition: 'all .7s ease-out',
                          opacity: impactAnimStep >= 4 ? 1 : 0,
                          transform: impactAnimStep >= 4 ? 'translateY(0)' : 'translateY(8px)',
                        }}
                      >
                        <div style={{ border: '1px solid #E4E4E4', borderRadius: '8px', padding: '12px 14px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0A0A0A' }}>Equity Multiplier</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0A0A0A', fontVariantNumeric: 'tabular-nums' }}>$120K</div>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                              <path d="M12 19V5M5 12l7-7 7 7" stroke={USER_MOVE_LAST_BEAT_GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9C9C9C', marginTop: '4px' }}>Annual Upside From 12 Deals</div>
                          <p style={{ fontSize: '11px', color: '#5C5C5C', lineHeight: 1.6, marginTop: '8px' }}>
                            12 deals at the new floor = $120K in pure margin gain. That funds your next hire without chasing more volume.
                          </p>
                        </div>
                        <div className="impact-metrics-pair">
                          <div style={{ border: '1px solid #E4E4E4', borderRadius: '8px', padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0A0A0A' }}>Premium</div>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                <path d="M12 19V5M5 12l7-7 7 7" stroke={USER_MOVE_LAST_BEAT_GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9C9C9C', marginTop: '4px' }}>Market Positioning</div>
                            <p style={{ fontSize: '11px', color: '#5C5C5C', lineHeight: 1.5, marginTop: '8px' }}>
                              You just signaled you're not the budget option. Premium pricing attracts clients who close faster and demand less.
                            </p>
                          </div>
                          <div style={{ border: '1px solid #E4E4E4', borderRadius: '8px', padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0A0A0A' }}>Compounding</div>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                <path d="M12 19V5M5 12l7-7 7 7" stroke={USER_MOVE_LAST_BEAT_GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9C9C9C', marginTop: '4px' }}>Growth Leverage</div>
                            <p style={{ fontSize: '11px', color: '#5C5C5C', lineHeight: 1.5, marginTop: '8px' }}>
                              Higher margin per deal = fewer deals needed to hit targets. You scale without grinding.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          borderTop: '1px solid #E4E4E4',
                          paddingTop: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'opacity .7s ease-out',
                          opacity: impactAnimStep >= 5 ? 1 : 0,
                        }}
                      >
                        <p
                          style={{
                            fontSize: '15px',
                            fontWeight: 400,
                            color: '#0A0A0A',
                            lineHeight: 1.5,
                            textAlign: 'center',
                            margin: 0,
                          }}
                        >
                          Konquer just turned one pricing decision into infinite compounding upside.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowRequestInviteModal(true)}
                          className="btn-gel-invite btn-gel-invite-animated request-invite-impact-ring"
                          style={{
                            color: '#ffffff',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: '17px',
                            fontWeight: 600,
                            letterSpacing: '-0.005em',
                          }}
                        >
                          <span
                            className="request-invite-impact-ring-inner"
                            style={{ padding: '18px 44px' }}
                          >
                            Request Invite
                          </span>
                        </button>
                        <Link
                          href="/redeem"
                          style={{
                            fontSize: '13px',
                            fontWeight: 400,
                            color: '#5C5C5C',
                            textDecoration: 'underline',
                            textUnderlineOffset: '3px',
                            marginTop: '4px',
                          }}
                        >
                          <span className="animate-demo-tagline-gradient" style={{ fontWeight: 400 }}>
                            Have an invite code?
                          </span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Idle — primary CTA: full-width pill, system typography */}
                  {demoState === 'idle' && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        gap: '16px',
                        width: '100%',
                        maxWidth: '100%',
                        marginTop: '14px',
                      }}
                    >
                      <div className="animate-cta-arrow-nudge" style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }} aria-hidden>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <path d="M6 9l6 6 6-6" stroke="#6E6E73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <button
                          onClick={() => setDemoState('committed')}
                          type="button"
                          className="btn-gel-invite btn-gel-invite-animated"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '16px 48px',
                            borderRadius: '16px',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#ffffff',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          Begin My Day
                        </button>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setShowTradeoffsModal(true)}
                          style={{ fontSize: '13px', fontWeight: 500, color: COST_OF_DELAY_RED, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}
                        >
                          Cost of Delay Impact
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

          {!(
            demoState === 'committed' &&
            committedViewPhase === 'agent_overlay' &&
            (agentDemoPhase === 'assembling' || agentDemoPhase === 'executing')
          ) && (
          <p
            style={{
              textAlign: 'center',
              fontSize: '15px',
              fontWeight: 300,
              marginTop: '48px',
              letterSpacing: '.04em',
              color: '#AEAEB2',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
          >
            <span className="animate-demo-tagline-gradient">
              You know the move. You execute. The number moves.
            </span>
          </p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE FOG
      ═══════════════════════════════════════════ */}
      <section
        id="fog"
        ref={fogRef}
        style={{ paddingTop: '72px', paddingBottom: '48px', borderTop: '1px solid #E4E4E4' }}
      >
        <div
          className="site-gutter fog-grid"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Fog line — centered display copy (not a quotation) */}
          <p
            className="fu"
            style={{
              textAlign: 'center',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: '#0A0A0A',
              margin: 0,
              padding: 0,
              maxWidth: '880px',
              fontStyle: 'normal',
            }}
          >
            The Fog Isn&apos;t Laziness. It Isn&apos;t Confusion. It&apos;s The Absence Of One Clear Signal.
          </p>

          {/* Body copy */}
          <div
            className="fu"
            style={{
              animationDelay: '0.12s',
              marginTop: '48px',
              width: '100%',
              maxWidth: '880px',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: '#5C5C5C',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              The Problem
            </p>
            <p
              style={{
                fontSize: '17px',
                fontWeight: 300,
                lineHeight: 1.87,
                color: '#5C5C5C',
                marginBottom: '24px',
              }}
            >
              Founders don&apos;t fail because they don&apos;t work hard. They fail because the systems
              around them generate noise faster than clarity. Every tool adds data. Every meeting adds
              options. Every morning the list is longer than yesterday.
            </p>
            <p
              style={{
                fontSize: '17px',
                fontWeight: 300,
                lineHeight: 1.87,
                color: '#5C5C5C',
              }}
            >
              Busy is not effective. Volume is not strategy.{' '}
              <strong className="animate-demo-tagline-gradient" style={{ fontWeight: 600 }}>
                The single move that actually moves the number is buried under everything else.
              </strong>{' '}
              Konquer removes the burial.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THREE PILLARS
      ═══════════════════════════════════════════ */}
      <section
        id="pillars"
        ref={pillarsRef}
        style={{
          paddingTop: '72px',
          paddingBottom: '48px',
          background: '#0A0A0A',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="site-gutter" style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <p
            className="fu"
            style={{
              fontSize: '13px',
              fontWeight: 400,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: '#888888',
              marginBottom: '40px',
              textAlign: 'center',
            }}
          >
            What Konquer Delivers
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '0',
            }}
            className="pillars-grid"
          >
            {PILLARS.map((p, i) => (
              <div
                key={p.title}
                className="fu"
                style={{
                  animationDelay: `${i * 0.12}s`,
                  paddingTop: '32px',
                  paddingBottom: '32px',
                  paddingRight: '32px',
                  paddingLeft: i === 0 ? '0' : '32px',
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}
              >
                <p style={{ fontSize: '12px', fontWeight: 400, letterSpacing: '.18em', textTransform: 'uppercase', color: '#737373', marginBottom: '20px', textAlign: 'center' }}>
                  {p.num}
                </p>
                <h3
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '14px',
                    fontSize: 'clamp(36px, 3.5vw, 44px)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#FAFAFA',
                    marginBottom: '10px',
                    lineHeight: 1.1,
                    textAlign: 'center',
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      flexShrink: 0,
                      fontSize: 'clamp(34px, 4.5vw, 50px)',
                      lineHeight: 1,
                      color: '#FAFAFA',
                      fontFamily:
                        '"Segoe UI Symbol", "Apple Symbols", "Noto Sans Symbols", "DejaVu Sans", serif',
                    }}
                  >
                    {PILLAR_CHESS_SYMBOLS[i]}
                  </span>
                  {p.title}
                </h3>
                <p style={{ fontSize: '16px', fontWeight: 300, fontStyle: 'italic', color: '#9CA3AF', marginBottom: '22px', textAlign: 'center' }}>
                  {p.sub}
                </p>
                <p style={{ fontSize: '17px', fontWeight: 300, lineHeight: 1.7, color: '#BDBDBD' }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE DIFFERENCE
      ═══════════════════════════════════════════ */}
      <section
        id="difference"
        ref={diffRef}
        style={{
          paddingTop: '72px',
          paddingBottom: '48px',
          background: '#F7F7F7',
          borderTop: '1px solid #E4E4E4',
        }}
      >
        <div
          className="site-gutter diff-grid"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'start',
          }}
        >
          {/* Reframe copy */}
          <div className="fu">
            <p style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '.18em', textTransform: 'uppercase', color: '#5C5C5C', marginBottom: '24px', textAlign: 'center' }}>
              A Different Category
            </p>
            <p
              style={{
                fontSize: 'clamp(21px, 2.5vw, 32px)',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.45,
                color: '#0A0A0A',
              }}
            >
              Every tool you&apos;ve used was built for a world that needed more data.
              Konquer was built for the world that already has too much of it.
            </p>
            <p style={{ fontSize: '15px', fontWeight: 300, lineHeight: 1.75, color: '#5C5C5C', marginTop: '28px' }}>
              The problem is not more information. The problem is the signal buried inside it.
              Konquer is not a smarter dashboard. It is a different answer to a different question.
            </p>
          </div>

          {/* Contrast list — each row is .fu so scroll stagger hits line-by-line */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {DIFF_ITEMS.map((item, i) => {
              const isThis = i === DIFF_ITEMS.length - 1;
              const isNotThis = item.label === 'Not this';
              return (
                <div
                  key={i}
                  className={isNotThis ? 'fu diff-contrast-row diff-row-not-this' : 'fu diff-contrast-row'}
                  tabIndex={isNotThis ? 0 : undefined}
                  aria-label={isNotThis ? `${item.label}: ${item.text}` : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '20px',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    paddingLeft: isThis ? '14px' : '0',
                    paddingRight: isThis ? '12px' : '0',
                    borderLeft: isThis ? '3px solid #166534' : 'none',
                    borderBottom: i < DIFF_ITEMS.length - 1 ? '1px solid #E4E4E4' : 'none',
                    background: isThis ? 'rgba(10, 10, 10, 0.03)' : 'transparent',
                    borderRadius: isThis ? '4px' : '0',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 400,
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      color: isThis ? '#0A0A0A' : '#9C9C9C',
                      minWidth: '64px',
                      flexShrink: 0,
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="diff-row-sentence"
                    style={{
                      fontSize: isThis ? 'clamp(22px, 2.4vw, 24px)' : '21px',
                      fontWeight: isThis ? 700 : 300,
                      color: isThis ? '#0A0A0A' : '#5C5C5C',
                      lineHeight: 1.3,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ACCESS CTA
      ═══════════════════════════════════════════ */}
      <section
        id="access"
        style={{ paddingTop: '72px', paddingBottom: '48px', borderTop: '1px solid #E4E4E4' }}
      >
        <div
          className="site-gutter"
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#0A0A0A',
              marginBottom: '16px',
            }}
          >
            You&apos;ve always had the capability.
          </h2>
          <p
            style={{
              fontSize: 'clamp(18px, 2.2vw, 26px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#5C5C5C',
              lineHeight: 1.4,
              marginBottom: '40px',
              whiteSpace: 'nowrap',
            }}
          >
            Now you can have the certainty to match it.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0,
              marginBottom: '20px',
            }}
          >
            <button
              type="button"
              onClick={() => setShowRequestInviteModal(true)}
              className="btn-gel-invite btn-gel-invite-animated request-invite-impact-ring"
              style={{
                color: '#ffffff',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '17px',
                fontWeight: 600,
                letterSpacing: '-0.005em',
              }}
            >
              <span
                className="request-invite-impact-ring-inner"
                style={{ padding: '18px 44px' }}
              >
                Request Invite
              </span>
            </button>
            <Link
              href="/redeem"
              style={{
                fontSize: '13px',
                fontWeight: 400,
                color: '#5C5C5C',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                marginTop: '6px',
              }}
            >
              <span className="animate-demo-tagline-gradient" style={{ fontWeight: 400 }}>
                Have an invite code?
              </span>
            </Link>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#9C9C9C',
                marginTop: '12px',
              }}
            >
              Starting at $1,000/mo.
            </span>
          </div>

          <p style={{ fontSize: '16px', fontWeight: 300, letterSpacing: '.04em', marginBottom: '8px', textAlign: 'center' }}>
            <span className="animate-demo-tagline-gradient">
              Konquer is built for founders already generating $500K+ a year.
            </span>
          </p>

          <p
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#CCCCCC',
              marginTop: '48px',
              marginBottom: 0,
              letterSpacing: '-0.01em',
            }}
          >
            Know the move!
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer
        style={{
          padding: '32px 0',
          borderTop: '1px solid #E4E4E4',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="site-gutter site-footer-bar"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div>
            <span style={{ fontWeight: 700, fontSize: '16px', color: '#0A0A0A', marginRight: '16px' }}>Konquer</span>
            <span style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '.14em', textTransform: 'uppercase', color: '#9C9C9C' }}>
              Precision Intelligence™
            </span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 300, color: '#9C9C9C' }}>
            © {new Date().getFullYear()} Konquer. All rights reserved.
          </span>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════
          TRADEOFFS MODAL
      ═══════════════════════════════════════════ */}
      {showTradeoffsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
            padding: '20px',
            transition: 'opacity 420ms ease-out',
            opacity: tradeoffsAnimStep >= 1 ? 1 : 0,
            pointerEvents: tradeoffsAnimStep >= 1 ? 'auto' : 'none',
          }}
          onClick={() => setShowTradeoffsModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '900px',
              maxHeight: 'min(90vh, 900px)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              background: '#fff',
              borderRadius: '16px',
              padding: 'clamp(20px, 5vw, 32px)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
              transition: 'all 500ms ease-out',
              transform: tradeoffsAnimStep >= 2 ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
              opacity: tradeoffsAnimStep >= 2 ? 1 : 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px 16px',
                marginBottom: '32px',
                transition: 'all 500ms ease-out',
                opacity: tradeoffsAnimStep >= 2 ? 1 : 0,
              }}
            >
              <h3 style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em', margin: 0 }}>If You Delay This Move</h3>
              <button onClick={() => setShowTradeoffsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C9C9C' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="tradeoffs-modal-grid">
              {[
                {
                  step: 3,
                  icon: (
                    <svg width="28" height="28" fill="none" stroke={ACCENT_BLUE} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  iconBg: '#EEF2FF',
                  value: '$13K per deal',
                  valueColor: ACCENT_BLUE,
                  label: 'MARGIN LEFT ON TABLE',
                  labelColor: DELAY_IMPACT_RED,
                  iconPulse: true,
                  body: 'Every deal you close at $15K instead of $28K costs you the difference.',
                },
                {
                  step: 4,
                  icon: (
                    <svg width="28" height="28" fill="none" stroke="#5C5C5C" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  ),
                  iconBg: '#F7F7F7',
                  value: 'Wrong clients',
                  valueColor: '#0A0A0A',
                  label: 'PIPELINE POLLUTION',
                  labelColor: DELAY_IMPACT_RED,
                  body: 'Low-value prospects keep entering your pipeline and burning your time.',
                },
                {
                  step: 5,
                  icon: (
                    <svg width="28" height="28" fill="none" stroke={ACCENT_BLUE} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  ),
                  iconBg: '#EEF2FF',
                  value: 'Commodity positioning',
                  valueColor: ACCENT_BLUE,
                  label: 'MARKET PERCEPTION',
                  labelColor: DELAY_IMPACT_RED,
                  body: 'You stay positioned as the cheaper option, not the premium choice.',
                },
                {
                  step: 6,
                  icon: (
                    <svg width="28" height="28" fill="none" stroke="#5C5C5C" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  iconBg: '#F7F7F7',
                  value: 'Hire timeline extends',
                  valueColor: '#0A0A0A',
                  label: 'GROWTH DELAYED',
                  labelColor: DELAY_IMPACT_RED,
                  body: 'Lower margin per deal means more volume needed to fund your next operator.',
                },
              ].map((col) => (
                <div
                  key={col.step}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 500ms ease-out',
                    opacity: tradeoffsAnimStep >= col.step ? 1 : 0,
                    transform: tradeoffsAnimStep >= col.step ? 'translateY(0)' : 'translateY(8px)',
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: col.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                      transition: 'transform 500ms ease-out',
                      transform: tradeoffsAnimStep >= col.step ? 'scale(1)' : 'scale(0.95)',
                    }}
                  >
                    {col.iconPulse ? (
                      <span className="tradeoffs-money-icon-pulse" style={{ display: 'inline-flex' }}>
                        {col.icon}
                      </span>
                    ) : (
                      col.icon
                    )}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: col.valueColor, marginBottom: '4px', lineHeight: 1 }}>{col.value}</div>
                  <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.1em', color: col.labelColor ?? '#9C9C9C', marginBottom: '12px' }}>{col.label}</div>
                  <p style={{ fontSize: '12px', color: '#5C5C5C', lineHeight: 1.6 }}>{col.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <RequestInviteModal open={showRequestInviteModal} onClose={() => setShowRequestInviteModal(false)} />
      <MemberLoginModal open={showMemberLoginModal} onClose={() => setShowMemberLoginModal(false)} />

      {/* ═══════════════════════════════════════════
          RESPONSIVE STYLES (injected)
      ═══════════════════════════════════════════ */}
      <style>{`
        .demo-chrome-title {
          display: block;
          font-weight: 600;
          color: #3c3c43;
          letter-spacing: -0.01em;
          line-height: 1.2;
          font-size: clamp(10px, 2.65vw, 13px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (max-width: 480px) {
          .demo-browser-chrome {
            padding: 10px 12px !important;
          }
          .demo-chrome-spacer {
            width: 36px !important;
          }
        }
        @media (max-width: 1024px) {
          .fog-grid > p:first-of-type { border-bottom: 1px solid #E4E4E4; padding-bottom: 32px !important; }
          .pillars-grid { grid-template-columns: 1fr !important; }
          .pillars-grid > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 24px 0 !important; }
          .pillars-grid > div:last-child { border-bottom: none !important; }
          .diff-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </div>
  );
}
