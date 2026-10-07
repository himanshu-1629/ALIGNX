import React, { useState, useEffect } from 'react';
import { AlignxCanvas } from '../AlignxCanvas';
import { SessionResumeHud } from '../SessionResumeHud';
import { RollButton } from '../RollButton';
import { RefractionSpectrumInteractive } from '../RefractionSpectrumInteractive';
import { InteractiveOpportunityMap } from '../InteractiveOpportunityMap';
import { TrajectoryBifurcationInteractive } from '../TrajectoryBifurcationInteractive';
import Parallax from '../Parallax';
import type { AppView } from '../Header';
import type { AlignxSessionProgress } from '../../types/alignx';
import { ArrowRight, Sparkles, Sliders, MapPin, TrendingUp } from 'lucide-react';

interface CinematicFramesProps {
  onEnterApp: (view?: AppView) => void;
  sessionProgress?: AlignxSessionProgress;
  onResetSession?: () => void;
}

export const CinematicFrames: React.FC<CinematicFramesProps> = ({
  onEnterApp,
  sessionProgress,
  onResetSession
}) => {
  const [activeTab, setActiveTab] = useState<'refraction' | 'map' | 'trajectory'>('refraction');
  const [activeFrame, setActiveFrame] = useState<string>('hero');

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
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    const targets = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right'
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Frame tracker for timeline nav
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'career-parallax-narrative', 'interactive-lab', 'get-started'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.15) {
            setActiveFrame(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasSessionProgress = !!sessionProgress && (
    sessionProgress.completedStages.onboarding ||
    sessionProgress.completedStages.discovery ||
    sessionProgress.completedStages.aptitude ||
    sessionProgress.parentInputDone
  );

  return (
    <div style={{ backgroundColor: 'var(--bg-deep)', color: 'var(--text-primary)', position: 'relative' }}>
      
      {/* Streamlined Right-side Navigator */}
      <nav aria-label="Page navigation" className="scroll-timeline-nav hide-mobile">
        {[
          { id: 'hero', label: 'Overview' },
          { id: 'career-parallax-narrative', label: 'Story' },
          { id: 'interactive-lab', label: 'Simulators' },
          { id: 'get-started', label: 'Start' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => document.getElementById(f.id)?.scrollIntoView({ behavior: 'smooth' })}
            className={`timeline-dot ${activeFrame === f.id ? 'active' : ''}`}
            title={`Go to ${f.label}`}
            style={{ border: 'none', padding: 0 }}
          />
        ))}
      </nav>

      {/* ========================================================
          SECTION 1 — HERO / ENTRY (Punchy & Cinematic)
          ======================================================== */}
      <section
        id="hero"
        style={{
          minHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 48px',
          position: 'relative',
          borderBottom: '1px solid var(--border-hairline)',
          overflow: 'hidden'
        }}
      >
        {/* Background 3D Canvas */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60%',
            height: '100%',
            opacity: 0.9,
            pointerEvents: 'none',
            zIndex: 0
          }}
        >
          <AlignxCanvas scrollProgress={0.05} />
        </div>

        {/* Top Eyebrow Badge */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="titanium-badge">
            <Sparkles size={12} color="var(--accent)" />
            <span>ALIGNX INTELLIGENCE</span>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="hide-mobile">
            MULTI-DIMENSIONAL CAREER ENGINE
          </div>
        </div>

        {/* Center Headline */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '820px', marginTop: '48px', marginBottom: '48px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7vw, 6.2rem)',
              fontWeight: 700,
              lineHeight: 0.98,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              margin: '0 0 24px 0',
              textTransform: 'uppercase'
            }}
          >
            Your Future<br />
            Isn’t Linear.
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
              fontWeight: 400,
              lineHeight: 1.55,
              color: 'var(--text-secondary)',
              maxWidth: '580px',
              marginBottom: '36px'
            }}
          >
            ALIGNX connects your cognitive strengths, family budget realities, and live job market trends into a clear, high-conviction career roadmap.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
            <RollButton
              onClick={() => onEnterApp('onboarding')}
              variant="primary"
              icon={<ArrowRight size={14} />}
            >
              START ASSESSMENT
            </RollButton>

            <RollButton
              onClick={() => document.getElementById('interactive-lab')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              icon={<Sliders size={14} />}
            >
              TEST SIMULATORS
            </RollButton>
          </div>

        </div>

        {/* Bottom Metrics Bar */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid var(--border-hairline)',
            paddingTop: '20px'
          }}
        >
          <div style={{ display: 'flex', gap: '36px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                COGNITIVE AXES
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                48 Dimensions Mapped
              </div>
            </div>

            <div className="hide-mobile">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                MARKET TELEMETRY
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                14 Corridors Tracked
              </div>
            </div>

            <div className="hide-mobile">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
                SIMULATION HORIZON
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                60-Month Trajectory
              </div>
            </div>
          </div>

          <div
            onClick={() => document.getElementById('career-parallax-narrative')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.14em',
              color: 'var(--accent)'
            }}
          >
            <span>SCROLL TO EXPLORE</span>
            <span>↓</span>
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

      {/* ======================================================
          SECTION 2 — PARALLAX CINEMATIC STORY (3 Punchy Stages)
          ====================================================== */}
      <Parallax />

      {/* ========================================================
          SECTION 3 — INTERACTIVE SIMULATION LAB (User-Friendly & Engaging)
          ======================================================== */}
      <section
        id="interactive-lab"
        style={{
          padding: '80px 48px',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header & Simulator Tabs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '36px'
            }}
            className="scroll-reveal"
          >
            <div>
              <div className="titanium-badge" style={{ marginBottom: '12px' }}>
                <Sliders size={12} color="var(--accent)" />
                <span>INTERACTIVE LAB</span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-primary)',
                  margin: 0
                }}
              >
                Test the Decision Engines
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                  marginTop: '8px',
                  maxWidth: '560px'
                }}
              >
                Try the interactive models directly below. Click through to explore potential careers, market salaries, and trajectory simulations.
              </p>
            </div>

            {/* Quick Switcher Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'refraction', label: '1. Refraction Prism', icon: <Sparkles size={13} /> },
                { id: 'map', label: '2. Talent Opportunity Map', icon: <MapPin size={13} /> },
                { id: 'trajectory', label: '3. What-If 5-Year Simulator', icon: <TrendingUp size={13} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`alignx-key ${activeTab === tab.id ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.74rem' }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Interactive Component */}
          <div style={{ marginTop: '24px' }}>
            {activeTab === 'refraction' && (
              <div id="tool-refraction" className="scroll-reveal">
                <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.14em' }}>
                    SIMULATOR 01
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Drag dispersion angle to see capability refraction into frontier fields
                  </span>
                </div>
                <RefractionSpectrumInteractive />
              </div>
            )}

            {activeTab === 'map' && (
              <div id="tool-map" className="scroll-reveal">
                <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.14em' }}>
                    SIMULATOR 02
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Select tech hubs to compare starting CTC, growth velocity, and hiring companies
                  </span>
                </div>
                <InteractiveOpportunityMap />
              </div>
            )}

            {activeTab === 'trajectory' && (
              <div id="tool-whatif" className="scroll-reveal">
                <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.14em' }}>
                    SIMULATOR 03
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Toggle location, domain, and postgrad options to forecast your 5-year career curve
                  </span>
                </div>
                <TrajectoryBifurcationInteractive />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4 — GET STARTED CALL TO ACTION (Clean & Decisive)
          ======================================================== */}
      <section
        id="get-started"
        style={{
          padding: '110px 48px',
          backgroundColor: 'var(--bg-deep)',
          textAlign: 'center',
          position: 'relative'
        }}
        className="scroll-reveal"
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="titanium-badge" style={{ marginBottom: '20px' }}>
            <span>YOUR CONVICTION ROADMAP</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.038em',
              color: 'var(--text-primary)',
              marginBottom: '20px'
            }}
          >
            Ready to find your path?
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '36px'
            }}
          >
            Take the 5-minute multi-dimensional assessment. Get your personalized career DNA, parent alignment report, and 60-month career roadmap.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <RollButton
              onClick={() => onEnterApp('onboarding')}
              variant="primary"
              icon={<ArrowRight size={14} />}
            >
              START FREE ASSESSMENT
            </RollButton>

            <RollButton
              onClick={() => onEnterApp('dashboard')}
              variant="outline"
              icon={<Sparkles size={14} />}
            >
              VIEW DEMO RESULTS
            </RollButton>
          </div>
        </div>
      </section>
    </div>
  );
};
