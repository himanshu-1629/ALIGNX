import React, { useState } from 'react';
import { DISCOVERY_SCENARIOS } from '../../data/mockAlignxData';
import { RollButton } from '../RollButton';
import { saveSessionProgress, getSessionProgress } from '../../utils/sessionManager';
import { ArrowRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface DiscoveryModuleProps {
  onComplete: (discoveryResults: Record<number, string>) => void;
  onSkipToAptitude?: () => void;
}

export const DiscoveryModule: React.FC<DiscoveryModuleProps> = ({ onComplete, onSkipToAptitude }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const scenario = DISCOVERY_SCENARIOS[currentIdx];
  const progressPercent = Math.round(((currentIdx + (isFinished ? 1 : 0)) / DISCOVERY_SCENARIOS.length) * 100);

  const handleSelectChoice = (tag: string) => {
    const updated = { ...answers, [scenario.id]: tag };
    setAnswers(updated);

    if (currentIdx < DISCOVERY_SCENARIOS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '40px auto', padding: '0 24px' }}>
      {/* Header & Progress Bar */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '24px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', color: 'var(--accent)' }}>
            PHASE 03 / CAREER DISCOVERY
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            SCENARIO {Math.min(currentIdx + 1, DISCOVERY_SCENARIOS.length)} OF {DISCOVERY_SCENARIOS.length} ({progressPercent}%)
          </span>
        </div>

        {/* Minimal Hairline Progress Tracker */}
        <div style={{ height: '3px', backgroundColor: 'var(--border-hairline)', width: '100%', position: 'relative' }}>
          <div
            style={{
              height: '100%',
              backgroundColor: 'var(--accent)',
              width: `${progressPercent}%`,
              transition: 'width 0.4s var(--ease-cinematic)'
            }}
          />
        </div>
      </div>

      {!isFinished ? (
        <div>
          {/* Scenario Card */}
          <div
            style={{
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-surface)',
              padding: '48px',
              position: 'relative'
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.14em', marginBottom: '16px' }}>
              DIMENSION: {scenario.category.toUpperCase()}
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                fontWeight: 600,
                lineHeight: 1.25,
                color: 'var(--text-primary)',
                marginBottom: '36px'
              }}
            >
              {scenario.scenario}
            </h2>

            {/* Interactive Scenario Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {scenario.choices.map((choice, i) => {
                const isSelected = answers[scenario.id] === choice.tag;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectChoice(choice.tag)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      padding: '20px 24px',
                      backgroundColor: isSelected ? 'var(--accent-dim)' : 'var(--bg-deep)',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      gap: '20px'
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.5 }}>
                        {choice.text}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                        TRAIT ALIGNMENT: {choice.tag.toUpperCase()}
                      </div>
                    </div>

                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '4px'
                      }}
                    >
                      {isSelected && <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent)', borderRadius: '50%' }} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--border-hairline)' }}>
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
                  fontSize: '0.75rem'
                }}
              >
                <ChevronLeft size={16} />
                <span>PREVIOUS SCENARIO</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  CHOOSE ONE ACTION TO ADVANCE
                </span>

                {onSkipToAptitude && (
                  <button
                    onClick={onSkipToAptitude}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent)',
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
            padding: '56px 48px',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <CheckCircle2 size={48} color="var(--accent)" />
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.16em', marginBottom: '12px' }}>
            DISCOVERY ENGINE SYNTHESIZED
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, marginBottom: '20px' }}>
            BEHAVIORAL INCLINATION CAPTURED
          </h2>

          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 36px', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Your responses indicate strong affinity for structured systems decomposition, architectural synthesis, and empirical validation under ambiguity.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <RollButton
              onClick={() => {
                saveSessionProgress({
                  lastActiveView: 'aptitude',
                  completedStages: {
                    ...getSessionProgress().completedStages,
                    discovery: true
                  }
                });
                onComplete(answers);
              }}
              variant="primary"
              icon={<ArrowRight size={15} />}
            >
              PROCEED TO COGNITIVE APTITUDE EVALUATION
            </RollButton>
          </div>
        </div>
      )}
    </div>
  );
};
