import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_CAREERS } from '../../data/mockAlignxData';
import { ApiService } from '../../services/api';
import type { CareerRecommendation, AlignxSessionProgress } from '../../types/alignx';
import {
  ArrowRight,
  ArrowLeft,
  Sliders,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Sparkles,
  MapPin,
  ShieldAlert,
  Clock,
  Coins,
  CheckCircle2,
  Cpu,
  Target
} from 'lucide-react';

interface WhatIfModuleProps {
  careerId?: string;
  sessionProgress?: AlignxSessionProgress;
  onSelectCareer?: (careerId: string) => void;
  onContinueToRoadmap?: (careerId?: string) => void;
  onBackToDashboard?: () => void;
  onOpenTwin?: () => void;
}

interface SimulatedCareerOutcome {
  career: CareerRecommendation;
  baselineRank: number;
  simulatedRank: number;
  rankDelta: number; // positive = climbed
  baselineScore: number;
  simScore: number;
  scoreDelta: number;
  sFit: number;
  baselineFFit: number;
  simFFit: number;
  baselineFamFit: number;
  simFamFit: number;
  baselineMFit: number;
  simMFit: number;
  baselineLFit: number;
  simLFit: number;
  degreeCost: number;
  rankStatus: 'PROMOTED' | 'DEMOTED' | 'STABLE';
}

const normalizeSlug = (slug?: string) => (slug || '').toLowerCase().replace(/[-_]/g, '');

export const WhatIfModule: React.FC<WhatIfModuleProps> = ({
  careerId = 'ai_ml_engineer',
  sessionProgress,
  onSelectCareer,
  onContinueToRoadmap,
  onBackToDashboard,
  onOpenTwin
}) => {
  // Baseline parameters extracted from student's profile
  const defaultBudget = sessionProgress?.parentData?.maxBudgetAnnualLakhs || sessionProgress?.studentProfile?.budgetAnnualLakhs || 16;
  const defaultLocation = sessionProgress?.studentProfile?.location || 'Bangalore';
  const defaultRisk = sessionProgress?.parentData?.riskAppetite || 'moderate';
  const defaultHorizon = 24;

  // Simulator active levers
  const [budgetLakhs, setBudgetLakhs] = useState<number>(defaultBudget);
  const [selectedLocation, setSelectedLocation] = useState<string>(defaultLocation);
  const [riskAppetite, setRiskAppetite] = useState<'low' | 'moderate' | 'high'>(defaultRisk);
  const [timeHorizonMonths, setTimeHorizonMonths] = useState<number>(defaultHorizon);
  const [filterMode, setFilterMode] = useState<'all' | 'promoted' | 'demoted' | 'top5'>('all');

  // Currently focused career in the spotlight
  const [focusedId, setFocusedId] = useState<string>(() => {
    const match = INITIAL_CAREERS.find(c => normalizeSlug(c.id) === normalizeSlug(careerId));
    return match ? match.id : INITIAL_CAREERS[0].id;
  });

  const [isSimBackendActive, setIsSimBackendActive] = useState(false);
  const [, setBackendSimResults] = useState<any[] | null>(null);

  // Sync focusedId when careerId prop changes externally
  useEffect(() => {
    if (careerId) {
      const match = INITIAL_CAREERS.find(c => normalizeSlug(c.id) === normalizeSlug(careerId));
      if (match && match.id !== focusedId) {
        setFocusedId(match.id);
      }
    }
  }, [careerId]);

  // Reset to default baseline parameters
  const handleReset = () => {
    setBudgetLakhs(defaultBudget);
    setSelectedLocation(defaultLocation);
    setRiskAppetite(defaultRisk);
    setTimeHorizonMonths(defaultHorizon);
  };

  // Helper to estimate realistic annual degree investment required per career domain
  const getCareerDegreeCostAnnual = (c: CareerRecommendation): number => {
    const t = `${c.title} ${c.domain}`.toLowerCase();
    if (t.includes('quantum') || t.includes('aerospace') || t.includes('neuroscience') || t.includes('satellite')) return 22;
    if (t.includes('vlsi') || t.includes('semiconductor') || t.includes('robotics') || t.includes('ai & machine')) return 16;
    if (t.includes('fintech') || t.includes('product') || t.includes('cloud') || t.includes('cyber')) return 14;
    return 10;
  };

  // Calculate baseline student fit from cognitive telemetry
  const computeStudentFit = (c: CareerRecommendation): number => {
    const rawMetrics: any = sessionProgress?.aptitudeMetrics || {};
    const baseAptitude = sessionProgress?.aptitudeScore || c.scores.studentFit || 80;

    const logic = rawMetrics.abstractLogic ?? rawMetrics.logical ?? baseAptitude;
    const quant = rawMetrics.quantitativeEstimation ?? rawMetrics.numerical ?? Math.max(60, baseAptitude - 2);
    const systems = rawMetrics.systemsThinking ?? rawMetrics.analytical ?? Math.min(98, baseAptitude + 1);
    const spatial = rawMetrics.spatialArchitecture ?? rawMetrics.spatial ?? Math.max(60, baseAptitude - 3);
    const verbal = rawMetrics.riskTolerance ?? rawMetrics.verbal ?? Math.max(60, baseAptitude - 4);

    const t = `${c.title} ${c.domain}`.toLowerCase();
    let fit = baseAptitude;
    if (t.includes('ai') || t.includes('machine learning')) fit = Math.round(0.40 * logic + 0.35 * quant + 0.25 * systems);
    else if (t.includes('vlsi') || t.includes('semiconductor')) fit = Math.round(0.40 * spatial + 0.35 * systems + 0.25 * logic);
    else if (t.includes('robot') || t.includes('autonomous')) fit = Math.round(0.38 * spatial + 0.32 * systems + 0.30 * logic);
    else if (t.includes('data platform') || t.includes('cloud')) fit = Math.round(0.40 * systems + 0.35 * logic + 0.25 * quant);
    else if (t.includes('cyber')) fit = Math.round(0.42 * systems + 0.38 * logic + 0.20 * quant);
    else if (t.includes('product') || t.includes('ui') || t.includes('ux')) fit = Math.round(0.42 * verbal + 0.33 * systems + 0.25 * spatial);
    else if (t.includes('quantum') || t.includes('quant')) fit = Math.round(0.45 * quant + 0.35 * logic + 0.20 * systems);
    else fit = Math.round(0.35 * logic + 0.35 * systems + 0.30 * quant);

    return Math.min(99, Math.max(50, fit));
  };

  // Comprehensive 5D simulation calculations
  const simulationData = useMemo(() => {
    // 1. Compute baseline rankings for all 25 careers
    const baselineList = INITIAL_CAREERS.map((c) => {
      const sFit = computeStudentFit(c);
      const degreeCost = getCareerDegreeCostAnnual(c);

      // Baseline financial fit
      const costRatio = defaultBudget / degreeCost;
      const bFFit = costRatio >= 1.25 ? 96 : costRatio >= 1.0 ? 89 : Math.max(45, Math.round(costRatio * 80));

      // Baseline family alignment
      const cRisk = (c.riskLevel || 'moderate').toLowerCase();
      let bFamFit = 85;
      if (defaultRisk === 'low') bFamFit = cRisk === 'low' ? 95 : cRisk === 'high' ? 68 : 84;
      else if (defaultRisk === 'high') bFamFit = cRisk === 'high' ? 95 : 85;
      else bFamFit = cRisk === 'low' ? 90 : cRisk === 'high' ? 80 : 88;

      // Baseline market fit
      const bMFit = c.scores.marketFit || 85;

      // Baseline location fit
      const hasLoc = c.topLocations.some(l => l.toLowerCase() === defaultLocation.toLowerCase());
      const bLFit = hasLoc ? 95 : 78;

      const baseOverall = Math.round(0.35 * sFit + 0.20 * bFFit + 0.15 * bFamFit + 0.20 * bMFit + 0.10 * bLFit);

      return {
        career: c,
        sFit,
        bFFit,
        bFamFit,
        bMFit,
        bLFit,
        baseOverall,
        degreeCost
      };
    }).sort((a, b) => b.baseOverall - a.baseOverall);

    const baselineRankMap = new Map<string, { rank: number; score: number }>();
    baselineList.forEach((item, idx) => {
      baselineRankMap.set(item.career.id, { rank: idx + 1, score: item.baseOverall });
    });

    // 2. Compute simulated rankings under modified scenario levers
    const simList = baselineList.map((item) => {
      const c = item.career;
      const sFit = item.sFit;

      // Lever 1: Financial elasticity against actual degree cost
      const simCostRatio = budgetLakhs / item.degreeCost;
      let simFFit = 85;
      if (simCostRatio >= 1.5) simFFit = 98;
      else if (simCostRatio >= 1.2) simFFit = 94;
      else if (simCostRatio >= 1.0) simFFit = 88;
      else if (simCostRatio >= 0.8) simFFit = 74;
      else simFFit = Math.max(38, Math.round(simCostRatio * 76));

      // Lever 2: Family risk tolerance
      const cRisk = (c.riskLevel || 'moderate').toLowerCase();
      let simFamFit = 85;
      if (riskAppetite === 'low') {
        simFamFit = cRisk === 'low' ? 96 : cRisk === 'high' ? 62 : 82;
      } else if (riskAppetite === 'high') {
        simFamFit = cRisk === 'high' ? 96 : cRisk === 'low' ? 82 : 88;
      } else {
        simFamFit = cRisk === 'low' ? 91 : cRisk === 'high' ? 80 : 89;
      }

      // Lever 3: Metropolitan cluster alignment
      const hasSimLoc = c.topLocations.some(l => l.toLowerCase() === selectedLocation.toLowerCase());
      const simLFit = hasSimLoc ? 96 : 74;

      // Lever 4: Time horizon sensitivity
      let simMFit = item.bMFit;
      const isResearchHeavy = item.degreeCost >= 18;
      if (timeHorizonMonths === 12) {
        simMFit = isResearchHeavy ? Math.max(65, simMFit - 8) : Math.min(98, simMFit + 4);
      } else if (timeHorizonMonths === 48) {
        simMFit = isResearchHeavy ? Math.min(99, simMFit + 8) : simMFit;
      }

      // Composite 5D simulated score
      const simScore = Math.min(99, Math.max(45, Math.round(
        0.35 * sFit +
        0.20 * simFFit +
        0.15 * simFamFit +
        0.20 * simMFit +
        0.10 * simLFit
      )));

      return {
        career: c,
        sFit,
        baselineFFit: item.bFFit,
        simFFit,
        baselineFamFit: item.bFamFit,
        simFamFit,
        baselineMFit: item.bMFit,
        simMFit,
        baselineLFit: item.bLFit,
        simLFit,
        simScore,
        degreeCost: item.degreeCost
      };
    }).sort((a, b) => b.simScore - a.simScore);

    // 3. Pair outcomes with rank shifts
    const outcomes: SimulatedCareerOutcome[] = simList.map((simItem, simIndex) => {
      const bInfo = baselineRankMap.get(simItem.career.id) || { rank: simIndex + 1, score: simItem.simScore };
      const simulatedRank = simIndex + 1;
      const baselineRank = bInfo.rank;
      const rankDelta = baselineRank - simulatedRank; // positive = climbed
      const scoreDelta = simItem.simScore - bInfo.score;

      const rankStatus: 'PROMOTED' | 'DEMOTED' | 'STABLE' =
        rankDelta >= 2 ? 'PROMOTED' : rankDelta <= -2 ? 'DEMOTED' : 'STABLE';

      return {
        career: simItem.career,
        baselineRank,
        simulatedRank,
        rankDelta,
        baselineScore: bInfo.score,
        simScore: simItem.simScore,
        scoreDelta,
        sFit: simItem.sFit,
        baselineFFit: simItem.baselineFFit,
        simFFit: simItem.simFFit,
        baselineFamFit: simItem.baselineFamFit,
        simFamFit: simItem.simFamFit,
        baselineMFit: simItem.baselineMFit,
        simMFit: simItem.simMFit,
        baselineLFit: simItem.baselineLFit,
        simLFit: simItem.simLFit,
        degreeCost: simItem.degreeCost,
        rankStatus
      };
    });

    return outcomes;
  }, [budgetLakhs, selectedLocation, riskAppetite, timeHorizonMonths, defaultBudget, defaultLocation, defaultRisk]);

  // Synchronize with backend simulator engine (debounced for network efficiency)
  useEffect(() => {
    let isCancelled = false;
    const handler = setTimeout(() => {
      ApiService.runSimulator({
        educationBudget: budgetLakhs * 100000,
        location: selectedLocation,
        riskAppetite: riskAppetite,
        timeToEmployment: timeHorizonMonths,
        scenarioName: `Sim_${selectedLocation}_${budgetLakhs}L`
      })
        .then(res => {
          if (!isCancelled && res?.data?.recommendations) {
            setBackendSimResults(res.data.recommendations);
            setIsSimBackendActive(true);
          }
        })
        .catch(err => {
          console.warn('[ALIGNX WhatIf] Backend simulator sync note:', err);
        });
    }, 450);

    return () => {
      isCancelled = true;
      clearTimeout(handler);
    };
  }, [budgetLakhs, selectedLocation, riskAppetite, timeHorizonMonths]);

  // Resolve currently focused career
  const spotlightOutcome = useMemo(() => {
    const match = simulationData.find(o => o.career.id === focusedId || normalizeSlug(o.career.id) === normalizeSlug(focusedId));
    return match || simulationData[0];
  }, [simulationData, focusedId]);

  // Filtered leaderboard rows
  const filteredOutcomes = useMemo(() => {
    if (filterMode === 'promoted') return simulationData.filter(o => o.rankDelta > 0);
    if (filterMode === 'demoted') return simulationData.filter(o => o.rankDelta < 0);
    if (filterMode === 'top5') return simulationData.slice(0, 5);
    return simulationData;
  }, [simulationData, filterMode]);

  const handleSelectFocused = (cId: string) => {
    setFocusedId(cId);
    onSelectCareer?.(cId);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '36px auto', padding: '0 28px' }}>
      {/* Studio Header & Top Navigation Bar */}
      <div
        style={{
          borderBottom: '1px solid var(--border-hairline)',
          paddingBottom: '24px',
          marginBottom: '32px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          {onBackToDashboard ? (
            <button
              onClick={onBackToDashboard}
              className="alignx-key"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 16px', fontSize: '0.74rem' }}
            >
              <ArrowLeft size={13} />
              <span>← RETURN TO 5D CAREER ALIGNMENT</span>
            </button>
          ) : <div />}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onOpenTwin && (
              <button
                onClick={onOpenTwin}
                className="alignx-key"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 16px', fontSize: '0.74rem' }}
              >
                <Cpu size={13} color="var(--accent)" />
                <span>INSPECT DIGITAL CAREER TWIN →</span>
              </button>
            )}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '0px',
                backgroundColor: isSimBackendActive ? 'rgba(52, 199, 89, 0.12)' : 'rgba(45, 90, 67, 0.08)',
                color: isSimBackendActive ? '#28cd41' : 'var(--accent)',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                border: '1px solid var(--border-hairline)'
              }}
            >
              ● {isSimBackendActive ? 'LIVE CLOUD SIMULATION' : 'DETERMINISTIC 5D ENGINE ACTIVE'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sliders size={18} color="var(--accent)" />
          <span className="tracking-widest-mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            PHASE 09 // COUNTERFACTUAL WHAT-IF LAB
          </span>
        </div>

        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '6px 0 10px',
            color: 'var(--text-primary)'
          }}
        >
          Dynamic Scenario Simulator & Sensitivity Stress-Testing
        </h1>

        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '85ch', lineHeight: 1.6 }}>
          Adjust financial capacity, metropolitan hubs, parental risk profiles, and horizon windows in real time. Observe instant multidimensional trajectory recalibration across all 25 frontier STEAM pathways.
        </p>
      </div>

      {/* Control Surface: The 4 Scenario Levers */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '0px',
          border: '1px solid var(--border-hairline)',
          padding: '28px 32px',
          marginBottom: '36px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={16} color="var(--accent)" />
            <span className="tracking-widest-mono" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              SCENARIO MANIPULATION LEVERS
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleReset}
              className="alignx-key"
              style={{ fontSize: '0.72rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Reset parameters to your baseline psychometric calibration"
            >
              <RotateCcw size={12} />
              <span>RESET TO BASELINE PROFILE</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Lever 1: Annual Budget */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px 22px', border: '1px solid var(--border-hairline)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Coins size={15} color="var(--accent)" />
                <label className="tracking-widest-mono" style={{ color: 'var(--text-secondary)' }}>
                  ANNUAL EDUCATION BUDGET
                </label>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent)' }}>
                ₹{budgetLakhs} LPA
              </span>
            </div>

            <input
              type="range"
              min="4"
              max="40"
              step="1"
              value={budgetLakhs}
              onChange={(e) => setBudgetLakhs(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer', margin: '10px 0' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              <span>₹4L (Scholarship-led)</span>
              <span>₹16L (Median)</span>
              <span>₹40L (Unrestricted)</span>
            </div>
          </div>

          {/* Lever 2: Target Metropolitan Hub */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px 22px', border: '1px solid var(--border-hairline)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <MapPin size={15} color="var(--accent)" />
              <label className="tracking-widest-mono" style={{ color: 'var(--text-secondary)' }}>
                TARGET REGIONAL HUB
              </label>
            </div>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                backgroundColor: 'var(--bg-deep)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '0px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <option value="Bangalore">Bangalore (Tier-1 AI, Systems & DeepTech Hub)</option>
              <option value="Hyderabad">Hyderabad (Cloud, Silicon & Enterprise Defense)</option>
              <option value="Chennai">Chennai (Semiconductor & Electric Mobility)</option>
              <option value="Pune">Pune (Autonomous Robotics & Mechatronics)</option>
              <option value="Delhi NCR">Delhi NCR (DefenseTech, Policy & Fintech)</option>
              <option value="Mumbai">Mumbai (Quantitative Finance & Algorithmic Markets)</option>
              <option value="Singapore">Singapore (APAC Global DeepTech & Capital)</option>
              <option value="Berlin">Berlin (Applied European DeepTech Lab)</option>
              <option value="Tokyo">Tokyo (Precision Hardware & Kinetic Robotics)</option>
            </select>
          </div>

          {/* Lever 3: Family Risk Appetite */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px 22px', border: '1px solid var(--border-hairline)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <ShieldAlert size={15} color="var(--accent)" />
              <label className="tracking-widest-mono" style={{ color: 'var(--text-secondary)' }}>
                FAMILY RISK APPETITE
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {(['low', 'moderate', 'high'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRiskAppetite(lvl)}
                  className={`alignx-key ${riskAppetite === lvl ? 'active' : ''}`}
                  style={{ padding: '8px 4px', fontSize: '0.72rem', textAlign: 'center', textTransform: 'uppercase' }}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              {riskAppetite === 'low'
                ? '• Penalizes volatile unaccredited roles; rewards established infrastructure'
                : riskAppetite === 'high'
                ? '• Rewards frontier venture-scale pathways (Quantum, Aerospace, CleanTech)'
                : '• Balanced risk curve matching standard industry volatility'}
            </div>
          </div>

          {/* Lever 4: Time Horizon */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px 22px', border: '1px solid var(--border-hairline)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={15} color="var(--accent)" />
                <label className="tracking-widest-mono" style={{ color: 'var(--text-secondary)' }}>
                  PREPARATION HORIZON
                </label>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent)' }}>
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
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer', margin: '10px 0' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              <span>12m (Fast-Track)</span>
              <span>24m (Undergrad)</span>
              <span>48m (R&D / Advanced)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spotlight Card: Detailed Impact on Focused Career */}
      <div
        style={{
          border: '1.5px solid var(--accent)',
          backgroundColor: 'var(--bg-surface)',
          padding: '32px 36px',
          marginBottom: '40px',
          boxShadow: '0 4px 20px rgba(45, 90, 67, 0.08)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Target size={18} color="var(--accent)" />
              <span className="tracking-widest-mono" style={{ color: 'var(--accent)', fontWeight: 700 }}>
                SPOTLIGHT CANDIDATE UNDER SIMULATION
              </span>
            </div>

            <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {spotlightOutcome.career.title.toUpperCase()}
            </h2>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Domain: <strong style={{ color: 'var(--text-primary)' }}>{spotlightOutcome.career.domain}</strong> • Required Degree Budget: ~₹{spotlightOutcome.degreeCost} LPA
            </div>
          </div>

          {/* Quick Career Focus Switcher */}
          <div style={{ minWidth: '280px' }}>
            <label className="tracking-widest-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              SWITCH SPOTLIGHT CAREER:
            </label>
            <select
              value={spotlightOutcome.career.id}
              onChange={(e) => handleSelectFocused(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                backgroundColor: 'var(--bg-deep)',
                border: '1px solid var(--border-hairline)',
                borderRadius: '0px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              {INITIAL_CAREERS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Big Comparative Scoreboard */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            padding: '24px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-hairline)',
            marginBottom: '24px'
          }}
        >
          <div>
            <div className="tracking-widest-mono" style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
              BASELINE STANDING
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '4px' }}>
              Rank #{spotlightOutcome.baselineRank} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>({spotlightOutcome.baselineScore}%)</span>
            </div>
          </div>

          <div>
            <div className="tracking-widest-mono" style={{ fontSize: '0.64rem', color: 'var(--accent)' }}>
              SIMULATED STANDING
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)', marginTop: '4px' }}>
              Rank #{spotlightOutcome.simulatedRank} <span style={{ fontSize: '1.2rem' }}>({spotlightOutcome.simScore}%)</span>
            </div>
          </div>

          <div>
            <div className="tracking-widest-mono" style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
              TRAJECTORY VARIANCE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: spotlightOutcome.scoreDelta >= 0 ? '#15803D' : '#B91C1C'
                }}
              >
                {spotlightOutcome.scoreDelta >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                {spotlightOutcome.scoreDelta >= 0 ? `+${spotlightOutcome.scoreDelta}%` : `${spotlightOutcome.scoreDelta}%`}
              </span>

              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '4px 8px',
                  backgroundColor: spotlightOutcome.rankDelta > 0 ? 'rgba(22, 163, 74, 0.1)' : spotlightOutcome.rankDelta < 0 ? 'rgba(220, 38, 38, 0.1)' : 'rgba(0,0,0,0.04)',
                  color: spotlightOutcome.rankDelta > 0 ? '#15803D' : spotlightOutcome.rankDelta < 0 ? '#B91C1C' : 'var(--text-muted)'
                }}
              >
                {spotlightOutcome.rankDelta > 0 ? `↑ CLIMBED ${spotlightOutcome.rankDelta} RANKS` : spotlightOutcome.rankDelta < 0 ? `↓ SLIPPED ${Math.abs(spotlightOutcome.rankDelta)} RANKS` : '— RANK UNCHANGED'}
              </span>
            </div>
          </div>
        </div>

        {/* 5-Dimensional Breakdown Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'STUDENT FIT', base: spotlightOutcome.sFit, sim: spotlightOutcome.sFit, weight: '35%' },
            { label: 'FINANCIAL FIT', base: spotlightOutcome.baselineFFit, sim: spotlightOutcome.simFFit, weight: '20%' },
            { label: 'FAMILY ALIGNMENT', base: spotlightOutcome.baselineFamFit, sim: spotlightOutcome.simFamFit, weight: '15%' },
            { label: 'MARKET DEMAND', base: spotlightOutcome.baselineMFit, sim: spotlightOutcome.simMFit, weight: '20%' },
            { label: 'LOCATION HUB', base: spotlightOutcome.baselineLFit, sim: spotlightOutcome.simLFit, weight: '10%' }
          ].map((dim, i) => (
            <div key={i} style={{ border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-deep)', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <span>{dim.label}</span>
                <span>{dim.weight}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: 'var(--font-mono)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dim.base}%</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>→</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: dim.sim >= dim.base ? 'var(--accent)' : '#B91C1C' }}>
                  {dim.sim}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Diagnostic Rationale */}
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-hairline)', paddingTop: '16px' }}>
          <strong>Systemic Causality Insight:</strong>{' '}
          {spotlightOutcome.simFFit > spotlightOutcome.baselineFFit && budgetLakhs >= spotlightOutcome.degreeCost
            ? `Allocating ₹${budgetLakhs} LPA fully satisfies the ₹${spotlightOutcome.degreeCost} LPA benchmark for Tier-1 labs, lifting Financial Feasibility from a bottleneck to a top catalyst.`
            : spotlightOutcome.simFFit < spotlightOutcome.baselineFFit
            ? `Budget of ₹${budgetLakhs} LPA introduces a financial deficit against estimated ₹${spotlightOutcome.degreeCost} LPA institutional tuition, requiring partial scholarship or loan coverage.`
            : `Stabilized across key dimensions under current ₹${budgetLakhs} LPA expenditure.`}{' '}
          {spotlightOutcome.simLFit > spotlightOutcome.baselineLFit
            ? `Selecting ${selectedLocation} unlocks top industry density for this sector.`
            : `Metropolitan hub ${selectedLocation} presents lower cluster density than primary hubs.`}
        </div>
      </div>

      {/* Full 25-Career Dynamic Leaderboard Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '0px',
          border: '1px solid var(--border-hairline)',
          padding: '32px',
          marginBottom: '36px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <span className="tracking-widest-mono" style={{ color: 'var(--accent)', fontWeight: 700 }}>
              SIMULATION OUTCOMES // COMPLETE 25 STEAM CAREER RE-RANKING
            </span>
            <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, margin: '4px 0 0' }}>
              Full Scenario Recalibration Leaderboard
            </h3>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `ALL (${simulationData.length})` },
              { id: 'promoted', label: `PROMOTED (↑ ${simulationData.filter(o => o.rankDelta > 0).length})` },
              { id: 'demoted', label: `DEMOTED (↓ ${simulationData.filter(o => o.rankDelta < 0).length})` },
              { id: 'top5', label: 'TOP 5 ONLY' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterMode(tab.id as any)}
                className={`alignx-key ${filterMode === tab.id ? 'active' : ''}`}
                style={{ padding: '6px 12px', fontSize: '0.7rem' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredOutcomes.map((item) => {
            const isSpotlight = item.career.id === spotlightOutcome.career.id;
            const isTopRank = item.simulatedRank === 1;

            return (
              <div
                key={item.career.id}
                onClick={() => handleSelectFocused(item.career.id)}
                style={{
                  border: isSpotlight ? '1.5px solid var(--accent)' : '1px solid var(--border-hairline)',
                  backgroundColor: isSpotlight ? 'var(--bg-surface)' : 'var(--bg-deep)',
                  padding: '18px 24px',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(260px, 2.5fr) 1fr 1fr 1fr 1.2fr',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                {/* Career Title & Taxonomy */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: isTopRank ? 'var(--accent)' : 'var(--text-muted)' }}>
                      #{item.simulatedRank}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.career.title}
                    </span>
                    {isTopRank && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, backgroundColor: 'var(--accent)', color: '#fff', padding: '2px 8px' }}>
                        TOP RANK
                      </span>
                    )}
                    {isSpotlight && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, border: '1px solid var(--accent)', color: 'var(--accent)', padding: '2px 6px' }}>
                        SPOTLIGHT
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {item.career.domain} • Risk: {item.career.riskLevel.toUpperCase()}
                  </div>
                </div>

                {/* Baseline Standing */}
                <div>
                  <div className="tracking-widest-mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                    BASELINE
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    #{item.baselineRank} ({item.baselineScore}%)
                  </div>
                </div>

                {/* Simulated Standing */}
                <div>
                  <div className="tracking-widest-mono" style={{ fontSize: '0.62rem', color: 'var(--accent)' }}>
                    SIMULATED
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--accent)', fontWeight: 700 }}>
                    #{item.simulatedRank} ({item.simScore}%)
                  </div>
                </div>

                {/* Variance */}
                <div>
                  <div className="tracking-widest-mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                    VARIANCE
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: item.scoreDelta >= 0 ? '#15803D' : '#B91C1C'
                    }}
                  >
                    {item.scoreDelta >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    <span>{item.scoreDelta >= 0 ? `+${item.scoreDelta}%` : `${item.scoreDelta}%`}</span>
                  </div>
                </div>

                {/* Rank Shift Badge */}
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: item.rankDelta > 0 ? 'rgba(22, 163, 74, 0.08)' : item.rankDelta < 0 ? 'rgba(220, 38, 38, 0.06)' : 'transparent',
                      color: item.rankDelta > 0 ? '#15803D' : item.rankDelta < 0 ? '#B91C1C' : 'var(--text-muted)'
                    }}
                  >
                    {item.rankDelta > 0 ? `↑ +${item.rankDelta} RANKS` : item.rankDelta < 0 ? `↓ ${item.rankDelta} RANKS` : '— STABLE'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connected Action Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          borderTop: '1px solid var(--border-hairline)',
          paddingTop: '28px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            SIMULATION COMPLETE // READY TO COMMIT STRATEGIC EXECUTION PATHWAY
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {onContinueToRoadmap && (
            <button
              onClick={() => onContinueToRoadmap(spotlightOutcome.career.id)}
              className="btn-alignx-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px' }}
            >
              <span>PROCEED TO STRATEGIC ROADMAP FOR {spotlightOutcome.career.title.toUpperCase()}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
