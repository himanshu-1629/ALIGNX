import React from 'react';
import type { AppView } from './Header';

export interface SubNavStep {
  id: AppView;
  num: string;
  label: string;
}

interface SubNavStepperProps {
  steps: SubNavStep[];
  currentView: AppView;
  onSelectStep: (stepId: AppView) => void;
}

export const SubNavStepper: React.FC<SubNavStepperProps> = ({
  steps,
  currentView,
  onSelectStep
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-hairline)',
        padding: '10px 24px'
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          overflowX: 'auto'
        }}
      >
        {steps.map((step, idx) => {
          const isActive = currentView === step.id;
          const stepIndex = steps.findIndex((s) => s.id === currentView);
          const isPast = idx < stepIndex;

          return (
            <div
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                opacity: isActive ? 1 : 0.75,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.opacity = '0.75';
              }}
            >
              <span
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '0px',
                  backgroundColor: isActive
                    ? 'var(--accent)'
                    : isPast
                    ? 'var(--text-primary)'
                    : 'var(--border-hairline)',
                  color: isActive || isPast ? '#FFFFFF' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  fontWeight: 700
                }}
              >
                {isPast ? '✓' : step.num}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                {step.label}
              </span>
              {idx < steps.length - 1 && (
                <span style={{ color: 'var(--border-subtle)', marginLeft: '12px' }}>—</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
