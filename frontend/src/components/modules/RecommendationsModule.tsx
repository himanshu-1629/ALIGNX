import React, { useState, useEffect } from 'react';
import { INITIAL_CAREERS } from '../../data/mockAlignxData';
import type { CareerRecommendation } from '../../types/alignx';
import { ApiService } from '../../services/api';
import {
  Columns,
  Sparkles,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface RecommendationsModuleProps {
  onSelectCareerTwin: (careerId: string) => void;
  onOpenWhatIf: () => void;
}

export const RecommendationsModule: React.FC<RecommendationsModuleProps> = ({
  onSelectCareerTwin,
  onOpenWhatIf
}) => {
  const [careers, setCareers] = useState<CareerRecommendation[]>(INITIAL_CAREERS);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation>(INITIAL_CAREERS[0]);
  const [comparisonCareer, setComparisonCareer] = useState<CareerRecommendation | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [isBackendLive, setIsBackendLive] = useState(false);

  // Fetch live recommendations from backend ALIGNX Decision Engine
  useEffect(() => {
    let isMounted = true;
    const loadLiveRecommendations = async () => {
      try {
        const res = await ApiService.generateRecommendations();
        if (res?.data?.recommendations && res.data.recommendations.length > 0 && isMounted) {
          const mapDomain = (cat?: string, fallback?: string): string => {
            if (!cat) return fallback || 'AI & Data Science';
            const c = cat.toLowerCase();
            if (c.includes('ai') || c.includes('data')) return 'AI & Data Science';
            if (c.includes('robot') || c.includes('semi') || c.includes('hardware') || c.includes('vlsi') || c.includes('embedded')) return 'Hardware & Robotics';
            if (c.includes('clean') || c.includes('energy') || c.includes('climate') || c.includes('battery')) return 'CleanTech & Systems';
            if (c.includes('design') || c.includes('product') || c.includes('ux')) return 'Product & Design';
            return fallback || 'AI & Data Science';
          };

          const mapped: CareerRecommendation[] = res.data.recommendations.map((rec: any) => {
            const matchedStatic = INITIAL_CAREERS.find(c => c.id === rec.careerSlug || c.title.toLowerCase() === rec.careerName?.toLowerCase());
            
            const salaryFormatted = rec.salaryRange?.entryLevel
              ? `₹${Math.round(rec.salaryRange.entryLevel / 100000)} - ${Math.round(rec.salaryRange.seniorLevel / 100000)} LPA`
              : matchedStatic?.salaryRange || '₹8 - 25 LPA';

            const riskFormatted = rec.riskLevel
              ? (rec.riskLevel.charAt(0).toUpperCase() + rec.riskLevel.slice(1))
              : (matchedStatic?.riskLevel as any) || 'Medium';

            return {
              id: rec.careerSlug || matchedStatic?.id || rec.careerId,
              title: rec.careerName || matchedStatic?.title || 'Career Path',
              domain: mapDomain(rec.category || rec.domain, matchedStatic?.domain),
              tagline: rec.explanation?.summary || matchedStatic?.tagline || 'Frontier STEAM pathway',
              scores: {
                studentFit: rec.studentFit || 65,
                financialFit: rec.financialFit || 75,
                familyAlignment: rec.familyAlignment || 75,
                marketFit: rec.marketFit || 85,
                locationFit: rec.locationFit || 65,
                overallScore: rec.overallScore || 70
              },
              growthRate: matchedStatic?.growthRate || '+28% (5-yr CAGR)',
              salaryRange: salaryFormatted,
              riskLevel: riskFormatted as any,
              topLocations: rec.topLocations?.length ? rec.topLocations : matchedStatic?.topLocations || ['Bangalore', 'Hyderabad', 'Chennai'],
              requiredSkills: matchedStatic?.requiredSkills || ['Python', 'System Architecture', 'Problem Solving'],
              studentSkillGaps: rec.explanation?.potentialChallenges || matchedStatic?.studentSkillGaps || ['Advanced Frameworks'],
              strengthsMatch: rec.explanation?.whyItMatches || matchedStatic?.strengthsMatch || ['Analytical Logic'],
              whyRecommended: rec.explanation?.whyItMatches?.length ? rec.explanation.whyItMatches : (matchedStatic?.whyRecommended || []),
              educationPath: rec.educationPathway?.preferredDegrees?.join(' / ') || matchedStatic?.educationPath || 'B.Tech / B.S. in Allied STEAM Discipline',
              entranceExams: matchedStatic?.entranceExams || ['JEE Main', 'JEE Advanced', 'BITSAT'],
              scholarships: matchedStatic?.scholarships || ['Merit Scholarship', 'National Fellowship']
            };
          });

          setCareers(mapped);
          setSelectedCareer(mapped[0]);
          setIsBackendLive(true);
        }
      } catch (err) {
        console.warn('[ALIGNX Recommendations] Using resilient initial career catalog:', err);
      }
    };

    loadLiveRecommendations();
    return () => { isMounted = false; };
  }, []);

  const domains = ['all', 'AI & Data Science', 'Hardware & Robotics', 'Product & Design', 'CleanTech & Systems'];

  const filteredCareers = selectedDomain === 'all'
    ? careers
    : careers.filter(c => c.domain.toLowerCase().includes(selectedDomain.toLowerCase()) || selectedDomain.toLowerCase().includes(c.domain.toLowerCase()));

  return (
    <div style={{ maxWidth: '1440px', margin: '36px auto', padding: '0 28px' }}>
      {/* Studio Header & Navigation Switcher */}
      <div
        style={{
          borderBottom: '1px solid var(--border-hairline)',
          paddingBottom: '24px',
          marginBottom: '32px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <Sparkles size={16} color="var(--accent)" />
              <span className="tracking-widest-mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                DECISION INTELLIGENCE STUDIO
              </span>
              {isBackendLive && (
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
                  ● LIVE ALIGNX ENGINE
                </span>
              )}
            </div>

            <h1
              className="font-display tracking-tight-display"
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: '4px 0 10px'
              }}
            >
              5D Career Alignment Hub
            </h1>

            <p
              className="font-body"
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.02rem',
                maxWidth: '75ch',
                lineHeight: 1.55
              }}
            >
              Multi-dimensional ranking synthesizing Student Aptitude (35%), Financial Feasibility (20%), Family Alignment (15%), Industrial Market Demand (20%), and Regional Location (10%).
            </p>
          </div>

          {/* Quick Studio Switcher Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '980px',
              border: '1px solid var(--border-hairline)'
            }}
          >
            <button
              style={{
                padding: '8px 18px',
                borderRadius: '980px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-hairline)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
              }}
            >
              <Compass size={14} color="var(--accent)" />
              <span>5D Recommendations</span>
            </button>

            <button
              onClick={() => onSelectCareerTwin(selectedCareer.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '980px',
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.18s ease'
              }}
            >
              <Sparkles size={14} />
              <span>Career Twin Radar</span>
            </button>

            <button
              onClick={onOpenWhatIf}
              style={{
                padding: '8px 18px',
                borderRadius: '980px',
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.18s ease'
              }}
            >
              <SlidersHorizontal size={14} />
              <span>What-If Lab</span>
            </button>
          </div>
        </div>

        {/* Filter Bar & Comparison Mode Toggle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Domain Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`alignx-key ${selectedDomain === dom ? 'active' : ''}`}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.74rem',
                  textTransform: 'capitalize'
                }}
              >
                {dom === 'all' ? 'All Disciplines' : dom}
              </button>
            ))}
          </div>

          {/* Compare Toggle */}
          <button
            onClick={() => {
              setIsCompareMode(!isCompareMode);
              if (!comparisonCareer) setComparisonCareer(careers[1] || careers[0]);
            }}
            className="alignx-key"
            style={{
              padding: '7px 16px',
              fontSize: '0.74rem',
              backgroundColor: isCompareMode ? 'var(--accent-dim)' : undefined,
              borderColor: isCompareMode ? 'var(--accent)' : undefined
            }}
          >
            <Columns size={13} />
            <span>{isCompareMode ? 'CLOSE COMPARISON' : 'COMPARE PATHWAYS'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Ranked Cards, Right In-Depth Dossier */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isCompareMode ? '1fr 1fr' : '1fr 1.6fr',
          gap: '32px',
          alignItems: 'start'
        }}
        className="dashboard-main-grid"
      >
        {/* Left: Ranked Trajectory Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span className="tracking-widest-mono" style={{ color: 'var(--text-muted)' }}>
              RANKED CANDIDATES ({filteredCareers.length})
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)' }}>
              CLICK CARD TO INSPECT
            </span>
          </div>

          {filteredCareers.map((career, idx) => {
            const isSelected = selectedCareer.id === career.id;
            return (
              <div
                key={career.id}
                onClick={() => setSelectedCareer(career)}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '14px',
                  border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border-hairline)',
                  padding: '22px 24px',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 16px rgba(158, 107, 56, 0.12)' : '0 2px 6px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: isSelected ? 'var(--accent)' : 'var(--text-muted)'
                        }}
                      >
                        #{idx + 1}
                      </span>
                      <span className="tracking-widest-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {career.domain}
                      </span>
                    </div>

                    <h3
                      className="font-display"
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: '4px 0 6px'
                      }}
                    >
                      {career.title}
                    </h3>
                  </div>

                  {/* Overall Match Circle */}
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.7rem',
                        fontWeight: 800,
                        color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                        lineHeight: 1,
                        fontVariantNumeric: 'tabular-nums'
                      }}
                    >
                      {career.scores.overallScore}%
                    </div>
                    <div className="tracking-widest-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      FIT ALIGNMENT
                    </div>
                  </div>
                </div>

                <p
                  className="font-body"
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                    marginBottom: '16px'
                  }}
                >
                  {career.tagline}
                </p>

                {/* Micro 5-Factor Bar Indicator */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', height: '4px', borderRadius: '980px', overflow: 'hidden', backgroundColor: 'var(--border-hairline)', marginBottom: '12px' }}>
                  <div style={{ backgroundColor: 'var(--accent)', opacity: career.scores.studentFit / 100 }} title={`Student Fit: ${career.scores.studentFit}%`} />
                  <div style={{ backgroundColor: 'var(--accent)', opacity: career.scores.financialFit / 100 }} title={`Financial Fit: ${career.scores.financialFit}%`} />
                  <div style={{ backgroundColor: 'var(--accent)', opacity: career.scores.familyAlignment / 100 }} title={`Family: ${career.scores.familyAlignment}%`} />
                  <div style={{ backgroundColor: 'var(--accent)', opacity: career.scores.marketFit / 100 }} title={`Market: ${career.scores.marketFit}%`} />
                  <div style={{ backgroundColor: 'var(--accent)', opacity: career.scores.locationFit / 100 }} title={`Location: ${career.scores.locationFit}%`} />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  <span>CTC: {career.salaryRange}</span>
                  <span>RISK: {career.riskLevel.toUpperCase()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Dossier Panel */}
        <div>
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-hairline)',
              padding: '36px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
              marginBottom: '28px'
            }}
          >
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <span className="tracking-widest-mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  ACTIVE CANDIDATE DOSSIER
                </span>
                <h2
                  className="font-display tracking-tight-subhead"
                  style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: '6px 0 8px'
                  }}
                >
                  {selectedCareer.title}
                </h2>
                <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '0.98rem', maxWidth: '65ch', lineHeight: 1.5 }}>
                  {selectedCareer.tagline}
                </div>
              </div>

              <div
                style={{
                  padding: '16px 24px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-hairline)',
                  textAlign: 'center'
                }}
              >
                <div className="tracking-widest-mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                  ALIGNX SCORE
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '2.8rem',
                    fontWeight: 800,
                    color: 'var(--accent)',
                    lineHeight: 1.1,
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {selectedCareer.scores.overallScore}%
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#15803D', fontWeight: 600, marginTop: '2px' }}>
                  FEASIBLE MATCH
                </div>
              </div>
            </div>

            {/* 5-Dimensional Breakdown Cards */}
            <div
              style={{
                borderTop: '1px solid var(--border-hairline)',
                borderBottom: '1px solid var(--border-hairline)',
                padding: '24px 0',
                margin: '24px 0'
              }}
            >
              <div className="tracking-widest-mono" style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                5-DIMENSIONAL DETERMINISTIC SCORING BREAKDOWN
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '14px'
                }}
              >
                {[
                  { label: 'STUDENT FIT', weight: '35%', score: selectedCareer.scores.studentFit },
                  { label: 'FINANCIAL FIT', weight: '20%', score: selectedCareer.scores.financialFit },
                  { label: 'FAMILY ALIGN', weight: '15%', score: selectedCareer.scores.familyAlignment },
                  { label: 'MARKET FIT', weight: '20%', score: selectedCareer.scores.marketFit },
                  { label: 'LOCATION FIT', weight: '10%', score: selectedCareer.scores.locationFit },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: '10px',
                      border: '1px solid var(--border-hairline)',
                      padding: '16px',
                      backgroundColor: 'var(--bg-surface)'
                    }}
                  >
                    <div className="tracking-widest-mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                      {item.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--accent)' }}>
                      Weight: {item.weight}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: '6px 0',
                        fontVariantNumeric: 'tabular-nums'
                      }}
                    >
                      {item.score}%
                    </div>
                    <div style={{ height: '4px', backgroundColor: 'var(--border-hairline)', borderRadius: '980px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.score}%`, backgroundColor: 'var(--accent)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explainable Rationale */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <CheckCircle2 size={16} color="var(--accent)" />
                <span className="tracking-widest-mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  EXPLAINABLE AI RECOMMENDATION RATIONALE
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedCareer.whyRecommended.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      backgroundColor: 'var(--bg-surface)',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-hairline)'
                    }}
                  >
                    <span style={{ color: 'var(--accent)', marginTop: '2px' }}>•</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {r}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                <MapPin size={14} color="var(--accent)" />
                <span>PRIMARY HUBS: {selectedCareer.topLocations.join(', ')}</span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => onSelectCareerTwin(selectedCareer.id)}
                  className="btn-alignx-primary"
                  style={{ padding: '12px 24px', fontSize: '0.78rem' }}
                >
                  <span>CAREER TWIN & SKILL GAPS</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Comparison Card (If Compare Mode Active) */}
          {isCompareMode && comparisonCareer && (
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-hairline)',
                padding: '32px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <span className="tracking-widest-mono" style={{ color: 'var(--text-muted)' }}>
                    BENCHMARK COMPARISON CANDIDATE
                  </span>
                  <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0' }}>
                    {comparisonCareer.title}
                  </h3>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '2.2rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {comparisonCareer.scores.overallScore}%
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {[
                  { label: 'Student', s1: selectedCareer.scores.studentFit, s2: comparisonCareer.scores.studentFit },
                  { label: 'Finance', s1: selectedCareer.scores.financialFit, s2: comparisonCareer.scores.financialFit },
                  { label: 'Family', s1: selectedCareer.scores.familyAlignment, s2: comparisonCareer.scores.familyAlignment },
                  { label: 'Market', s1: selectedCareer.scores.marketFit, s2: comparisonCareer.scores.marketFit },
                  { label: 'Location', s1: selectedCareer.scores.locationFit, s2: comparisonCareer.scores.locationFit },
                ].map((diff, idx) => (
                  <div key={idx} style={{ borderRadius: '8px', border: '1px solid var(--border-hairline)', padding: '10px', textAlign: 'center', backgroundColor: 'var(--bg-surface)' }}>
                    <div className="tracking-widest-mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{diff.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: diff.s1 >= diff.s2 ? 'var(--accent)' : 'var(--text-secondary)', marginTop: '4px' }}>
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
        @media (max-width: 960px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
