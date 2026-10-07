import React from 'react';
import { INITIAL_CAREERS } from '../../data/mockAlignxData';
import { Calendar, BookOpen, Award, GraduationCap } from 'lucide-react';

interface RoadmapModuleProps {
  careerId?: string;
}

export const RoadmapModule: React.FC<RoadmapModuleProps> = ({
  careerId = 'ai-engineer'
}) => {
  const career = INITIAL_CAREERS.find(c => c.id === careerId) || INITIAL_CAREERS[0];

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '24px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Calendar size={18} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', color: 'var(--accent)' }}>
            PHASE 10 / STRATEGIC LEARNING & EXECUTION ROADMAP
          </span>
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
          EXECUTION BLUEPRINT: {career.title.toUpperCase()}
        </h1>

        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Deterministic timeline mapping skill-gap resolution, entrance exams, and high-value scholarship opportunities.
        </p>
      </div>

      {/* Degree & Education Pathway */}
      <div
        style={{
          border: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)',
          padding: '32px',
          marginBottom: '36px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <GraduationCap size={18} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
            ACADEMIC DEGREE PATHWAY
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {career.educationPath}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Designed to ensure dual eligibility for both immediate high-tier campus hiring and sponsored research fellowships.
        </div>
      </div>

      {/* 4-Quarter Step-by-Step Learning Roadmap */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.14em', marginBottom: '20px' }}>
          QUARTER-BY-QUARTER MILESTONES & SKILL GAP RESOLUTION
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            {
              quarter: 'Q1 (MONTHS 1–3)',
              focus: 'CORE FOUNDATION & MATHEMATICAL PROFILING',
              deliverables: [
                'Complete advanced Linear Algebra & Multivariable Matrix Calculus for ML.',
                'Benchmark C++ / CUDA baseline with zero-copy memory pinned allocators.',
                'Resolve deficit: Tensor decomposition and hardware cache layouts.'
              ]
            },
            {
              quarter: 'Q2 (MONTHS 4–6)',
              focus: 'DISTRIBUTED SYSTEMS & MODEL PARALLELISM',
              deliverables: [
                'Implement Megatron-LM tensor parallel layer from scratch in PyTorch.',
                'Master Ray Train and vLLM inference engine internals.',
                'Contribute 2 PRs to open-source systems frameworks.'
              ]
            },
            {
              quarter: 'Q3 (MONTHS 7–9)',
              focus: 'PRODUCTION RESEARCH PROJECT & INTERNSHIP',
              deliverables: [
                'Deploy sub-5ms low-latency inference service on NVIDIA Triton server.',
                'Target Tier-1 lab internship in Bangalore / Singapore.',
                'Apply for ISM or Reliance Foundation research grants.'
              ]
            },
            {
              quarter: 'Q4 (MONTHS 10–12)',
              focus: 'PORTFOLIO ARBITRAGE & HIGH-TIER PLACEMENT',
              deliverables: [
                'Publish reproducible benchmark paper or GitHub technical report.',
                'Complete targeted system design interviews for DeepTech roles.',
                'Negotiate offers prioritizing equity upside and compute budget.'
              ]
            }
          ].map((m, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid var(--border-hairline)',
                padding: '28px 32px',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
                  {m.quarter}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  MILESTONE {idx + 1} OF 4
                </span>
              </div>

              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
                {m.focus}
              </div>

              <ul style={{ paddingLeft: '20px', fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {m.deliverables.map((d, i) => (
                  <li key={i} style={{ marginBottom: '6px' }}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Entrance Exams & Scholarships */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          marginBottom: '40px'
        }}
        className="roadmap-support-grid"
      >
        {/* Entrance Exams */}
        <div style={{ border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BookOpen size={16} color="var(--accent)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
              RELEVANT ENTRANCE EXAMINATIONS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {career.entranceExams.map((exam, i) => (
              <div key={i} style={{ border: '1px solid var(--border-subtle)', padding: '14px 18px', backgroundColor: 'var(--bg-deep)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600 }}>{exam}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  GATEWAY TO TIER-1 INSTITUTIONAL COHORTS
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scholarships */}
        <div style={{ border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Award size={16} color="var(--accent)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
              TARGET SCHOLARSHIPS & RESEARCH GRANTS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {career.scholarships.map((sch, i) => (
              <div key={i} style={{ border: '1px solid var(--border-subtle)', padding: '14px 18px', backgroundColor: 'var(--bg-deep)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600 }}>{sch}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', marginTop: '4px' }}>
                  OFFSETS 50%–100% OF TUITION & LIVING STIPEND
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .roadmap-support-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
