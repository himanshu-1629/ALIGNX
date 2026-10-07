import React, { useState } from 'react';

export const TrajectoryBifurcationInteractive: React.FC = () => {
  const [location, setLocation] = useState<'Bangalore' | 'Singapore' | 'Dubai'>('Bangalore');
  const [domain, setDomain] = useState<'AI' | 'Systems' | 'Quantitative'>('AI');
  const [postgrad, setPostgrad] = useState<boolean>(false);

  // Dynamic calculations
  const calculateMetrics = () => {
    let score = 84;
    let baseCtc = 18;
    let fiveYearCtc = 42;

    if (location === 'Singapore') {
      score += 7;
      baseCtc = 38;
      fiveYearCtc = 85;
    } else if (location === 'Dubai') {
      score += 5;
      baseCtc = 34;
      fiveYearCtc = 72;
    }

    if (domain === 'Quantitative') {
      score += 5;
      baseCtc += 8;
      fiveYearCtc += 24;
    } else if (domain === 'AI') {
      score += 4;
      baseCtc += 4;
      fiveYearCtc += 18;
    }

    if (postgrad) {
      score += 3;
      baseCtc += 6;
      fiveYearCtc += 30;
    }

    return { score: Math.min(score, 98), baseCtc, fiveYearCtc };
  };

  const { score, baseCtc, fiveYearCtc } = calculateMetrics();

  return (
    <div
      style={{
        border: '1px solid var(--border-hairline)',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '0px',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.05)'
      }}
      className="scroll-reveal-scale"
    >
      {/* Simulation Controls Strip */}
      <div
        style={{
          padding: '24px 32px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderBottom: '1px solid var(--border-hairline)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Variable 1: Geography */}
        <div>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            VARIABLE 01: ECONOMIC JURISDICTION
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['Bangalore', 'Singapore', 'Dubai'] as const).map((loc) => (
              <button
                key={loc}
                onClick={() => setLocation(loc)}
                className={`alignx-key ${location === loc ? 'active' : ''}`}
                style={{ fontSize: '0.7rem', padding: '6px 10px', flex: 1 }}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Variable 2: Specialization */}
        <div>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            VARIABLE 02: SPECIALIZATION
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['AI', 'Systems', 'Quantitative'] as const).map((dom) => (
              <button
                key={dom}
                onClick={() => setDomain(dom)}
                className={`alignx-key ${domain === dom ? 'active' : ''}`}
                style={{ fontSize: '0.7rem', padding: '6px 10px', flex: 1 }}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>

        {/* Variable 3: Higher Studies */}
        <div>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            VARIABLE 03: POSTGRAD / MS (+2 YRS)
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[false, true].map((val) => (
              <button
                key={String(val)}
                onClick={() => setPostgrad(val)}
                className={`alignx-key ${postgrad === val ? 'active' : ''}`}
                style={{ fontSize: '0.7rem', padding: '6px 10px', flex: 1 }}
              >
                {val ? 'M.Tech / M.S.' : 'Direct Career'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Simulation Readout */}
      <div
        style={{
          padding: '36px',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '36px',
          alignItems: 'center'
        }}
        className="responsive-stack"
      >
        {/* Dynamic Trajectory Curve Visualization */}
        <div
          style={{
            height: '240px',
            backgroundColor: '#F5F5F7',
            borderRadius: '0px',
            border: '1px solid var(--border-hairline)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="architectural-grid"
        >
          <svg viewBox="0 0 450 200" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="trajGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#2D5A43" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Grid markers */}
            <line x1="40" y1="160" x2="410" y2="160" stroke="rgba(0, 0, 0, 0.08)" />
            <line x1="40" y1="40" x2="40" y2="160" stroke="rgba(0, 0, 0, 0.08)" />
            <text x="45" y="175" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="9">YEAR 0</text>
            <text x="210" y="175" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="9">YEAR 3</text>
            <text x="380" y="175" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="9">YEAR 5</text>

            {/* Baseline comparison path */}
            <path
              d="M 40 150 Q 210 130 400 110"
              fill="none"
              stroke="rgba(0, 0, 0, 0.22)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Active Simulated Trajectory Curve */}
            <path
              d={`M 40 150 Q 180 ${postgrad ? 155 : 110} 400 ${60 - (score - 80) * 2.5}`}
              fill="none"
              stroke="url(#trajGrad)"
              strokeWidth="3"
            />

            {/* Key waypoint nodes */}
            <circle cx="40" cy="150" r="4" fill="var(--accent)" />
            <circle cx="210" cy={postgrad ? 150 : 105} r="4" fill="var(--accent)" />
            <circle cx="400" cy={60 - (score - 80) * 2.5} r="6" fill="#FFFFFF" stroke="var(--accent)" strokeWidth="2" />

            <text x="390" y={45 - (score - 80) * 2.5} textAnchor="end" fill="var(--text-primary)" fontFamily="var(--font-mono)" fontSize="10" fontWeight="600">
              ₹{fiveYearCtc}L YR-5
            </text>
          </svg>

          <div style={{ position: 'absolute', bottom: '10px', left: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)' }}>
            TRAJECTORY DISPERSION MODEL • 60-MONTH HORIZON
          </div>
        </div>

        {/* Calculated Telemetry Box */}
        <div
          style={{
            padding: '28px',
            borderRadius: '0px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-hairline)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
              CALCULATED ALIGNX INDEX
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {score}%
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderTop: '1px solid var(--border-hairline)', paddingTop: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                PROJECTED YEAR-1
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                ₹{baseCtc}L CTC
              </div>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                5-YEAR COMPOUND YIELD
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)', marginTop: '2px' }}>
                ₹{fiveYearCtc}L CTC
              </div>
            </div>
          </div>

          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {location === 'Singapore'
              ? 'APAC regional headquarters provides 2.4x compensation upside with elevated initial relocation threshold.'
              : location === 'Dubai'
              ? 'Tax-free sovereign jurisdiction optimizes early capital accumulation and international mobility.'
              : 'Dense domestic technology cluster maximizes early velocity and startup optionality.'}
          </div>
        </div>
      </div>
    </div>
  );
};
