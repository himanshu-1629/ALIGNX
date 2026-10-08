import React, { useState, useEffect, useMemo } from 'react';
import { DISCOVERY_SCENARIOS, type DiscoveryChoice } from '../../data/mockAlignxData';
import { RollButton } from '../RollButton';
import { saveSessionProgress, getSessionProgress } from '../../utils/sessionManager';
import { ApiService } from '../../services/api';
import { ArrowRight, ChevronLeft, CheckCircle2, Zap, Sparkles } from 'lucide-react';

interface DiscoveryModuleProps {
  onComplete: (discoveryResults: Record<number, string>) => void;
  onBack?: () => void;
  onSkipToAptitude?: () => void;
  draftDiscovery?: {
    currentIdx: number;
    selectedChoices: Record<number, DiscoveryChoice>;
    isFinished: boolean;
  };
  onUpdateDraft?: (updates: {
    currentIdx?: number;
    selectedChoices?: Record<number, DiscoveryChoice>;
    isFinished?: boolean;
  }) => void;
}

export const DiscoveryModule: React.FC<DiscoveryModuleProps> = ({
  onComplete,
  onBack,
  onSkipToAptitude,
  draftDiscovery,
  onUpdateDraft
}) => {
  const [currentIdx, setCurrentIdx] = useState(draftDiscovery?.currentIdx ?? 0);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, DiscoveryChoice>>(
    draftDiscovery?.selectedChoices ?? {}
  );
  const [isFinished, setIsFinished] = useState(draftDiscovery?.isFinished ?? false);
  const [pulseKey, setPulseKey] = useState(0);

  // Sync state if draftDiscovery changes externally
  useEffect(() => {
    if (draftDiscovery) {
      if (draftDiscovery.currentIdx !== undefined) setCurrentIdx(draftDiscovery.currentIdx);
      if (draftDiscovery.selectedChoices) setSelectedChoices(draftDiscovery.selectedChoices);
      if (draftDiscovery.isFinished !== undefined) setIsFinished(draftDiscovery.isFinished);
    }
  }, [draftDiscovery]);

  const scenario = DISCOVERY_SCENARIOS[currentIdx];
  const totalMissions = DISCOVERY_SCENARIOS.length;
  const progressPercent = Math.round(((currentIdx + (isFinished ? 1 : 0)) / totalMissions) * 100);

  // Compute live cumulative RIASEC scores as the student makes choices
  const cumulativeRiasec = useMemo(() => {
    const scores = { R: 45, I: 45, A: 45, S: 45, E: 45, C: 45 };
    Object.values(selectedChoices).forEach((choice) => {
      if (choice?.riasecDelta) {
        if (choice.riasecDelta.R) scores.R += choice.riasecDelta.R;
        if (choice.riasecDelta.I) scores.I += choice.riasecDelta.I;
        if (choice.riasecDelta.A) scores.A += choice.riasecDelta.A;
        if (choice.riasecDelta.S) scores.S += choice.riasecDelta.S;
        if (choice.riasecDelta.E) scores.E += choice.riasecDelta.E;
        if (choice.riasecDelta.C) scores.C += choice.riasecDelta.C;
      }
    });
    return scores;
  }, [selectedChoices]);

  // Keyboard navigation support: 1, 2, 3, 4 to choose, Enter to proceed
  useEffect(() => {
    if (isFinished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs/textareas
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const choiceIndex = parseInt(e.key, 10) - 1;
        if (scenario.choices[choiceIndex]) {
          handleSelectChoice(scenario.choices[choiceIndex]);
        }
      } else if (e.key === 'Enter') {
        if (selectedChoices[scenario.id]) {
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
    const updated = { ...selectedChoices, [scenario.id]: choice };
    setSelectedChoices(updated);
    setPulseKey(prev => prev + 1);
    onUpdateDraft?.({ selectedChoices: updated });
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      onUpdateDraft?.({ currentIdx: prevIdx });
    } else if (onBack) {
      onBack();
    }
  };

  const handleNext = () => {
    if (selectedChoices[scenario.id]) {
      if (currentIdx < totalMissions - 1) {
        const nextIdx = currentIdx + 1;
        setCurrentIdx(nextIdx);
        onUpdateDraft?.({ currentIdx: nextIdx });
        window.scrollTo({ top: 120, behavior: 'smooth' });
      } else {
        setIsFinished(true);
        onUpdateDraft?.({ isFinished: true });
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }
  };

  // Archetype Synthesis Calculation
  const synthesisResults = useMemo(() => {
    const rawR = cumulativeRiasec.R;
    const rawI = cumulativeRiasec.I;
    const rawA = cumulativeRiasec.A;
    const rawS = cumulativeRiasec.S;
    const rawE = cumulativeRiasec.E;
    const rawC = cumulativeRiasec.C;

    const maxVal = Math.max(rawR, rawI, rawA, rawS, rawE, rawC, 1);
    const scale = (val: number) => Math.min(99, Math.max(55, Math.round((val / maxVal) * 96)));

    const finalScores = {
      realistic: scale(rawR),
      investigative: scale(rawI),
      artistic: scale(rawA),
      social: scale(rawS),
      enterprising: scale(rawE),
      conventional: scale(rawC)
    };

    const sortedDimensions = [
      { key: 'realistic', label: 'Builder & Systems Engineer', score: finalScores.realistic, icon: '⚙️' },
      { key: 'investigative', label: 'Scientist & Deep Theorist', score: finalScores.investigative, icon: '🔬' },
      { key: 'artistic', label: 'Spatial Creator & UX Visionary', score: finalScores.artistic, icon: '🎨' },
      { key: 'social', label: 'People Mentor & Crisis Mediator', score: finalScores.social, icon: '🤝' },
      { key: 'enterprising', label: 'Venture Leader & Growth Strategist', score: finalScores.enterprising, icon: '🚀' },
      { key: 'conventional', label: 'Integrity Sentinel & Precision Architect', score: finalScores.conventional, icon: '📊' }
    ].sort((a, b) => b.score - a.score);

    return {
      scores: finalScores,
      primaryArchetype: sortedDimensions[0],
      secondaryArchetype: sortedDimensions[1],
      dimensions: sortedDimensions
    };
  }, [cumulativeRiasec]);

  const activeChoice = selectedChoices[scenario?.id];

  return (
    <div style={{ maxWidth: '1040px', margin: '36px auto 60px', padding: '0 24px' }}>
      {/* Top Header: Phase Title & Stepper Strip */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '22px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                padding: '2px 8px',
                backgroundColor: 'rgba(45, 90, 67, 0.1)',
                border: '1px solid rgba(45, 90, 67, 0.25)',
                color: 'var(--accent)',
                fontWeight: 600
              }}
            >
              6 TACTICAL MISSIONS
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
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

        {/* 6-Mission Step Indicator Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '12px' }}>
          {DISCOVERY_SCENARIOS.map((sc, idx) => {
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
                  height: '6px',
                  backgroundColor: isDone
                    ? 'var(--accent)'
                    : isCurrent
                    ? '#B8824C'
                    : 'var(--border-hairline)',
                  border: 'none',
                  padding: 0,
                  cursor: isDone || idx <= currentIdx ? 'pointer' : 'default',
                  transition: 'background-color 0.25s ease',
                  position: 'relative'
                }}
                title={`Mission 0${sc.id}: ${sc.category}`}
              />
            );
          })}
        </div>
      </div>

      {!isFinished && scenario ? (
        <div>
          {/* Main Mission Tactical Card */}
          <div
            style={{
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-surface)',
              padding: 'clamp(24px, 4vw, 44px)',
              position: 'relative',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)'
            }}
          >
            {/* Mission Category & Meta Tag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  color: 'var(--accent)',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}
              >
                {scenario.missionCode}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.08em'
                }}
              >
                DIMENSION: {scenario.category.toUpperCase()}
              </div>
            </div>

            {/* Scenario Narrative */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
                fontWeight: 700,
                lineHeight: 1.35,
                color: 'var(--text-primary)',
                marginBottom: '20px'
              }}
            >
              {scenario.scenario}
            </h2>

            {/* Dilemma Callout Protocol */}
            <div
              style={{
                backgroundColor: 'rgba(45, 90, 67, 0.05)',
                borderLeft: '3px solid var(--accent)',
                padding: '12px 18px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Zap size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.02em'
                }}
              >
                {scenario.dilemma}
              </div>
            </div>

            {/* 4 Interactive Choice Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '32px' }}>
              {scenario.choices.map((choice, i) => {
                const isSelected = activeChoice?.id === choice.id;
                const shortcutNum = i + 1;

                return (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      padding: '20px',
                      borderRadius: '0px',
                      backgroundColor: isSelected ? 'rgba(45, 90, 67, 0.08)' : 'var(--bg-deep)',
                      border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isSelected ? '0 6px 20px rgba(45, 90, 67, 0.14)' : 'none',
                      transform: isSelected ? 'translateY(-2px)' : 'none',
                      position: 'relative'
                    }}
                  >
                    <div>
                      {/* Top Archetype Badge & Shortcut Key */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            padding: '3px 8px',
                            backgroundColor: isSelected ? 'var(--accent)' : 'rgba(24, 24, 22, 0.08)',
                            color: isSelected ? '#FFFFFF' : 'var(--text-secondary)'
                          }}
                        >
                          {choice.archetype}
                        </span>

                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                            border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                            padding: '2px 6px',
                            backgroundColor: isSelected ? 'rgba(45, 90, 67, 0.15)' : 'transparent'
                          }}
                        >
                          [{shortcutNum}]
                        </span>
                      </div>

                      {/* Action Title */}
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.08rem',
                          fontWeight: 700,
                          lineHeight: 1.3,
                          marginBottom: '8px',
                          color: isSelected ? 'var(--accent)' : 'var(--text-primary)'
                        }}
                      >
                        {choice.title}
                      </div>

                      {/* Action Concrete Description */}
                      <div
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.85rem',
                          lineHeight: 1.5,
                          color: 'var(--text-secondary)',
                          marginBottom: '16px'
                        }}
                      >
                        {choice.description}
                      </div>
                    </div>

                    {/* Trait Resonance Strip */}
                    <div
                      style={{
                        borderTop: isSelected ? '1px solid rgba(45, 90, 67, 0.25)' : '1px solid var(--border-hairline)',
                        paddingTop: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={12} color={isSelected ? 'var(--accent)' : 'var(--text-muted)'} />
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.66rem',
                            color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                            fontWeight: isSelected ? 700 : 500
                          }}
                        >
                          {choice.traitBonus.label}
                        </span>
                      </div>

                      {isSelected && (
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            color: '#FFFFFF',
                            backgroundColor: 'var(--accent)',
                            padding: '2px 6px'
                          }}
                        >
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Trait Equalizer HUD */}
            <div
              key={pulseKey}
              style={{
                backgroundColor: 'var(--bg-deep)',
                border: '1px solid var(--border-subtle)',
                padding: '16px 20px',
                marginBottom: '28px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--text-secondary)', fontWeight: 700 }}>
                  LIVE CAREER DNA SYNTHESIS // REAL-TIME EQUALIZER
                </span>
                {activeChoice && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 700 }}>
                    ⚡ {activeChoice.archetype} SELECTED
                  </span>
                )}
              </div>

              {/* 6 Mini Bars for RIASEC */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                {[
                  { label: 'R: BUILD', val: cumulativeRiasec.R, color: '#2D5A43' },
                  { label: 'I: SCIENCE', val: cumulativeRiasec.I, color: '#3A6B53' },
                  { label: 'A: DESIGN', val: cumulativeRiasec.A, color: '#B8824C' },
                  { label: 'S: PEOPLE', val: cumulativeRiasec.S, color: '#6A8A73' },
                  { label: 'E: LEAD', val: cumulativeRiasec.E, color: '#9E6B38' },
                  { label: 'C: PRECISE', val: cumulativeRiasec.C, color: '#4A5D53' }
                ].map((item, idx) => {
                  const pct = Math.min(100, Math.max(30, Math.round((item.val / 120) * 100)));
                  return (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                          {item.label}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {item.val}
                        </span>
                      </div>
                      <div style={{ height: '4px', backgroundColor: 'var(--border-hairline)', position: 'relative' }}>
                        <div
                          style={{
                            height: '100%',
                            backgroundColor: item.color,
                            width: `${pct}%`,
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
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  padding: '8px 12px'
                }}
              >
                <ChevronLeft size={16} />
                <span>{currentIdx === 0 ? '← PREVIOUS' : 'PREVIOUS MISSION'}</span>
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
                    ? 'NEXT MISSION (ENTER) →'
                    : 'FINALIZE DISCOVERY SYNTHESIS →'}
                </RollButton>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Discovery Completion Screen */
        <div
          style={{
            border: '1px solid var(--accent-border)',
            backgroundColor: 'var(--bg-surface)',
            padding: '48px 40px',
            textAlign: 'center',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(45, 90, 67, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid var(--accent)'
              }}
            >
              <CheckCircle2 size={36} color="var(--accent)" />
            </div>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.18em', marginBottom: '8px', fontWeight: 700 }}>
            MISSION DEBRIEF COMPLETE // RIASEC CONSTELLATION MAPPED
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>
            {synthesisResults.primaryArchetype.label.toUpperCase()}
          </h2>

          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 28px', fontSize: '1rem', lineHeight: 1.6 }}>
            Across all 6 tactical mission dilemmas, you demonstrated high inclination toward{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{synthesisResults.primaryArchetype.label}</strong> with secondary synergy in{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{synthesisResults.secondaryArchetype.label}</strong>.
          </p>

          {/* Archetype Breakdown Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', maxWidth: '860px', margin: '0 auto 36px' }}>
            {synthesisResults.dimensions.map((dim, idx) => (
              <div
                key={dim.key}
                style={{
                  backgroundColor: idx === 0 ? 'rgba(45, 90, 67, 0.08)' : 'var(--bg-deep)',
                  border: idx === 0 ? '1.5px solid var(--accent)' : '1px solid var(--border-subtle)',
                  padding: '16px 12px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.3rem', marginBottom: '6px' }}>{dim.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {dim.score}%
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', lineHeight: 1.2 }}>
                  {dim.key}
                </div>
                {idx === 0 && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent)', fontWeight: 700, marginTop: '6px' }}>
                    DOMINANT
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setIsFinished(false);
                setCurrentIdx(totalMissions - 1);
                onUpdateDraft?.({ isFinished: false, currentIdx: totalMissions - 1 });
              }}
              className="alignx-key"
              style={{ padding: '14px 24px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <ChevronLeft size={16} />
              <span>← PREVIOUS MISSION</span>
            </button>
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
