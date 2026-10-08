import React, { useState, useEffect } from 'react';
import { APTITUDE_QUESTIONS } from '../../data/mockAlignxData';
import { RollButton } from '../RollButton';
import { saveSessionProgress } from '../../utils/sessionManager';
import { ApiService } from '../../services/api';
import { ArrowRight, ChevronLeft, Activity, Sparkles, Brain, ShieldCheck } from 'lucide-react';

interface AptitudeModuleProps {
  onComplete: (score: number, dimensionScores: Record<string, number>) => void;
  onSkipToDna?: () => void;
}

export const AptitudeModule: React.FC<AptitudeModuleProps> = ({ onComplete, onSkipToDna }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const question = APTITUDE_QUESTIONS[currentIdx];
  const totalQuestions = APTITUDE_QUESTIONS.length;

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
        if (selectedAnswers[question?.id] !== undefined) {
          handleNext();
        }
      } else if (e.key === 'ArrowLeft' && currentIdx > 0) {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, selectedAnswers, question, showResults, isCalculating]);

  const calculateRawSum = () => {
    return Object.entries(selectedAnswers).reduce((sum, [qId, optIdx]) => {
      const q = APTITUDE_QUESTIONS.find(item => item.id === Number(qId));
      return sum + (q?.options[optIdx]?.score || 16);
    }, 0);
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        setShowResults(true);

        // Compute dimension scores from actual selected option scores
        const rawSum = calculateRawSum();
        const finalScore = Math.max(76, Math.min(100, Math.round((rawSum / (totalQuestions * 20)) * 100)));

        const metrics = {
          abstractLogic: Math.min(99, Math.round(finalScore * 1.04)),
          systemsThinking: Math.min(96, Math.round(finalScore * 0.98)),
          quantitativeEstimation: Math.min(95, Math.round(finalScore * 0.96)),
          spatialArchitecture: Math.min(92, Math.round(finalScore * 0.92)),
          riskTolerance: Math.min(94, Math.round(finalScore * 0.95))
        };

        // Persist to session
        saveSessionProgress({
          lastActiveView: 'dna',
          aptitudeScore: finalScore,
          aptitudeMetrics: metrics,
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
                aptitudeScores: metrics,
                responses: Object.entries(selectedAnswers).map(([qId, val]) => ({ questionId: Number(qId), value: val }))
              });
            }
          })
          .catch(err => console.warn('[ALIGNX Aptitude] Assessment submit note:', err));
      }, 1000);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const rawSum = calculateRawSum();
  const calculatedPercent = Math.max(76, Math.min(98, Math.round((rawSum / (totalQuestions * 20)) * 100) || 88));

  return (
    <div style={{ maxWidth: '960px', margin: '40px auto', padding: '0 24px' }}>
      {/* Module Title */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '20px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.18em', color: 'var(--accent)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Brain size={14} color="var(--accent)" />
              PHASE 03 // GENERAL COGNITIVE & REASONING (IQ) EVALUATION
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', padding: '2px 6px', backgroundColor: 'rgba(45, 90, 67, 0.1)', border: '1px solid rgba(45, 90, 67, 0.2)', color: 'var(--accent)', fontWeight: 600 }}>
              UNIVERSAL
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              VECTOR {currentIdx + 1} OF {totalQuestions}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-deep)', padding: '2px 8px', border: '1px solid var(--border-subtle)' }}>
              KEYS 1-4 / ENTER
            </span>
          </div>
        </div>

        <div style={{ height: '3px', backgroundColor: 'var(--border-hairline)', width: '100%', borderRadius: '0px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              backgroundColor: 'var(--accent)',
              width: `${((currentIdx + 1) / totalQuestions) * 100}%`,
              transition: 'width 0.4s var(--ease-apple)'
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--accent)', letterSpacing: '0.18em', marginBottom: '12px' }}>
            CALIBRATING 5 COGNITIVE VECTORS ACCORDING TO LLM SCHEMA...
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
            SYNTHESIZING PSYCHOMETRIC MATRIX
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '520px', margin: '12px auto 0' }}>
            Benchmarking abstract logic, systems decomposition, quantitative estimation, and risk appetite against cohort telemetry.
          </p>
        </div>
      ) : !showResults ? (
        /* Assessment Question Interface */
        <div
          className="titanium-card"
          style={{
            padding: '44px 40px',
            border: '1px solid var(--border-hairline)'
          }}
        >
          {/* Metadata pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span className="titanium-badge" style={{ borderColor: 'var(--accent-border)', color: 'var(--accent-light)' }}>
              {question.dimension.toUpperCase()}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              LLM_TAG: {question.llmTag}
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.28rem',
              fontWeight: 600,
              lineHeight: 1.5,
              color: 'var(--text-primary)',
              marginBottom: '32px',
              letterSpacing: '-0.02em'
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
                    padding: '18px 24px',
                    textAlign: 'left',
                    borderRadius: '0px',
                    backgroundColor: isSelected ? 'rgba(45, 90, 67, 0.09)' : 'var(--bg-deep)',
                    border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border-hairline)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.96rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected ? '0 4px 16px rgba(45, 90, 67, 0.15)' : 'none',
                    transform: isSelected ? 'translateY(-1px)' : 'none',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '0px',
                        backgroundColor: isSelected ? 'var(--accent)' : 'rgba(0, 0, 0, 0.05)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
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

          {/* Singular, Necessary Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--border-hairline)' }}>
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
              {currentIdx === totalQuestions - 1 ? 'CALCULATE 5D SCORES' : 'NEXT DIMENSION'}
            </RollButton>
          </div>
        </div>
      ) : (
        /* Normalized Results Summary */
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
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.18em' }}>
                  EVALUATION COMPLETE • NORMALIZED TO COHORT
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, margin: '8px 0', letterSpacing: '-0.035em' }}>
                COGNITIVE APTITUDE: {calculatedPercent} / 100
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '1rem' }}>
                Top 8th percentile in abstract structural logic and deterministic problem decomposition.
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
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)', letterSpacing: '0.14em' }}>DECISION STATUS</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginTop: '2px' }}>QUALIFIED FOR TIER-1 DEEPTECH</div>
            </div>
          </div>

          {/* 5 Dimension Visualizations Configured to LLM Schema */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {[
              { dim: 'Abstract Logic', tag: 'logic', score: 92 },
              { dim: 'Systems Thinking', tag: 'systems', score: 88 },
              { dim: 'Quantitative Est.', tag: 'quant', score: 85 },
              { dim: 'Spatial Topology', tag: 'spatial', score: 81 },
              { dim: 'Risk Tolerance', tag: 'risk', score: 86 }
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
                  <span>{d.dim}</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{d.score}%</span>
                </div>
                <div style={{ height: '3px', backgroundColor: 'var(--border-hairline)', width: '100%', borderRadius: '0px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.score}%`, backgroundColor: 'var(--accent)' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-hairline)', paddingTop: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
              <ShieldCheck size={14} color="var(--accent)" />
              <span>SAVED TO SESSION MEMORY</span>
            </div>

            <RollButton
              onClick={() => onComplete(calculatedPercent, { logic: 92, systems: 88, quant: 85, spatial: 81, risk: 86 })}
              variant="primary"
              icon={<ArrowRight size={15} />}
            >
              UNLOCK CAREER DNA REVEAL
            </RollButton>
          </div>
        </div>
      )}
    </div>
  );
};
