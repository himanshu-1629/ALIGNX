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
  const normalizeSlug = (slug?: string) => (slug || '').toLowerCase().replace(/[-_]/g, '');

  const [careers, setCareers] = useState<CareerRecommendation[]>(INITIAL_CAREERS);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation>(() => {
    if (selectedCareerId) {
      const match = INITIAL_CAREERS.find(c => normalizeSlug(c.id) === normalizeSlug(selectedCareerId));
      if (match) return match;
    }
    return INITIAL_CAREERS[0];
  });
  const [comparisonCareer, setComparisonCareer] = useState<CareerRecommendation | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [isBackendLive, setIsBackendLive] = useState(false);

  // Calibrate career catalog scores based on live psychometric and session telemetry
  const calibrateCareersFromSession = (
    catalog: CareerRecommendation[],
    progress: AlignxSessionProgress
  ): CareerRecommendation[] => {
    const rawMetrics: any = progress.aptitudeMetrics || {};
    const baseAptitude = progress.aptitudeScore || 80;

    // Extract individual cognitive metrics (fallback to overall aptitude score or 75)
    const logic = rawMetrics.abstractLogic ?? rawMetrics.logical ?? baseAptitude;
    const quant = rawMetrics.quantitativeEstimation ?? rawMetrics.numerical ?? Math.max(60, baseAptitude - 2);
    const systems = rawMetrics.systemsThinking ?? rawMetrics.analytical ?? Math.min(98, baseAptitude + 1);
    const spatial = rawMetrics.spatialArchitecture ?? rawMetrics.spatial ?? Math.max(60, baseAptitude - 3);
    const verbal = rawMetrics.riskTolerance ?? rawMetrics.verbal ?? Math.max(60, baseAptitude - 4);

    const branch = ((progress.studentProfile as any)?.branch || progress.studentProfile?.currentField || '').toLowerCase();
    const parentBudget = progress.parentData?.maxBudgetAnnualLakhs || progress.studentProfile?.budgetAnnualLakhs || 16;
    const parentRisk = progress.parentData?.riskAppetite || 'moderate';
    const preferredLocs = (progress.parentData?.preferredLocations || []).map(l => l.toLowerCase());

    const scored = catalog.map((c, index) => {
      const text = `${c.title} ${c.domain} ${c.requiredSkills.join(' ')}`.toLowerCase();

      // 1. Differentiated Student Fit (Cognitive Vector + Domain Affinity)
      let cognitiveFit = 75;
      if (text.includes('ai') || text.includes('machine learning') || text.includes('neural') || text.includes('deep learning')) {
        cognitiveFit = Math.round(0.40 * logic + 0.35 * quant + 0.25 * systems);
      } else if (text.includes('vlsi') || text.includes('semiconductor') || text.includes('chip') || text.includes('hardware')) {
        cognitiveFit = Math.round(0.40 * spatial + 0.35 * systems + 0.25 * logic);
      } else if (text.includes('robot') || text.includes('autonomous') || text.includes('kinetic') || text.includes('mechatron')) {
        cognitiveFit = Math.round(0.38 * spatial + 0.32 * systems + 0.30 * logic);
      } else if (text.includes('data platform') || text.includes('cloud') || text.includes('distributed')) {
        cognitiveFit = Math.round(0.40 * systems + 0.35 * logic + 0.25 * quant);
      } else if (text.includes('cyber') || text.includes('crypto') || text.includes('security')) {
        cognitiveFit = Math.round(0.42 * systems + 0.38 * logic + 0.20 * quant);
      } else if (text.includes('product') || text.includes('ui') || text.includes('ux') || text.includes('design')) {
        cognitiveFit = Math.round(0.42 * verbal + 0.33 * systems + 0.25 * spatial);
      } else if (text.includes('quantum') || text.includes('fintech') || text.includes('quant')) {
        cognitiveFit = Math.round(0.45 * quant + 0.35 * logic + 0.20 * systems);
      } else if (text.includes('clean') || text.includes('energy') || text.includes('battery') || text.includes('climate')) {
        cognitiveFit = Math.round(0.35 * systems + 0.35 * spatial + 0.30 * quant);
      } else if (text.includes('bio') || text.includes('neuro') || text.includes('genom')) {
        cognitiveFit = Math.round(0.40 * systems + 0.35 * quant + 0.25 * logic);
      } else {
        cognitiveFit = Math.round(0.35 * logic + 0.35 * systems + 0.30 * quant);
      }

      // Branch match bonus
      let branchBonus = 0;
      if (branch) {
        if ((branch.includes('comp') || branch.includes('it') || branch.includes('data')) && (text.includes('software') || text.includes('ai') || text.includes('cloud') || text.includes('data'))) branchBonus = 5;
        else if ((branch.includes('elect') || branch.includes('ece')) && (text.includes('vlsi') || text.includes('hardware') || text.includes('embedded') || text.includes('circuit'))) branchBonus = 5;
        else if (branch.includes('mech') && (text.includes('robot') || text.includes('aerospace') || text.includes('powertrain'))) branchBonus = 5;
        else if (branch.includes('design') && (text.includes('product') || text.includes('ux'))) branchBonus = 5;
      }

      const sFit = Math.min(99, Math.max(45, cognitiveFit + branchBonus));

      // 2. Financial Feasibility Fit
      let fFit = 85;
      if (text.includes('quantum') || text.includes('aerospace') || text.includes('neuroscience')) {
        fFit = parentBudget >= 22 ? 96 : parentBudget >= 15 ? 88 : 70;
      } else if (text.includes('product') || text.includes('ai & machine') || text.includes('robotics')) {
        fFit = parentBudget >= 18 ? 97 : parentBudget >= 12 ? 90 : 76;
      } else {
        fFit = parentBudget >= 14 ? 98 : parentBudget >= 10 ? 92 : 82;
      }

      // 3. Family Alignment Fit
      let faFit = 82;
      const isFrontier = text.includes('quantum') || text.includes('neuro') || text.includes('ar/vr') || text.includes('spatial');
      const isConservative = text.includes('vlsi') || text.includes('cloud') || text.includes('cyber') || text.includes('data platform');
      if (parentRisk === 'low') {
        faFit = isConservative ? 94 : isFrontier ? 72 : 85;
      } else if (parentRisk === 'high') {
        faFit = isFrontier ? 95 : 86;
      } else {
        faFit = isConservative ? 90 : isFrontier ? 82 : 88;
      }

      // 4. Market & Hiring Velocity Fit
      let mFit = 85;
      if (text.includes('ai & machine') || text.includes('deep learning')) mFit = 95;
      else if (text.includes('vlsi') || text.includes('semiconductor')) mFit = 93;
      else if (text.includes('cybersecurity')) mFit = 91;
      else if (text.includes('data platform') || text.includes('cloud')) mFit = 89;
      else if (text.includes('robotics') || text.includes('autonomous')) mFit = 88;
      else if (text.includes('clean') || text.includes('energy') || text.includes('battery')) mFit = 87;
      else if (text.includes('product') || text.includes('design')) mFit = 86;
      else if (text.includes('quantum')) mFit = 84;
      else mFit = 83;

      // 5. Geographic Alignment Fit
      let lFit = 80;
      if (preferredLocs.length > 0 && c.topLocations?.some(loc => preferredLocs.some(pl => loc.toLowerCase().includes(pl) || pl.includes(loc.toLowerCase())))) {
        lFit = 95;
      } else {
        lFit = 84;
      }

      // High precision composite calculation
      const rawComposite = 0.35 * sFit + 0.20 * fFit + 0.15 * faFit + 0.20 * mFit + 0.10 * lFit;
      // Micro offset to resolve mathematical ties cleanly across diverse specializations
      const microOffset = ((sFit * 0.05 + mFit * 0.03 + index * 0.01) % 1.6) - 0.8;
      const overall = Math.min(99, Math.max(50, Math.round(rawComposite + (microOffset * 0.2))));

      return {
        ...c,
        scores: {
          studentFit: sFit,
          financialFit: fFit,
          familyAlignment: faFit,
          marketFit: mFit,
          locationFit: lFit,
          overallScore: overall
        },
        _rawComposite: rawComposite + (sFit * 0.02)
      };
    });

    // Sort descending with deterministic floating-point tie-breaking
    scored.sort((a, b) => {
      if (Math.abs(b._rawComposite - a._rawComposite) > 0.08) {
        return b._rawComposite - a._rawComposite;
      }
      if (b.scores.overallScore !== a.scores.overallScore) {
        return b.scores.overallScore - a.scores.overallScore;
      }
      if (b.scores.studentFit !== a.scores.studentFit) {
        return b.scores.studentFit - a.scores.studentFit;
      }
      return b.scores.marketFit - a.scores.marketFit;
    });

    return scored.map(({ _rawComposite, ...rest }) => rest);
  };

  // Verify whether student has completed assessment calibration
  const isCalibrated =
    Boolean(sessionProgress?.completedStages?.onboarding) &&
    (Boolean(sessionProgress?.completedStages?.aptitude) || Boolean(sessionProgress?.completedStages?.dashboard));

  // Unified recommendation loading and deterministic ranking
  useEffect(() => {
    let isMounted = true;

    const loadRecommendations = async () => {
      // 1. Attempt live recommendation generation from backend ALIGNX Decision Engine
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
            const matchedStatic = INITIAL_CAREERS.find(c =>
              normalizeSlug(c.id) === normalizeSlug(rec.careerSlug) ||
              c.title.toLowerCase() === rec.careerName?.toLowerCase()
            );

            const salaryFormatted = rec.salaryRange?.entryLevel
              ? `₹${Math.round(rec.salaryRange.entryLevel / 100000)} - ${Math.round(rec.salaryRange.seniorLevel / 100000)} LPA`
              : matchedStatic?.salaryRange || '₹8 - 25 LPA';

            const riskFormatted = rec.riskLevel
              ? (rec.riskLevel.charAt(0).toUpperCase() + rec.riskLevel.slice(1))
              : (matchedStatic?.riskLevel as any) || 'Medium';

            const sFit = rec.studentFit ?? rec.components?.studentFit ?? matchedStatic?.scores.studentFit ?? 78;
            const fFit = rec.financialFit ?? rec.components?.financialFit ?? matchedStatic?.scores.financialFit ?? 82;
            const faFit = rec.familyAlignment ?? rec.components?.familyAlignment ?? matchedStatic?.scores.familyAlignment ?? 76;
            const mFit = rec.marketFit ?? rec.components?.marketFit ?? matchedStatic?.scores.marketFit ?? 85;
            const lFit = rec.locationFit ?? rec.components?.locationFit ?? matchedStatic?.scores.locationFit ?? 78;
            const overall = rec.overallScore ?? Math.round(0.35 * sFit + 0.20 * fFit + 0.15 * faFit + 0.20 * mFit + 0.10 * lFit);

            return {
              id: rec.careerSlug || matchedStatic?.id || rec.careerId,
              title: rec.careerName || matchedStatic?.title || 'Career Path',
              domain: mapDomain(rec.category || rec.domain, matchedStatic?.domain),
              tagline: rec.explanation?.summary || matchedStatic?.tagline || 'Frontier STEAM pathway',
              scores: {
                studentFit: sFit,
                financialFit: fFit,
                familyAlignment: faFit,
                marketFit: mFit,
                locationFit: lFit,
                overallScore: overall
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

          // Sort descending
          mapped.sort((a, b) => b.scores.overallScore - a.scores.overallScore);

          setCareers(mapped);
          setIsBackendLive(true);

          // Update selection: Select rank #1 unless student specifically selected a candidate in the active list
          const existingSelection = selectedCareerId
            ? mapped.find(c => normalizeSlug(c.id) === normalizeSlug(selectedCareerId))
            : null;
          const topCareer = existingSelection || mapped[0];
          setSelectedCareer(topCareer);
          if (!existingSelection) {
            onSelectCareerId?.(topCareer.id);
          }
          return;
        }
      } catch (err) {
        console.warn('[ALIGNX Recommendations] Using live session calibration:', err);
      }

      // 2. High-precision local calibrated scoring based on actual session inputs
      if (isMounted) {
        const calibrated = calibrateCareersFromSession(INITIAL_CAREERS, sessionProgress);
        setCareers(calibrated);

        const existingSelection = selectedCareerId
          ? calibrated.find(c => normalizeSlug(c.id) === normalizeSlug(selectedCareerId))
          : null;
        const topCareer = existingSelection || calibrated[0];
        setSelectedCareer(topCareer);
        if (!existingSelection) {
          onSelectCareerId?.(topCareer.id);
        }
      }
    };

    loadRecommendations();
    return () => { isMounted = false; };
  }, [isCalibrated, sessionProgress]);

  // Synchronize when parent explicitly selects a career
  useEffect(() => {
    if (selectedCareerId) {
      const match = careers.find(c => normalizeSlug(c.id) === normalizeSlug(selectedCareerId));
      if (match && match.id !== selectedCareer.id) {
        setSelectedCareer(match);
      }
    }
  }, [selectedCareerId, careers]);

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
      onSelectCareerId?.(top6Careers[0].id);
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
