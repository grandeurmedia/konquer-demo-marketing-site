'use client';

import React, { useEffect, useRef, useState } from 'react';
import { WaitlistModal } from '@/components/waitlist/WaitlistModal';

/* ─── Demo animation constants (unchanged from original) ─── */
const TRADEOFFS_FINAL_STEP = 6;
const COMMITTED_CONFIRM_MS = 3000;
const AGENT_SIM_AFTER_SLIDE_MS = 400;
const AGENT_ASSEMBLING_MS = 6000;
const AGENT_STRIKE_GAP_MS = 3000;
const AGENT_READY_AFTER_LAST_STRIKE_MS = 1300;
const COMMITTED_FOOTER_AFTER_READY_MS = 2000;

const COMMITTED_CARD =
  'rounded-[10px] border border-gray-200 bg-white px-4 py-4 shadow-[0_1px_4px_1px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out';

type DemoPhase = 'idle' | 'committed' | 'impact';
type CommittedViewPhase = 'confirmed_only' | 'agent_overlay';
type AgentDemoPhase = 'assembling' | 'executing' | 'ready';

const AGENT_LIST_LINES = [
  'Acme renewal context linked to Sarah and open risks',
  'Next steps drafted for after the 2pm call',
  'Call brief with talking points and objection notes',
] as const;

const AGENT_READY_LINES = [
  'Linked Acme renewal context to Sarah and surfaced open risks.',
  'Drafted next steps for after the 2pm call.',
  'Built a call brief with talking points and objection notes.',
] as const;

const AGENT_ASSEMBLE_STAGGER_MS = 1000;
const AGENT_READY_STAGGER_MS = 1000;
const IMPACT_STAGGER_INITIAL_MS = 400;
const IMPACT_STAGGER_STEP_MS = 500;
const IMPACT_REVENUE_START_K = 1;
const IMPACT_REVENUE_END_K = 18;
const IMPACT_REVENUE_COUNT_MS = 650;

/* ─── Hero headline words ─── */
const HEADLINE_WORDS = ['One', 'Move.', 'Total', 'Clarity.'];

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

/* ─── Difference statements ─── */
const DIFF_ITEMS = [
  { label: 'Not this', text: 'Another dashboard full of charts.' },
  { label: 'Not this', text: 'A chatbot that gives you options.' },
  { label: 'Not this', text: 'An analytics tool that tells you what happened.' },
  { label: 'This', text: 'One move. Auditable certainty. Every day.' },
];

export default function LandingPage() {
  /* ─── Nav scroll ─── */
  const [isScrolled, setIsScrolled] = useState(false);

  /* ─── Demo state (all reused from original) ─── */
  const [showTradeoffsModal, setShowTradeoffsModal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [demoState, setDemoState] = useState<DemoPhase>('idle');
  const [committedViewPhase, setCommittedViewPhase] = useState<CommittedViewPhase>('confirmed_only');
  const [agentSheetEntered, setAgentSheetEntered] = useState(false);
  const [impactAnimStep, setImpactAnimStep] = useState(0);
  const [impactRevenueK, setImpactRevenueK] = useState(IMPACT_REVENUE_START_K);
  const [tradeoffsAnimStep, setTradeoffsAnimStep] = useState(0);
  const [agentDemoPhase, setAgentDemoPhase] = useState<AgentDemoPhase>('assembling');
  const [agentStrikeCount, setAgentStrikeCount] = useState(0);
  const [committedFooterVisible, setCommittedFooterVisible] = useState(false);

  /* ─── Access form ─── */
  const [email, setEmail] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  /* ─── Fade-up refs for scroll sections ─── */
  const fogRef = useRef<HTMLElement>(null);
  const pillarsRef = useRef<HTMLElement>(null);
  const diffRef = useRef<HTMLElement>(null);

  /* ─── Nav scroll listener ─── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ─── IntersectionObserver fade-up ─── */
  useEffect(() => {
    const refs = [fogRef, pillarsRef, diffRef];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll<HTMLElement>('.fu').forEach((el, i) => {
              el.style.animationDelay = `${i * 0.12}s`;
              el.classList.add('animate-fade-up');
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    refs.forEach((r) => { if (r.current) observer.observe(r.current); });
    return () => observer.disconnect();
  }, []);

  /* ─── Demo effects (all reused verbatim) ─── */
  const resetDemo = () => {
    setDemoState('idle');
    setShowTradeoffsModal(false);
    setShowWaitlistModal(false);
    setCommittedViewPhase('confirmed_only');
    setAgentSheetEntered(false);
    setAgentDemoPhase('assembling');
    setAgentStrikeCount(0);
    setCommittedFooterVisible(false);
  };

  const openImpact = () => setDemoState('impact');
  const closeImpact = () => resetDemo();

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
    if (demoState !== 'impact') { setImpactAnimStep(0); return; }
    setImpactAnimStep(0);
    const timers = [1, 2, 3, 4, 5].map((step, i) =>
      setTimeout(() => setImpactAnimStep(step), IMPACT_STAGGER_INITIAL_MS + i * IMPACT_STAGGER_STEP_MS)
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
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setAgentDemoPhase('executing'), execStart),
      setTimeout(() => setAgentStrikeCount(1), execStart + AGENT_STRIKE_GAP_MS),
      setTimeout(() => setAgentStrikeCount(2), execStart + AGENT_STRIKE_GAP_MS * 2),
      setTimeout(() => setAgentStrikeCount(3), execStart + AGENT_STRIKE_GAP_MS * 3),
      setTimeout(() => setAgentDemoPhase('ready'), execStart + AGENT_STRIKE_GAP_MS * 3 + AGENT_READY_AFTER_LAST_STRIKE_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, [demoState, committedViewPhase]);

  useEffect(() => {
    if (demoState !== 'committed') { setCommittedFooterVisible(false); return; }
    if (agentDemoPhase !== 'ready') { setCommittedFooterVisible(false); return; }
    const t = setTimeout(() => setCommittedFooterVisible(true), COMMITTED_FOOTER_AFTER_READY_MS);
    return () => clearTimeout(t);
  }, [demoState, agentDemoPhase]);

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
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 48px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* Logo */}
          <span style={{ fontWeight: 700, fontSize: '22px', letterSpacing: '-0.02em', color: '#0A0A0A' }}>
            Konquer
          </span>

          {/* Waitlist badge */}
          <div
            className="hidden md:flex"
            style={{
              alignItems: 'center',
              gap: '7px',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '.08em',
              color: '#0A0A0A',
            }}
          >
            <span
              className="animate-dot-pulse"
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#0A0A0A',
              }}
            />
            <span className="animate-waitlist-blink">Waitlist Open!</span>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowWaitlistModal(true)}
              style={{
                padding: '9px 20px',
                background: '#0A0A0A',
                color: '#fff',
                border: '1px solid #0A0A0A',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '.06em',
                cursor: 'pointer',
                transition: 'background .2s, color .2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#0A0A0A'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#0A0A0A'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
            >
              Get In Now
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '120px 48px 80px',
          maxWidth: '880px',
          margin: '0 auto',
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
            color: '#5C5C5C',
            marginBottom: '36px',
          }}
        >
          Strategic Execution Intelligence™
        </p>

        {/* Animated headline */}
        <h1
          style={{
            fontSize: 'clamp(48px, 7vw, 88px)',
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            color: '#0A0A0A',
            marginBottom: '32px',
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
        </h1>

        {/* Problem paragraph */}
        <p
          className="animate-fade-up"
          style={{
            animationDelay: '1.0s',
            fontSize: 'clamp(17px, 2vw, 20px)',
            fontWeight: 300,
            lineHeight: 1.75,
            color: '#5C5C5C',
            maxWidth: '560px',
            marginBottom: '36px',
          }}
        >
          Not because they lack drive. Not because they lack intelligence.
          Because every morning, they open their tools and face the fog — a hundred
          things competing for attention, none of them clearly the right one.
        </p>

        {/* Blue reveal */}
        <p
          className="animate-fade-up"
          style={{
            animationDelay: '1.3s',
            fontSize: 'clamp(50px, 7vw, 88px)',
            fontWeight: 700,
            fontStyle: 'italic',
            lineHeight: 1.0,
            color: '#1548FF',
            letterSpacing: '-0.03em',
            marginBottom: '64px',
          }}
        >
          certainty.
        </p>

        {/* Scroll drip */}
        <a
          href="#fog"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: '#9C9C9C',
            textDecoration: 'none',
            position: 'relative',
          }}
          className="animate-fade-in"
        >
          <span
            style={{
              display: 'block',
              width: '1px',
              height: '40px',
              background: '#E4E4E4',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                background: '#9C9C9C',
                animation: 'scrollDrip 2.4s ease-in-out infinite',
              }}
            />
          </span>
          See how it works
        </a>
      </section>

      {/* ═══════════════════════════════════════════
          INTERACTIVE DEMO
      ═══════════════════════════════════════════ */}
      <section
        id="demo"
        style={{ padding: '120px 0', background: '#F7F7F7', borderTop: '1px solid #E4E4E4' }}
      >
        <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 48px' }}>
          {/* Section header */}
          <div style={{ marginBottom: '64px' }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: '#5C5C5C',
                marginBottom: '20px',
              }}
            >
              The Prescription
            </p>
            <h2
              style={{
                fontSize: 'clamp(32px, 4vw, 56px)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#0A0A0A',
                marginBottom: '16px',
              }}
            >
              Every morning you open Konquer,<br />the fog is gone.
            </h2>
            <p
              style={{
                fontSize: '17px',
                fontWeight: 300,
                color: '#5C5C5C',
              }}
            >
              One move. Auditable certainty. Every day.
            </p>
          </div>

          {/* Demo card */}
          <div className="flex justify-center">
            <div
              style={{
                background: '#fff',
                border: '1px solid #E4E4E4',
                borderRadius: '16px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                width: '100%',
                maxWidth: '560px',
                overflow: 'hidden',
              }}
            >
              {/* Browser chrome */}
              <div
                style={{
                  background: '#F7F7F7',
                  borderBottom: '1px solid #E4E4E4',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F57' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FEBC2E' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28C840' }} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#5C5C5C' }}>Today&apos;s Strategic Move</div>
                <div style={{ width: '52px' }} />
              </div>

              {/* Card body */}
              <div style={{ padding: '32px' }}>
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid #E4E4E4',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#0A0A0A', marginBottom: '10px' }}>
                      Today&apos;s Strategic Move
                    </h3>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#0A0A0A', marginBottom: '16px' }}>
                      Raise your price floor to $25K today so next quarter&apos;s pipeline is built on real margin.
                    </p>

                    {demoState !== 'impact' && (
                      <div
                        style={{
                          background: '#F7F7F7',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '20px',
                          textAlign: 'left',
                        }}
                      >
                        <p style={{ fontSize: '11px', fontWeight: 600, color: '#0A0A0A', marginBottom: '4px' }}>
                          Why this move first
                        </p>
                        <p style={{ fontSize: '11px', color: '#5C5C5C', lineHeight: 1.6 }}>
                          Every deal you close after this decision is more profitable. This single change filters out time-wasters, positions you as premium, and builds a pipeline on real margin—not volume. Make the move now, and next quarter's revenue funds growth instead of covering costs.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Committed state */}
                  {demoState === 'committed' && (
                    <div style={{ borderTop: '1px solid #E4E4E4', paddingTop: '20px' }}>
                      <div style={{ position: 'relative', minHeight: 'min(260px, 36vh)', overflow: 'hidden', borderRadius: '10px' }}>
                        <div className={COMMITTED_CARD}>
                          <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9C9C9C', marginBottom: '12px', textAlign: 'center' }}>
                            Confirmed
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #bbf7d0', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="16" height="16" fill="none" stroke="#16a34a" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#15803d' }}>Move scheduled</span>
                          </div>
                          <div style={{ background: '#F7F7F7', border: '1px solid #E4E4E4', borderRadius: '8px', padding: '10px 14px' }}>
                            <p style={{ fontSize: '11px', color: '#0A0A0A', lineHeight: 1.6 }}>
                              Calendar blocked for 2pm · Context ready · Call scheduled with Sarah
                            </p>
                          </div>
                        </div>

                        {committedViewPhase === 'agent_overlay' && (
                          <div
                            style={{
                              position: 'absolute',
                              left: 0, right: 0, bottom: 0, top: '48px',
                              zIndex: 20,
                              borderRadius: '10px 10px 0 0',
                              border: '1px solid #E4E4E4',
                              borderBottom: 'none',
                              background: '#fff',
                              padding: '12px 16px 16px',
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
                                {agentDemoPhase === 'ready' ? "Here's what the agent completed for your call." : 'Agent is preparing the call.'}
                              </p>
                              <div style={{ background: '#F7F7F7', border: '1px solid #E4E4E4', borderRadius: '8px', padding: '12px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0A0A0A' }}>Agent</span>
                                  <span
                                    style={{
                                      fontSize: '10px',
                                      fontWeight: 500,
                                      textTransform: 'uppercase',
                                      letterSpacing: '.08em',
                                      color: agentDemoPhase === 'ready' ? '#16a34a' : '#9C9C9C',
                                      transition: 'color .3s',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                    }}
                                  >
                                    {agentDemoPhase === 'assembling' && (
                                      <>
                                        <span className="inline-flex gap-0.5 motion-reduce:hidden" aria-hidden>
                                          <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                                          <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                                          <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                                        </span>
                                        <span className="animate-pulse motion-reduce:animate-none">Assembling</span>
                                      </>
                                    )}
                                    {agentDemoPhase === 'executing' && <span className="animate-pulse motion-reduce:animate-none">Executing</span>}
                                    {agentDemoPhase === 'ready' && <span>Ready</span>}
                                  </span>
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
                                          style={agentDemoPhase === 'assembling' ? { animationDelay: `${i * AGENT_ASSEMBLE_STAGGER_MS}ms` } : undefined}
                                        >
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
                        )}
                      </div>
                    </div>
                  )}

                  {/* Impact state */}
                  {demoState === 'impact' && (
                    <div style={{ borderTop: '1px solid #E4E4E4', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                          <p style={{ fontSize: '13px', fontWeight: 500, color: '#0A0A0A', lineHeight: 1.5, marginBottom: '6px' }}>$18K locked — not maybe, done.</p>
                          <p style={{ fontSize: '11px', color: '#5C5C5C', lineHeight: 1.6 }}>
                            That shift from open risk to booked revenue is the hit: your brain clears the loop, stress drops, and attention returns to the next strike.
                          </p>
                        </div>
                        <button onClick={closeImpact} style={{ fontSize: '11px', fontWeight: 500, color: '#9C9C9C', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', flexShrink: 0 }}>
                          Back
                        </button>
                      </div>

                      <div style={{ transition: 'all .7s ease-out', opacity: impactAnimStep >= 2 ? 1 : 0, transform: impactAnimStep >= 2 ? 'translateY(0)' : 'translateY(8px)' }}>
                        <div style={{ border: '1px solid #E4E4E4', borderRadius: '8px', padding: '14px 16px' }}>
                          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0A0A0A', fontVariantNumeric: 'tabular-nums' }}>{`$${impactRevenueK}K`}</div>
                          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9C9C9C', marginTop: '4px' }}>Revenue protected</div>
                          <p style={{ fontSize: '11px', color: '#5C5C5C', lineHeight: 1.6, marginTop: '8px' }}>
                            This renewal secures $18K now, so your team is not chasing replacement revenue this week.
                          </p>
                        </div>
                      </div>

                      <div style={{ transition: 'all .7s ease-out', opacity: impactAnimStep >= 3 ? 1 : 0, transform: impactAnimStep >= 3 ? 'translateY(0)' : 'translateY(8px)' }}>
                        <div style={{ border: '1px solid #E4E4E4', borderRadius: '8px', padding: '14px 16px' }}>
                          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0A0A0A' }}>12h</div>
                          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9C9C9C', marginTop: '4px' }}>Time saved</div>
                          <p style={{ fontSize: '11px', color: '#5C5C5C', lineHeight: 1.6, marginTop: '8px' }}>
                            12 hours freed immediately for higher-value execution, not recovery work.
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                          transition: 'all .7s ease-out',
                          opacity: impactAnimStep >= 4 ? 1 : 0,
                          transform: impactAnimStep >= 4 ? 'translateY(0)' : 'translateY(8px)',
                        }}
                      >
                        {[
                          { title: 'Stable', label: 'Operational pressure', body: 'With this revenue secured, day-to-day pressure drops and execution becomes calmer.' },
                          { title: 'Compounding', label: 'Next move capacity', body: 'Recovered time and reduced pressure create room for the next high-impact move.' },
                        ].map((c) => (
                          <div key={c.title} style={{ border: '1px solid #E4E4E4', borderRadius: '8px', padding: '14px 16px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0A0A0A' }}>{c.title}</div>
                            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9C9C9C', marginTop: '4px' }}>{c.label}</div>
                            <p style={{ fontSize: '11px', color: '#5C5C5C', lineHeight: 1.5, marginTop: '8px' }}>{c.body}</p>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          borderTop: '1px solid #E4E4E4',
                          paddingTop: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          transition: 'opacity .7s ease-out',
                          opacity: impactAnimStep >= 5 ? 1 : 0,
                        }}
                      >
                        <p style={{ fontSize: '11px', color: '#5C5C5C', lineHeight: 1.6 }}>
                          Konquer surfaces one decisive move and makes the value visible in outcomes you can act on today.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowWaitlistModal(true)}
                          className="btn-gel-waitlist"
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: '#0A0A0A', whiteSpace: 'nowrap', cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
                        >
                          Join Waitlist Now
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Idle buttons */}
                  {demoState === 'idle' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <button
                        onClick={() => setDemoState('committed')}
                        style={{
                          padding: '12px 32px',
                          background: '#0A0A0A',
                          color: '#fff',
                          border: '1px solid #0A0A0A',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'background .2s',
                        }}
                      >
                        Make The Move
                      </button>
                      <button
                        type="button"
                        onClick={openImpact}
                        style={{ fontSize: '13px', fontWeight: 500, color: '#5C5C5C', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}
                      >
                        See the Benefits
                      </button>
                    </div>
                  )}

                  {/* Committed footer */}
                  {demoState === 'committed' && committedFooterVisible && (
                    <div style={{ marginTop: '8px', textAlign: 'center', borderTop: '1px solid #E4E4E4', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button type="button" onClick={openImpact} style={{ fontSize: '13px', fontWeight: 500, color: '#5C5C5C', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
                        See the impact
                      </button>
                      <div>
                        <button onClick={resetDemo} style={{ fontSize: '11px', color: '#9C9C9C', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Go Back</button>
                        <span style={{ fontSize: '11px', color: '#E4E4E4', margin: '0 8px' }}>•</span>
                        <button onClick={() => setShowTradeoffsModal(true)} style={{ fontSize: '11px', color: '#9C9C9C', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Explore delay impact</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', fontWeight: 300, color: '#9C9C9C', marginTop: '32px', letterSpacing: '.04em' }}>
            You know the move. You execute. The number moves.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE FOG
      ═══════════════════════════════════════════ */}
      <section
        id="fog"
        ref={fogRef}
        style={{ padding: '120px 0', borderTop: '1px solid #E4E4E4' }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 48px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'start',
          }}
          className="fog-grid"
        >
          {/* Pull quote */}
          <blockquote
            className="fu"
            style={{
              fontSize: 'clamp(24px, 3vw, 38px)',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.4,
              color: '#0A0A0A',
              margin: 0,
              paddingRight: '40px',
              borderRight: '1px solid #E4E4E4',
            }}
          >
            "The fog isn&apos;t laziness. It isn&apos;t confusion. It&apos;s the absence of one clear signal."
          </blockquote>

          {/* Body copy */}
          <div className="fu" style={{ animationDelay: '0.12s' }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: '#5C5C5C',
                marginBottom: '24px',
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
              High performers don&apos;t fail because they don&apos;t work hard. They fail because the systems
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
              <strong style={{ fontWeight: 600, color: '#0A0A0A' }}>
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
        style={{ padding: '120px 0', borderTop: '1px solid #E4E4E4' }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px' }}>
          <p
            className="fu"
            style={{
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: '#5C5C5C',
              marginBottom: '64px',
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
                  padding: '40px',
                  borderRight: i < 2 ? '1px solid #E4E4E4' : 'none',
                  paddingLeft: i === 0 ? '0' : '40px',
                }}
              >
                <p style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '.18em', textTransform: 'uppercase', color: '#9C9C9C', marginBottom: '20px' }}>
                  {p.num}
                </p>
                <h3 style={{ fontSize: '34px', fontWeight: 700, letterSpacing: '-0.02em', color: '#0A0A0A', marginBottom: '8px', lineHeight: 1.1 }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '14px', fontWeight: 300, fontStyle: 'italic', color: '#9C9C9C', marginBottom: '20px' }}>
                  {p.sub}
                </p>
                <p style={{ fontSize: '15px', fontWeight: 300, lineHeight: 1.75, color: '#5C5C5C' }}>
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
        style={{ padding: '120px 0', background: '#F7F7F7', borderTop: '1px solid #E4E4E4' }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 48px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'start',
          }}
          className="diff-grid"
        >
          {/* Reframe copy */}
          <div className="fu">
            <p style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '.18em', textTransform: 'uppercase', color: '#5C5C5C', marginBottom: '24px' }}>
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

          {/* Contrast list */}
          <div
            className="fu"
            style={{ animationDelay: '0.12s', display: 'flex', flexDirection: 'column', gap: '0' }}
          >
            {DIFF_ITEMS.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '20px',
                  padding: '24px 0',
                  borderBottom: i < DIFF_ITEMS.length - 1 ? '1px solid #E4E4E4' : 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 400,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: i === DIFF_ITEMS.length - 1 ? '#0A0A0A' : '#9C9C9C',
                    minWidth: '64px',
                    flexShrink: 0,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: '21px',
                    fontWeight: i === DIFF_ITEMS.length - 1 ? 700 : 300,
                    color: i === DIFF_ITEMS.length - 1 ? '#0A0A0A' : '#5C5C5C',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ACCESS CTA
      ═══════════════════════════════════════════ */}
      <section
        id="access"
        style={{ padding: '140px 0', borderTop: '1px solid #E4E4E4' }}
      >
        <div
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            padding: '0 48px',
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
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#5C5C5C',
              lineHeight: 1.4,
              marginBottom: '48px',
            }}
          >
            Now you can have the certainty to match it.
          </p>

          {formSubmitted ? (
            <div>
              <p style={{ fontSize: '22px', fontWeight: 700, color: '#0A0A0A', marginBottom: '12px' }}>You&apos;re in.</p>
              <p style={{ fontSize: '15px', fontWeight: 300, color: '#5C5C5C' }}>We&apos;ll be in touch when your access is ready.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setFormSubmitted(true);
              }}
              style={{ display: 'flex', gap: '0', marginBottom: '20px' }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  fontSize: '14px',
                  fontWeight: 300,
                  border: '1px solid #E4E4E4',
                  borderRight: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  color: '#0A0A0A',
                  background: '#fff',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '14px 24px',
                  background: '#0A0A0A',
                  color: '#fff',
                  border: '1px solid #0A0A0A',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '.08em',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                Get In Now
              </button>
            </form>
          )}

          <p style={{ fontSize: '12px', fontWeight: 300, color: '#9C9C9C', letterSpacing: '.04em' }}>
            Early access only. The clock is running.
          </p>

          <p
            style={{
              fontSize: 'clamp(24px, 3.5vw, 42px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#E4E4E4',
              marginTop: '64px',
              letterSpacing: '-0.01em',
            }}
          >
            Know the move.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer
        style={{
          padding: '40px 0',
          borderTop: '1px solid #E4E4E4',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 48px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontWeight: 700, fontSize: '16px', color: '#0A0A0A', marginRight: '16px' }}>Konquer</span>
            <span style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '.14em', textTransform: 'uppercase', color: '#9C9C9C' }}>
              Strategic Execution Intelligence™
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
            padding: '24px',
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
              background: '#fff',
              borderRadius: '16px',
              padding: '40px',
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
                marginBottom: '40px',
                transition: 'all 500ms ease-out',
                opacity: tradeoffsAnimStep >= 2 ? 1 : 0,
              }}
            >
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}>If This Move Is Delayed</h3>
              <button onClick={() => setShowTradeoffsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C9C9C' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {[
                {
                  step: 3,
                  icon: (
                    <svg width="28" height="28" fill="none" stroke="#1548FF" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  iconBg: '#EEF2FF',
                  value: '$13K per deal',
                  valueColor: '#1548FF',
                  label: 'MARGIN LEFT ON TABLE',
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
                  body: 'Low-value prospects keep entering your pipeline and burning your time.',
                },
                {
                  step: 5,
                  icon: (
                    <svg width="28" height="28" fill="none" stroke="#1548FF" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  ),
                  iconBg: '#EEF2FF',
                  value: 'Commodity positioning',
                  valueColor: '#1548FF',
                  label: 'MARKET PERCEPTION',
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
                    {col.icon}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: col.valueColor, marginBottom: '4px', lineHeight: 1 }}>{col.value}</div>
                  <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9C9C9C', marginBottom: '12px' }}>{col.label}</div>
                  <p style={{ fontSize: '12px', color: '#5C5C5C', lineHeight: 1.6 }}>{col.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <WaitlistModal open={showWaitlistModal} onClose={() => setShowWaitlistModal(false)} />

      {/* ═══════════════════════════════════════════
          RESPONSIVE STYLES (injected)
      ═══════════════════════════════════════════ */}
      <style>{`
        @media (max-width: 1024px) {
          .fog-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .fog-grid blockquote { border-right: none !important; padding-right: 0 !important; border-bottom: 1px solid #E4E4E4; padding-bottom: 40px !important; }
          .pillars-grid { grid-template-columns: 1fr !important; }
          .pillars-grid > div { border-right: none !important; border-bottom: 1px solid #E4E4E4; padding: 32px 0 !important; }
          .pillars-grid > div:last-child { border-bottom: none !important; }
          .diff-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 768px) {
          section { padding: 80px 0 !important; }
          .wrap, [style*="padding: 0 48px"] { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
    </div>
  );
}
