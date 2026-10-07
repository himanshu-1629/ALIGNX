import React from 'react';
import type { AppView } from './Header';
import type { AlignxSessionProgress } from '../types/alignx';
import { RollButton } from './RollButton';
import { ArrowRight, RotateCw, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface SessionResumeHudProps {
  progress: AlignxSessionProgress;
  onResume: (view: AppView) => void;
  onReset: () => void;
}

export const SessionResumeHud: React.FC<SessionResumeHudProps> = ({
  progress,
  onResume,
  onReset
}) => {
  // Determine current active stage name & target view
  const getNextStageInfo = (): { view: AppView; label: string; description: string } => {
    if (!progress.completedStages.onboarding) {
      return {
        view: 'onboarding',
        label: 'Student Foundation',
        description: 'Input academic stage, current stream, and initial interests.'
      };
    }
    if (!progress.completedStages.discovery) {
      return {
        view: 'discovery',
        label: 'Career Discovery Scenarios',
        description: 'Solve real-world workplace scenarios to identify cognitive archetype.'
      };
    }
    if (!progress.completedStages.aptitude) {
      return {
        view: 'aptitude',
        label: 'Cognitive Aptitude Matrix',
        description: '5 LLM-calibrated dimensions (Logic, Systems, Quantitative, Spatial, Risk).'
      };
    }
    if (!progress.parentInputDone) {
      return {
        view: 'parent',
        label: 'Parent & Family Alignment',
        description: 'Input family financial boundaries, relocation radius, and stability weights.'
      };
    }
    return {
      view: 'dashboard',
      label: '5D Decision Engine Dashboard',
      description: 'Unified multidimensional evaluation synthesising student + family + market data.'
    };
  };

  const nextStage = getNextStageInfo();

  // Calculate completion percentage
  const steps = [
    progress.completedStages.onboarding,
    progress.completedStages.discovery,
    progress.completedStages.aptitude,
    progress.parentInputDone,
    progress.completedStages.dashboard
  ];
  const completedCount = steps.filter(Boolean).length;
  const percent = Math.round((completedCount / steps.length) * 100);

  // If literally no stage is completed, don't show the resume HUD
  if (completedCount === 0 && !progress.studentProfile) {
    return null;
  }

  return (
    <section
      id="active-session-hud"
      style={{
        margin: '0 auto 48px auto',
        maxWidth: '1240px',
        padding: '0 24px',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div
        className="titanium-card"
        style={{
          border: '1px solid var(--accent-border)',
          backgroundColor: '#FFFFFF',
          padding: '28px 32px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            borderBottom: '1px solid var(--border-hairline)',
            paddingBottom: '20px',
            marginBottom: '22px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Rotating Titanium Badge */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--accent-dim)'
              }}
            >
              <RotateCw size={16} color="var(--accent)" className="animate-spin-slow" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase' }}>
                  ACTIVE SESSION DETECTED
                </span>
                <span style={{ height: '4px', width: '4px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  SAVED TO MEMORY
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                {progress.studentProfile?.name ? `${progress.studentProfile.name.toUpperCase()}’S CAREER VECTOR` : 'ACTIVE STUDENT ASSESSMENT'}
              </h3>
            </div>
          </div>

          {/* Progress Percent Badge & Reset Key */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '980px',
                backgroundColor: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)'
              }}
            >
              <Sparkles size={14} color="var(--accent)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>
                {percent}% COMPLETE
              </span>
            </div>

            <button
              onClick={onReset}
              className="alignx-key"
              style={{ padding: '6px 12px', fontSize: '0.7rem' }}
              title="Reset current session progress and start fresh"
            >
              START FRESH
            </button>
          </div>
        </div>

        {/* 5-Step Pipeline Chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}
        >
          {/* Step 1: Onboarding */}
          <div
            onClick={() => onResume('onboarding')}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: progress.completedStages.onboarding ? 'rgba(0, 0, 0, 0.03)' : 'var(--bg-surface)',
              border: progress.completedStages.onboarding ? '1px solid var(--border-bright)' : '1px solid var(--border-hairline)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>01 / PROFILE</span>
              {progress.completedStages.onboarding ? <CheckCircle2 size={13} color="var(--accent)" /> : <Clock size={13} color="var(--text-muted)" />}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, color: progress.completedStages.onboarding ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {progress.studentProfile?.currentField || 'Student Baseline'}
            </div>
          </div>

          {/* Step 2: Discovery */}
          <div
            onClick={() => onResume('discovery')}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: progress.completedStages.discovery ? 'rgba(0, 0, 0, 0.03)' : 'var(--bg-surface)',
              border: progress.completedStages.discovery ? '1px solid var(--border-bright)' : '1px solid var(--border-hairline)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>02 / DISCOVERY</span>
              {progress.completedStages.discovery ? <CheckCircle2 size={13} color="var(--accent)" /> : <Clock size={13} color="var(--text-muted)" />}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, color: progress.completedStages.discovery ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {progress.completedStages.discovery ? 'Scenarios Completed' : 'Cognitive RIASEC'}
            </div>
          </div>

          {/* Step 3: Aptitude */}
          <div
            onClick={() => onResume('aptitude')}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: progress.completedStages.aptitude ? 'rgba(0, 0, 0, 0.03)' : 'var(--bg-surface)',
              border: progress.completedStages.aptitude ? '1px solid var(--border-bright)' : '1px solid var(--border-hairline)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>03 / APTITUDE</span>
              {progress.completedStages.aptitude ? <CheckCircle2 size={13} color="var(--accent)" /> : <Clock size={13} color="var(--text-muted)" />}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, color: progress.completedStages.aptitude ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {progress.aptitudeScore ? `${progress.aptitudeScore}% Cognitive Match` : '5D LLM Aptitude'}
            </div>
          </div>

          {/* Step 4: Parent Input */}
          <div
            onClick={() => onResume('parent')}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: progress.parentInputDone ? 'var(--accent-dim)' : 'var(--bg-surface)',
              border: progress.parentInputDone ? '1px solid var(--accent-border)' : '1px solid var(--border-hairline)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>04 / PARENT INPUT</span>
              {progress.parentInputDone ? <CheckCircle2 size={13} color="var(--accent)" /> : <Clock size={13} color="var(--text-muted)" />}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, color: progress.parentInputDone ? 'var(--accent)' : 'var(--text-secondary)' }}>
              {progress.parentInputDone ? (progress.parentData?.maxBudgetAnnualLakhs ? `₹${progress.parentData.maxBudgetAnnualLakhs}L/yr Cap • Aligned` : 'Parent Aligned') : 'Pending Input'}
            </div>
          </div>

          {/* Step 5: 5D Decision Dashboard */}
          <div
            onClick={() => onResume('dashboard')}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: progress.completedStages.dashboard ? 'rgba(0, 0, 0, 0.03)' : 'var(--bg-surface)',
              border: progress.completedStages.dashboard ? '1px solid var(--border-bright)' : '1px solid var(--border-hairline)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>05 / 5D ENGINE</span>
              {progress.completedStages.dashboard ? <CheckCircle2 size={13} color="var(--accent)" /> : <Clock size={13} color="var(--text-muted)" />}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, color: progress.completedStages.dashboard ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {progress.completedStages.dashboard ? 'Results Synthesized' : 'Multi-Dim Results'}
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            backgroundColor: 'var(--bg-surface)',
            padding: '16px 20px',
            borderRadius: '10px',
            border: '1px solid var(--border-hairline)'
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              CURRENT PAUSE POINT
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              <strong>{nextStage.label}</strong> — {nextStage.description}
            </div>
            {progress.parentInputDone && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#10B981', marginTop: '4px' }}>
                ✓ Parent inputs have been saved and integrated with the student’s profile.
              </div>
            )}
          </div>

          <RollButton
            onClick={() => onResume(nextStage.view)}
            variant="primary"
            icon={<ArrowRight size={15} />}
          >
            RESUME FROM {nextStage.label.toUpperCase()}
          </RollButton>
        </div>
      </div>
    </section>
  );
};
