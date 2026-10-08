import React, { useState, useEffect, useMemo } from 'react';
import type { LifeStage } from '../../types/alignx';
import { type DiscoveryChoice, type DiscoveryScenario } from '../../data/mockAlignxData';
import { getDiscoveryScenariosForStage } from '../../data/stageQuestionsData';
import { RollButton } from '../RollButton';
import { saveSessionProgress, getSessionProgress } from '../../utils/sessionManager';
import { ApiService } from '../../services/api';
import { ArrowRight, ChevronLeft, CheckCircle2, Zap, SlidersHorizontal } from 'lucide-react';

interface DiscoveryModuleProps {
  onComplete: (discoveryResults: Record<number, string>) => void;
  onSkipToAptitude?: () => void;
}

const STAGE_LABELS: Record<LifeStage, { name: string; tag: string; description: string }> = {
  class10: { name: 'Class 10', tag: 'SECONDARY FOUNDATION', description: 'Stream selection & foundational exploratory challenges' },
  class12: { name: 'Class 12', tag: 'HIGHER SECONDARY', description: 'Degrees, competitive exams & pre-college projects' },
  ug: { name: 'Undergraduate', tag: 'HIGHER EDUCATION', description: 'Technical specializations, engineering & lab dilemmas' },
  pg: { name: 'Postgraduate', tag: 'ADVANCED R&D', description: 'Deep research, theoretical proofs & high-consequence labs' },
  professional: { name: 'Working Pro', tag: 'INDUSTRY CAREER', description: 'Production architecture, team leadership & strategic pivots' }
};

export const DiscoveryModule: React.FC<DiscoveryModuleProps> = ({ onComplete, onSkipToAptitude }) => {
  // Read life stage from session or default to undergraduate
  const sessionData = useMemo(() => getSessionProgress(), []);
  const initialStage: LifeStage = sessionData.studentProfile?.stage || 'ug';

  const [currentStage, setCurrentStage] = useState<LifeStage>(initialStage);
  const [showStageSelector, setShowStageSelector] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, DiscoveryChoice>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  // Load scenarios calibrated to the active stage
  const scenarios: DiscoveryScenario[] = useMemo(() => {
    return getDiscoveryScenariosForStage(currentStage);
  }, [currentStage]);

  const scenario = scenarios[currentIdx] || scenarios[0];
  const totalMissions = scenarios.length;
  const progressPercent = Math.round(((currentIdx + (isFinished ? 1 : 0)) / totalMissions) * 100);

  // Reset or adjust index when stage changes
  const handleStageChange = (newStage: LifeStage) => {
    setCurrentStage(newStage);
    setCurrentIdx(0);
    setSelectedChoices({});
    setIsFinished(false);
    setShowStageSelector(false);

    // Update session with selected stage
    const curr = getSessionProgress();
    if (curr.studentProfile) {
      saveSessionProgress({
        studentProfile: {
          ...curr.studentProfile,
          stage: newStage
        }
      });
    }
  };

  // Compute live normalized Holland RIASEC scores (0–100%) as choices are made
  const calibratedRiasec = useMemo(() => {
    const rawPoints = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const choicesList = Object.values(selectedChoices);

    choicesList.forEach((choice) => {
      if (choice?.riasecDelta) {
        if (choice.riasecDelta.R) rawPoints.R += choice.riasecDelta.R;
        if (choice.riasecDelta.I) rawPoints.I += choice.riasecDelta.I;
        if (choice.riasecDelta.A) rawPoints.A += choice.riasecDelta.A;
        if (choice.riasecDelta.S) rawPoints.S += choice.riasecDelta.S;
        if (choice.riasecDelta.E) rawPoints.E += choice.riasecDelta.E;
        if (choice.riasecDelta.C) rawPoints.C += choice.riasecDelta.C;
      }
    });

    // If no choices made yet, neutral cohort baseline is 50%
    if (choicesList.length === 0) {
      return { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 };
    }

    // Normalized psychometric standard score bounded cleanly between 42% and 98%
    // Each mission contributes ~35 pts to primary and ~10-15 pts to secondary
    const maxPotential = Math.max(choicesList.length * 35, 35);
    const normalize = (pts: number) => {
      const ratio = pts / maxPotential;
      return Math.min(98, Math.max(42, Math.round(45 + ratio * 53)));
    };

    return {
      R: normalize(rawPoints.R),
      I: normalize(rawPoints.I),
      A: normalize(rawPoints.A),
      S: normalize(rawPoints.S),
      E: normalize(rawPoints.E),
      C: normalize(rawPoints.C)
    };
  }, [selectedChoices]);

  // Keyboard navigation support: 1, 2, 3, 4 to choose, Enter to proceed
  useEffect(() => {
    if (isFinished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const choiceIndex = parseInt(e.key, 10) - 1;
        if (scenario?.choices[choiceIndex]) {
          handleSelectChoice(scenario.choices[choiceIndex]);
        }
      } else if (e.key === 'Enter') {
        if (scenario && selectedChoices[scenario.id]) {
          handleNext();
        }
      } else if (e.key === 'ArrowLeft' && currentIdx > 0) {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, selectedChoices, scenario, isFinished]);

  const handleSelectChoice = (choice: DiscoveryChoice) => {
    if (!scenario) return;
    setSelectedChoices(prev => ({ ...prev, [scenario.id]: choice }));
    setPulseKey(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleNext = () => {
    if (scenario && selectedChoices[scenario.id]) {
      if (currentIdx < totalMissions - 1) {
        setCurrentIdx(currentIdx + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setIsFinished(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Archetype Synthesis Calculation directly using normalized 0-100% scores
  const synthesisResults = useMemo(() => {
    const finalScores = {
      realistic: calibratedRiasec.R,
      investigative: calibratedRiasec.I,
      artistic: calibratedRiasec.A,
      social: calibratedRiasec.S,
      enterprising: calibratedRiasec.E,
      conventional: calibratedRiasec.C
    };

    // Sorted dimensions with technical numeric code identifiers (NO EMOJIS)
    const sortedDimensions = [
      { key: 'realistic', code: 'R', numCode: '01', label: 'Builder & Systems Engineer', score: finalScores.realistic },
      { key: 'investigative', code: 'I', numCode: '02', label: 'Scientist & Deep Theorist', score: finalScores.investigative },
      { key: 'artistic', code: 'A', numCode: '03', label: 'Spatial Creator & UX Visionary', score: finalScores.artistic },
      { key: 'social', code: 'S', numCode: '04', label: 'People Mentor & Crisis Mediator', score: finalScores.social },
      { key: 'enterprising', code: 'E', numCode: '05', label: 'Venture Leader & Growth Strategist', score: finalScores.enterprising },
      { key: 'conventional', code: 'C', numCode: '06', label: 'Integrity Sentinel & Precision Architect', score: finalScores.conventional }
    ].sort((a, b) => b.score - a.score);

    return {
      scores: finalScores,
      primaryArchetype: sortedDimensions[0],
      secondaryArchetype: sortedDimensions[1],
      dimensions: sortedDimensions
    };
  }, [calibratedRiasec]);

  const activeChoice = scenario ? selectedChoices[scenario.id] : undefined;

  return (
    <div style={{ maxWidth: '1080px', margin: '20px auto 70px', padding: '20px 24px 0' }}>
      {/* Top Header: Phase Title, Life Stage Badge & Stepper Strip */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.18em',
                  color: 'var(--accent)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Zap size={14} color="var(--accent)" />
                PHASE 03 // SITUATIONAL CAREER DISCOVERY
              </span>

              {/* Stage calibration tag with interactive switch */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowStageSelector(!showStageSelector)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                    padding: '3px 10px',
                    backgroundColor: 'rgba(45, 90, 67, 0.08)',
                    border: '1px solid rgba(45, 90, 67, 0.3)',
                    color: 'var(--accent)',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                  title="Click to change life stage calibration"
                >
                  <SlidersHorizontal size={11} />
                  CALIBRATED: {STAGE_LABELS[currentStage]?.name.toUpperCase()} ▾
                </button>

                {showStageSelector && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '6px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      zIndex: 30,
                      minWidth: '240px',
                      padding: '6px 0'
                    }}
                  >
                    <div style={{ padding: '6px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-hairline)' }}>
                      SELECT CALIBRATION STAGE:
                    </div>
                    {(Object.keys(STAGE_LABELS) as LifeStage[]).map(stg => (
                      <button
                        key={stg}
                        onClick={() => handleStageChange(stg)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          background: currentStage === stg ? 'rgba(45, 90, 67, 0.08)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: currentStage === stg ? 'var(--accent)' : 'var(--text-primary)'
                        }}
                      >
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
                          {STAGE_LABELS[stg].name}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                          {STAGE_LABELS[stg].description}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {STAGE_LABELS[currentStage]?.description}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              MISSION {Math.min(currentIdx + 1, totalMissions)} OF {totalMissions} ({progressPercent}%)
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-deep)',
                padding: '3px 8px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              KEYS 1-4 / ENTER
            </span>
          </div>
        </div>

        {/* 6-Mission Step Indicator Strip with clear numeric markers */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${totalMissions}, 1fr)`, gap: '8px', marginBottom: '8px' }}>
          {scenarios.map((sc, idx) => {
            const isDone = selectedChoices[sc.id] !== undefined;
            const isCurrent = idx === currentIdx;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  if (selectedChoices[sc.id] || idx <= currentIdx) {
                    setCurrentIdx(idx);
                  }
                }}
                style={{
                  height: '24px',
                  backgroundColor: isDone
                    ? 'rgba(45, 90, 67, 0.15)'
                    : isCurrent
                    ? 'rgba(184, 130, 76, 0.15)'
                    : 'var(--bg-deep)',
                  border: isDone
                    ? '1.5px solid var(--accent)'
                    : isCurrent
                    ? '1.5px solid #B8824C'
                    : '1px solid var(--border-hairline)',
                  padding: '0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: isDone || idx <= currentIdx ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                }}
                title={`Mission 0${idx + 1}: ${sc.category}`}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: isDone ? 'var(--accent)' : isCurrent ? '#B8824C' : 'var(--text-muted)'
                  }}
                >
                  0{idx + 1}
                </span>
                {isDone && <CheckCircle2 size={10} color="var(--accent)" />}
              </button>
            );
          })}
        </div>
      </div>

      {!isFinished && scenario ? (
        <div>
          {/* Main Mission Tactical Card */}
          <div
            style={{
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              padding: 'clamp(24px, 4vw, 40px)',
              position: 'relative',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)'
            }}
          >
            {/* Top Tactical Briefing Strip */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-hairline)',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    color: 'var(--accent)',
                    fontWeight: 800,
                    backgroundColor: 'rgba(45, 90, 67, 0.08)',
                    padding: '3px 8px',
                    border: '1px solid rgba(45, 90, 67, 0.2)'
                  }}
                >
                  DOSSIER 0{currentIdx + 1} / 0{totalMissions}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.08em'
                  }}
                >
                  {scenario.missionCode}
                </span>
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                {scenario.category}
              </span>
            </div>

            {/* Scenario Narrative */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.4rem, 2.6vw, 1.95rem)',
                fontWeight: 700,
                lineHeight: 1.35,
                color: 'var(--text-primary)',
                marginBottom: '20px',
                letterSpacing: '-0.01em'
              }}
            >
              {scenario.scenario}
            </h2>

            {/* Dilemma Callout Protocol */}
            <div
              style={{
                backgroundColor: 'rgba(45, 90, 67, 0.05)',
                borderLeft: '3px solid var(--accent)',
                padding: '14px 20px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Zap size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)', letterSpacing: '0.14em', fontWeight: 800, marginRight: '8px' }}>
                  TACTICAL DILEMMA:
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                  }}
                >
                  {scenario.dilemma}
                </span>
              </div>
            </div>

            {/* 4 Interactive Choice Cards (1 Full Row Per Option for Maximum Legibility) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              {scenario.choices.map((choice, i) => {
                const isSelected = activeChoice?.id === choice.id;
                const shortcutNum = i + 1;
                const numLabel = `0${shortcutNum}`;

                return (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'left',
                      padding: '20px 24px',
                      borderRadius: '0px',
                      backgroundColor: isSelected ? 'rgba(45, 90, 67, 0.07)' : 'var(--bg-deep)',
                      border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isSelected ? '0 4px 18px rgba(45, 90, 67, 0.12)' : 'none',
                      transform: isSelected ? 'translateY(-1px)' : 'none',
                      position: 'relative',
                      width: '100%'
                    }}
                  >
                    {/* Top Row: Archetype Badge, Numeric Marker, Trait & Shortcut Key */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            color: isSelected ? 'var(--accent)' : 'var(--text-secondary)'
                          }}
                        >
                          [{numLabel}]
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            padding: '2px 8px',
                            backgroundColor: isSelected ? 'var(--accent)' : 'rgba(24, 24, 22, 0.08)',
                            color: isSelected ? '#FFFFFF' : 'var(--text-secondary)'
                          }}
                        >
                          {choice.archetype}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.66rem',
                            color: 'var(--text-muted)',
                            letterSpacing: '0.04em'
                          }}
                        >
                          {choice.badge}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isSelected && (
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              color: '#FFFFFF',
                              backgroundColor: 'var(--accent)',
                              padding: '2px 8px',
                              letterSpacing: '0.06em'
                            }}
                          >
                            ACTIVE SELECTION
                          </span>
                        )}
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.64rem',
                            fontWeight: 700,
                            color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                            border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                            padding: '2px 8px',
                            backgroundColor: isSelected ? 'rgba(45, 90, 67, 0.15)' : 'transparent'
                          }}
                        >
                          KEY {shortcutNum}
                        </span>
                      </div>
                    </div>

                    {/* Action Title */}
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.24rem',
                        fontWeight: 700,
                        lineHeight: 1.3,
                        marginBottom: '8px',
                        color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {choice.title}
                    </div>

                    {/* Action Concrete Description — Full row breadth for effortless readability */}
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.94rem',
                        lineHeight: 1.6,
                        color: 'var(--text-secondary)',
                        marginBottom: '12px'
                      }}
                    >
                      {choice.description}
                    </div>

                    {/* Bottom Trait Resonance Strip */}
                    <div
                      style={{
                        borderTop: isSelected ? '1px solid rgba(45, 90, 67, 0.2)' : '1px solid var(--border-hairline)',
                        paddingTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                          fontWeight: isSelected ? 700 : 500
                        }}
                      >
                        + {choice.traitBonus.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live RIASEC Telemetry Bar (Technical, Minimal Numbers) */}
            <div
              key={pulseKey}
              style={{
                backgroundColor: 'var(--bg-deep)',
                border: '1px solid var(--border-subtle)',
                padding: '16px 22px',
                marginBottom: '28px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.14em', color: 'var(--text-secondary)', fontWeight: 800 }}>
                  LIVE HOLLAND RIASEC CALIBRATION TELEMETRY (0–100% SCALE)
                </span>
                {activeChoice && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 700 }}>
                    RECORDED: {activeChoice.archetype}
                  </span>
                )}
              </div>

              {/* 6 Dimension Columns with Normalized 0-100% Scores */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
                {[
                  { num: '01', code: 'R', label: 'REALISTIC', val: calibratedRiasec.R, color: '#2D5A43' },
                  { num: '02', code: 'I', label: 'INVESTIGATIVE', val: calibratedRiasec.I, color: '#3A6B53' },
                  { num: '03', code: 'A', label: 'ARTISTIC', val: calibratedRiasec.A, color: '#B8824C' },
                  { num: '04', code: 'S', label: 'SOCIAL', val: calibratedRiasec.S, color: '#6A8A73' },
                  { num: '05', code: 'E', label: 'ENTERPRISING', val: calibratedRiasec.E, color: '#9E6B38' },
                  { num: '06', code: 'C', label: 'CONVENTIONAL', val: calibratedRiasec.C, color: '#4A5D53' }
                ].map((item, idx) => {
                  return (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                          {item.num} · {item.code}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {item.val}%
                        </span>
                      </div>
                      <div style={{ height: '3px', backgroundColor: 'var(--border-hairline)', position: 'relative' }}>
                        <div
                          style={{
                            height: '100%',
                            backgroundColor: item.color,
                            width: `${item.val}%`,
                            transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation & Advance buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-hairline)',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: currentIdx === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
                  cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  padding: '8px 12px'
                }}
              >
                <ChevronLeft size={16} />
                <span>PREVIOUS MISSION</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {onSkipToAptitude && (
                  <button
                    onClick={onSkipToAptitude}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline'
                    }}
                  >
                    SKIP TO APTITUDE →
                  </button>
                )}

                <RollButton
                  onClick={handleNext}
                  variant={activeChoice ? 'primary' : 'outline'}
                  disabled={!activeChoice}
                  icon={<ArrowRight size={15} />}
                  style={{
                    opacity: activeChoice ? 1 : 0.45,
                    cursor: activeChoice ? 'pointer' : 'not-allowed'
                  }}
                >
                  {currentIdx < totalMissions - 1
                    ? `PROCEED TO MISSION 0${currentIdx + 2} (ENTER) →`
                    : 'FINALIZE DISCOVERY SYNTHESIS →'}
                </RollButton>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Discovery Completion Screen (ZERO EMOJIS, PURE NUMERIC ALIGNX SYSTEM) */
        <div
          style={{
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            padding: '52px 40px',
            textAlign: 'center',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '0px',
                backgroundColor: 'rgba(45, 90, 67, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid var(--accent)'
              }}
            >
              <CheckCircle2 size={32} color="var(--accent)" />
            </div>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.18em', marginBottom: '10px', fontWeight: 800 }}>
            MISSION DEBRIEF COMPLETE // RIASEC CONSTELLATION MAPPED
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '14px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            {synthesisResults.primaryArchetype.label.toUpperCase()}
          </h2>

          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 36px', fontSize: '1.02rem', lineHeight: 1.6 }}>
            Across all {totalMissions} tactical mission dilemmas for{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{STAGE_LABELS[currentStage]?.name}</strong>, you demonstrated high inclination toward{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{synthesisResults.primaryArchetype.label}</strong> with secondary synergy in{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{synthesisResults.secondaryArchetype.label}</strong>.
          </p>

          {/* Archetype Breakdown Cards (NO EMOJIS — PURE NUMERIC MONOSPACE IDENTIFIERS) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', maxWidth: '880px', margin: '0 auto 40px' }}>
            {synthesisResults.dimensions.map((dim, idx) => {
              const rankLabel = `0${idx + 1}`;
              const isDominant = idx === 0;
              const isSecondary = idx === 1;

              return (
                <div
                  key={dim.key}
                  style={{
                    backgroundColor: isDominant ? 'rgba(45, 90, 67, 0.08)' : 'var(--bg-deep)',
                    border: isDominant ? '1.5px solid var(--accent)' : '1px solid var(--border-subtle)',
                    padding: '18px 12px',
                    textAlign: 'center',
                    position: 'relative'
                  }}
                >
                  {/* Clean Monospace Index Number (Replaces Emojis) */}
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: isDominant ? 'var(--accent)' : 'var(--text-muted)',
                      letterSpacing: '0.12em',
                      marginBottom: '8px'
                    }}
                  >
                    {rankLabel} // {dim.code}
                  </div>

                  {/* Big Percentage Number */}
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                    {dim.score}%
                  </div>

                  {/* Dimension Name */}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--text-secondary)', marginTop: '8px', textTransform: 'uppercase', lineHeight: 1.25, fontWeight: 700 }}>
                    {dim.key}
                  </div>

                  {/* Status Badge */}
                  {isDominant && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#FFFFFF', backgroundColor: 'var(--accent)', fontWeight: 800, marginTop: '8px', padding: '2px 4px', letterSpacing: '0.06em' }}>
                      DOMINANT
                    </div>
                  )}
                  {isSecondary && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#B8824C', backgroundColor: 'rgba(184, 130, 76, 0.15)', fontWeight: 800, marginTop: '8px', padding: '2px 4px', letterSpacing: '0.06em' }}>
                      SECONDARY
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <RollButton
              onClick={async () => {
                saveSessionProgress({
                  lastActiveView: 'aptitude',
                  completedStages: {
                    ...getSessionProgress().completedStages,
                    discovery: true
                  }
                });

                // Asynchronously submit discovery assessment session to backend
                ApiService.startAssessment('career_discovery')
                  .then(res => {
                    if (res?.data?.assessmentId) {
                      return ApiService.completeAssessment(res.data.assessmentId, 'career_discovery', {
                        riasecScores: synthesisResults.scores,
                        responses: Object.entries(selectedChoices).map(([qId, ch]) => ({
                          questionId: Number(qId),
                          value: ch.tag,
                          dimensionImpact: ch.riasecDelta
                        }))
                      });
                    }
                  })
                  .catch(err => console.warn('[ALIGNX Discovery] Assessment submit note:', err));

                // Send answers record for onComplete
                const answersRecord: Record<number, string> = {};
                Object.entries(selectedChoices).forEach(([qId, ch]) => {
                  answersRecord[Number(qId)] = ch.tag;
                });
                onComplete(answersRecord);
              }}
              variant="primary"
              icon={<ArrowRight size={15} />}
            >
              PROCEED TO COGNITIVE APTITUDE EVALUATION →
            </RollButton>
          </div>
        </div>
      )}
    </div>
  );
};
