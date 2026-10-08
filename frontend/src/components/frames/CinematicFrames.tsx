import React, { useState, useEffect } from 'react';
import type { AppView } from '../Header';
import type { AlignxSessionProgress } from '../../types/alignx';
import { AuthenticCompass } from '../common/AuthenticCompass';
import { EquilibriumRadar3D } from '../common/EquilibriumRadar3D';

interface CinematicFramesProps {
  onEnterApp: (view?: AppView) => void;
  sessionProgress?: AlignxSessionProgress;
  onResetSession?: () => void;
}

export const CinematicFrames: React.FC<CinematicFramesProps> = ({
  onEnterApp,
  sessionProgress: _sessionProgress,
  onResetSession: _onResetSession
}) => {
  // Scroll telemetry for the split wordmark and compass rotation across the first 700px
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute Wordmark translation & Astrolabe rotation across the first 700px of scroll
  const heroProgress = Math.min(1, Math.max(0, scrollY / 700));
  const wordmarkSpreadVw = heroProgress * 15; // 0 to 15vw
  const astrolabeRotationDeg = heroProgress * 180; // 0 to 180 deg

  const catalogItems = [
    {
      ref: 'ALX-AI-01',
      title: 'AI & Distributed Systems Engineer',
      domain: 'AI & Data Science',
      capital: '₹16.5L',
      salary: '₹18.0L',
      growth: '+24.6%',
      status: 'CALIBRATED'
    },
    {
      ref: 'ALX-BM-02',
      title: 'Biomedical & MedTech Systems Specialist',
      domain: 'Biotech & Health',
      capital: '₹14.2L',
      salary: '₹13.5L',
      growth: '+18.4%',
      status: 'CALIBRATED'
    },
    {
      ref: 'ALX-QA-03',
      title: 'Quantum Computing & Algorithms Researcher',
      domain: 'Deep Tech & Physics',
      capital: '₹19.0L',
      salary: '₹22.0L',
      growth: '+31.2%',
      status: 'CALIBRATED'
    },
    {
      ref: 'ALX-AV-04',
      title: 'Aerospace & Avionics Systems Architect',
      domain: 'Hardware & Robotics',
      capital: '₹17.8L',
      salary: '₹15.0L',
      growth: '+16.8%',
      status: 'CALIBRATED'
    },
    {
      ref: 'ALX-CB-05',
      title: 'Computational Biologist & Drug Designer',
      domain: 'Biotech & Life Sciences',
      capital: '₹13.5L',
      salary: '₹14.0L',
      growth: '+19.5%',
      status: 'CALIBRATED'
    }
  ];

  return (
    <div
      style={{
        backgroundColor: '#F6F5F1',
        color: '#181816',
        minHeight: '100vh',
        overflowX: 'clip',
        fontFamily: "'Martian Mono', 'JetBrains Mono', monospace"
      }}
    >
      {/* ========================================================
          HERO: Split Wordmark Bracket & Rotating Decision Astrolabe
          ======================================================== */}
      <section
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 60px)',
          backgroundColor: '#ECE9E2',
          borderBottom: '1px solid rgba(24, 24, 22, 0.12)',
          padding: '50px 48px 0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          isolation: 'isolate'
        }}
      >
        {/* Top Header Row: Left Copy Stack + Right Specs & Section Links */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 10, flexWrap: 'wrap', gap: '32px' }}>
          {/* Left Copy Stack (<= 44vw) */}
          <div style={{ maxWidth: '44vw', minWidth: '320px' }}>
            <div
              style={{
                fontFamily: "'Martian Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#6E6A61',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>ALIGNX</span>
              <span>·</span>
              <span>CALIBRATION LABORATORY</span>
              <span>·</span>
              <span style={{ color: '#2D5A43' }}>ENGINE V2.4</span>
            </div>

            <h1
              style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontSize: 'clamp(44px, 5.8vw, 84px)',
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#181816',
                margin: '0 0 24px 0'
              }}
            >
              <div>FIVE FACTORS.</div>
              <div>ZERO GUESSWORK.</div>
              <div style={{ color: '#2D5A43' }}>PERFECT ALIGNMENT.</div>
            </h1>

            <p
              style={{
                fontFamily: "'Martian Mono', monospace",
                fontSize: '11px',
                lineHeight: 1.85,
                color: '#6E6A61',
                maxWidth: '480px',
                marginBottom: '32px'
              }}
            >
              A multi-stakeholder calibration instrument resolving student cognitive aptitude, four-year tuition limits,
              and parental risk appetite against ten-year Indian labor market hiring velocity.
            </p>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <button
                onClick={() => onEnterApp('onboarding')}
                style={{
                  height: '42px',
                  padding: '0 24px',
                  backgroundColor: '#181816',
                  color: '#F6F5F1',
                  border: 'none',
                  borderRadius: '0px',
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2D5A43')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#181816')}
              >
                <span>■</span>
                <span>START ASSESSMENT</span>
              </button>

              <button
                onClick={() => onEnterApp('explore')}
                style={{
                  height: '42px',
                  padding: '0 18px',
                  backgroundColor: '#ECE9E2',
                  color: '#181816',
                  border: '1px solid rgba(24, 24, 22, 0.25)',
                  borderRadius: '0px',
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#2D5A43';
                  e.currentTarget.style.color = '#2D5A43';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ECE9E2';
                  e.currentTarget.style.borderColor = 'rgba(24, 24, 22, 0.25)';
                  e.currentTarget.style.color = '#181816';
                }}
              >
                <span>EXPLORE</span>
                <span style={{ color: '#2D5A43' }}>→</span>
              </button>
            </div>
          </div>

          {/* Top Right: Specifications + Section Navigation Links */}
          <div
            style={{
              textAlign: 'right',
              fontFamily: "'Martian Mono', monospace",
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '24px'
            }}
          >
            <div
              style={{
                fontSize: '10.5px',
                letterSpacing: '0.12em',
                color: '#6E6A61',
                lineHeight: 1.8
              }}
            >
              <div>25 CATALOG CAREERS · 5 AXES</div>
              <div>
                <span style={{ color: '#2D5A43', fontWeight: 600 }}>96.4% CONSENSUS</span> · 4-YEAR HORIZON
              </div>
            </div>

            {/* Section Links (Moved from top banner to right side & made larger) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderTop: '1px solid rgba(24, 24, 22, 0.16)',
                paddingTop: '20px',
                minWidth: '220px'
              }}
            >
              {[
                { num: '01', label: 'EQUILIBRIUM', id: 'section-equilibrium' },
                { num: '02', label: 'FORMULA', id: 'section-formula' },
                { num: '03', label: 'PROTOCOL', id: 'section-protocol' },
                { num: '04', label: 'CATALOG', id: 'section-catalog' }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={`#${item.id}`}
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: '#181816',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    padding: '2px 0',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#2D5A43';
                    e.currentTarget.style.transform = 'translateX(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#181816';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ color: '#6E6A61', fontSize: '10.5px', fontWeight: 400 }}>{item.num} ·</span>
                  <span>{item.label}</span>
                  <span style={{ color: '#2D5A43', fontSize: '12px' }}>→</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================
            THE SIGNATURE HORIZONTAL WORDMARK BRACKET & ASTROLABE
            ALIGN (Behind, z-index: 1)  |  ASTROLABE (Center, z-index: 2)  |  X. (Front, z-index: 3)
            ======================================================== */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(220px, 34vw, 420px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginTop: 'auto'
          }}
        >
          {/* Left Half: "ALIGN" (Behind the central instrument) */}
          <div
            style={{
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontSize: 'clamp(110px, 24vw, 360px)',
              fontWeight: 900,
              lineHeight: 0.74,
              letterSpacing: '-0.02em',
              color: '#181816',
              userSelect: 'none',
              transform: `translateX(-${wordmarkSpreadVw}vw)`,
              transition: 'transform 0.08s ease-out',
              zIndex: 1
            }}
          >
            ALIGN
          </div>

          {/* Center Instrument: Authentic 3D Horological & Surveyor Compass in Proper Orientation */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '5%',
              transform: 'translate(-50%, 0)',
              width: 'clamp(200px, 26vw, 360px)',
              height: 'clamp(200px, 26vw, 360px)',
              zIndex: 2,
              pointerEvents: 'auto'
            }}
          >
            <AuthenticCompass
              size="100%"
              rotationDeg={astrolabeRotationDeg}
            />
          </div>

          {/* Right Half: "X." (Behind the central instrument, snug to the astrolabe) */}
          <div
            style={{
              position: 'absolute',
              left: 'calc(50% + clamp(65px, 9.5vw, 145px))',
              bottom: 0,
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontSize: 'clamp(110px, 24vw, 360px)',
              fontWeight: 900,
              lineHeight: 0.74,
              letterSpacing: '-0.02em',
              color: '#181816',
              userSelect: 'none',
              transform: `translateX(${wordmarkSpreadVw}vw)`,
              transition: 'transform 0.08s ease-out',
              zIndex: 1,
              display: 'flex'
            }}
          >
            <span>X</span>
            <span style={{ color: '#2D5A43' }}>.</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. 01 — EQUILIBRIUM: 3D POLYHEDRAL RADAR (Fluid Natural Scroll)
          ======================================================== */}
      <section
        id="section-equilibrium"
        style={{
          padding: '100px 48px 80px',
          backgroundColor: '#F6F5F1',
          borderBottom: '1px solid rgba(24, 24, 22, 0.12)',
          position: 'relative'
        }}
      >
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px'
          }}
        >
          {/* Section Header */}
          <div>
            <div
              style={{
                fontFamily: "'Martian Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: '#2D5A43',
                marginBottom: '12px'
              }}
            >
              01 — EQUILIBRIUM
            </div>
            <h2
              style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontSize: 'clamp(36px, 4.2vw, 58px)',
                fontWeight: 800,
                textTransform: 'uppercase',
                lineHeight: 0.95,
                color: '#181816',
                margin: 0
              }}
            >
              ONE HOUSEHOLD, ALIGNED ACROSS TWO PLANES.
            </h2>
          </div>

          {/* 3D Polyhedral Radar Crystal Visualization with Minimalist Hairline Pointer Callout Lines */}
          <EquilibriumRadar3D />
        </div>
      </section>

      {/* ========================================================
          4. TWO-COLUMN SPECIFICATION: 02 — FORMULA (The 5-Factor Composite)
          ======================================================== */}
      <section
        id="section-formula"
        style={{
          padding: '100px 48px',
          backgroundColor: '#ECE9E2',
          borderBottom: '1px solid rgba(24, 24, 22, 0.12)'
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '80px', alignItems: 'center' }}>
          {/* Left Column: Hairline Ruled Specification Rows */}
          <div>
            <div
              style={{
                fontFamily: "'Martian Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: '#2D5A43',
                marginBottom: '14px'
              }}
            >
              02 — FORMULA
            </div>
            <h2
              style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontSize: 'clamp(40px, 4.8vw, 68px)',
                fontWeight: 900,
                lineHeight: 0.9,
                color: '#181816',
                margin: '0 0 20px 0',
                textTransform: 'uppercase'
              }}
            >
              THE 5-FACTOR COMPOSITE ENGINE.
            </h2>
            <p
              style={{
                fontFamily: "'Martian Mono', monospace",
                fontSize: '11px',
                lineHeight: 1.85,
                color: '#6E6A61',
                marginBottom: '40px'
              }}
            >
              Every career pathway is calibrated through a simultaneous multi-objective solver. A score of 90+ requires
              convergence across all five planes, preventing blindspots before commitments are signed.
            </p>

            {/* Hairline Specification Rows */}
            <div style={{ borderTop: '1px solid rgba(24, 24, 22, 0.14)' }}>
              {[
                {
                  code: '01',
                  label: 'STUDENT COGNITIVE & RIASEC FIT',
                  desc: 'Spatial, numerical, and structural aptitude calibrated via calibrated assessment',
                  weight: '35% WEIGHT'
                },
                {
                  code: '02',
                  label: '4-YEAR TUITION CAPITAL LIMIT',
                  desc: 'Strict household affordability ceiling with scholarship mitigation logic',
                  weight: '20% WEIGHT'
                },
                {
                  code: '03',
                  label: 'PARENTAL RISK TOLERANCE',
                  desc: 'Downside economic buffer and multi-generational risk tolerance rating',
                  weight: '15% WEIGHT'
                },
                {
                  code: '04',
                  label: 'PLFS MARKET HIRING VELOCITY',
                  desc: 'MoSPI PLFS microdata and 10-year Indian industry compound hiring trajectory',
                  weight: '20% WEIGHT'
                },
                {
                  code: '05',
                  label: 'REGIONAL CLUSTER PROXIMITY',
                  desc: 'Proximity to primary hiring hubs (Bangalore, NCR, Hyderabad, Pune)',
                  weight: '10% WEIGHT'
                }
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1.5fr 2fr 110px',
                    gap: '16px',
                    padding: '18px 0',
                    borderBottom: '1px solid rgba(24, 24, 22, 0.14)',
                    alignItems: 'baseline'
                  }}
                >
                  <span style={{ color: '#2D5A43', fontSize: '10px' }}>{row.code}</span>
                  <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#181816' }}>{row.label}</span>
                  <span style={{ fontSize: '10.5px', color: '#6E6A61' }}>{row.desc}</span>
                  <span style={{ fontSize: '10.5px', color: '#2D5A43', textAlign: 'right', fontWeight: 600 }}>
                    {row.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Cross-Section Crop */}
          <div
            style={{
              backgroundColor: '#F6F5F1',
              border: '1px solid rgba(24, 24, 22, 0.14)',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(24, 24, 22, 0.1)' , paddingBottom: '12px' }}>
              <span style={{ fontSize: '10px', color: '#2D5A43', letterSpacing: '0.1em' }}>DIAGNOSTIC NO. 88-B</span>
              <span style={{ fontSize: '10px', color: '#6E6A61' }}>TOLERANCE ±0.04%</span>
            </div>

            <div style={{ padding: '24px 0', display: 'flex', justifyContent: 'center' }}>
              <svg viewBox="0 0 240 240" width="200" height="200">
                <circle cx="120" cy="120" r="110" fill="none" stroke="#181816" strokeWidth="1.5" />
                <circle cx="120" cy="120" r="90" fill="none" stroke="#2D5A43" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="120" cy="120" r="60" fill="none" stroke="#181816" strokeWidth="1" />
                <polygon points="120,40 196,176 44,176" fill="none" stroke="#2D5A43" strokeWidth="1.5" />
                <circle cx="120" cy="120" r="8" fill="#2D5A43" />
                <line x1="120" y1="10" x2="120" y2="230" stroke="rgba(24,24,22,0.2)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="10" y1="120" x2="230" y2="120" stroke="rgba(24,24,22,0.2)" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
            </div>

            <div style={{ fontSize: '10px', lineHeight: 1.8, color: '#6E6A61', borderTop: '1px solid rgba(24, 24, 22, 0.1)', paddingTop: '16px' }}>
              Figure 1.0 — Convergence geometry of the 5-plane calibration manifold. The student trajectory is validated
              when the centroid falls within the risk-weighted safe basin.
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. PROCESS ROWS: 03 — PROTOCOL (Four Gates)
          ======================================================== */}
      <section
        id="section-protocol"
        style={{
          padding: '100px 48px',
          backgroundColor: '#F6F5F1',
          borderBottom: '1px solid rgba(24, 24, 22, 0.12)'
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div
            style={{
              fontFamily: "'Martian Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.14em',
              color: '#2D5A43',
              marginBottom: '14px'
            }}
          >
            03 — PROTOCOL
          </div>
          <h2
            style={{
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontSize: 'clamp(40px, 4.8vw, 68px)',
              fontWeight: 900,
              lineHeight: 0.9,
              color: '#181816',
              margin: '0 0 40px 0',
              textTransform: 'uppercase'
            }}
          >
            FOUR GATES TO IRREVERSIBLE CLARITY.
          </h2>

          <div style={{ borderTop: '1px solid rgba(24, 24, 22, 0.14)' }}>
            {[
              {
                gate: 'GATE 01',
                title: 'COGNITIVE APTITUDE & RIASEC CALIBRATION',
                desc: 'Adaptive psychometric evaluation isolating true mechanical, abstract, and behavioral drivers.',
                metric: '45 MINUTES'
              },
              {
                gate: 'GATE 02',
                title: 'HOUSEHOLD FINANCIAL CONSTRAINT LOCK',
                desc: 'Hard-bounding capital availability, loan ceilings, and tier-1 merit scholarship qualification.',
                metric: '₹14L–₹32L RANGE'
              },
              {
                gate: 'GATE 03',
                title: 'PARENT-STUDENT DUAL-BLIND AUDIT',
                desc: 'Unbiased parallel preference inputs reconciled algorithmically into family consensus.',
                metric: '48-HR CONSENSUS'
              },
              {
                gate: 'GATE 04',
                title: '12-QUARTER EXECUTION ROADMAP',
                desc: 'Quarter-by-quarter entrance exam milestones, technical deliverables, and placement leverage.',
                metric: '12 QUARTERS'
              }
            ].map((gate, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1.5fr 2fr 140px',
                  gap: '24px',
                  padding: '24px 0',
                  borderBottom: '1px solid rgba(24, 24, 22, 0.14)',
                  alignItems: 'center'
                }}
              >
                <span style={{ color: '#2D5A43', fontWeight: 600, fontSize: '11px' }}>{gate.gate}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#181816' }}>{gate.title}</span>
                <span style={{ fontSize: '11px', color: '#6E6A61', lineHeight: 1.6 }}>{gate.desc}</span>
                <span style={{ fontSize: '11px', color: '#181816', textAlign: 'right', fontWeight: 600 }}>
                  {gate.metric}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. SERIES TABLE: 04 — CATALOG (The Calibrated Careers)
          ======================================================== */}
      <section
        id="section-catalog"
        style={{
          padding: '100px 48px',
          backgroundColor: '#ECE9E2',
          borderBottom: '1px solid rgba(24, 24, 22, 0.12)'
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div
            style={{
              fontFamily: "'Martian Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.14em',
              color: '#2D5A43',
              marginBottom: '14px'
            }}
          >
            04 — CATALOG
          </div>
          <h2
            style={{
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontSize: 'clamp(40px, 4.8vw, 68px)',
              fontWeight: 900,
              lineHeight: 0.9,
              color: '#181816',
              margin: '0 0 40px 0',
              textTransform: 'uppercase'
            }}
          >
            CALIBRATED CAREER INDEX.
          </h2>

          <div style={{ borderTop: '1px solid rgba(24, 24, 22, 0.16)' }}>
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '110px 2fr 1.5fr 110px 110px 110px 110px',
                gap: '16px',
                padding: '14px 0',
                borderBottom: '1px solid rgba(24, 24, 22, 0.16)',
                fontSize: '9.5px',
                letterSpacing: '0.08em',
                color: '#6E6A61'
              }}
            >
              <span>REFERENCE</span>
              <span>DISCIPLINE</span>
              <span>SECTOR</span>
              <span style={{ textAlign: 'right' }}>4Y CAPITAL</span>
              <span style={{ textAlign: 'right' }}>ENTRY COMP</span>
              <span style={{ textAlign: 'right' }}>10Y ALPHA</span>
              <span style={{ textAlign: 'right' }}>CALIBRATION</span>
            </div>

            {/* Table Rows */}
            {catalogItems.map((c, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 2fr 1.5fr 110px 110px 110px 110px',
                  gap: '16px',
                  padding: '20px 0',
                  borderBottom: '1px solid rgba(24, 24, 22, 0.12)',
                  fontSize: '10.5px',
                  alignItems: 'center',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <span style={{ color: '#2D5A43', fontWeight: 600 }}>{c.ref}</span>
                <span style={{ color: '#181816', fontWeight: 600 }}>{c.title}</span>
                <span style={{ color: '#6E6A61' }}>{c.domain}</span>
                <span style={{ textAlign: 'right', color: '#181816' }}>{c.capital}</span>
                <span style={{ textAlign: 'right', color: '#181816' }}>{c.salary}</span>
                <span style={{ textAlign: 'right', color: '#2D5A43', fontWeight: 600 }}>{c.growth}</span>
                <span style={{ textAlign: 'right', color: '#6E6A61' }}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. DRAMATIC CLOSE & CROPPED WORDMARK
          ======================================================== */}
      <section
        style={{
          position: 'relative',
          padding: '120px 48px 0',
          backgroundColor: '#F6F5F1',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '80vh'
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px' }}>
            <div style={{ maxWidth: '640px' }}>
              <h2
                style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  fontSize: 'clamp(44px, 5.5vw, 80px)',
                  fontWeight: 900,
                  lineHeight: 0.9,
                  textTransform: 'uppercase',
                  color: '#181816',
                  margin: '0 0 20px 0'
                }}
              >
                DECISIONS BUILT TO OUTLAST <span style={{ color: '#2D5A43' }}>MARKET CYCLES.</span>
              </h2>
              <p
                style={{
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '11px',
                  lineHeight: 1.85,
                  color: '#6E6A61',
                  margin: 0
                }}
              >
                Calibrated on MoSPI PLFS 2023-24 microdata, NIRF Tier-1 institutional fee schedules, and dual-plane
                household psychometrics.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <button
                onClick={() => onEnterApp('onboarding')}
                style={{
                  height: '46px',
                  padding: '0 28px',
                  backgroundColor: '#181816',
                  color: '#F6F5F1',
                  border: 'none',
                  borderRadius: '0px',
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2D5A43')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#181816')}
              >
                <span>■</span>
                <span>ENTER DECISION STUDIO</span>
              </button>

              <button
                onClick={() => onEnterApp('parent')}
                style={{
                  height: '46px',
                  padding: '0 24px',
                  backgroundColor: 'transparent',
                  color: '#181816',
                  border: '1px solid rgba(24, 24, 22, 0.25)',
                  borderRadius: '0px',
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease, color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#2D5A43';
                  e.currentTarget.style.color = '#2D5A43';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(24, 24, 22, 0.25)';
                  e.currentTarget.style.color = '#181816';
                }}
              >
                FAMILY PORTAL
              </button>
            </div>
          </div>

          {/* Hairline Footer Strip */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '36px 0 20px',
              borderTop: '1px solid rgba(24, 24, 22, 0.12)',
              marginTop: '60px',
              fontSize: '10px',
              color: '#6E6A61'
            }}
          >
            <div>ALIGNX LABORATORY · ALL RIGHTS RESERVED</div>
            <div>SPEC: CALIBRE ALX-2026 · INDIA PLFS MODEL</div>
          </div>
        </div>

        {/* The Cropped Wordmark: clamp(84px, 22vw, 340px) translated down .16em */}
        <div
          style={{
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontSize: 'clamp(90px, 22vw, 340px)',
            fontWeight: 900,
            lineHeight: 0.72,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#181816',
            width: '100%',
            textAlign: 'center',
            transform: 'translateY(0.16em)',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          <span>ALIGNX</span>
          <span style={{ color: '#2D5A43' }}>.</span>
        </div>
      </section>
    </div>
  );
};
