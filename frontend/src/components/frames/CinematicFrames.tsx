import React, { useState, useEffect } from 'react';
import { AlignxCanvas } from '../AlignxCanvas';
import { SessionResumeHud } from '../SessionResumeHud';
import { RollButton } from '../RollButton';
import type { AppView } from '../Header';
import type { AlignxSessionProgress } from '../../types/alignx';
import { MARKET_SIGNALS, OPPORTUNITY_NODES, LIFE_STAGE_DATA } from '../../data/mockAlignxData';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface CinematicFramesProps {
  onEnterApp: (view?: AppView) => void;
  sessionProgress?: AlignxSessionProgress;
  onResetSession?: () => void;
}

export const CinematicFrames: React.FC<CinematicFramesProps> = ({ onEnterApp, sessionProgress, onResetSession }) => {
  const [whatIfLocation, setWhatIfLocation] = useState<'Chennai' | 'Bangalore' | 'Singapore'>('Chennai');
  const [whatIfSpec, setWhatIfSpec] = useState<'Software' | 'AI' | 'Quantitative'>('Software');
  const [whatIfHigherStudies, setWhatIfHigherStudies] = useState<boolean>(false);
  const [activeLifeStageIdx, setActiveLifeStageIdx] = useState<number>(2);


  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    const targets = document.querySelectorAll('.scroll-reveal');
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const getSimulatedScore = () => {
    let score = 84;
    if (whatIfLocation === 'Bangalore') score += 4;
    if (whatIfLocation === 'Singapore') score += 7;
    if (whatIfSpec === 'AI') score += 5;
    if (whatIfSpec === 'Quantitative') score += 6;
    if (whatIfHigherStudies) score += 3;
    return Math.min(score, 98);
  };

  // Determine if session has progress to resume
  const hasSessionProgress = !!sessionProgress && (
    sessionProgress.completedStages.onboarding ||
    sessionProgress.completedStages.discovery ||
    sessionProgress.completedStages.aptitude ||
    sessionProgress.parentInputDone
  );

  return (
    <div style={{ backgroundColor: 'var(--bg-deep)', color: 'var(--text-primary)', position: 'relative' }}>
      
      {/* ========================================================
          FRAME 01 — HERO / ENTRY
          ======================================================== */}
      <section
        id="frame-01"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 48px',
          position: 'relative',
          borderBottom: '1px solid var(--border-hairline)',
          overflow: 'hidden'
        }}
      >
        {/* Background Architectural Canvas */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '65%',
            height: '100%',
            opacity: 0.85,
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          <AlignxCanvas scrollProgress={0.05} />
        </div>

        {/* Top Technical Metadata */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--accent)' }}>
              ALIGNX / 01
            </span>
            <span style={{ height: '12px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--text-secondary)' }}>
              DECISION-INTELLIGENCE PROTOCOL
            </span>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="hide-mobile">
            COORD: 12.9716° N / 77.5946° E
          </div>
        </div>

        {/* Center Editorial Typography */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '880px', marginTop: '60px', marginBottom: '60px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.22em', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            [ MULTI-DIMENSIONAL CAREER ALIGNMENT ]
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7.5vw, 6.8rem)',
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: '-0.035em',
              color: 'var(--text-primary)',
              margin: '0 0 28px 0',
              textTransform: 'uppercase'
            }}
          >
            Your Future<br />
            Isn’t Linear.
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.1rem, 2vw, 1.45rem)',
              fontWeight: 300,
              lineHeight: 1.5,
              color: 'var(--text-secondary)',
              maxWidth: '640px',
              marginBottom: '40px'
            }}
          >
            Career intelligence for decisions that matter. ALIGNX unifies your cognitive aptitude, financial boundaries, family context, and live global market signals.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
            <RollButton
              onClick={() => onEnterApp('onboarding')}
              variant="primary"
              icon={<ArrowRight size={14} />}
            >
              BEGIN ALIGNMENT
            </RollButton>

            <RollButton
              onClick={() => document.getElementById('frame-02')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              icon={<ChevronDown size={14} />}
            >
              EXPLORE THE SYSTEM
            </RollButton>
          </div>
        </div>

        {/* Bottom Technical Indicators */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid var(--border-hairline)',
            paddingTop: '24px'
          }}
        >
          <div style={{ display: 'flex', gap: '40px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                PARADIGM
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                NEXT BEST DECISION
              </div>
            </div>

            <div className="hide-mobile">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                DIMENSIONALITY
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                5D DETERMINISTIC ENGINE
              </div>
            </div>
          </div>

          <div
            onClick={() => document.getElementById('frame-02')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.16em',
              color: 'var(--accent)'
            }}
          >
            <span>SCROLL TO EXPLORE</span>
            <span style={{ transform: 'rotate(90deg)', display: 'inline-block' }}>→</span>
          </div>
        </div>
      </section>

      {/* ======================================================
          SESSION RESUME HUD — Shown when active progress exists
          ====================================================== */}
      {hasSessionProgress && sessionProgress && onResetSession && (
        <SessionResumeHud
          progress={sessionProgress}
          onResume={(view) => onEnterApp(view)}
          onReset={onResetSession}
        />
      )}

      {/* ========================================================
          FRAME 02 — THE ALIGNMENT ENGINE
          ======================================================== */}
      <section
        id="frame-02"
        style={{
          minHeight: '100vh',
          padding: '100px 48px',
          borderBottom: '1px solid var(--border-hairline)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div className="scroll-reveal" style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: '16px' }}>
            ALIGNX / 02 — MULTI-DIMENSIONAL REFRACTION
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '64px', alignItems: 'center' }}>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  marginBottom: '28px'
                }}
              >
                VECTOR<br />
                REFRACTION.
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.15rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '24px'
                }}
              >
                A single ray of capability entering reality does not simply continue in straight simplicity. It refracts, revealing the full spectral bandwidth contained within.
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.05rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '36px'
                }}
              >
                In traditional career advice, you are given a singular job title. In ALIGNX, your raw potential is deconstructed and aligned across real-world market geometry, revealing all viable pathways and trade-offs.
              </p>

              <div
                style={{
                  borderLeft: '2px solid var(--accent)',
                  paddingLeft: '20px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  letterSpacing: '0.04em'
                }}
              >
                "GLASS + LIGHT + GEOMETRY — PREDICTABLE, MATHEMATICAL, RIGOROUS."
              </div>
            </div>

            <div style={{ height: '480px', border: '1px solid var(--border-hairline)', position: 'relative', backgroundColor: 'var(--bg-deep)' }}>
              <AlignxCanvas scrollProgress={0.4} />
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '20px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.12em',
                  color: 'var(--text-muted)'
                }}
              >
                FIG 2.1 — REFRACTIVE DECOMPOSITION OF STUDENT CAPABILITY
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          FRAME 03 — WHO ARE YOU?
          ======================================================== */}
      <section
        id="frame-03"
        style={{
          minHeight: '100vh',
          padding: '100px 48px',
          borderBottom: '1px solid var(--border-hairline)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-deep)'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: '16px' }}>
            ALIGNX / 03 — COGNITIVE TELEMETRY
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '60px', alignItems: 'center' }} className="responsive-stack">
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
                  fontWeight: 800,
                  lineHeight: 0.9,
                  letterSpacing: '-0.04em',
                  textTransform: 'uppercase'
                }}
              >
                WHO<br />
                ARE<br />
                YOU?
              </h2>

              <p style={{ marginTop: '32px', fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Not your test rank or syllabus percentage. But the innate cognitive architecture with which you process abstraction, risk, and problem density.
              </p>
            </div>

            {/* Architectural Data Composition (NOT generic cards) */}
            <div
              style={{
                borderLeft: '1px solid var(--border-hairline)',
                paddingLeft: '48px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px'
              }}
            >
              {[
                { label: 'APTITUDE', value: '82', metric: '/ 100', note: 'Abstract spatial & algorithmic decomposition' },
                { label: 'INTEREST', value: '74', metric: '/ 100', note: 'Deep inclination towards hardware-software synthesis' },
                { label: 'ASPIRATION', value: '91', metric: '/ 100', note: 'Ambition to build core technological infrastructure' },
                { label: 'RISK TOLERANCE', value: '43', metric: '/ 100', note: 'Prudent preference for bounded downside bets' },
                { label: 'MOBILITY', value: 'HIGH', metric: 'GLOBAL', note: 'Willingness to relocate across national & APAC hubs' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    borderBottom: '1px solid var(--border-hairline)',
                    paddingBottom: '16px'
                  }}
                >
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.14em', color: 'var(--text-secondary)' }}>
                      {item.label}
                    </span>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {item.note}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2.4rem',
                        fontWeight: 700,
                        color: idx === 0 || idx === 2 ? 'var(--accent)' : 'var(--text-primary)',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {item.value}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                      {item.metric}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          FRAME 04 — YOUR PROFILE
          ======================================================== */}
      <section
        id="frame-04"
        style={{
          minHeight: '100vh',
          padding: '100px 48px',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: '16px' }}>
            ALIGNX / 04 — INTEGRATED TOPOLOGY
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}
          >
            YOU ARE MORE<br />
            THAN A SCORE.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              maxWidth: '780px',
              marginBottom: '48px',
              fontWeight: 300
            }}
          >
            Your capabilities, interests, ambitions, and constraints shape different possibilities. We assemble them into an interconnected vector profile.
          </p>

          {/* Connected Matrix Diagram */}
          <div
            style={{
              border: '1px solid var(--border-hairline)',
              padding: '48px',
              backgroundColor: 'var(--bg-deep)',
              position: 'relative'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '32px',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <div style={{ border: '1px solid var(--border-subtle)', padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.14em' }}>
                  NODE 01
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, marginTop: '8px' }}>
                  APTITUDE (82)
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Algorithmic logic, spatial kinematics, structured decomposition.
                </div>
              </div>

              <div style={{ border: '1px solid var(--accent-border)', padding: '24px', backgroundColor: 'var(--accent-dim)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.14em' }}>
                  CENTRAL NODE
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, marginTop: '8px', color: 'var(--text-primary)' }}>
                  PROFILE MATRIX
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '8px' }}>
                  Harmonized student vector feeding into the Decision Engine.
                </div>
              </div>

              <div style={{ border: '1px solid var(--border-subtle)', padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.14em' }}>
                  NODE 02
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, marginTop: '8px' }}>
                  ASPIRATION (91)
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Frontier technology infrastructure and high intellectual leverage.
                </div>
              </div>

              <div style={{ border: '1px solid var(--border-subtle)', padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.14em' }}>
                  NODE 03
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, marginTop: '8px' }}>
                  VALUES (78)
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Meritocratic growth, deep craftsmanship, transparent outcomes.
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-muted)'
              }}
            >
              <span>[ TOPOLOGY: MULTI-AXIS VECTOR COUPLING ]</span>
              <span>CONFIDENCE: 94.2%</span>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          FRAME 05 — REALITY
          ======================================================== */}
      <section
        id="frame-05"
        style={{
          minHeight: '100vh',
          padding: '100px 48px',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-deep)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: '16px' }}>
            ALIGNX / 05 — THE DUAL-PLANE INTERSECTION
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center' }} className="responsive-stack">
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)',
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  marginBottom: '24px'
                }}
              >
                POTENTIAL<br />
                × REALITY.
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.15rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '24px'
                }}
              >
                A theoretical passion without financial viability leads to debt distress. A safe job without aptitude alignment leads to burnout.
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.05rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7
                }}
              >
                ALIGNX maps your real-world boundary conditions directly onto your theoretical trajectory:
              </p>
            </div>

            {/* Boundary Constraints Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'FAMILY COHESION', val: '88%', desc: 'Parental expectation alignment' },
                { label: 'BUDGET CEILING', val: '₹18L', desc: 'Max annual academic capital' },
                { label: 'LOCATION FLEX', val: 'DOMESTIC + APAC', desc: 'Acceptable geographic radius' },
                { label: 'TIME HORIZON', val: '48 MOS', desc: 'Time to required self-sufficiency' },
                { label: 'RISK TOLERANCE', val: 'BOUNDED', desc: 'Protection against zero-sum outcomes' },
                { label: 'INSTITUTION ACCESS', val: 'TIER-1 / TIER-2', desc: 'Entrance test qualification probability' },
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid var(--border-hairline)',
                    padding: '20px',
                    backgroundColor: 'var(--bg-surface)'
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
                    {c.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, margin: '8px 0 4px', color: 'var(--text-primary)' }}>
                    {c.val}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {c.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          FRAME 06 — THE WORLD
          ======================================================== */}
      <section
        id="frame-06"
        style={{
          minHeight: '100vh',
          padding: '100px 48px',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: '16px' }}>
            ALIGNX / 06 — MACRO SIGNALS
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 4.8rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}
          >
            THE WORLD<br />
            DOESN’T STAND STILL.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: '750px',
              marginBottom: '48px',
              fontWeight: 300
            }}
          >
            Syllabi update every decade. Markets shift every quarter. ALIGNX streams macro talent shortage signals and industrial capital flows.
          </p>

          {/* Architectural Data Wall (Restrained, Editorial, NOT generic cards) */}
          <div
            style={{
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-deep)'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
                padding: '16px 24px',
                borderBottom: '1px solid var(--border-hairline)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.12em'
              }}
              className="data-wall-header"
            >
              <span>STRATEGIC SECTOR</span>
              <span>GROWTH VELOCITY</span>
              <span>TALENT SHORTAGE</span>
              <span>KEY INDUSTRIAL HUBS</span>
            </div>

            {MARKET_SIGNALS.map((signal, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
                  padding: '20px 24px',
                  borderBottom: idx === MARKET_SIGNALS.length - 1 ? 'none' : '1px solid var(--border-hairline)',
                  alignItems: 'center',
                  fontFamily: 'var(--font-body)'
                }}
                className="data-wall-row"
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {signal.sector}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {signal.driver}
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: 'var(--accent)'
                    }}
                  >
                    ↑ {signal.growthPercent}%
                  </span>
                </div>

                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.08em',
                      padding: '4px 8px',
                      border: '1px solid var(--border-subtle)',
                      color: signal.talentShortage === 'Critical' ? 'var(--accent)' : 'var(--text-secondary)'
                    }}
                  >
                    {signal.talentShortage}
                  </span>
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {signal.keyHubs.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================
          FRAME 07 — OPPORTUNITY MAP
          ======================================================== */}
      <section
        id="frame-07"
        style={{
          minHeight: '100vh',
          padding: '100px 48px',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-deep)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: '16px' }}>
            ALIGNX / 07 — SPATIAL DENSITY
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase'
                }}
              >
                OPPORTUNITY<br />
                MAP.
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
                SKILL → LOCATION → INDUSTRY → OPPORTUNITY
              </p>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              MAPPING 8 STRATEGIC TECH HUBS ACROSS INDIA & GLOBAL CORRIDORS
            </div>
          </div>

          {/* Abstract Coordinate Map Grid */}
          <div
            style={{
              height: '460px',
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-surface)',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="architectural-grid"
          >
            {/* Map Node Pins */}
            {OPPORTUNITY_NODES.map((node, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${node.coordinates.x}%`,
                  top: `${node.coordinates.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: 'var(--accent)',
                      border: '2px solid var(--text-primary)',
                      transform: 'rotate(45deg)'
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: 'rgba(7, 19, 29, 0.88)',
                      border: '1px solid var(--border-subtle)',
                      padding: '4px 10px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {node.city.toUpperCase()}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)' }}>
                      ₹{node.avgStartingCtcLakhs}L AVG CTC
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.12em'
              }}
            >
              SPATIAL ARBITRAGE: REAL-TIME COST-OF-LIVING TO YIELD COEFFICIENT
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          FRAME 08 — YOU × REALITY × WORLD
          ======================================================== */}
      <section
        id="frame-08"
        style={{
          minHeight: '100vh',
          padding: '100px 48px',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '1000px', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: '20px' }}>
            ALIGNX / 08 — THE CONVERGENCE
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '24px',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(1rem, 2.5vw, 1.8rem)',
              letterSpacing: '0.14em',
              color: 'var(--text-secondary)',
              marginBottom: '32px'
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>YOU</span>
            <span style={{ color: 'var(--accent)' }}>×</span>
            <span style={{ color: 'var(--text-primary)' }}>REALITY</span>
            <span style={{ color: 'var(--accent)' }}>×</span>
            <span style={{ color: 'var(--text-primary)' }}>WORLD</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              marginBottom: '32px'
            }}
          >
            YOUR<br />
            NEXT MOVE.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 40px',
              fontWeight: 300
            }}
          >
            When internal potential intersects external constraints and industrial demand, ambiguity collapses into clear, actionable decisions.
          </p>

          <button
            onClick={() => onEnterApp('dashboard')}
            className="btn-alignx-primary"
          >
            <span>VIEW RECOMMENDATION ENGINE</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </section>


      {/* ========================================================
          FRAME 09 — DECISION
          ======================================================== */}
      <section
        id="frame-09"
        style={{
          minHeight: '100vh',
          padding: '100px 48px',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-deep)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: '16px' }}>
            DECISION / 01
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: '-0.035em',
              textTransform: 'uppercase',
              marginBottom: '54px'
            }}
          >
            SO, WHAT NOW?
          </h2>

          {/* Three Branching Pathways (Architectural lines, not generic cards) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px'
            }}
          >
            {[
              {
                title: 'SPECIALIZE',
                subtitle: 'DEEPEN VERTICAL MASTERY',
                desc: 'Double down on high-scarcity technical niches (e.g. Edge ML, Physical Synthesis) to capture top 5% compensation early.',
                tag: 'RECOMMENDED STRATEGY',
                risk: 'MODERATE RISK • HIGH UPSIDE'
              },
              {
                title: 'STUDY',
                subtitle: 'ACADEMIC CAPITALIZATION',
                desc: 'Pursue specialized M.Tech / M.S. or dual-degree pathways with targeted research fellowships and international mobility.',
                tag: 'LONG-HORIZON LEVERAGE',
                risk: 'LOW RISK • CAPITAL INTENSIVE'
              },
              {
                title: 'SWITCH',
                subtitle: 'INTERDISCIPLINARY PIVOT',
                desc: 'Bridge foundational engineering skills with finance or product strategy (e.g. Quant Risk, Systems Product Management).',
                tag: 'HIGH ARBITRAGE',
                risk: 'ELEVATED RISK • DIVERGENT YIELD'
              }
            ].map((path, idx) => (
              <div
                key={idx}
                style={{
                  border: idx === 0 ? '1px solid var(--accent)' : '1px solid var(--border-hairline)',
                  padding: '36px',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '320px'
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.14em', color: idx === 0 ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {path.tag}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, margin: '14px 0 6px', color: 'var(--text-primary)' }}>
                    {path.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    {path.subtitle}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {path.desc}
                  </p>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--border-hairline)',
                    paddingTop: '16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em'
                  }}
                >
                  {path.risk}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================
          FRAME 10 — WHAT-IF SIMULATION PREVIEW
          ======================================================== */}
      <section
        id="frame-10"
        style={{
          minHeight: '100vh',
          padding: '100px 48px',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: '16px' }}>
            ALIGNX / 10 — REAL-TIME TRAJECTORY SIMULATOR
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}
          >
            WHAT-IF<br />
            SIMULATION.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: '780px',
              marginBottom: '40px',
              fontWeight: 300
            }}
          >
            Change a single variable and watch the downstream trajectory transform. No career advice should ever be static.
          </p>

          {/* Interactive Simulation Console */}
          <div
            style={{
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-deep)',
              padding: '40px'
            }}
          >
            {/* Interactive Toggle Controls */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '24px',
                borderBottom: '1px solid var(--border-hairline)',
                paddingBottom: '32px',
                marginBottom: '36px'
              }}
            >
              {/* Location Toggle */}
              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.12em', display: 'block', marginBottom: '12px' }}>
                  VARIABLE 01: LOCATION
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['Chennai', 'Bangalore', 'Singapore'] as const).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setWhatIfLocation(loc)}
                      style={{
                        padding: '10px 14px',
                        backgroundColor: whatIfLocation === loc ? 'var(--accent)' : 'var(--bg-surface)',
                        color: whatIfLocation === loc ? '#FFFFFF' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialization Toggle */}
              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.12em', display: 'block', marginBottom: '12px' }}>
                  VARIABLE 02: SPECIALIZATION
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['Software', 'AI', 'Quantitative'] as const).map((spec) => (
                    <button
                      key={spec}
                      onClick={() => setWhatIfSpec(spec)}
                      style={{
                        padding: '10px 14px',
                        backgroundColor: whatIfSpec === spec ? 'var(--accent)' : 'var(--bg-surface)',
                        color: whatIfSpec === spec ? '#FFFFFF' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Higher Studies Toggle */}
              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.12em', display: 'block', marginBottom: '12px' }}>
                  VARIABLE 03: POSTGRAD / MS
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[false, true].map((val) => (
                    <button
                      key={String(val)}
                      onClick={() => setWhatIfHigherStudies(val)}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: whatIfHigherStudies === val ? 'var(--accent)' : 'var(--bg-surface)',
                        color: whatIfHigherStudies === val ? '#FFFFFF' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {val ? 'M.S. / M.Tech (+2 Yrs)' : 'Direct Work'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated Live Pathway Result */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr',
                gap: '40px',
                alignItems: 'center'
              }}
              className="responsive-stack"
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: '8px' }}>
                  LIVE MORPHING PATHWAY
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600 }}>
                    B.TECH CSE
                  </span>
                  <span style={{ color: 'var(--accent)' }}>↓</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--accent)' }}>
                    {whatIfSpec === 'AI' ? 'NEURAL COMPUTE' : whatIfSpec === 'Quantitative' ? 'QUANT SYSTEMS' : 'SOFTWARE PLATFORMS'}
                  </span>
                  <span style={{ color: 'var(--accent)' }}>↓</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600 }}>
                    {whatIfLocation.toUpperCase()}
                  </span>
                </div>

                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '16px', lineHeight: 1.6 }}>
                  {whatIfLocation === 'Singapore' 
                    ? 'Global APAC jurisdiction yields 2.4x compensation multiplier with elevated initial relocation hurdle.'
                    : whatIfLocation === 'Bangalore'
                    ? 'Dense Tier-1 engineering ecosystem with peak startup and venture optionality.'
                    : 'Balanced living cost index with strong deeptech & hardware manufacturing cluster alignment.'}
                </p>
              </div>

              {/* Dynamic Score Indicator */}
              <div
                style={{
                  border: '1px solid var(--accent-border)',
                  backgroundColor: 'var(--accent-dim)',
                  padding: '28px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.14em' }}>
                  COMPUTED ALIGNX SCORE
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0' }}>
                  {getSimulatedScore()}%
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  ESTIMATED INITIAL YIELD: ₹{whatIfLocation === 'Singapore' ? '34L' : whatIfSpec === 'AI' ? '18L' : '14L'} CTC
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          FRAME 11 — LIFE STAGES
          ======================================================== */}
      <section
        id="frame-11"
        style={{
          minHeight: '100vh',
          padding: '100px 48px',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-deep)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: '16px' }}>
            ALIGNX / 11 — STAGE-AWARE INTELLIGENCE
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              marginBottom: '40px'
            }}
          >
            LIFE STAGES.
          </h2>

          {/* Interactive Life Stage Selector */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-hairline)',
              overflowX: 'auto',
              marginBottom: '40px'
            }}
          >
            {LIFE_STAGE_DATA.map((stage, idx) => (
              <button
                key={stage.stage}
                onClick={() => setActiveLifeStageIdx(idx)}
                style={{
                  padding: '16px 28px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeLifeStageIdx === idx ? '2px solid var(--accent)' : '2px solid transparent',
                  color: activeLifeStageIdx === idx ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {stage.label.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Active Stage Editorial Presentation */}
          <div
            style={{
              border: '1px solid var(--border-hairline)',
              padding: '48px',
              backgroundColor: 'var(--bg-surface)'
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.16em', marginBottom: '12px' }}>
              CURRENT FOCUS: {LIFE_STAGE_DATA[activeLifeStageIdx].label.toUpperCase()}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3.4rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: '24px',
                color: 'var(--text-primary)'
              }}
            >
              "{LIFE_STAGE_DATA[activeLifeStageIdx].question}"
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="responsive-stack">
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  DECISION HORIZON
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {LIFE_STAGE_DATA[activeLifeStageIdx].context}
                </p>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  KEY ARTIFACTS GENERATED
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--accent)', lineHeight: 1.6 }}>
                  {LIFE_STAGE_DATA[activeLifeStageIdx].deliverable}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          FRAME 12 — ALIGNX SYSTEM
          ======================================================== */}
      <section
        id="frame-12"
        style={{
          minHeight: '100vh',
          padding: '100px 48px',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--accent)', marginBottom: '16px' }}>
            ALIGNX / 12 — THE COMPLETE ARCHITECTURE
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              marginBottom: '48px'
            }}
          >
            THE ALIGNX SYSTEM.
          </h2>

          {/* End-to-end Step Cascade */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px'
            }}
          >
            {[
              { num: '01', title: 'YOU', sub: 'Psychometrics & Core Aptitude' },
              { num: '02', title: 'ASSESSMENT', sub: 'Cognitive Dilemma Scoring' },
              { num: '03', title: 'REALITY', sub: 'Family Budget & Risk Solver' },
              { num: '04', title: 'MARKET', sub: 'Live Talent Scarcity Signals' },
              { num: '05', title: 'OPTIONS', sub: 'Cross-Disciplinary Pathways' },
              { num: '06', title: 'SIMULATE', sub: 'Parameter Stress Testing' },
              { num: '07', title: 'DECISION', sub: 'Next Best Immediate Move' },
              { num: '08', title: 'ROADMAP', sub: 'Milestones & Exams Blueprint' },
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--border-hairline)',
                  padding: '24px',
                  backgroundColor: 'var(--bg-deep)'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)' }}>
                  {step.num}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, margin: '8px 0 4px', color: 'var(--text-primary)' }}>
                  {step.title}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {step.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================
          FRAME 13 — QUIET MOMENT
          ======================================================== */}
      <section
        id="frame-13"
        style={{
          minHeight: '85vh',
          padding: '120px 48px',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: '#050D14', // Deepest quiet charcoal
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '850px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '32px' }}>
            ALIGNX / 13 — REFLECTION
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              marginBottom: '32px'
            }}
          >
            THERE IS NO<br />
            SINGLE FUTURE.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.4rem',
              color: 'var(--text-secondary)',
              fontWeight: 300,
              lineHeight: 1.6
            }}
          >
            "There are possibilities. Shaped by intelligence, constrained by reality, and realized by decisive execution."
          </p>
        </div>
      </section>


      {/* ========================================================
          FRAME 14 — FINAL CTA
          ======================================================== */}
      <section
        id="frame-14"
        style={{
          minHeight: '100vh',
          padding: '80px 48px',
          backgroundColor: 'var(--bg-deep)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '80%', opacity: 0.6, pointerEvents: 'none' }}>
          <AlignxCanvas scrollProgress={0.85} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', color: 'var(--accent)' }}>
            ALIGNX / 14 — COMMENCE EXPLORATION
          </span>
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '60px 0' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7vw, 6.2rem)',
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.035em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              marginBottom: '32px'
            }}
          >
            EXPLORE<br />
            YOUR POSSIBILITIES.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '40px',
              fontWeight: 300
            }}
          >
            Begin your personalized career intelligence diagnostics now. Walk through discovery, evaluate your aptitude, model parent realities, and run the What-If simulation.
          </p>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onEnterApp('onboarding')}
              className="btn-alignx-primary"
            >
              <span>ENTER ALIGNX →</span>
            </button>

            <button
              onClick={() => onEnterApp('dashboard')}
              className="btn-alignx-outline"
            >
              <span>RECOMMENDATION DASHBOARD</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            borderTop: '1px solid var(--border-hairline)',
            paddingTop: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            ALIGNX — CAREER DECISION INTELLIGENCE SYSTEM / 2026
          </div>
          <div>
            DESIGNED & DEVELOPED FOR DATAQUEST 3.0
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .responsive-stack {
            grid-template-columns: 1fr !important;
          }
          .hide-mobile {
            display: none !important;
          }
          .data-wall-header {
            display: none !important;
          }
          .data-wall-row {
            grid-template-columns: 1fr !important;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};
