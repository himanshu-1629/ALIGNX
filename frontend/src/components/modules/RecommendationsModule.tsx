import React, { useState } from 'react';
import { INITIAL_CAREERS } from '../../data/mockAlignxData';
import type { CareerRecommendation } from '../../types/alignx';
import { ArrowRight, Columns } from 'lucide-react';

interface RecommendationsModuleProps {
  onSelectCareerTwin: (careerId: string) => void;
  onOpenWhatIf: () => void;
}

export const RecommendationsModule: React.FC<RecommendationsModuleProps> = ({
  onSelectCareerTwin,
  onOpenWhatIf
}) => {
  const [careers] = useState<CareerRecommendation[]>(INITIAL_CAREERS);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation>(INITIAL_CAREERS[0]);
  const [comparisonCareer, setComparisonCareer] = useState<CareerRecommendation | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);

  return (
    <div style={{ maxWidth: '1300px', margin: '40px auto', padding: '0 24px' }}>
      {/* Top Banner */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '24px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', color: 'var(--accent)' }}>
              PHASE 07 / ALIGNX DECISION ENGINE (DETERMINISTIC 5D)
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
              RECOMMENDATION DASHBOARD
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Ranked career vectors calculated by combining Student Fit (35%), Financial Fit (20%), Family Alignment (15%), Market Fit (20%), and Location Fit (10%).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                setIsCompareMode(!isCompareMode);
                if (!comparisonCareer) setComparisonCareer(INITIAL_CAREERS[1]);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: isCompareMode ? 'var(--accent-dim)' : 'transparent',
                border: isCompareMode ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                color: isCompareMode ? 'var(--accent)' : 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              <Columns size={15} />
              <span>{isCompareMode ? 'EXIT COMPARISON' : 'COMPARE CAREERS'}</span>
            </button>

            <button
              onClick={onOpenWhatIf}
              className="btn-alignx-primary"
              style={{ padding: '10px 18px', fontSize: '0.75rem' }}
            >
              <span>RUN WHAT-IF SIMULATOR</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Ranked List, Right Deep Analysis */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isCompareMode ? '1fr 1fr' : '1.2fr 2fr',
          gap: '32px',
          alignItems: 'start'
        }}
        className="dashboard-main-grid"
      >
        {/* Left: Ranked Career Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
            RANKED TRAJECTORIES ({careers.length})
          </div>

          {careers.map((career, idx) => {
            const isSelected = selectedCareer.id === career.id;
            return (
              <div
                key={career.id}
                onClick={() => setSelectedCareer(career)}
                style={{
                  border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-hairline)',
                  backgroundColor: isSelected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: isSelected ? 'var(--accent)' : 'var(--text-muted)' }}>
                    RANK #{idx + 1} • {career.domain.toUpperCase()}
                  </div>

                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {career.scores.overallScore}%
                  </div>
                </div>

                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {career.title}
                </div>

                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
                  {career.tagline}
                </div>

                {/* Quick 5-Score Bar Micro-Visualizer */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', height: '4px', backgroundColor: 'var(--border-hairline)' }}>
                  <div style={{ backgroundColor: 'var(--accent)', opacity: career.scores.studentFit / 100 }} title={`Student Fit: ${career.scores.studentFit}%`} />
                  <div style={{ backgroundColor: 'var(--accent)', opacity: career.scores.financialFit / 100 }} title={`Financial Fit: ${career.scores.financialFit}%`} />
                  <div style={{ backgroundColor: 'var(--accent)', opacity: career.scores.familyAlignment / 100 }} title={`Family: ${career.scores.familyAlignment}%`} />
                  <div style={{ backgroundColor: 'var(--accent)', opacity: career.scores.marketFit / 100 }} title={`Market: ${career.scores.marketFit}%`} />
                  <div style={{ backgroundColor: 'var(--accent)', opacity: career.scores.locationFit / 100 }} title={`Location: ${career.scores.locationFit}%`} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                  <span>{career.salaryRange}</span>
                  <span>{career.growthRate}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed 5D Breakdown & Explainable AI */}
        <div>
          {/* Active Career Detail Panel */}
          <div
            style={{
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-surface)',
              padding: '36px',
              marginBottom: '28px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
                  PRIMARY CANDIDATE PROFILE
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, margin: '6px 0' }}>
                  {selectedCareer.title}
                </h2>
                <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  {selectedCareer.tagline}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>OVERALL MATCH</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.4rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
                  {selectedCareer.scores.overallScore}%
                </div>
              </div>
            </div>

            {/* 5-Dimensional Component Scores */}
            <div style={{ borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)', padding: '24px 0', margin: '24px 0' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '16px' }}>
                5-DIMENSIONAL DETERMINISTIC SCORING BREAKDOWN
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
                {[
                  { label: 'STUDENT FIT', weight: '35%', score: selectedCareer.scores.studentFit },
                  { label: 'FINANCIAL FIT', weight: '20%', score: selectedCareer.scores.financialFit },
                  { label: 'FAMILY ALIGN', weight: '15%', score: selectedCareer.scores.familyAlignment },
                  { label: 'MARKET FIT', weight: '20%', score: selectedCareer.scores.marketFit },
                  { label: 'LOCATION FIT', weight: '10%', score: selectedCareer.scores.locationFit },
                ].map((item, i) => (
                  <div key={i} style={{ border: '1px solid var(--border-subtle)', padding: '14px', backgroundColor: 'var(--bg-deep)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                      {item.label} ({item.weight})
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0' }}>
                      {item.score}%
                    </div>
                    <div style={{ height: '3px', backgroundColor: 'var(--border-hairline)', width: '100%' }}>
                      <div style={{ height: '100%', width: `${item.score}%`, backgroundColor: 'var(--accent)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explainable Rationale */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: '10px' }}>
                EXPLAINABLE AI RECOMMENDATION RATIONALE
              </div>
              <ul style={{ paddingLeft: '18px', fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {selectedCareer.whyRecommended.map((r, i) => (
                  <li key={i} style={{ marginBottom: '6px' }}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-hairline)', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                PRIMARY HUBS: {selectedCareer.topLocations.join(' • ')}
              </div>

              <button
                onClick={() => onSelectCareerTwin(selectedCareer.id)}
                className="btn-alignx-primary"
                style={{ padding: '10px 18px', fontSize: '0.75rem' }}
              >
                <span>OPEN CAREER TWIN & SKILL GAPS</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Comparison Mode Secondary Card */}
          {isCompareMode && comparisonCareer && (
            <div
              style={{
                border: '1px solid var(--border-hairline)',
                backgroundColor: 'var(--bg-surface)',
                padding: '36px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    BENCHMARK COMPARISON CANDIDATE
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, margin: '4px 0' }}>
                    {comparisonCareer.title}
                  </h3>
                </div>

                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {comparisonCareer.scores.overallScore}%
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', margin: '16px 0' }}>
                {[
                  { label: 'Student', s1: selectedCareer.scores.studentFit, s2: comparisonCareer.scores.studentFit },
                  { label: 'Finance', s1: selectedCareer.scores.financialFit, s2: comparisonCareer.scores.financialFit },
                  { label: 'Family', s1: selectedCareer.scores.familyAlignment, s2: comparisonCareer.scores.familyAlignment },
                  { label: 'Market', s1: selectedCareer.scores.marketFit, s2: comparisonCareer.scores.marketFit },
                  { label: 'Location', s1: selectedCareer.scores.locationFit, s2: comparisonCareer.scores.locationFit },
                ].map((diff, idx) => (
                  <div key={idx} style={{ border: '1px solid var(--border-hairline)', padding: '8px', textAlign: 'center', backgroundColor: 'var(--bg-deep)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>{diff.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, color: diff.s1 >= diff.s2 ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      {diff.s1}% vs {diff.s2}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
