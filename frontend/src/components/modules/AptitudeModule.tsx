import React, { useState, useEffect, useMemo } from 'react';
import type { LifeStage, AptitudeQuestion } from '../../types/alignx';
import { getAptitudeQuestionsForStage } from '../../data/stageQuestionsData';
import { RollButton } from '../RollButton';
import { saveSessionProgress, getSessionProgress } from '../../utils/sessionManager';
import { ApiService } from '../../services/api';
import { ArrowRight, ChevronLeft, Activity, Sparkles, Brain, ShieldCheck, SlidersHorizontal } from 'lucide-react';

interface AptitudeModuleProps {
  onComplete: (score: number, dimensionScores: Record<string, number>) => void;
  onSkipToDna?: () => void;
}

const STAGE_LABELS: Record<LifeStage, { name: string; tag: string; description: string }> = {
  class10: { name: 'Class 10', tag: 'FOUNDATION STEM', description: 'Elementary logic, algebra patterns & spatial reasoning' },
  class12: { name: 'Class 12', tag: 'ENTRANCE RIGOR', description: 'Competitive reasoning, rates, series & coordinate projections' },
  ug: { name: 'Undergraduate', tag: 'ANALYTICAL LOGIC', description: 'Algorithmic state transitions, scale & systemic bottlenecks' },
  pg: { name: 'Postgraduate', tag: 'RESEARCH & ADVANCED', description: 'Stochastic probability, non-linear dynamics & epistemic logic' },
  professional: { name: 'Working Pro', tag: 'EXECUTIVE & TECH', description: 'Strategic trade-offs, unit economics & distributed throughput' }
};

export const AptitudeModule: React.FC<AptitudeModuleProps> = ({ onComplete, onSkipToDna }) => {
  const sessionData = useMemo(() => getSessionProgress(), []);
  const initialStage: LifeStage = sessionData.studentProfile?.stage || 'ug';

  const [currentStage, setCurrentStage] = useState<LifeStage>(initialStage);
  const [showStageSelector, setShowStageSelector] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Load questions tailored for the active life stage
  const questions: AptitudeQuestion[] = useMemo(() => {
    return getAptitudeQuestionsForStage(currentStage);
  }, [currentStage]);

  const question = questions[currentIdx] || questions[0];
  const totalQuestions = questions.length;

  const handleStageChange = (newStage: LifeStage) => {
    setCurrentStage(newStage);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowStageSelector(false);

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

  const handleSelectOption = (qId: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  // Keyboard navigation support: 1-4 / A-D to select, Enter to advance
  useEffect(() => {
    if (showResults || isCalculating) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toLowerCase();
      let optIdx = -1;
      if (['1', '2', '3', '4'].includes(key)) {
        optIdx = parseInt(key, 10) - 1;
      } else if (key === 'a') optIdx = 0;
      else if (key === 'b') optIdx = 1;
      else if (key === 'c') optIdx = 2;
      else if (key === 'd') optIdx = 3;

      if (optIdx >= 0 && question?.options[optIdx]) {
        handleSelectOption(question.id, optIdx);
      } else if (e.key === 'Enter') {
        if (question && selectedAnswers[question.id] !== undefined) {
          handleNext();
        }
      } else if (e.key === 'ArrowLeft' && currentIdx > 0) {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, selectedAnswers, question, showResults, isCalculating]);


  const [calculatedMetrics, setCalculatedMetrics] = useState({
    logical: 85,
    numerical: 85,
    analytical: 85,
    spatial: 85,
    verbal: 85
  });
  const [overallCalculatedScore, setOverallCalculatedScore] = useState(85);

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        setShowResults(true);

        // Dynamic psychometric calibration across the 5 evaluated cognitive dimensions
        const computedMetrics = {
          logical: 75,
          numerical: 75,
          analytical: 75,
          spatial: 75,
          verbal: 75
        };

        questions.forEach((q) => {
          const optIdx = selectedAnswers[q.id];
          const rawScore = optIdx !== undefined ? (q.options[optIdx]?.score ?? 8) : 10;
          // Calibrated psychometric curve:
          // Mastery (score 20) -> 96%
          // Near-miss (score 14) -> 73%
          // Heuristic (score 10) -> 58%
          // Divergent (score 6-7) -> 43-47%
          const calibrated = Math.min(98, Math.max(35, Math.round(20 + (rawScore / 20) * 76)));

          if (q.llmTag.includes('logical')) computedMetrics.logical = calibrated;
          else if (q.llmTag.includes('numerical')) computedMetrics.numerical = calibrated;
          else if (q.llmTag.includes('analytical')) computedMetrics.analytical = calibrated;
          else if (q.llmTag.includes('spatial')) computedMetrics.spatial = calibrated;
          else if (q.llmTag.includes('verbal')) computedMetrics.verbal = calibrated;
        });

        const finalScore = Math.round(
          (computedMetrics.logical +
            computedMetrics.numerical +
            computedMetrics.analytical +
            computedMetrics.spatial +
            computedMetrics.verbal) /
            5
        );

        setCalculatedMetrics(computedMetrics);
        setOverallCalculatedScore(finalScore);

        // Persist to session
        saveSessionProgress({
          lastActiveView: 'dna',
          aptitudeScore: finalScore,
          aptitudeMetrics: {
            abstractLogic: computedMetrics.logical,
            systemsThinking: computedMetrics.analytical,
            quantitativeEstimation: computedMetrics.numerical,
            spatialArchitecture: computedMetrics.spatial,
            riskTolerance: computedMetrics.verbal
          },
          completedStages: {
            onboarding: true,
            discovery: true,
            aptitude: true,
            dna: false,
            parent: false,
            dashboard: false
          }
        });

        // Submit aptitude assessment to backend
        ApiService.startAssessment('aptitude')
          .then(res => {
            if (res?.data?.assessmentId) {
              return ApiService.completeAssessment(res.data.assessmentId, 'aptitude', {
                aptitudeScores: computedMetrics,
                responses: Object.entries(selectedAnswers).map(([qId, val]) => ({ questionId: Number(qId), value: val }))
              });
            }
          })
          .catch(err => console.warn('[ALIGNX Aptitude] Assessment submit note:', err));
      }, 900);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };


  return (
    <div style={{ maxWidth: '980px', margin: '40px auto 70px', padding: '0 24px' }}>
      {/* Module Title & Life Stage Stepper */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '22px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.18em', color: 'var(--accent)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Brain size={14} color="var(--accent)" />
                PHASE 04 // 5D COGNITIVE APTITUDE EVALUATION
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
                  title="Click to switch calibration stage"
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              VECTOR {currentIdx + 1} OF {totalQuestions}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-deep)', padding: '2px 8px', border: '1px solid var(--border-subtle)' }}>
              KEYS 1-4 / ENTER
            </span>
          </div>
        </div>

        <div style={{ height: '3px', backgroundColor: 'var(--border-hairline)', width: '100%', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              backgroundColor: 'var(--accent)',
              width: `${((currentIdx + 1) / totalQuestions) * 100}%`,
              transition: 'width 0.35s ease'
            }}
          />
        </div>
      </div>

      {isCalculating ? (
        /* Synthesis Loading State */
        <div
          className="titanium-card"
          style={{
            padding: '80px 40px',
            textAlign: 'center',
            border: '1px solid var(--accent-border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <Activity size={40} color="var(--accent)" className="animate-spin-slow" />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--accent)', letterSpacing: '0.18em', marginBottom: '12px', fontWeight: 800 }}>
            CALIBRATING 5 COGNITIVE VECTORS ACCORDING TO STAGE TELEMETRY...
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
            SYNTHESIZING PSYCHOMETRIC MATRIX
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '520px', margin: '12px auto 0' }}>
            Benchmarking abstract logic, systems decomposition, quantitative facility, and spatial architecture for {STAGE_LABELS[currentStage]?.name}.
          </p>
        </div>
      ) : !showResults && question ? (
        /* Assessment Question Interface */
        <div
          className="titanium-card"
          style={{
            padding: '44px 40px',
            border: '1px solid var(--border-hairline)'
          }}
        >
          {/* Metadata pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--accent)',
                backgroundColor: 'rgba(45, 90, 67, 0.08)',
                padding: '3px 10px',
                border: '1px solid rgba(45, 90, 67, 0.25)',
                letterSpacing: '0.08em'
              }}
            >
              0{currentIdx + 1} // {question.dimension.toUpperCase()}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              VECTOR_TAG: {question.llmTag}
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.3rem, 2.4vw, 1.7rem)',
              fontWeight: 700,
              lineHeight: 1.45,
              color: 'var(--text-primary)',
              marginBottom: '32px',
              letterSpacing: '-0.015em'
            }}
          >
            {question.prompt}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {question.options.map((opt, i) => {
              const isSelected = selectedAnswers[question.id] === i;
              const optionLetters = ['A', 'B', 'C', 'D'];
              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(question.id, i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    textAlign: 'left',
                    borderRadius: '0px',
                    backgroundColor: isSelected ? 'rgba(45, 90, 67, 0.08)' : 'var(--bg-deep)',
                    border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-hairline)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.96rem',
                    cursor: 'pointer',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected ? '0 4px 16px rgba(45, 90, 67, 0.12)' : 'none',
                    transform: isSelected ? 'translateY(-1px)' : 'none',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '0px',
                        backgroundColor: isSelected ? 'var(--accent)' : 'rgba(0, 0, 0, 0.05)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {optionLetters[i] || i + 1}
                    </span>
                    <span style={{ letterSpacing: '-0.01em', lineHeight: 1.45, fontWeight: isSelected ? 600 : 400 }}>
                      {opt.text}
                    </span>
                  </div>

                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-subtle)',
                      borderRadius: '0px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      backgroundColor: isSelected ? 'rgba(45, 90, 67, 0.12)' : 'transparent'
                    }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          backgroundColor: 'var(--accent)',
                          borderRadius: '0px'
                        }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--border-hairline)', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="alignx-key"
                style={{
                  opacity: currentIdx === 0 ? 0.4 : 1,
                  cursor: currentIdx === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft size={14} />
                <span>PREVIOUS</span>
              </button>

              {onSkipToDna && (
                <button
                  type="button"
                  onClick={onSkipToDna}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  SKIP TO DNA →
                </button>
              )}
            </div>

            <RollButton
              onClick={handleNext}
              disabled={selectedAnswers[question.id] === undefined}
              variant="primary"
              icon={<ArrowRight size={14} />}
              style={{
                opacity: selectedAnswers[question.id] === undefined ? 0.5 : 1,
                pointerEvents: selectedAnswers[question.id] === undefined ? 'none' : 'auto'
              }}
            >
              {currentIdx < totalQuestions - 1 ? 'NEXT VECTOR (ENTER) →' : 'FINALIZE APTITUDE MATRIX →'}
            </RollButton>
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div
          className="titanium-card"
          style={{
            padding: '48px 40px',
            border: '1px solid var(--accent-border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '36px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Sparkles size={14} color="var(--accent)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.18em', fontWeight: 800 }}>
                  EVALUATION COMPLETE • CALIBRATED FOR {STAGE_LABELS[currentStage]?.name.toUpperCase()}
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, margin: '8px 0', letterSpacing: '-0.035em' }}>
                COGNITIVE APTITUDE: {overallCalculatedScore} / 100
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '1rem' }}>
                Calibrated across 5 cognitive vectors for {STAGE_LABELS[currentStage]?.name}.
              </p>
            </div>

            <div
              style={{
                border: '1px solid var(--accent-border)',
                borderRadius: '0px',
                padding: '16px 22px',
                backgroundColor: 'rgba(45, 90, 67, 0.09)'
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)', letterSpacing: '0.14em', fontWeight: 800 }}>DECISION STATUS</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginTop: '2px' }}>
                {overallCalculatedScore >= 80 ? 'QUALIFIED FOR TIER-1 DEEPTECH' : 'SOLID FOUNDATION FOR SPECIALIZATION'}
              </div>
            </div>
          </div>

          {/* 5 Dimension Visualizations (Clean Monospace Numbers from Actual Answers) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {[
              { num: '01', dim: 'Abstract Logic', tag: 'logic', score: calculatedMetrics.logical },
              { num: '02', dim: 'Systems Thinking', tag: 'systems', score: calculatedMetrics.analytical },
              { num: '03', dim: 'Quantitative Facility', tag: 'quant', score: calculatedMetrics.numerical },
              { num: '04', dim: 'Spatial Topology', tag: 'spatial', score: calculatedMetrics.spatial },
              { num: '05', dim: 'Verbal & Relational', tag: 'verbal', score: calculatedMetrics.verbal }
            ].map((d, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid var(--border-hairline)',
                  borderRadius: '0px',
                  padding: '18px',
                  backgroundColor: 'var(--bg-panel)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{d.num} · {d.dim}</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 800 }}>{d.score}%</span>
                </div>
                <div style={{ height: '3px', backgroundColor: 'var(--border-hairline)', width: '100%', borderRadius: '0px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.score}%`, backgroundColor: 'var(--accent)' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-hairline)', paddingTop: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
              <ShieldCheck size={14} color="var(--accent)" />
              <span>SAVED TO ALIGNX SESSION MEMORY</span>
            </div>

            <RollButton
              onClick={() => onComplete(overallCalculatedScore, {
                logic: calculatedMetrics.logical,
                systems: calculatedMetrics.analytical,
                quant: calculatedMetrics.numerical,
                spatial: calculatedMetrics.spatial,
                verbal: calculatedMetrics.verbal
              })}
              variant="primary"
              icon={<ArrowRight size={15} />}
            >
              UNLOCK CAREER DNA REVEAL →
            </RollButton>
          </div>
        </div>
      )}
    </div>
  );
};
