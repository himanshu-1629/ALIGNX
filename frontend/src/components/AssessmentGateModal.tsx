import React from 'react';
import { Lock, ArrowRight, CheckCircle2, CircleSlash, Compass, X } from 'lucide-react';
import type { AlignxSessionProgress } from '../types/alignx';
import type { AppView } from './Header';

interface AssessmentGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetView: AppView;
  sessionProgress: AlignxSessionProgress;
  onStartAssessment: (view?: AppView) => void;
  onExploreAtlas: () => void;
}

export const AssessmentGateModal: React.FC<AssessmentGateModalProps> = ({
  isOpen,
  onClose,
  targetView,
  sessionProgress,
  onStartAssessment,
  onExploreAtlas
}) => {
  if (!isOpen) return null;

  const getTargetTitle = () => {
    switch (targetView) {
      case 'dashboard':
      case 'twin':
      case 'whatif':
        return 'DECISION ENGINE & CALIBRATED RANKINGS';
      case 'parent':
        return 'FAMILY PERSPECTIVE PORTAL';
      case 'roadmap':
        return '4-YEAR STRATEGIC ROADMAP';
      default:
        return 'DECISION ENGINE';
    }
  };

  const steps = [
    {
      num: '01',
      title: 'PROFILE & CAPITAL ENVELOPE',
      desc: 'Annual tuition ceiling, target domains, and geographic constraints.',
      isDone: !!sessionProgress?.completedStages?.onboarding,
      stageId: 'onboarding' as AppView
    },
    {
      num: '02',
      title: 'HOLLAND VOCATIONAL RIASEC',
      desc: '18 behavioral scenarios deriving 6-axis career interest vectors.',
      isDone: !!sessionProgress?.completedStages?.discovery,
      stageId: 'discovery' as AppView
    },
    {
      num: '03',
      title: '5D COGNITIVE APTITUDE',
      desc: 'Quantitative, logical, and spatial scenario challenges.',
      isDone: !!sessionProgress?.completedStages?.aptitude,
      stageId: 'aptitude' as AppView
    }
  ];

  // Find next incomplete stage
  const nextIncompleteStep = steps.find((s) => !s.isDone) || steps[0];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(24, 24, 22, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #181816',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
          padding: '36px',
          position: 'relative',
          borderRadius: '0px'
        }}
        className="animate-fade-in"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#6E6A61',
            cursor: 'pointer',
            padding: '6px'
          }}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Top Lock Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'rgba(45, 90, 67, 0.1)',
              border: '1px solid #2D5A43',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2D5A43'
            }}
          >
            <Lock size={18} />
          </div>
          <div>
            <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#2D5A43', fontWeight: 700, letterSpacing: '0.12em' }}>
              ASSESSMENT CALIBRATION REQUIRED
            </span>
            <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61' }}>
              5D MATHEMATICAL PRISM GATE
            </div>
          </div>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontSize: '32px',
            fontWeight: 800,
            textTransform: 'uppercase',
            lineHeight: 1,
            margin: '0 0 12px 0',
            color: '#181816'
          }}
        >
          {getTargetTitle()} IS LOCKED
        </h2>

        <p
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14.5px',
            color: '#6E6A61',
            lineHeight: 1.55,
            margin: '0 0 24px 0'
          }}
        >
          ALIGNX generates individualized career rankings and sensitivity models using a 5-dimension deterministic formula (Student Aptitude Fit, Financial Envelope, Family Consensus, Labor Market Velocity, and Location Alignment). To view your personalized results, you must complete your assessment stages first. Once filled, you will have permanent anytime access!
        </p>

        {/* Prerequisite Checklist */}
        <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {steps.map((st) => (
            <div
              key={st.num}
              style={{
                padding: '12px 14px',
                backgroundColor: st.isDone ? 'rgba(45, 90, 67, 0.05)' : '#F6F5F1',
                border: st.isDone ? '1px solid rgba(45, 90, 67, 0.3)' : '1px solid rgba(24, 24, 22, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '10px',
                    fontWeight: 700,
                    color: st.isDone ? '#2D5A43' : '#6E6A61'
                  }}
                >
                  {st.num} ·
                </span>
                <div>
                  <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#181816' }}>
                    {st.title}
                  </div>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#6E6A61' }}>
                    {st.desc}
                  </div>
                </div>
              </div>

              {st.isDone ? (
                <span
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#2D5A43',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CheckCircle2 size={14} />
                  <span>CALIBRATED</span>
                </span>
              ) : (
                <span
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#6E6A61',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CircleSlash size={13} />
                  <span>REQUIRED</span>
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => {
              onClose();
              onStartAssessment(nextIncompleteStep.stageId);
            }}
            style={{
              height: '44px',
              padding: '0 20px',
              backgroundColor: '#181816',
              color: '#F6F5F1',
              border: 'none',
              borderRadius: '0px',
              fontFamily: "'Martian Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2D5A43')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#181816')}
          >
            <span>■</span>
            <span>COMPLETE {nextIncompleteStep.title}</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={() => {
              onClose();
              onExploreAtlas();
            }}
            style={{
              height: '42px',
              padding: '0 20px',
              backgroundColor: '#ECE9E2',
              color: '#181816',
              border: '1px solid rgba(24, 24, 22, 0.2)',
              borderRadius: '0px',
              fontFamily: "'Martian Mono', monospace",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.18s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = '#2D5A43';
              e.currentTarget.style.color = '#2D5A43';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ECE9E2';
              e.currentTarget.style.borderColor = 'rgba(24, 24, 22, 0.2)';
              e.currentTarget.style.color = '#181816';
            }}
          >
            <Compass size={14} />
            <span>EXPLORE INDIA TALENT ATLAS FIRST (NO LOGIN REQUIRED)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
