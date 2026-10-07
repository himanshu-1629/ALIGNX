import React, { useState } from 'react';
import { INITIAL_CAREERS } from '../../data/mockAlignxData';
import type { CareerRecommendation } from '../../types/alignx';
import { ArrowRight, Sliders, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';

interface WhatIfModuleProps {
  onContinueToRoadmap?: () => void;
}

export const WhatIfModule: React.FC<WhatIfModuleProps> = ({ onContinueToRoadmap }) => {
  // Simulator input parameters
  const [budgetLakhs, setBudgetLakhs] = useState<number>(14);
  const [selectedLocation, setSelectedLocation] = useState<string>('Bangalore');
  const [riskAppetite, setRiskAppetite] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [timeHorizonMonths, setTimeHorizonMonths] = useState<number>(24);
  const [hasSimulated, setHasSimulated] = useState<boolean>(true);

  // Compute simulated dynamic scores
  const getSimulatedCareers = (): { career: CareerRecommendation; originalScore: number; simScore: number; delta: number; rankChange: string }[] => {
    return INITIAL_CAREERS.map((c) => {
      let mod = 0;

      // Budget effect
      if (budgetLakhs >= 20) mod += 5;
      else if (budgetLakhs < 8) mod -= 8;

      // Location effect
      if (c.topLocations.includes(selectedLocation)) {
        mod += 6;
      } else {
        mod -= 4;
      }

      // Risk effect
      if (riskAppetite === 'high') {
        if (c.id === 'quant-risk-analyst') mod += 10;
        if (c.id === 'ai-engineer') mod += 3;
      } else if (riskAppetite === 'low') {
        if (c.id === 'semiconductor-architect') mod += 6;
        if (c.id === 'quant-risk-analyst') mod -= 12;
      }

      // Time horizon effect
      if (timeHorizonMonths <= 12) {
        if (c.id === 'ai-engineer') mod += 4;
        if (c.id === 'semiconductor-architect') mod -= 5;
      }

      const orig = c.scores.overallScore;
      const sim = Math.max(50, Math.min(99, orig + mod));
      const delta = sim - orig;
      const rankChange = delta > 2 ? '↑ PROMOTED' : delta < -2 ? '↓ DEMOTED' : '— STABLE';

      return {
        career: c,
        originalScore: orig,
        simScore: sim,
        delta,
        rankChange
      };
    }).sort((a, b) => b.simScore - a.simScore);
  };

  const results = getSimulatedCareers();

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '24px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Sliders size={18} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', color: 'var(--accent)' }}>
            PHASE 09 / WHAT-IF CAREER SIMULATOR
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '8px 0 10px'
          }}
        >
          DYNAMIC SCENARIO SIMULATION
        </h1>

        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Test hypotheses in real-time (*"What if my budget increases to ₹25L?"*, *"What if I relocate to Singapore?"*, *"What if I reduce time-to-employment to 12 months?"*).
        </p>
      </div>

      {/* Simulator Control Panel */}
      <div
        style={{
          border: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)',
          padding: '36px',
          marginBottom: '40px'
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.14em', marginBottom: '24px' }}>
          ADJUST SCENARIO PARAMETERS
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px', marginBottom: '32px' }}>
          {/* Budget Control */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                BUDGET (ANNUAL):
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                ₹{budgetLakhs} Lakhs
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="35"
              step="1"
              value={budgetLakhs}
              onChange={(e) => setBudgetLakhs(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>₹4L</span>
              <span>₹20L</span>
              <span>₹35L</span>
            </div>
          </div>

          {/* Location Selection */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              PRIMARY GEOGRAPHIC TARGET:
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-deep)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem'
              }}
            >
              <option value="Bangalore">Bangalore (Tier-1 AI / VC)</option>
              <option value="Chennai">Chennai (Hardware / Silicon / Auto)</option>
              <option value="Hyderabad">Hyderabad (Cloud / Defense)</option>
              <option value="Pune">Pune (Kinetic Robotics / IoT)</option>
              <option value="Singapore">Singapore (Global APAC / Quant)</option>
              <option value="Berlin">Berlin (Applied DeepTech)</option>
            </select>
          </div>

          {/* Risk Appetite */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              RISK TOLERANCE:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['low', 'moderate', 'high'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setRiskAppetite(lvl)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: riskAppetite === lvl ? 'var(--accent)' : 'var(--bg-deep)',
                    color: riskAppetite === lvl ? '#FFFFFF' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Time to Employment */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                TIME HORIZON:
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                {timeHorizonMonths} Months
              </span>
            </div>
            <input
              type="range"
              min="12"
              max="48"
              step="6"
              value={timeHorizonMonths}
              onChange={(e) => setTimeHorizonMonths(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>12m (Immediate)</span>
              <span>24m</span>
              <span>48m (Extended R&D)</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-hairline)', paddingTop: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            STATUS: {hasSimulated ? 'SCENARIO COMPUTED • ALL 5D WEIGHTS NORMALIZED' : 'READY TO RE-EXECUTE'}
          </div>

          <button
            onClick={() => setHasSimulated(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--accent)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} />
            <span>RE-EXECUTE SIMULATION</span>
          </button>
        </div>
      </div>

      {/* Before / After Comparison Table */}
      <div
        style={{
          border: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)',
          padding: '36px',
          marginBottom: '36px'
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.14em', marginBottom: '20px' }}>
          SIMULATION OUTCOMES: BEFORE VS. AFTER COMPARISON
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {results.map((res, idx) => (
            <div
              key={res.career.id}
              style={{
                border: '1px solid var(--border-hairline)',
                padding: '24px 28px',
                backgroundColor: 'var(--bg-deep)',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
                alignItems: 'center',
                gap: '20px'
              }}
              className="sim-result-row"
            >
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600 }}>
                  #{idx + 1} {res.career.title}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {res.career.domain}
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>BASELINE</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                  {res.originalScore}%
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>SIMULATED</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>
                  {res.simScore}%
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>DELTA</div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: res.delta >= 0 ? '#4ADE80' : '#F87171',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {res.delta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{res.delta >= 0 ? `+${res.delta}` : res.delta}%</span>
                </div>
              </div>

              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    padding: '4px 8px',
                    border: '1px solid var(--border-subtle)',
                    color: res.delta > 2 ? 'var(--accent)' : 'var(--text-muted)'
                  }}
                >
                  {res.rankChange}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation of Changes */}
      <div
        style={{
          border: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)',
          padding: '32px',
          marginBottom: '36px'
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: '8px' }}>
          DECISION ENGINE SYSTEMIC CAUSALITY
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Relocating target geography to <strong>{selectedLocation}</strong> altered geographic demand coefficients by up to 10 points. Adjusting risk tolerance to <strong>{riskAppetite}</strong> shifted ranking preference toward high-velocity asymmetric roles.
        </p>
      </div>

      {/* Advance to Roadmap */}
      {onContinueToRoadmap && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-hairline)', paddingTop: '24px' }}>
          <button onClick={onContinueToRoadmap} className="btn-alignx-primary">
            <span>VIEW STRATEGIC ROADMAP FOR TOP SIMULATED PATH</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 850px) {
          .sim-result-row {
            grid-template-columns: 1fr !important;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};
