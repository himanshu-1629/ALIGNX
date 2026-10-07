import React, { useState, useEffect } from 'react';
import { DEFAULT_CAREER_DNA } from '../../data/mockAlignxData';
import { ApiService } from '../../services/api';
import { getSessionProgress } from '../../utils/sessionManager';
import { ArrowRight, Dna, ChevronLeft, SlidersHorizontal } from 'lucide-react';

interface CareerDnaModuleProps {
  onContinue: () => void;
  onBack?: () => void;
  onSkipToDashboard?: () => void;
}

export const CareerDnaModule: React.FC<CareerDnaModuleProps> = ({
  onContinue,
  onBack,
  onSkipToDashboard
}) => {
  const [dna, setDna] = useState(() => {
    const session = getSessionProgress();
    const metrics = session.aptitudeMetrics;
    if (!metrics) return DEFAULT_CAREER_DNA;

    return {
      ...DEFAULT_CAREER_DNA,
      traits: [
        { dimension: 'Algorithmic Decomposition', score: metrics.abstractLogic || 92, descriptor: 'Investigative & Systematic', implication: 'Naturally divides multi-tier challenges into modular executable pipelines.' },
        { dimension: 'Spatial & Structural Logic', score: metrics.spatialArchitecture || 84, descriptor: 'High Architectural Topology', implication: 'Visualizes interconnected dependencies, data flows, and physical constraints.' },
        { dimension: 'Empirical Skepticism', score: metrics.systemsThinking || 88, descriptor: 'Data-Driven Validation', implication: 'Rejects unfounded claims; relies on verifiable telemetry and measured benchmarks.' },
        { dimension: 'Quantitative Estimation', score: metrics.quantitativeEstimation || 85, descriptor: 'Probabilistic Modeler', implication: 'Calculates expected values and computational complexities accurately.' },
        { dimension: 'Calculated Risk Tolerance', score: metrics.riskTolerance || 80, descriptor: 'Prudent Opportunist', implication: 'Willing to take non-consensus bets when downside is strictly bounded.' }
      ]
    };
  });

  const [isLiveDna, setIsLiveDna] = useState(false);

  useEffect(() => {
    let isMounted = true;
    ApiService.getCareerDna()
      .then(res => {
        if (res?.data && isMounted) {
          const remote = res.data;
          const ts = remote.traitScores;
          const dynamicTraits = ts ? [
            { dimension: 'Analytical & Algorithmic Logic', score: ts.analytical || 90, descriptor: 'Investigative & Systematic', implication: 'Naturally divides multi-tier challenges into modular executable pipelines.' },
            { dimension: 'Practical Systems Construction', score: ts.builder || 85, descriptor: 'Builder / Kinetic Engineering', implication: 'Synthesizes concrete mechanical or software implementations from theoretical designs.' },
            { dimension: 'Frontier Research & Discovery', score: ts.research || 88, descriptor: 'Empirical Discovery', implication: 'Rejects unfounded claims; relies on verifiable telemetry and measured benchmarks.' },
            { dimension: 'Creative Synthesis & Architecture', score: ts.creative || 75, descriptor: 'Generative Topology', implication: 'Identifies novel non-linear solutions across interdisciplinary boundaries.' },
            { dimension: 'Leadership & Calculated Risk', score: Math.round(((ts.leadership || 70) + (ts.risk || 70)) / 2), descriptor: 'Prudent Opportunist', implication: 'Willing to take non-consensus bets when downside is strictly bounded.' }
          ] : null;

          setDna(prev => ({
            ...prev,
            dominantArchetype: remote.primaryTrait || remote.primaryArchetype || remote.archetype || prev.dominantArchetype,
            subType: remote.secondaryTraits?.length ? remote.secondaryTraits.join(' • ') : (remote.subType || prev.subType),
            description: remote.description || prev.description,
            traits: dynamicTraits || prev.traits
          }));
          setIsLiveDna(true);
        }
      })
      .catch(err => console.warn('[ALIGNX DNA] Backend DNA note:', err));

    return () => { isMounted = false; };
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 24px' }}>
      {/* Top Navigation Strip */}
      {(onBack || onSkipToDashboard) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          {onBack && (
            <button
              onClick={onBack}
              className="alignx-key"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.78rem' }}
            >
              <ChevronLeft size={14} />
              <span>BACK TO APTITUDE</span>
            </button>
          )}

          {onSkipToDashboard && (
            <button
              onClick={onSkipToDashboard}
              className="alignx-key"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.78rem' }}
            >
              <SlidersHorizontal size={14} color="var(--accent)" />
              <span>SKIP TO 5D DECISION ENGINE</span>
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '24px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <Dna size={18} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', color: 'var(--accent)' }}>
            PHASE 05 / CAREER DNA PROTOCOL REVEAL
          </span>
          {isLiveDna && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '0px',
                backgroundColor: 'rgba(52, 199, 89, 0.12)',
                color: '#28cd41',
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                border: '1px solid rgba(52, 199, 89, 0.25)'
              }}
            >
              ● LIVE SYNTHESIS
            </span>
          )}
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            margin: '8px 0 14px',
            color: 'var(--text-primary)'
          }}
        >
          {dna.dominantArchetype}
        </h1>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          SUB-CLASSIFICATION: <span style={{ color: 'var(--accent)' }}>{dna.subType}</span>
        </div>
      </div>

      {/* Main Narrative Explanation */}
      <div
        style={{
          border: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)',
          padding: '40px',
          marginBottom: '36px'
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '12px' }}>
          EXECUTIVE PSYCHOMETRIC SYNTHESIS
        </div>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.2rem',
            lineHeight: 1.7,
            color: 'var(--text-primary)',
            fontWeight: 300,
            marginBottom: '32px'
          }}
        >
          {dna.description}
        </p>

        {/* Ideal Work Environments */}
        <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.14em', marginBottom: '12px' }}>
            IDEAL LEVERAGE ENVIRONMENTS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {dna.idealEnvironments.map((env, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-hairline)',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-deep)'
                }}
              >
                <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent)', borderRadius: '0px' }} />
                <span>{env}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Trait Vectors */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.14em', marginBottom: '16px' }}>
          DETAILED TRAIT BREAKDOWN
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {dna.traits.map((t, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid var(--border-hairline)',
                padding: '24px 32px',
                backgroundColor: 'var(--bg-surface)',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 3fr',
                alignItems: 'center',
                gap: '24px'
              }}
              className="trait-grid-row"
            >
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600 }}>
                  {t.dimension}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', marginTop: '4px' }}>
                  {t.descriptor}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span>VECTOR</span>
                  <span style={{ fontWeight: 600 }}>{t.score}%</span>
                </div>
                <div style={{ height: '3px', backgroundColor: 'var(--border-hairline)', width: '100%' }}>
                  <div style={{ height: '100%', width: `${t.score}%`, backgroundColor: 'var(--accent)' }} />
                </div>
              </div>

              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {t.implication}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Step CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-hairline)', paddingTop: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {onSkipToDashboard && (
            <button onClick={onSkipToDashboard} className="alignx-key" style={{ padding: '12px 18px', fontSize: '0.76rem' }}>
              <span>SKIP TO 5D DASHBOARD</span>
            </button>
          )}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            CAREER DNA STORED
          </span>
        </div>

        <button onClick={onContinue} className="btn-alignx-primary">
          <span>CONFIGURE FAMILY & FINANCIAL PORTAL</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .trait-grid-row {
            grid-template-columns: 1fr !important;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};
