import React, { useState, useEffect } from 'react';
import { INITIAL_CAREERS } from '../../data/mockAlignxData';
import { ApiService } from '../../services/api';
import { ArrowRight, Cpu, CheckCircle2, AlertCircle, GitBranch } from 'lucide-react';

import type { AlignxSessionProgress } from '../../types/alignx';

interface CareerTwinModuleProps {
  careerId?: string;
  sessionProgress?: AlignxSessionProgress;
  onOpenRoadmap: () => void;
  onBackToDashboard?: () => void;
  onOpenWhatIf?: () => void;
  onSelectCareer?: (careerId: string) => void;
}

export const CareerTwinModule: React.FC<CareerTwinModuleProps> = ({
  careerId = 'ai-engineer',
  sessionProgress,
  onOpenRoadmap,
  onSelectCareer
}) => {
  const normalizeSlug = (slug?: string) => (slug || '').toLowerCase().replace(/[-_]/g, '');

  const [career, setCareer] = useState(() =>
    INITIAL_CAREERS.find(c => normalizeSlug(c.id) === normalizeSlug(careerId)) || INITIAL_CAREERS[0]
  );
  const [twinBackendData, setTwinBackendData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const staticMatched =
      INITIAL_CAREERS.find(c => normalizeSlug(c.id) === normalizeSlug(careerId)) || INITIAL_CAREERS[0];
    setCareer(staticMatched);

    ApiService.getCareerTwin(careerId)
      .then(res => {
        if (res?.data && isMounted) {
          setTwinBackendData(res.data);
        }
      })
      .catch(err => console.warn('[ALIGNX Twin] Backend twin note:', err));

    return () => { isMounted = false; };
  }, [careerId]);

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '24px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <Cpu size={18} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', color: 'var(--accent)' }}>
            PHASE 08 / DIGITAL CAREER TWIN
          </span>
          {twinBackendData && (
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
              ● LIVE DIGITAL TWIN
            </span>
          )}
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
          CAREER TWIN: {career.title.toUpperCase()}
        </h1>

        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Simulating the synthetic profile of a top 10th-percentile practitioner in this domain vs. your current baseline competencies.
        </p>
      </div>

      {/* Twin Comparison Topology Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          marginBottom: '40px'
        }}
        className="twin-comparison-grid"
      >
        {/* Left: Your Current Profile Vector */}
        <div
          style={{
            border: '1px solid var(--border-hairline)',
            backgroundColor: 'var(--bg-surface)',
            padding: '36px'
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: '8px' }}>
            STUDENT BASELINE VECTOR
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>
            {career.title.toUpperCase()} (FOUNDATIONAL LEVEL)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {career.requiredSkills.map((skillName, idx) => {
              const rawMetrics: any = sessionProgress?.aptitudeMetrics || {};
              const baseAptitude = sessionProgress?.aptitudeScore || 78;

              const logic = rawMetrics.abstractLogic ?? rawMetrics.logical ?? baseAptitude;
              const quant = rawMetrics.quantitativeEstimation ?? rawMetrics.numerical ?? baseAptitude;
              const systems = rawMetrics.systemsThinking ?? rawMetrics.analytical ?? baseAptitude;
              const spatial = rawMetrics.spatialArchitecture ?? rawMetrics.spatial ?? baseAptitude;
              const verbal = rawMetrics.riskTolerance ?? rawMetrics.verbal ?? baseAptitude;

              const sLower = skillName.toLowerCase();
              let cognitiveSignal = baseAptitude;

              if (sLower.includes('hardware') || sLower.includes('circuit') || sLower.includes('embedded') || sLower.includes('pcb') || sLower.includes('cad') || sLower.includes('iot')) {
                cognitiveSignal = Math.round(spatial * 0.50 + systems * 0.30 + logic * 0.20);
              } else if (sLower.includes('machine learning') || sLower.includes('ai') || sLower.includes('algorithm') || sLower.includes('neural')) {
                cognitiveSignal = Math.round(logic * 0.45 + quant * 0.35 + systems * 0.20);
              } else if (sLower.includes('data') || sLower.includes('database') || sLower.includes('cloud') || sLower.includes('distributed')) {
                cognitiveSignal = Math.round(systems * 0.50 + logic * 0.30 + quant * 0.20);
              } else if (sLower.includes('math') || sLower.includes('statist') || sLower.includes('quantitative') || sLower.includes('fintech')) {
                cognitiveSignal = Math.round(quant * 0.55 + logic * 0.30 + systems * 0.15);
              } else if (sLower.includes('product') || sLower.includes('design') || sLower.includes('ui') || sLower.includes('ux')) {
                cognitiveSignal = Math.round(verbal * 0.45 + systems * 0.35 + spatial * 0.20);
              } else {
                cognitiveSignal = Math.round(systems * 0.40 + logic * 0.35 + quant * 0.25);
              }

              const branch = ((sessionProgress?.studentProfile as any)?.branch || sessionProgress?.studentProfile?.currentField || '').toLowerCase();
              let branchBonus = 0;
              if (branch) {
                if ((branch.includes('elect') || branch.includes('ece')) && (sLower.includes('circuit') || sLower.includes('embedded') || sLower.includes('hardware') || sLower.includes('iot'))) branchBonus = 6;
                else if ((branch.includes('comp') || branch.includes('it')) && (sLower.includes('python') || sLower.includes('c++') || sLower.includes('data') || sLower.includes('software'))) branchBonus = 6;
                else if (branch.includes('mech') && (sLower.includes('cad') || sLower.includes('robot') || sLower.includes('sensor'))) branchBonus = 6;
              }

              // Realistic student foundational baseline
              const baselineLevel = Math.min(84, Math.max(38, Math.round(cognitiveSignal * 0.74 + branchBonus)));

              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '6px' }}>
                    <span>{skillName}</span>
                    <span style={{ color: 'var(--accent)' }}>{baselineLevel}%</span>
                  </div>
                  <div style={{ height: '3px', backgroundColor: 'var(--border-hairline)', width: '100%' }}>
                    <div style={{ height: '100%', width: `${baselineLevel}%`, backgroundColor: 'var(--accent)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: The Benchmark Career Twin */}
        <div
          style={{
            border: '1px solid var(--border-hairline)',
            backgroundColor: 'var(--bg-surface)',
            padding: '36px'
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '8px' }}>
            TARGET INDUSTRY TWIN BENCHMARK
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>
            TOP 10TH-PERCENTILE {career.title.toUpperCase()}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {career.requiredSkills.map((skillName, idx) => {
              const targetLevel = 90 + ((idx * 2) % 6);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '6px' }}>
                    <span>{skillName}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{targetLevel}%</span>
                  </div>
                  <div style={{ height: '3px', backgroundColor: 'var(--border-hairline)', width: '100%' }}>
                    <div style={{ height: '100%', width: `${targetLevel}%`, backgroundColor: 'var(--text-secondary)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Strengths & Deficits / Skill Gap Audit */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          marginBottom: '40px'
        }}
        className="twin-comparison-grid"
      >
        {/* Identified Strengths */}
        <div style={{ border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CheckCircle2 size={16} color="var(--accent)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.14em' }}>
              CONFIRMED STRENGTHS & ASYMMETRIC ADVANTAGES
            </span>
          </div>

          <ul style={{ paddingLeft: '18px', fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
            {career.strengthsMatch.map((str, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>{str}</li>
            ))}
            <li>High conceptual endurance during root-cause systems debugging.</li>
          </ul>
        </div>

        {/* Identified Deficits / Skill Gaps */}
        <div style={{ border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertCircle size={16} color="var(--accent)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.14em' }}>
              CRITICAL SKILL DEFICITS (REQUIRING REMEDIATION)
            </span>
          </div>

          <ul style={{ paddingLeft: '18px', fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {career.studentSkillGaps.map((gap, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{gap}:</span> Deficit of approximately 35% compared to Tier-1 hiring threshold.
              </li>
            ))}
            <li>Zero-latency inference profiling on NVIDIA TensorRT / Triton Server.</li>
          </ul>
        </div>
      </div>

      {/* Alternative & Interdisciplinary Pivots */}
      <div
        style={{
          border: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)',
          padding: '36px',
          marginBottom: '36px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <GitBranch size={16} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.14em' }}>
            ADJACENT CAREER TWIN ALTERNATIVES (LOW-EFFORT PIVOTS)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {[
            { id: 'silicon-architect', title: 'Silicon Compiler Engineer', overlap: '78% Skill Overlap', rationale: 'Leverages your abstract logic into ASIC and FPGA synthesis.' },
            { id: 'quant-systems', title: 'High-Frequency Quant Systems', overlap: '74% Skill Overlap', rationale: 'Requires low-latency C++ optimization and stochastic modeling.' },
            { id: 'robotics-lead', title: 'Autonomous Robotics Autonomy Lead', overlap: '71% Skill Overlap', rationale: 'Applies neural networks directly to physical sensor telemetry.' }
          ].map((alt, i) => (
            <div
              key={i}
              onClick={() => onSelectCareer?.(alt.id)}
              style={{
                border: '1px solid var(--border-subtle)',
                padding: '20px',
                backgroundColor: 'var(--bg-deep)',
                cursor: onSelectCareer ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {alt.title}
                </div>
                {onSelectCareer && <ArrowRight size={14} color="var(--accent)" />}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', margin: '4px 0 10px' }}>
                {alt.overlap}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {alt.rationale}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Action Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          borderTop: '1px solid var(--border-hairline)',
          paddingTop: '24px'
        }}
      >
        <button onClick={onOpenRoadmap} className="btn-alignx-primary">
          <span>GENERATE PERSONALIZED SKILL-GAP ROADMAP</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .twin-comparison-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
