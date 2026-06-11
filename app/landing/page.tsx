'use client';

/**
 * Konquer — Landing Page
 * Strategic Execution Intelligence™
 *
 * Design philosophy: Luxury editorial meets surgical precision.
 * Black on white. Maximum negative space. Typography does all the work.
 * Color appears exactly once.
 */

import React, { useState, useEffect, useRef } from 'react';
import styles from './landing.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MetricProps {
  label: string;
  value: string;
}

interface PillarProps {
  number: string;
  title: string;
  sub: string;
  body: string;
  delay?: string;
}

interface DiffStatementProps {
  label: string;
  text: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Metric({ label, value }: MetricProps) {
  return (
    <div className={styles.cardMetric}>
      <p className={styles.cardMetricLabel}>{label}</p>
      <p className={styles.cardMetricValue}>{value}</p>
    </div>
  );
}

function Pillar({ number, title, sub, body, delay }: PillarProps) {
  const delayClass = delay === '1' ? styles.delay1 : delay === '2' ? styles.delay2 : '';
  return (
    <div className={`${styles.pillar} ${styles.fadeUp} ${delayClass}`}>
      <p className={styles.pillarNumber}>{number}</p>
      <h3 className={styles.pillarTitle}>{title}</h3>
      <p className={styles.pillarSub}>{sub}</p>
      <p className={styles.pillarText}>{body}</p>
    </div>
  );
}

function DiffStatement({ label, text }: DiffStatementProps) {
  return (
    <div className={styles.diffStatement}>
      <p className={styles.diffStatementLabel}>{label}</p>
      <p className={styles.diffStatementText}>{text}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function KonquerLanding(): React.JSX.Element {
  const [isScrolled, setIsScrolled]       = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [email, setEmail]                 = useState<string>('');
  const observerRef                       = useRef<IntersectionObserver | null>(null);

  // Load Google Fonts + attach scroll/intersection listeners
  useEffect(() => {
    // Fonts
    if (!document.getElementById('konquer-fonts')) {
      const preA = document.createElement('link');
      preA.rel = 'preconnect';
      preA.href = 'https://fonts.googleapis.com';

      const preB = document.createElement('link');
      preB.rel = 'preconnect';
      preB.href = 'https://fonts.gstatic.com';
      preB.crossOrigin = 'anonymous';

      const link = document.createElement('link');
      link.id   = 'konquer-fonts';
      link.rel  = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500&display=swap';

      document.head.append(preA, preB, link);
    }

    // Scroll — nav border
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Fade-up on scroll
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Small delay so DOM is painted
    const timer = setTimeout(() => {
      document.querySelectorAll(`.${styles.fadeUp}`).forEach((el) => {
        observerRef.current?.observe(el);
      });
    }, 50);

    return () => {
      window.removeEventListener('scroll', onScroll);
      observerRef.current?.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const scrollToAccess = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={styles.page}>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className={`${styles.nav} ${isScrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <a href="#" className={styles.navWordmark}>Konquer</a>
          <span className={styles.navCenter}>Know the Move.</span>
          <a href="#access" onClick={scrollToAccess} className={styles.navCta}>
            The window is open. Get in. →
          </a>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroInner}>
          <p className={`${styles.eyebrow} ${styles.heroEyebrow}`}>
            Strategic Execution Intelligence™
          </p>

          <h1 className={styles.heroHeadline}>
            Most people working hard<br />
            are working on the wrong things.
          </h1>

          <p className={styles.heroSub}>
            Not because they lack drive. Because no system has ever told them —
            with certainty, with proof, with live data behind it — which single
            action moves their number the most right now.
          </p>

          {/* The one blue moment */}
          <p className={styles.heroReveal}>certainty.</p>
        </div>

        <a
          href="#fog"
          className={styles.heroScroll}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('fog')?.scrollIntoView({ behavior: 'smooth' });
          }}
          aria-label="Scroll down"
        >
          <span className={styles.heroScrollLine} />
        </a>
      </section>

      <div className={styles.rule} />

      {/* ── THE FOG ─────────────────────────────────────────────────────────── */}
      <section className={styles.section} id="fog">
        <div className={styles.container}>
          <div className={styles.fogGrid}>

            <blockquote className={`${styles.fogStatement} ${styles.fadeUp}`}>
              "The fog isn&rsquo;t laziness.<br />
              It isn&rsquo;t lack of strategy.<br />
              It is the natural result of running a business with no instrument
              that tells you what matters most right now."
            </blockquote>

            <div className={`${styles.fogCopy} ${styles.fadeUp} ${styles.delay1}`}>
              <p>You know what you want. The goal is clear. The drive is real.</p>
              <p>
                What isn&rsquo;t clear — what has{' '}
                <span className={styles.fogEmphasis}>never</span> been clear —
                is which action closes the gap today.
              </p>
              <p>
                So you work. You fill the hours with everything that seems important.
                The meeting that felt urgent. The content you thought would land. The
                proposal you rewrote for the third time. You move fast and stay busy.
              </p>
              <p>
                And at the end of the week{' '}
                <span className={styles.fogEmphasis}>the number is the same.</span>
              </p>
              <p>
                That is not a discipline problem. That is not a strategy problem.
                That is a <span className={styles.fogEmphasis}>clarity problem</span> —
                and it is the most expensive problem a growing business can have.
              </p>
            </div>

          </div>
        </div>
      </section>

      <div className={styles.rule} />

      {/* ── THE PRESCRIPTION ────────────────────────────────────────────────── */}
      <section className={styles.section} id="prescription">
        <div className={styles.containerMedium}>

          <div className={`${styles.productHeader} ${styles.fadeUp}`}>
            <p className={`${styles.eyebrow} ${styles.productHeaderEyebrow}`}>
              The Prescription
            </p>
            <p className={styles.productStatement}>
              Every morning you open Konquer,<br />the fog is gone.
            </p>
          </div>

          {/* Mock Konquer Card */}
          <div className={`${styles.cardDemo} ${styles.fadeUp} ${styles.delay1}`}>

            <div className={styles.cardHeader}>
              <span className={styles.cardLabel}>Today&rsquo;s Revenue Action</span>
              <span className={styles.cardScore}>
                Action Score
                <span className={styles.cardScoreValue}>94</span>
              </span>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.cardMove}>
                Call Marcus Chen before 11am to close his proposal.
              </p>

              <div className={styles.cardMetrics}>
                <Metric label="Expected Impact" value="$18,400" />
                <Metric label="Time Required"   value="30 min" />
                <Metric label="Window Closes"   value="4 hrs" />
              </div>

              <p className={styles.cardReasoning}>
                <span className={styles.cardReasoningStrong}>
                  Why this move scored highest:
                </span>{' '}
                Pipeline velocity shows Marcus is in a 72-hour decision window. Three
                prior signals — email open rate, last call duration, proposal view time
                — indicate readiness. Delay beyond today drops close probability by 34%.
              </p>
            </div>

            <div className={styles.cardFooter}>
              <button className={styles.cardBtnGhost} type="button">
                See full reasoning →
              </button>
              <button className={styles.cardBtnPrimary} type="button">
                Mark complete
              </button>
            </div>

          </div>

          <p className={`${styles.cardFootnote} ${styles.fadeUp} ${styles.delay2}`}>
            One move. Auditable certainty. Every day.
          </p>

        </div>
      </section>

      <div className={styles.rule} />

      {/* ── THREE PILLARS ───────────────────────────────────────────────────── */}
      <section className={styles.section} id="pillars">
        <div className={styles.container}>

          <div className={`${styles.pillarsHeader} ${styles.fadeUp}`}>
            <p className={`${styles.eyebrow} ${styles.pillarsHeaderEyebrow}`}>
              What Konquer sells
            </p>
            <p className={styles.pillarsHeaderHeadline}>
              Three things most entrepreneurs spend their entire careers chasing.
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            <Pillar
              number="01"
              title="Certainty"
              sub="removes the fog"
              body="The cognitive elimination of doubt. Not a suggestion — a prescription.
                    Auditable reasoning behind every Revenue Action. Every platform you've
                    ever used showed you what happened. Konquer tells you what to do next."
            />
            <Pillar
              number="02"
              title="Confidence"
              sub="converts certainty into motion"
              body="There is a quiet cost to not knowing. It lives underneath every decision
                    you make. It slows you down without you noticing. When the data is behind
                    it and the reasoning is visible, the background check stops running.
                    You move faster. You decide cleaner."
              delay="1"
            />
            <Pillar
              number="03"
              title="Identity"
              sub="what accumulates over time"
              body="What accumulates over repeated cycles of knowing and executing. You stop
                    being someone who works hard. You become someone who executes precisely.
                    Those are different people. They build different businesses. They live
                    different lives."
              delay="2"
            />
          </div>

        </div>
      </section>

      <div className={styles.rule} />

      {/* ── THE DIFFERENCE ──────────────────────────────────────────────────── */}
      <section className={styles.section} id="difference">
        <div className={styles.container}>
          <div className={styles.diffGrid}>

            <blockquote className={`${styles.diffQuote} ${styles.fadeUp}`}>
              &ldquo;Every tool you&rsquo;ve used was built for a world that needed
              more data. Konquer was built for the world that already has too much
              of it.&rdquo;
            </blockquote>

            <div className={`${styles.fadeUp} ${styles.delay1}`}>
              <div className={styles.diffStatements}>
                <DiffStatement label="Not this" text="A chatbot that answers when asked." />
                <DiffStatement label="Not this" text="A dashboard you have to interpret." />
                <DiffStatement label="Not this" text="A recommendation you hope you got right." />
                <DiffStatement label="This"     text="A system that already knows what you need." />
              </div>
              <p className={styles.diffCoda}>
                One requires you to know what to ask.<br />
                The other already knows the answer.
              </p>
            </div>

          </div>
        </div>
      </section>

      <div className={styles.rule} />

      {/* ── ACCESS / CTA ────────────────────────────────────────────────────── */}
      <section className={styles.access} id="access">
        <div className={styles.accessInner}>

          <div className={styles.fadeUp}>
            <p className={styles.accessHeadline}>You&rsquo;ve always had the capability.</p>
            <p className={styles.accessSub}>Now you can have the certainty to match it.</p>
          </div>

          {!formSubmitted ? (
            <div className={`${styles.fadeUp} ${styles.delay1}`}>
              <form className={styles.accessForm} onSubmit={handleSubmit} noValidate>
                <input
                  type="email"
                  className={styles.accessInput}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className={`${styles.accessBtn} btn-gel-waitlist btn-gel-waitlist-animated`}
                >
                  Get in now →
                </button>
              </form>
              <p className={styles.accessNote}>
                Early access only. The clock is running.
              </p>
            </div>
          ) : (
            <div className={`${styles.accessConfirm} ${styles.fadeUp}`}>
              <p className={styles.accessConfirmHeadline}>You&rsquo;re in.</p>
              <p className={styles.accessConfirmSub}>
                We&rsquo;ll be in touch before the gap widens.
              </p>
            </div>
          )}

          <p className={`${styles.accessTagline} ${styles.fadeUp} ${styles.delay2}`}>
            Know the move.
          </p>

        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLeft}>
            <span className={styles.footerWordmark}>Konquer</span>
            <span className={styles.footerCategory}>Strategic Execution Intelligence™</span>
          </div>
          <p className={styles.footerCopy}>&copy; 2025 Konquer. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
