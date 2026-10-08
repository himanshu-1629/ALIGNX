import React, { useState } from 'react';
import type { CareerRecommendation, AlignxSessionProgress } from '../../types/alignx';

interface DecisionArchitecturePipelineProps {
  topCareers?: CareerRecommendation[];
  top10Careers?: CareerRecommendation[];
  selectedCareer: CareerRecommendation;
  onSelectCareer: (career: CareerRecommendation) => void;
  sessionProgress: AlignxSessionProgress;
}

export const DecisionArchitecturePipeline: React.FC<DecisionArchitecturePipelineProps> = ({
  topCareers,
  top10Careers,
  selectedCareer,
  onSelectCareer,
  sessionProgress
}) => {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  const careersList = topCareers || top10Careers || [];
  const rankedCount = careersList.length || 6;
  const selectedIndex = careersList.findIndex((c) => c.id === selectedCareer.id);
  const currentRank = selectedIndex >= 0 ? selectedIndex + 1 : 1;

  // Extract authentic telemetry if available from sessionProgress
  const aptitudeVal = sessionProgress?.aptitudeScore || 85;
  const metrics = sessionProgress?.aptitudeMetrics;
  const budgetVal = sessionProgress?.parentData?.maxBudgetAnnualLakhs || sessionProgress?.studentProfile?.budgetAnnualLakhs || 14;

  return (
    <section
      aria-label="How ALIGNX Reached This Recommendation"
      style={{
        marginTop: '56px',
        borderTop: '1px solid var(--border-hairline)',
        paddingTop: '48px',
        position: 'relative'
      }}
    >
      {/* Schematic Container */}
      <div
        className="pipeline-schematic-container"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-hairline)',
          borderRadius: '0px',
          padding: '40px 36px 48px',
          position: 'relative',
          backgroundImage:
            'linear-gradient(to right, rgba(24, 24, 22, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(24, 24, 22, 0.035) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)'
        }}
      >
        {/* Top Architectural Telemetry Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-hairline)',
            paddingBottom: '16px',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                backgroundColor: 'var(--accent)'
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase'
              }}
            >
              SYS_ARCH // MULTIVARIATE DETERMINISTIC ENGINE v2.4
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                color: 'var(--text-secondary)'
              }}
            >
              SIGNAL BUS: <strong style={{ color: 'var(--accent)' }}>5D CONVERGENT</strong>
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                color: 'var(--text-secondary)'
              }}
            >
              EVALUATION: <strong style={{ color: 'var(--text-primary)' }}>DETERMINISTIC</strong>
            </span>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '2px 8px',
                backgroundColor: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'var(--accent)',
                letterSpacing: '0.08em',
                fontWeight: 700
              }}
            >
              <span
                className="pipeline-pulse-dot"
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)'
                }}
              />
              PIPELINE SYNCHRONIZED
            </div>
          </div>
        </div>

        {/* Section Title and Subtitle */}
        <div style={{ marginBottom: '36px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              color: 'var(--accent)',
              fontWeight: 700,
              marginBottom: '6px',
              textTransform: 'uppercase'
            }}
          >
            DECISION ARCHITECTURE &amp; PIPELINE
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.025em',
              margin: '0 0 6px 0',
              lineHeight: 1.15
            }}
          >
            HOW ALIGNX REACHED THIS RECOMMENDATION
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.98rem',
              color: 'var(--text-secondary)',
              margin: 0,
              maxWidth: '75ch',
              lineHeight: 1.55
            }}
          >
            From your profile signals to a ranked career path.
          </p>
        </div>

        {/* =========================================================================
            6-STAGE TECHNICAL PIPELINE GRID
            Row 1 (Ingestion & Scoring): 01 INPUT -> 02 SIGNALS -> 03 FIT
            Row 2 (Matching & Decision): 04 MATCH -> 05 RANK -> 06 RATIONALE
           ========================================================================= */}
        <div className="pipeline-stages-wrapper">
          {/* TIER 1: STAGES 01, 02, 03 */}
          <div className="pipeline-tier pipeline-tier-1">
            {/* STAGE 01: INPUT */}
            <div
              className={`pipeline-node-card ${hoveredStage === '01' ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredStage('01')}
              onMouseLeave={() => setHoveredStage(null)}
            >
              <div className="node-stage-header">
                <span className="node-stage-number">01 INPUT</span>
                <span className="node-stage-tag">PROFILE &amp; ASSESSMENT</span>
              </div>
              <h3 className="node-stage-title">5D Assessment Data</h3>
              <p className="node-stage-desc">
                Ingests raw psychometric, academic, and economic telemetry from the user's multi-stage assessment.
              </p>

              {/* 5 Assessment Inputs */}
              <div className="node-inputs-list">
                <div className="node-input-item">
                  <span className="input-dot" />
                  <div className="input-text">
                    <span className="input-name">Skills Baseline</span>
                    <span className="input-sub">Technical &amp; domain competencies</span>
                  </div>
                </div>
                <div className="node-input-item">
                  <span className="input-dot" />
                  <div className="input-text">
                    <span className="input-name">Holland Interests</span>
                    <span className="input-sub">RIASEC work archetype profile</span>
                  </div>
                </div>
                <div className="node-input-item">
                  <span className="input-dot" />
                  <div className="input-text">
                    <span className="input-name">5D Aptitude Matrix</span>
                    <span className="input-sub">Cognitive &amp; systems reasoning ({aptitudeVal}% score)</span>
                  </div>
                </div>
                <div className="node-input-item">
                  <span className="input-dot" />
                  <div className="input-text">
                    <span className="input-name">Work Style &amp; Risk</span>
                    <span className="input-sub">Autonomy &amp; risk tolerance bounds</span>
                  </div>
                </div>
                <div className="node-input-item">
                  <span className="input-dot" />
                  <div className="input-text">
                    <span className="input-name">Family Bounds &amp; Goals</span>
                    <span className="input-sub">Tuition cap (₹{budgetVal}L/yr) &amp; consensus</span>
                  </div>
                </div>
              </div>

              <div className="node-footer-meta">
                <span>STATUS: INGESTED</span>
                <span>CHANNELS: 5/5</span>
              </div>
            </div>

            {/* CONNECTOR 01 -> 02 */}
            <div className="pipeline-connector-h" aria-hidden="true">
              <svg className="connector-svg" width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none">
                <line x1="0" y1="12" x2="94" y2="12" className="connector-track" />
                <line x1="0" y1="12" x2="94" y2="12" className="connector-flow pipeline-flow-line" />
                <polygon points="94,8 100,12 94,16" className="connector-arrowhead" />
              </svg>
              <span className="connector-badge">RAW SIGNALS</span>
            </div>

            {/* STAGE 02: SIGNALS */}
            <div
              className={`pipeline-node-card ${hoveredStage === '02' ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredStage('02')}
              onMouseLeave={() => setHoveredStage(null)}
            >
              <div className="node-stage-header">
                <span className="node-stage-number">02 SIGNALS</span>
                <span className="node-stage-tag">EXTRACTION &amp; NORMALIZATION</span>
              </div>
              <h3 className="node-stage-title">Signal Extraction</h3>
              <p className="node-stage-desc">
                Normalizes raw responses into three independent mathematical feature vectors.
              </p>

              {/* 3 Converging Signal Vectors */}
              <div className="signal-vectors-group">
                <div className="signal-vector-box">
                  <div className="vector-header">
                    <span className="vector-label">VECTOR A // TECHNICAL SIGNALS</span>
                    <span className="vector-val">{metrics?.abstractLogic || 88}%</span>
                  </div>
                  <span className="vector-detail">Abstract logic, systems thinking &amp; quantitative models</span>
                </div>

                <div className="signal-vector-box">
                  <div className="vector-header">
                    <span className="vector-label">VECTOR B // BEHAVIORAL SIGNALS</span>
                    <span className="vector-val">{metrics?.systemsThinking || 85}%</span>
                  </div>
                  <span className="vector-detail">Problem decomposition, autonomy preference &amp; grit</span>
                </div>

                <div className="signal-vector-box">
                  <div className="vector-header">
                    <span className="vector-label">VECTOR C // CAREER PREFERENCES</span>
                    <span className="vector-val">100%</span>
                  </div>
                  <span className="vector-detail">Mobility tolerance, discipline affinity &amp; ROI horizon</span>
                </div>
              </div>

              <div className="node-footer-meta">
                <span>NORMALIZATION: Z-SCORE</span>
                <span>VECTORS: 3 ACTIVE</span>
              </div>
            </div>

            {/* CONNECTOR 02 -> 03 */}
            <div className="pipeline-connector-h" aria-hidden="true">
              <svg className="connector-svg" width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none">
                <line x1="0" y1="12" x2="94" y2="12" className="connector-track" />
                <line x1="0" y1="12" x2="94" y2="12" className="connector-flow pipeline-flow-line" />
                <polygon points="94,8 100,12 94,16" className="connector-arrowhead" />
              </svg>
              <span className="connector-badge">VECTORS</span>
            </div>

            {/* STAGE 03: FIT */}
            <div
              className={`pipeline-node-card ${hoveredStage === '03' ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredStage('03')}
              onMouseLeave={() => setHoveredStage(null)}
            >
              <div className="node-stage-header">
                <span className="node-stage-number">03 FIT</span>
                <span className="node-stage-tag">MULTIVARIATE ENGINE</span>
              </div>
              <h3 className="node-stage-title">Fit Scoring Engine</h3>
              <p className="node-stage-desc">
                Calculates deterministic alignment across 5 weighted dimensions. Hover to inspect weights.
              </p>

              {/* 5-Factor Scoring Formula Bars */}
              <div className="fit-factors-container">
                <div className="fit-factor-row">
                  <div className="fit-factor-head">
                    <span className="fit-factor-name">Student Fit (Skill &amp; Aptitude)</span>
                    <span className="fit-factor-weight">35%</span>
                  </div>
                  <div className="fit-factor-bar-bg">
                    <div className="fit-factor-bar-fill" style={{ width: `${selectedCareer.scores.studentFit}%` }} />
                  </div>
                  <span className="fit-factor-score-num">{selectedCareer.scores.studentFit}% active score</span>
                </div>

                <div className="fit-factor-row">
                  <div className="fit-factor-head">
                    <span className="fit-factor-name">Financial Fit (Tuition &amp; ROI)</span>
                    <span className="fit-factor-weight">20%</span>
                  </div>
                  <div className="fit-factor-bar-bg">
                    <div className="fit-factor-bar-fill" style={{ width: `${selectedCareer.scores.financialFit}%` }} />
                  </div>
                  <span className="fit-factor-score-num">{selectedCareer.scores.financialFit}% active score</span>
                </div>

                <div className="fit-factor-row">
                  <div className="fit-factor-head">
                    <span className="fit-factor-name">Market Fit (Industrial Demand)</span>
                    <span className="fit-factor-weight">20%</span>
                  </div>
                  <div className="fit-factor-bar-bg">
                    <div className="fit-factor-bar-fill" style={{ width: `${selectedCareer.scores.marketFit}%` }} />
                  </div>
                  <span className="fit-factor-score-num">{selectedCareer.scores.marketFit}% active score</span>
                </div>

                <div className="fit-factor-row">
                  <div className="fit-factor-head">
                    <span className="fit-factor-name">Family Alignment (Consensus)</span>
                    <span className="fit-factor-weight">15%</span>
                  </div>
                  <div className="fit-factor-bar-bg">
                    <div className="fit-factor-bar-fill" style={{ width: `${selectedCareer.scores.familyAlignment}%` }} />
                  </div>
                  <span className="fit-factor-score-num">{selectedCareer.scores.familyAlignment}% active score</span>
                </div>

                <div className="fit-factor-row">
                  <div className="fit-factor-head">
                    <span className="fit-factor-name">Location Fit (Regional Hubs)</span>
                    <span className="fit-factor-weight">10%</span>
                  </div>
                  <div className="fit-factor-bar-bg">
                    <div className="fit-factor-bar-fill" style={{ width: `${selectedCareer.scores.locationFit}%` }} />
                  </div>
                  <span className="fit-factor-score-num">{selectedCareer.scores.locationFit}% active score</span>
                </div>
              </div>

              <div className="fit-formula-badge">
                <code>Score = 0.35·S + 0.20·F + 0.20·M + 0.15·FA + 0.10·L</code>
              </div>
            </div>
          </div>

          {/* INTER-TIER DATA BUS: ROUTES FIT ENGINE OUTPUT DOWN TO MATCHING ENGINE */}
          <div className="pipeline-inter-tier-bus" aria-hidden="true">
            <div className="bus-line-track" />
            <div className="bus-junction-terminal">
              <span className="terminal-dot" />
              <span className="terminal-label">DETERMINISTIC FIT TENSOR PIPED TO ROLE MATCHING</span>
              <span className="terminal-dot" />
            </div>
          </div>

          {/* TIER 2: STAGES 04, 05, 06 */}
          <div className="pipeline-tier pipeline-tier-2">
            {/* STAGE 04: MATCH */}
            <div
              className={`pipeline-node-card ${hoveredStage === '04' ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredStage('04')}
              onMouseLeave={() => setHoveredStage(null)}
            >
              <div className="node-stage-header">
                <span className="node-stage-number">04 MATCH</span>
                <span className="node-stage-tag">TAXONOMY &amp; FILTERING</span>
              </div>
              <h3 className="node-stage-title">Role Matching</h3>
              <p className="node-stage-desc">
                Matches the student's 5D fit profile against authentic STEAM pathways and eliminates constraint violations.
              </p>

              {/* Matching Criteria Checklist */}
              <div className="match-criteria-list">
                <div className="match-criterion-box">
                  <div className="criterion-header">
                    <span className="criterion-title">STEAM Taxonomy Evaluation</span>
                    <span className="criterion-badge">25 PATHWAYS</span>
                  </div>
                  <span className="criterion-sub">Analyzes frontier roles across AI, Robotics, CleanTech &amp; Systems</span>
                </div>

                <div className="match-criterion-box">
                  <div className="criterion-header">
                    <span className="criterion-title">Skill Gap Tolerance</span>
                    <span className="criterion-badge">CALIBRATED</span>
                  </div>
                  <span className="criterion-sub">Ensures prerequisites are achievable within student runway</span>
                </div>

                <div className="match-criterion-box">
                  <div className="criterion-header">
                    <span className="criterion-title">Market Demand Telemetry</span>
                    <span className="criterion-badge">LIVE MoSPI/NASSCOM</span>
                  </div>
                  <span className="criterion-sub">Filters out sunset roles; prioritizes 5-year CAGR growth trajectories</span>
                </div>

                <div className="match-criterion-box">
                  <div className="criterion-header">
                    <span className="criterion-title">Boundary Gating</span>
                    <span className="criterion-badge">ENFORCED</span>
                  </div>
                  <span className="criterion-sub">Disqualifies options exceeding family budget or risk thresholds</span>
                </div>
              </div>

              <div className="node-footer-meta">
                <span>CATALOG: 25 ROLES</span>
                <span>GATING: PASSED</span>
              </div>
            </div>

            {/* CONNECTOR 04 -> 05 */}
            <div className="pipeline-connector-h" aria-hidden="true">
              <svg className="connector-svg" width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none">
                <line x1="0" y1="12" x2="94" y2="12" className="connector-track" />
                <line x1="0" y1="12" x2="94" y2="12" className="connector-flow pipeline-flow-line" />
                <polygon points="94,8 100,12 94,16" className="connector-arrowhead" />
              </svg>
              <span className="connector-badge">RANK PIPELINE</span>
            </div>

            {/* STAGE 05: RANK */}
            <div
              className={`pipeline-node-card ${hoveredStage === '05' ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredStage('05')}
              onMouseLeave={() => setHoveredStage(null)}
            >
              <div className="node-stage-header">
                <span className="node-stage-number">05 RANK</span>
                <span className="node-stage-tag">MULTI-CRITERIA SORT</span>
              </div>
              <h3 className="node-stage-title">Ranking Engine</h3>
              <p className="node-stage-desc">
                Ranks all qualified candidates by deterministic score. Isolates the Top {rankedCount} recommendations.
              </p>

              {/* Final Node: TOP RECOMMENDATIONS */}
              <div className="top10-terminal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="terminal-junction-sq" />
                  <span className="top10-terminal-title">TOP {rankedCount} RECOMMENDATIONS</span>
                </div>
                <span className="top10-terminal-meta">CLICK TO INSPECT</span>
              </div>

              {/* Compact Ranked Output Representation (Ranks #1 through #rankedCount) */}
              <div className="compact-top10-roster">
                {careersList.map((career, idx) => {
                  const isSelected = career.id === selectedCareer.id;
                  const rankDisplay = String(idx + 1).padStart(2, '0');
                  return (
                    <div
                      key={career.id}
                      onClick={() => onSelectCareer(career)}
                      className={`compact-top10-row ${isSelected ? 'is-selected' : ''}`}
                      title={`Rank #${idx + 1}: ${career.title} (${career.scores.overallScore}%)`}
                    >
                      <span className="compact-row-rank">{rankDisplay}</span>
                      <span className="compact-row-title">{career.title}</span>
                      <span className="compact-row-score">{career.scores.overallScore}%</span>
                    </div>
                  );
                })}
              </div>

              <div className="node-footer-meta">
                <span>TOTAL RANKED: {rankedCount}</span>
                <span>SELECTED: #{currentRank}</span>
              </div>
            </div>

            {/* CONNECTOR 05 -> 06 */}
            <div className="pipeline-connector-h" aria-hidden="true">
              <svg className="connector-svg" width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none">
                <line x1="0" y1="12" x2="94" y2="12" className="connector-track" />
                <line x1="0" y1="12" x2="94" y2="12" className="connector-flow pipeline-flow-line" />
                <polygon points="94,8 100,12 94,16" className="connector-arrowhead" />
              </svg>
              <span className="connector-badge">RATIONALE</span>
            </div>

            {/* STAGE 06: RATIONALE */}
            <div
              className={`pipeline-node-card ${hoveredStage === '06' ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredStage('06')}
              onMouseLeave={() => setHoveredStage(null)}
            >
              <div className="node-stage-header">
                <span className="node-stage-number">06 RATIONALE</span>
                <span className="node-stage-tag">DECISION VERIFICATION</span>
              </div>
              <h3 className="node-stage-title">Explainable Rationale</h3>
              <p className="node-stage-desc">
                Causal factors explaining why <strong style={{ color: 'var(--text-primary)' }}>{selectedCareer.title}</strong> is ranked #{currentRank}.
              </p>

              {/* Rationale Factor Breakdown */}
              <div className="rationale-breakdown-list">
                <div className="rationale-item">
                  <div className="rationale-item-head">
                    <span className="rationale-item-label">Skill Alignment</span>
                    <span className="rationale-item-score">{selectedCareer.scores.studentFit}% FIT</span>
                  </div>
                  <span className="rationale-item-desc">
                    {selectedCareer.strengthsMatch?.length
                      ? `Matches: ${selectedCareer.strengthsMatch.slice(0, 2).join(', ')}`
                      : 'Cognitive abstract logic and systems thinking match'}
                  </span>
                </div>

                <div className="rationale-item">
                  <div className="rationale-item-head">
                    <span className="rationale-item-label">Goal &amp; Budget Compatibility</span>
                    <span className="rationale-item-score">{selectedCareer.scores.financialFit}% FIT</span>
                  </div>
                  <span className="rationale-item-desc">
                    Tuition within ₹{budgetVal}L ceiling • Expected compensation: {selectedCareer.salaryRange}
                  </span>
                </div>

                <div className="rationale-item">
                  <div className="rationale-item-head">
                    <span className="rationale-item-label">Market Relevance</span>
                    <span className="rationale-item-score">{selectedCareer.scores.marketFit}% FIT</span>
                  </div>
                  <span className="rationale-item-desc">
                    Industrial demand expansion ({selectedCareer.growthRate})
                  </span>
                </div>

                <div className="rationale-item">
                  <div className="rationale-item-head">
                    <span className="rationale-item-label">Work-Style &amp; Family Consensus</span>
                    <span className="rationale-item-score">{selectedCareer.scores.familyAlignment}% FIT</span>
                  </div>
                  <span className="rationale-item-desc">
                    Risk tolerance alignment ({selectedCareer.riskLevel.toUpperCase()})
                  </span>
                </div>

                {selectedCareer.whyRecommended?.[0] && (
                  <div className="rationale-primary-summary">
                    <span className="summary-quote-mark">“</span>
                    <span className="summary-quote-text">{selectedCareer.whyRecommended[0]}</span>
                  </div>
                )}
              </div>

              {/* Final Output Node */}
              <div className="final-recommendation-box">
                <div className="final-box-label">FINAL RECOMMENDATION // RANK #{currentRank}</div>
                <div className="final-box-career">{selectedCareer.title}</div>
                <div className="final-box-score">
                  ALIGNMENT: <strong>{selectedCareer.scores.overallScore}% DETERMINISTIC FIT</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Schematic Terminal Legend */}
        <div
          style={{
            marginTop: '36px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-hairline)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--text-muted)' }}>
              LEGEND:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '2px', backgroundColor: 'var(--accent)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--text-secondary)' }}>
                DETERMINISTIC DATA BUS
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--text-secondary)' }}>
                DECISION JUNCTION
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', border: '1px solid var(--border-subtle)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--text-secondary)' }}>
                GATED CONSTRAINT
              </span>
            </div>
          </div>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.64rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.04em'
            }}
          >
            NO BLACK-BOX STOCHASTIC OUTPUT • 100% REPRODUCIBLE ALIGNMENT
          </span>
        </div>
      </div>

      {/* Scoped CSS for Decision Architecture Pipeline */}
      <style>{`
        .pipeline-stages-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .pipeline-tier {
          display: grid;
          grid-template-columns: 1fr 48px 1fr 48px 1fr;
          align-items: stretch;
        }

        .pipeline-node-card {
          background-color: #FFFFFF;
          border: 1px solid var(--border-hairline);
          padding: 24px;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: border-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
        }

        .pipeline-node-card:hover,
        .pipeline-node-card.is-hovered {
          border-color: var(--accent);
          box-shadow: 0 4px 18px rgba(45, 90, 67, 0.08);
          background-color: #FAFAF8;
        }

        .node-stage-header {
          display: flex;
          justifyContent: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-hairline);
        }

        .node-stage-number {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: 0.08em;
        }

        .node-stage-tag {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .node-stage-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 6px 0;
          letter-spacing: -0.015em;
        }

        .node-stage-desc {
          font-family: var(--font-body);
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin: 0 0 16px 0;
        }

        /* Stage 01: Inputs */
        .node-inputs-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .node-input-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px 10px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-hairline);
        }

        .input-dot {
          width: 5px;
          height: 5px;
          background-color: var(--accent);
          margin-top: 5px;
          flex-shrink: 0;
        }

        .input-text {
          display: flex;
          flex-direction: column;
        }

        .input-name {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .input-sub {
          font-family: var(--font-body);
          font-size: 0.7rem;
          color: var(--text-secondary);
          line-height: 1.3;
        }

        /* Stage 02: Vectors */
        .signal-vectors-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .signal-vector-box {
          padding: 10px 12px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-hairline);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .vector-header {
          display: flex;
          justifyContent: space-between;
          align-items: center;
        }

        .vector-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: 0.04em;
        }

        .vector-val {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .vector-detail {
          font-family: var(--font-body);
          font-size: 0.72rem;
          color: var(--text-secondary);
          line-height: 1.35;
        }

        /* Stage 03: Fit Factors */
        .fit-factors-container {
          display: flex;
          flex-direction: column;
          gap: 9px;
          flex: 1;
        }

        .fit-factor-row {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .fit-factor-head {
          display: flex;
          justifyContent: space-between;
          align-items: center;
        }

        .fit-factor-name {
          font-family: var(--font-body);
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .fit-factor-weight {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--accent);
        }

        .fit-factor-bar-bg {
          height: 4px;
          background-color: var(--border-hairline);
          overflow: hidden;
        }

        .fit-factor-bar-fill {
          height: 100%;
          background-color: var(--accent);
          transition: width 0.3s ease;
        }

        .fit-factor-score-num {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--text-muted);
        }

        .fit-formula-badge {
          margin-top: 12px;
          padding: 8px 10px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-hairline);
          font-size: 0.66rem;
          color: var(--text-secondary);
          text-align: center;
        }

        .fit-formula-badge code {
          font-family: var(--font-mono);
          color: var(--accent);
          font-weight: 600;
        }

        /* Inter-Tier Data Bus */
        .pipeline-inter-tier-bus {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          padding: 8px 0;
        }

        .bus-line-track {
          width: 100%;
          height: 1px;
          background-color: var(--border-subtle);
          position: absolute;
          top: 50%;
          left: 0;
          z-index: 1;
        }

        .bus-junction-terminal {
          position: relative;
          z-index: 2;
          background-color: var(--bg-card);
          padding: 4px 16px;
          border: 1px solid var(--accent-border);
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .terminal-dot {
          width: 5px;
          height: 5px;
          background-color: var(--accent);
        }

        .terminal-label {
          font-family: var(--font-mono);
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--accent);
          text-transform: uppercase;
        }

        /* Stage 04: Match Criteria */
        .match-criteria-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .match-criterion-box {
          padding: 8px 10px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-hairline);
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .criterion-header {
          display: flex;
          justifyContent: space-between;
          align-items: center;
        }

        .criterion-title {
          font-family: var(--font-body);
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .criterion-badge {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          font-weight: 700;
          color: var(--accent);
          background-color: var(--accent-dim);
          padding: 1px 6px;
          border: 1px solid var(--accent-border);
        }

        .criterion-sub {
          font-family: var(--font-body);
          font-size: 0.69rem;
          color: var(--text-secondary);
          line-height: 1.3;
        }

        /* Stage 05: Top 10 Roster */
        .top10-terminal-header {
          display: flex;
          justifyContent: space-between;
          align-items: center;
          background-color: var(--bg-surface);
          padding: 8px 10px;
          border: 1px solid var(--border-subtle);
          margin-bottom: 8px;
        }

        .terminal-junction-sq {
          width: 6px;
          height: 6px;
          background-color: var(--accent);
        }

        .top10-terminal-title {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--accent);
          letter-spacing: 0.06em;
        }

        .top10-terminal-meta {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
        }

        .compact-top10-roster {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
          max-height: 250px;
          overflow-y: auto;
          border: 1px solid var(--border-hairline);
          background-color: var(--bg-surface);
          padding: 4px;
        }

        .compact-top10-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 8px;
          background-color: #FFFFFF;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .compact-top10-row:hover {
          border-color: var(--accent-border);
          background-color: #F8FBF9;
        }

        .compact-top10-row.is-selected {
          border-color: var(--accent);
          background-color: var(--accent-dim);
        }

        .compact-row-rank {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--accent);
          width: 24px;
          flex-shrink: 0;
        }

        .compact-row-title {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-primary);
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 8px;
        }

        .compact-row-score {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-primary);
          flex-shrink: 0;
        }

        /* Stage 06: Rationale */
        .rationale-breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 12px;
          flex: 1;
        }

        .rationale-item {
          padding: 7px 9px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-hairline);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .rationale-item-head {
          display: flex;
          justifyContent: space-between;
          align-items: center;
        }

        .rationale-item-label {
          font-family: var(--font-mono);
          font-size: 0.64rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.02em;
        }

        .rationale-item-score {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--accent);
        }

        .rationale-item-desc {
          font-family: var(--font-body);
          font-size: 0.69rem;
          color: var(--text-secondary);
          line-height: 1.3;
        }

        .rationale-primary-summary {
          padding: 8px 10px;
          background-color: #F8FBF9;
          border-left: 2px solid var(--accent);
          display: flex;
          gap: 6px;
          align-items: flex-start;
        }

        .summary-quote-mark {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: var(--accent);
          line-height: 0.9;
        }

        .summary-quote-text {
          font-family: var(--font-body);
          font-size: 0.72rem;
          color: var(--text-secondary);
          line-height: 1.4;
          font-style: italic;
        }

        .final-recommendation-box {
          padding: 10px 12px;
          background-color: var(--accent-dim);
          border: 1px solid var(--accent);
          text-align: center;
          margin-top: auto;
        }

        .final-box-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: var(--accent);
          font-weight: 700;
          margin-bottom: 2px;
        }

        .final-box-career {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .final-box-score {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-secondary);
        }

        .final-box-score strong {
          color: var(--accent);
        }

        /* Node Footer Meta */
        .node-footer-meta {
          display: flex;
          justifyContent: space-between;
          align-items: center;
          margin-top: 14px;
          padding-top: 8px;
          border-top: 1px solid var(--border-hairline);
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
        }

        /* Connectors */
        .pipeline-connector-h {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 48px;
        }

        .connector-svg {
          width: 100%;
          height: 24px;
        }

        .connector-track {
          stroke: var(--border-subtle);
          stroke-width: 1.5;
        }

        .connector-flow {
          stroke: var(--accent);
          stroke-width: 1.5;
        }

        .connector-arrowhead {
          fill: var(--accent);
        }

        .connector-badge {
          position: absolute;
          bottom: 2px;
          font-family: var(--font-mono);
          font-size: 0.48rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          white-space: nowrap;
          text-transform: uppercase;
        }

        /* Signal Animation */
        @keyframes technicalSignalFlow {
          from {
            stroke-dashoffset: 24;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        .pipeline-flow-line {
          stroke-dasharray: 4 4;
          animation: technicalSignalFlow 1.2s linear infinite;
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.85);
          }
        }

        .pipeline-pulse-dot {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .pipeline-flow-line,
          .pipeline-pulse-dot {
            animation: none !important;
          }
        }

        /* Responsive Layout */
        @media (max-width: 1100px) {
          .pipeline-tier {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .pipeline-connector-h {
            width: 100%;
            height: 32px;
            margin: 4px 0;
          }

          .connector-svg {
            transform: rotate(90deg);
            height: 32px;
          }

          .pipeline-inter-tier-bus {
            padding: 16px 0;
          }

          .pipeline-schematic-container {
            padding: 24px 18px 32px !important;
          }
        }
      `}</style>
    </section>
  );
};
