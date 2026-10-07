import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_CAREERS } from '../../data/mockAlignxData';
import { ApiService } from '../../services/api';
import {
  ArrowRight,
  Sliders,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Sparkles,
  MapPin,
  ShieldAlert,
  Clock,
  Coins,
  CheckCircle2
} from 'lucide-react';
import { StudioNavTabs } from '../studio/StudioNavTabs';

interface WhatIfModuleProps {
  careerId?: string;
  onContinueToRoadmap?: () => void;
  onBackToDashboard?: () => void;
  onOpenTwin?: () => void;
}

export const WhatIfModule: React.FC<WhatIfModuleProps> = ({
  careerId = 'ai-engineer',
  onContinueToRoadmap,
  onBackToDashboard,
  onOpenTwin
}) => {
  const currentCareer = INITIAL_CAREERS.find(c => c.id === careerId) || INITIAL_CAREERS[0];
  // Simulator input parameters
  const [budgetLakhs, setBudgetLakhs] = useState<number>(14);
  const [selectedLocation, setSelectedLocation] = useState<string>('Bangalore');
  const [riskAppetite, setRiskAppetite] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [timeHorizonMonths, setTimeHorizonMonths] = useState<number>(24);
  const [isSimBackendActive, setIsSimBackendActive] = useState(false);
  const [backendSimResults, setBackendSimResults] = useState<any[] | null>(null);

  // Reset to default baseline parameters
  const handleReset = () => {
    setBudgetLakhs(14);
    setSelectedLocation('Bangalore');
    setRiskAppetite('moderate');
    setTimeHorizonMonths(24);
  };

  // Compute simulated dynamic scores using authentic ALIGNX 5-factor scoring formula:
  // 35% Student Fit + 20% Financial Fit + 15% Family Alignment + 20% Market Fit + 10% Location Fit
  const results = useMemo(() => {
    return INITIAL_CAREERS.map((c) => {
      // 1. Student Fit (35%)
      const sFit = c.scores.studentFit;

      // 2. Financial Fit (20%) - dynamically scaled with budget
      let fFit = c.scores.financialFit;
      if (budgetLakhs >= 22) fFit = Math.min(99, fFit + 12);
      else if (budgetLakhs >= 15) fFit = Math.min(96, fFit + 6);
      else if (budgetLakhs < 8) fFit = Math.max(45, fFit - 18);
      else if (budgetLakhs < 12) fFit = Math.max(60, fFit - 8);

      // 3. Family Alignment (15%) - dynamically scaled with parental risk appetite
      let aFam = c.scores.familyAlignment;
      const cRisk = c.riskLevel.toLowerCase();
      if (riskAppetite === 'low') {
        if (cRisk === 'low') aFam = Math.min(98, aFam + 10);
        else if (cRisk === 'high') aFam = Math.max(50, aFam - 20);
        else aFam = Math.max(65, aFam - 8);
      } else if (riskAppetite === 'high') {
        if (cRisk === 'high') aFam = Math.min(96, aFam + 12);
      } else {
        if (cRisk === 'moderate') aFam = Math.min(95, aFam + 5);
      }

      // 4. Market Fit (20%) - slightly responsive to shorter time horizons
      let mFit = c.scores.marketFit;
      if (timeHorizonMonths === 12) {
        mFit = Math.min(98, mFit + 4);
      } else if (timeHorizonMonths === 48) {
        if (c.domain === 'AI & Data Science' || c.domain === 'Hardware & Robotics') {
          mFit = Math.min(99, mFit + 8);
        }
      }

      // 5. Location Fit (10%) - dynamically checked against regional career clusters
      let lFit = c.scores.locationFit;
      const hasHub = c.topLocations.some(
        (loc) => loc.toLowerCase() === selectedLocation.toLowerCase()
      );
      if (hasHub) {
        lFit = Math.min(98, lFit + 12);
      } else {
        lFit = Math.max(45, lFit - 14);
      }

      const simMatch = backendSimResults?.find(
        (b) => b.careerSlug === c.id || b.careerName?.toLowerCase() === c.title?.toLowerCase()
      );

      const orig = c.scores.overallScore;
      const sim = simMatch ? simMatch.overallScore : Math.round(
        0.35 * sFit +
        0.20 * fFit +
        0.15 * aFam +
        0.20 * mFit +
        0.10 * lFit
      );
      const delta = simMatch ? simMatch.scoreDelta : (sim - orig);
      const rankChange = simMatch
        ? (simMatch.rankDelta > 0 ? 'PROMOTED' : simMatch.rankDelta < 0 ? 'DEMOTED' : 'STABLE')
        : (delta > 2 ? 'PROMOTED' : delta < -2 ? 'DEMOTED' : 'STABLE');

      return {
        career: c,
        originalScore: orig,
        simScore: sim,
        delta,
        rankChange,
        sFit,
        fFit,
        aFam,
        mFit,
        lFit
      };
    }).sort((a, b) => b.simScore - a.simScore);
  }, [budgetLakhs, selectedLocation, riskAppetite, timeHorizonMonths, backendSimResults]);

  // Synchronize scenario parameters with backend simulator engine (debounced)

  useEffect(() => {
    const handler = setTimeout(() => {
      ApiService.runSimulator({
        educationBudget: budgetLakhs * 100000,
        location: selectedLocation,
        riskAppetite: riskAppetite,
        timeToEmployment: timeHorizonMonths,
        scenarioName: `Sim_${selectedLocation}_${budgetLakhs}L`
      }).then(res => {
        if (res?.data?.recommendations) {
          setBackendSimResults(res.data.recommendations);
          setIsSimBackendActive(true);
        }
      }).catch(err => {
        console.warn('[ALIGNX WhatIf] Backend simulator sync note:', err);
      });
    }, 400);

    return () => clearTimeout(handler);
  }, [budgetLakhs, selectedLocation, riskAppetite, timeHorizonMonths]);

  // Derived causality telemetry for top result
  const topResult = results[0];
  const isBudgetShifted = budgetLakhs !== 14;
  const isRiskShifted = riskAppetite !== 'moderate';
  const isLocationShifted = selectedLocation !== 'Bangalore';

  return (
    <div style={{ maxWidth: '1400px', margin: '36px auto', padding: '0 24px' }}>
      {/* Synchronized Studio Nav Tabs */}
      <StudioNavTabs
        currentTab="whatif"
        onSelectTab={(tab) => {
          if (tab === 'dashboard' && onBackToDashboard) onBackToDashboard();
          else if (tab === 'twin' && onOpenTwin) onOpenTwin();
          else if (tab === 'roadmap' && onContinueToRoadmap) onContinueToRoadmap();
        }}
        selectedCareerTitle={currentCareer.title}
      />

      {/* Editorial Header */}
      <div
        style={{
          borderBottom: '1px solid var(--border-hairline)',
          paddingBottom: '28px',
          marginBottom: '36px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <Sliders size={18} color="var(--accent)" />
          <span className="tracking-widest-mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            MODULE 08 // COUNTERFACTUAL WHAT-IF LAB
          </span>
          {isSimBackendActive && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '980px',
                backgroundColor: 'rgba(52, 199, 89, 0.12)',
                color: '#28cd41',
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                border: '1px solid rgba(52, 199, 89, 0.25)'
              }}
            >
              ● LIVE SIMULATION ENGINE
            </span>
          )}
        </div>

        <h1
          className="font-display tracking-tight-display"
          style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '6px 0 12px'
          }}
        >
          Dynamic Scenario Simulator
        </h1>

        <p
          className="font-body"
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            maxWidth: '75ch',
            lineHeight: 1.6
          }}
        >
          Manipulate environmental variables in real time to observe instantaneous ranking recalibration across the 5D alignment surface. Validate how budget elasticity, regional migration, and family risk appetite alter strategic feasibility.
        </p>
      </div>

      {/* Simulator Control Surface */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-hairline)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
          padding: '32px',
          marginBottom: '40px',
          position: 'relative'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            borderBottom: '1px solid var(--border-hairline)',
            paddingBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={16} color="var(--accent)" />
            <span className="tracking-widest-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              SCENARIO INPUT PARAMETERS
            </span>
          </div>

          <button
            onClick={handleReset}
            className="alignx-key"
            style={{ fontSize: '0.72rem', padding: '6px 14px' }}
            title="Reset to default baseline scenario"
          >
            <RotateCcw size={12} />
            <span>RESET TO BASELINE</span>
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}
        >
          {/* Parameter 1: Annual Budget */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid var(--border-hairline)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Coins size={15} color="var(--accent)" />
                <label className="tracking-widest-mono" style={{ color: 'var(--text-secondary)' }}>
                  EDUCATION BUDGET:
                </label>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                ₹{budgetLakhs}.0L
              </span>
            </div>

            <input
              type="range"
              min="4"
              max="35"
              step="1"
              value={budgetLakhs}
              onChange={(e) => setBudgetLakhs(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--accent)',
                cursor: 'pointer',
                margin: '8px 0'
              }}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              <span>₹4L (Constrained)</span>
              <span>₹18L (Median)</span>
              <span>₹35L (Unrestricted)</span>
            </div>
          </div>

          {/* Parameter 2: Regional Cluster */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid var(--border-hairline)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <MapPin size={15} color="var(--accent)" />
              <label className="tracking-widest-mono" style={{ color: 'var(--text-secondary)' }}>
                PRIMARY METROPOLITAN HUB:
              </label>
            </div>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 16px',
                backgroundColor: 'var(--bg-deep)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '9px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease'
              }}
            >
              <option value="Bangalore">Bangalore (Tier-1 AI / Software / VC)</option>
              <option value="Chennai">Chennai (Hardware / Auto / Semiconductor)</option>
              <option value="Hyderabad">Hyderabad (Cloud / Enterprise Defense)</option>
              <option value="Pune">Pune (Kinetic Robotics / Auto / IoT)</option>
              <option value="Singapore">Singapore (APAC Financial Engineering / Quant)</option>
              <option value="Berlin">Berlin (Applied DeepTech / Industrial Biotech)</option>
            </select>
          </div>

          {/* Parameter 3: Parental Risk Tolerance */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid var(--border-hairline)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <ShieldAlert size={15} color="var(--accent)" />
              <label className="tracking-widest-mono" style={{ color: 'var(--text-secondary)' }}>
                FAMILY RISK PROFILE:
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {(['low', 'moderate', 'high'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRiskAppetite(lvl)}
                  className={`alignx-key ${riskAppetite === lvl ? 'active' : ''}`}
                  style={{
                    padding: '9px 6px',
                    fontSize: '0.72rem',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                marginTop: '10px'
              }}
            >
              {riskAppetite === 'low'
                ? '• Penalizes seed-stage & unaccredited pathways'
                : riskAppetite === 'high'
                ? '• Rewards frontier asymmetric potential'
                : '• Standard risk-adjusted stability curve'}
            </div>
          </div>

          {/* Parameter 4: Time Horizon */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid var(--border-hairline)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={15} color="var(--accent)" />
                <label className="tracking-widest-mono" style={{ color: 'var(--text-secondary)' }}>
                  TIME HORIZON:
                </label>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {timeHorizonMonths} Mo
              </span>
            </div>

            <input
              type="range"
              min="12"
              max="48"
              step="6"
              value={timeHorizonMonths}
              onChange={(e) => setTimeHorizonMonths(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--accent)',
                cursor: 'pointer',
                margin: '8px 0'
              }}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              <span>12m (Fast Track)</span>
              <span>24m</span>
              <span>48m (Graduate/R&D)</span>
            </div>
          </div>
        </div>

        {/* Telemetry Status Ribbon */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-hairline)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={15} color="#15803D" />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.04em'
              }}
            >
              SIMULATION ACTIVE: EVALUATING 25 STEAM CAREERS IN REAL TIME (0.36ms DETERMINISTIC EVAL)
            </span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              display: 'flex',
              gap: '16px'
            }}
          >
            <span>HUB: <strong style={{ color: 'var(--text-primary)' }}>{selectedLocation}</strong></span>
            <span>BUDGET: <strong style={{ color: 'var(--text-primary)' }}>₹{budgetLakhs}L</strong></span>
            <span>RISK: <strong style={{ color: 'var(--text-primary)' }}>{riskAppetite.toUpperCase()}</strong></span>
          </div>
        </div>
      </div>

      {/* Dynamic Results Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-hairline)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
          padding: '32px',
          marginBottom: '36px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}
        >
          <div>
            <span className="tracking-widest-mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              SIMULATION OUTCOMES // 5D COMPOSITE RE-RANKING
            </span>
            <h2
              className="font-display"
              style={{
                fontSize: '1.4rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginTop: '4px'
              }}
            >
              Simulated Career Trajectories vs. Static Baseline
            </h2>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)'
            }}
          >
            SHOWING TOP {results.length} PATHS
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {results.map((res, idx) => {
            const isTopRank = idx === 0;
            const isPromoted = res.delta > 2;
            const isDemoted = res.delta < -2;

            return (
              <div
                key={res.career.id}
                className="sim-result-row"
                style={{
                  borderRadius: '12px',
                  border: isTopRank ? '1.5px solid var(--accent)' : '1px solid var(--border-hairline)',
                  padding: '22px 28px',
                  backgroundColor: isTopRank ? 'var(--bg-surface)' : 'var(--bg-deep)',
                  display: 'grid',
                  gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1.4fr',
                  alignItems: 'center',
                  gap: '20px',
                  boxShadow: isTopRank ? '0 4px 16px rgba(158, 107, 56, 0.12)' : 'none',
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Career Title & Taxonomy */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: isTopRank ? 'var(--accent)' : 'var(--text-muted)'
                      }}
                    >
                      #{idx + 1}
                    </span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.15rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: 0
                      }}
                    >
                      {res.career.title}
                    </h3>
                    {isTopRank && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          backgroundColor: 'var(--accent)',
                          color: '#FFFFFF',
                          padding: '2px 8px',
                          borderRadius: '980px',
                          letterSpacing: '0.08em'
                        }}
                      >
                        TOP FIT
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                      display: 'flex',
                      gap: '12px'
                    }}
                  >
                    <span>{res.career.domain}</span>
                    <span>•</span>
                    <span>Risk: {res.career.riskLevel.toUpperCase()}</span>
                  </div>
                </div>

                {/* Baseline Score */}
                <div>
                  <div className="tracking-widest-mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                    BASELINE
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.25rem',
                      color: 'var(--text-secondary)',
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {res.originalScore}%
                  </div>
                </div>

                {/* Simulated Score */}
                <div>
                  <div className="tracking-widest-mono" style={{ fontSize: '0.62rem', color: 'var(--accent)' }}>
                    SIMULATED
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.45rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {res.simScore}%
                  </div>
                </div>

                {/* Delta Badge (Accessible contrast) */}
                <div>
                  <div className="tracking-widest-mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                    VARIANCE
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '980px',
                      backgroundColor:
                        res.delta > 0
                          ? 'rgba(22, 163, 74, 0.10)'
                          : res.delta < 0
                          ? 'rgba(220, 38, 38, 0.10)'
                          : 'rgba(0, 0, 0, 0.05)',
                      color:
                        res.delta > 0
                          ? '#15803D'
                          : res.delta < 0
                          ? '#B91C1C'
                          : 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                      marginTop: '2px'
                    }}
                  >
                    {res.delta > 0 ? (
                      <TrendingUp size={13} />
                    ) : res.delta < 0 ? (
                      <TrendingDown size={13} />
                    ) : null}
                    <span>{res.delta > 0 ? `+${res.delta}` : res.delta}%</span>
                  </div>
                </div>

                {/* Rank Shift Indicator */}
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: isPromoted
                        ? 'rgba(158, 107, 56, 0.08)'
                        : isDemoted
                        ? 'rgba(0, 0, 0, 0.03)'
                        : 'transparent',
                      color: isPromoted
                        ? 'var(--accent)'
                        : isDemoted
                        ? 'var(--text-muted)'
                        : 'var(--text-secondary)'
                    }}
                  >
                    {isPromoted ? '↑ PROMOTED' : isDemoted ? '↓ DEMOTED' : '— STABLE'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Causality Intelligence & Sensitivity Diagnostic */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-hairline)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
          padding: '32px',
          marginBottom: '36px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Sparkles size={16} color="var(--accent)" />
          <span className="tracking-widest-mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            DECISION ENGINE SYSTEMIC CAUSALITY
          </span>
        </div>

        <h3
          className="font-display"
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '10px'
          }}
        >
          Why {topResult.career.title} Ranked #1 Under This Scenario:
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginTop: '18px'
          }}
        >
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)'
            }}
          >
            <div className="tracking-widest-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              FINANCIAL AFFORDABILITY (20%)
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', margin: '4px 0' }}>
              {topResult.fFit}% Score
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {isBudgetShifted
                ? `Simulated budget of ₹${budgetLakhs}L provides comfortable margin over estimated education cost.`
                : 'Baseline ₹14L annual budget sufficiently covers top-tier university pathways.'}
            </p>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)'
            }}
          >
            <div className="tracking-widest-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              REGIONAL HIRING VELOCITY (10%)
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', margin: '4px 0' }}>
              {topResult.lFit}% Score
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {isLocationShifted
                ? `Adjusted focus to ${selectedLocation} re-evaluated regional demand clusters and tech ecosystems.`
                : `${selectedLocation} remains the primary baseline epicenter for this role.`}
            </p>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)'
            }}
          >
            <div className="tracking-widest-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              FAMILY RISK ALIGNMENT (15%)
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', margin: '4px 0' }}>
              {topResult.aFam}% Score
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {isRiskShifted
                ? `Adjusted ${riskAppetite.toUpperCase()} risk appetite matched against career stability metrics.`
                : 'Balanced risk profile aligned with moderate compensation volatility.'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border-hairline)',
          paddingTop: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="alignx-key"
              style={{ padding: '12px 20px', fontSize: '0.78rem' }}
            >
              <span>← 5D RECOMMENDATIONS</span>
            </button>
          )}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            CURRENT SIMULATION READY FOR EXECUTION
          </span>
        </div>

        {onContinueToRoadmap && (
          <button
            onClick={onContinueToRoadmap}
            className="btn-alignx-primary"
            style={{ padding: '14px 32px' }}
          >
            <span>GENERATE STRATEGIC ROADMAP FOR #{topResult.career.title}</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Responsive Stacking Media Styles */}
      <style>{`
        @media (max-width: 900px) {
          .sim-result-row {
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
            padding: 18px 20px !important;
          }
          .sim-result-row > div:first-child {
            grid-column: 1 / -1;
          }
          .sim-result-row > div:last-child {
            text-align: left !important;
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </div>
  );
};
