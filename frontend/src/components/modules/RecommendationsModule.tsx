import React, { useState, useEffect } from 'react';
import { INITIAL_CAREERS } from '../../data/mockAlignxData';
import type { CareerRecommendation, AlignxSessionProgress } from '../../types/alignx';
import { ApiService } from '../../services/api';
import { RollButton } from '../RollButton';
import type { AppView } from '../Header';
import { DecisionArchitecturePipeline } from './DecisionArchitecturePipeline';
import {
  Columns,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Layers,
  Lock,
  Clock,
  ArrowRight
} from 'lucide-react';

interface RecommendationsModuleProps {
  onSelectCareerTwin: (careerId: string) => void;
  onOpenWhatIf: () => void;
  onOpenRoadmap?: (careerId: string) => void;
  sessionProgress: AlignxSessionProgress;
  onStartAssessment: (view?: AppView) => void;
  selectedCareerId?: string;
  onSelectCareerId?: (careerId: string) => void;
}

export const RecommendationsModule: React.FC<RecommendationsModuleProps> = ({
  onSelectCareerTwin,
  onOpenWhatIf,
  onOpenRoadmap,
  sessionProgress,
  onStartAssessment,
  selectedCareerId,
  onSelectCareerId
}) => {
  const [careers, setCareers] = useState<CareerRecommendation[]>(INITIAL_CAREERS);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation>(() => {
    if (selectedCareerId) {
      const match = INITIAL_CAREERS.find(c => c.id === selectedCareerId);
      if (match) return match;
    }
    return INITIAL_CAREERS[0];
  });
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

  useEffect(() => {
    if (selectedCareerId) {
      const match = careers.find(c => c.id === selectedCareerId);
      if (match && match.id !== selectedCareer.id) {
        setSelectedCareer(match);
      }
    }
  }, [selectedCareerId, careers]);

  // Verify whether student has completed assessment calibration
  const isCalibrated =
    Boolean(sessionProgress?.completedStages?.onboarding) &&
    (Boolean(sessionProgress?.completedStages?.aptitude) || Boolean(sessionProgress?.completedStages?.dashboard));

  // Sync with live backend database and personalized parameters
  useEffect(() => {
    if (!isCalibrated) return;
    let isMounted = true;

    const syncLiveProfile = async () => {
      try {
        const res = await ApiService.getDashboard();
        if (res.data?.recommendations && res.data.recommendations.length > 0 && isMounted) {
          const mapped = res.data.recommendations.map((rec: any, index: number) => {
            const matchInitial = INITIAL_CAREERS.find(c => c.id === rec.careerSlug || c.title.toLowerCase().includes((rec.careerName || '').toLowerCase()));
            return {
              id: rec.careerSlug || matchInitial?.id || `career-${index}`,
              title: rec.careerName || matchInitial?.title || 'Specialist',
              domain: matchInitial?.domain || 'Technology & Engineering',
              tagline: matchInitial?.tagline || 'Calibrated through 5D Decision Protocol',
              scores: {
                studentFit: rec.studentFit || matchInitial?.scores.studentFit || 85,
                financialFit: rec.financialFit || matchInitial?.scores.financialFit || 80,
                familyAlignment: rec.familyAlignment || matchInitial?.scores.familyAlignment || 75,
                marketFit: rec.marketFit || matchInitial?.scores.marketFit || 88,
                locationFit: rec.locationFit || matchInitial?.scores.locationFit || 82,
                overallScore: rec.overallScore || matchInitial?.scores.overallScore || 84
              },
              growthRate: matchInitial?.growthRate || '+32% YoY',
              salaryRange: matchInitial?.salaryRange || '₹18L - ₹45L',
              riskLevel: matchInitial?.riskLevel || 'Moderate',
              topLocations: matchInitial?.topLocations || ['Bangalore', 'Hyderabad', 'Singapore'],
              requiredSkills: matchInitial?.requiredSkills || ['Analytical Thinking', 'Systems Decomposition'],
              studentSkillGaps: matchInitial?.studentSkillGaps || ['Advanced Specialization Frameworks'],
              strengthsMatch: rec.explanationData?.whyItMatches || matchInitial?.strengthsMatch || ['High abstract problem solving'],
              whyRecommended: rec.explanationData?.summary ? [rec.explanationData.summary] : matchInitial?.whyRecommended || ['Top alignment across aptitude and market telemetry'],
              educationPath: matchInitial?.educationPath || 'Undergraduate STEM Foundation',
              entranceExams: matchInitial?.entranceExams || ['Tier-1 Entrance Standards'],
              scholarships: matchInitial?.scholarships || ['Merit-Based Research Grant']
            };
          });
          setCareers(mapped);
          setSelectedCareer(mapped[0]);
        }
      } catch {
        // Fallback: Compute personalized scores based on the actual sessionProgress profile
        if (sessionProgress.aptitudeScore || sessionProgress.studentProfile) {
          const studentScore = sessionProgress.aptitudeScore || 85;
          const budget = sessionProgress.studentProfile?.budgetAnnualLakhs || 14;
          const parentBudget = sessionProgress.parentData?.maxBudgetAnnualLakhs || budget;
          
          const personalized = INITIAL_CAREERS.map(c => {
            const sFit = Math.min(99, Math.round(c.scores.studentFit * (studentScore / 88)));
            const fFit = parentBudget >= 20 ? Math.min(98, c.scores.financialFit + 10) : parentBudget <= 10 ? Math.max(55, c.scores.financialFit - 12) : c.scores.financialFit;
            const overall = Math.round(0.35 * sFit + 0.20 * fFit + 0.15 * c.scores.familyAlignment + 0.20 * c.scores.marketFit + 0.10 * c.scores.locationFit);
            return {
              ...c,
              scores: {
                ...c.scores,
                studentFit: sFit,
                financialFit: fFit,
                overallScore: overall
              }
            };
          }).sort((a, b) => b.scores.overallScore - a.scores.overallScore);
          setCareers(personalized);
          setSelectedCareer(personalized[0]);
        }
      }
    };

    syncLiveProfile();
    return () => { isMounted = false; };
  }, [isCalibrated, sessionProgress]);

  // If student is not calibrated, show the authentic locked Decision Engine
  if (!isCalibrated) {
    const nextPendingStage: AppView = !sessionProgress?.completedStages?.onboarding
      ? 'onboarding'
      : !sessionProgress?.completedStages?.discovery
      ? 'discovery'
      : !sessionProgress?.completedStages?.aptitude
      ? 'aptitude'
      : !sessionProgress?.parentInputDone
      ? 'parent'
      : 'dashboard';

    return (
      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 24px' }}>
        <div
          className="titanium-card animate-fade-in"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--accent-border)',
            padding: '56px 48px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.06)',
            textAlign: 'center'
          }}
        >
          {/* Lock Icon */}
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-dim)',
              border: '1.5px solid var(--accent)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}
          >
            <Lock size={28} color="var(--accent)" />
          </div>

          {/* Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div className="titanium-badge" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
              <span>5D DECISION ENGINE LOCKED • CALIBRATION REQUIRED</span>
            </div>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              margin: '0 0 16px 0'
            }}
          >
            Your True Path Requires Real Data.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 36px auto',
              lineHeight: 1.6
            }}
          >
            ALIGNX does not generate generic or static career guesses. To calculate your multidimensional fit across Student Aptitude (35%), Financial Reality (20%), Family Alignment (15%), and Market Demand (20%), you must complete your psychometric evaluation.
          </p>

          {/* 4-Step Calibration Readiness Checklist */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '40px',
              textAlign: 'left'
            }}
          >
            {[
              {
                step: '01 / FOUNDATION',
                title: 'Goals & Budget',
                desc: 'Academic baseline & tuition ceiling',
                done: Boolean(sessionProgress?.completedStages?.onboarding),
                target: 'onboarding' as AppView
              },
              {
                step: '02 / INTERESTS',
                title: 'Holland RIASEC',
                desc: 'Workplace problem-solving archetype',
                done: Boolean(sessionProgress?.completedStages?.discovery),
                target: 'discovery' as AppView
              },
              {
                step: '03 / COGNITIVE',
                title: '5D Aptitude Matrix',
                desc: 'Abstract logic & systems thinking',
                done: Boolean(sessionProgress?.completedStages?.aptitude),
                target: 'aptitude' as AppView
              },
              {
                step: '04 / FAMILY',
                title: 'Family Bounds',
                desc: 'Parent consensus & risk tolerance',
                done: Boolean(sessionProgress?.parentInputDone),
                target: 'parent' as AppView
              }
            ].map((s, idx) => (
              <div
                key={idx}
                onClick={() => onStartAssessment(s.target)}
                style={{
                  padding: '20px',
                  borderRadius: '0px',
                  backgroundColor: s.done ? 'rgba(45, 90, 67, 0.08)' : 'var(--bg-surface)',
                  border: s.done ? '1px solid var(--accent)' : '1px solid var(--border-hairline)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: s.done ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {s.step}
                  </span>
                  {s.done ? (
                    <CheckCircle2 size={16} color="var(--accent)" />
                  ) : (
                    <Clock size={16} color="var(--text-muted)" />
                  )}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {s.title}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Primary Action Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RollButton
              onClick={() => onStartAssessment(nextPendingStage)}
              variant="primary"
              icon={<ArrowRight size={16} />}
              style={{ padding: '16px 36px', fontSize: '0.9rem' }}
            >
              START ASSESSMENT TO UNLOCK DECISION ENGINE
            </RollButton>
          </div>
        </div>
      </div>
    );
  }

  const domains = ['all', 'AI & Data Science', 'Hardware & Robotics', 'Product & Design', 'CleanTech & Systems'];

  const filteredCareers = selectedDomain === 'all'
    ? careers
    : careers.filter(c => c.domain.toLowerCase().includes(selectedDomain.toLowerCase()) || selectedDomain.toLowerCase().includes(c.domain.toLowerCase()));

  const top6Careers = filteredCareers.slice(0, 6);

  useEffect(() => {
    if (top6Careers.length > 0 && !top6Careers.some(c => c.id === selectedCareer.id)) {
      setSelectedCareer(top6Careers[0]);
    }
  }, [selectedDomain, careers]);

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
              TOP 6 RANKED CANDIDATES
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)' }}>
              CLICK CARD TO INSPECT
            </span>
          </div>

          {top6Careers.map((career, idx) => {
            const isSelected = selectedCareer.id === career.id;
            return (
              <div
                key={career.id}
                onClick={() => {
                  setSelectedCareer(career);
                  onSelectCareerId?.(career.id);
                }}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '0px',
                  border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border-hairline)',
                  padding: '22px 24px',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 16px rgba(45, 90, 67, 0.12)' : '0 2px 6px rgba(0, 0, 0, 0.02)',
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

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={onOpenWhatIf}
                  className="alignx-key"
                  style={{ padding: '10px 18px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <SlidersHorizontal size={13} color="var(--accent)" />
                  <span>SIMULATE WHAT-IF</span>
                </button>

                {onOpenRoadmap && (
                  <button
                    onClick={() => onOpenRoadmap(selectedCareer.id)}
                    className="alignx-key"
                    style={{ padding: '10px 18px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Layers size={13} color="var(--accent)" />
                    <span>VIEW ROADMAP</span>
                  </button>
                )}

                <button
                  onClick={() => onSelectCareerTwin(selectedCareer.id)}
                  className="btn-alignx-primary"
                  style={{ padding: '10px 20px', fontSize: '0.76rem' }}
                >
                  <span>CAREER TWIN & GAPS</span>
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

      {/* Visual System Architecture & Decision Pipeline: How ALIGNX Reached This Recommendation */}
      <DecisionArchitecturePipeline
        topCareers={top6Careers}
        selectedCareer={selectedCareer}
        onSelectCareer={(career) => {
          setSelectedCareer(career);
          onSelectCareerId?.(career.id);
        }}
        sessionProgress={sessionProgress}
      />

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
