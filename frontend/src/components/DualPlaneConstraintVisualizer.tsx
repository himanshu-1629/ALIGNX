import React, { useState } from 'react';

export const DualPlaneConstraintVisualizer: React.FC = () => {
  const [budgetTier, setBudgetTier] = useState<'low' | 'mid' | 'high'>('mid');
  const [mobilityRadius, setMobilityRadius] = useState<'domestic' | 'apac' | 'global'>('apac');
  const [familyAlignment, setFamilyAlignment] = useState<number>(88);

  // Compute calculated feasible yield based on boundary constraints
  const getFeasibilityIndex = () => {
    let index = 78;
    if (budgetTier === 'high') index += 12;
    if (budgetTier === 'low') index -= 8;
    if (mobilityRadius === 'global') index += 8;
    if (mobilityRadius === 'domestic') index -= 4;
    return Math.min(Math.max(index + Math.round((familyAlignment - 50) / 5), 45), 98);
  };

  const feasibility = getFeasibilityIndex();

  return (
    <div
      style={{
        border: '1px solid var(--border-hairline)',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '36px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}
      className="scroll-reveal-scale"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--accent)' }}>
            GRAVITATIONAL BOUNDARY COLLIDER
          </span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, margin: '4px 0 0 0', textTransform: 'uppercase' }}>
            POTENTIAL × REALITY ENVELOPE
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            FEASIBILITY INDEX:
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>
            {feasibility}%
          </span>
        </div>
      </div>

      {/* Main Interactive Collider Graphic */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.3fr 1fr',
          gap: '32px',
          alignItems: 'center'
        }}
        className="responsive-stack"
      >
        {/* SVG Gravitational Waveform / Ray Collision Graphic */}
        <div
          style={{
            height: '280px',
            backgroundColor: '#F5F5F7',
            borderRadius: '12px',
            border: '1px solid var(--border-hairline)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="architectural-grid"
        >
          <svg viewBox="0 0 500 260" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="beamPotential" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1D1D1F" stopOpacity="0.8" />
                <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="viableField" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(158, 107, 56, 0.18)" />
                <stop offset="100%" stopColor="rgba(158, 107, 56, 0.02)" />
              </linearGradient>
            </defs>

            {/* Boundary Plane Horizon */}
            <line x1="220" y1="20" x2="220" y2="240" stroke="rgba(0, 0, 0, 0.16)" strokeDasharray="4 4" strokeWidth="1.5" />
            <text x="210" y="35" textAnchor="end" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontSize="9">
              THEORETICAL PLANE
            </text>
            <text x="230" y="35" textAnchor="start" fill="var(--accent)" fontFamily="var(--font-mono)" fontSize="9">
              REALITY CONSTRAINTS
            </text>

            {/* Theoretical Input Ray (from left into plane) */}
            <path
              d="M 20 130 Q 120 130 220 130"
              fill="none"
              stroke="url(#beamPotential)"
              strokeWidth="3"
            />
            <circle cx="20" cy="130" r="4" fill="#1D1D1F" />

            {/* Gravitational Deflection Arc based on Budget and Mobility */}
            {/* Upper bound (Aggressive high trajectory) */}
            <path
              d={`M 220 130 Q 320 ${130 - (feasibility - 60)} 480 ${110 - (feasibility - 60) * 0.8}`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
            />
            {/* Lower bound (Safe baseline trajectory) */}
            <path
              d={`M 220 130 Q 320 ${130 + 30} 480 ${160 + (98 - feasibility) * 0.6}`}
              fill="none"
              stroke="rgba(0, 0, 0, 0.28)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Viable corridor polygon between the two trajectories */}
            <path
              d={`M 220 130 
                 Q 320 ${130 - (feasibility - 60)} 480 ${110 - (feasibility - 60) * 0.8}
                 L 480 ${160 + (98 - feasibility) * 0.6}
                 Q 320 ${130 + 30} 220 130 Z`}
              fill="url(#viableField)"
            />

            {/* Focus Collision Node */}
            <circle cx="220" cy="130" r="7" fill="var(--accent)" stroke="#FFFFFF" strokeWidth="2" />

            {/* Outcome Target Label */}
            <g transform="translate(420, 100)">
              <rect x="0" y="-12" width="70" height="20" rx="4" fill="rgba(197, 155, 109, 0.2)" stroke="var(--accent)" strokeWidth="1" />
              <text x="35" y="2" textAnchor="middle" fill="#FFFFFF" fontFamily="var(--font-mono)" fontSize="9" fontWeight="600">
                ALIGNMENT
              </text>
            </g>
          </svg>

          {/* Graphic Footer Caption */}
          <div style={{ position: 'absolute', bottom: '10px', left: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-muted)' }}>
            FIG 5.1 — CONSTRAINED PATHWAY CONVERGENCE
          </div>
        </div>

        {/* Right Boundary Controls (Tactile Keys) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Budget Constraint Key Group */}
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              CAPITAL BOUNDARY (ANNUAL)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'low', label: '₹8L (CONSERVATIVE)' },
                { id: 'mid', label: '₹18L (BALANCED)' },
                { id: 'high', label: '₹35L+ (UNBOUNDED)' }
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setBudgetTier(tier.id as any)}
                  className={`alignx-key ${budgetTier === tier.id ? 'active' : ''}`}
                  style={{ fontSize: '0.68rem', padding: '7px 10px', flex: 1 }}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobility Constraint Key Group */}
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              GEOGRAPHIC MOBILITY RADIUS
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'domestic', label: 'DOMESTIC HUBS' },
                { id: 'apac', label: 'APAC CORRIDOR' },
                { id: 'global', label: 'GLOBAL ACCESS' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMobilityRadius(m.id as any)}
                  className={`alignx-key ${mobilityRadius === m.id ? 'active' : ''}`}
                  style={{ fontSize: '0.68rem', padding: '7px 10px', flex: 1 }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Family Cohesion Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>FAMILY EXPECTATION COHESION</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{familyAlignment}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={familyAlignment}
              onChange={(e) => setFamilyAlignment(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--accent)',
                cursor: 'pointer',
                height: '4px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
