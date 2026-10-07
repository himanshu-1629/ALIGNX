import React from 'react';

interface StudioNavTabsProps {
  currentTab?: 'dashboard' | 'twin' | 'whatif' | 'roadmap';
  onSelectTab?: (tab: 'dashboard' | 'twin' | 'whatif' | 'roadmap') => void;
  selectedCareerTitle?: string;
  className?: string;
}

export const StudioNavTabs: React.FC<StudioNavTabsProps> = ({
  selectedCareerTitle,
  className = ''
}) => {
  return (
    <div
      className={`studio-nav-container ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        padding: '10px 16px',
        backgroundColor: '#FFFFFF',
        borderRadius: '0px',
        border: '1px solid var(--border-hairline)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
        marginBottom: '28px'
      }}
    >
      {/* Studio Brand + Active Career Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            letterSpacing: '0.14em',
            color: 'var(--accent)',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '0px',
            backgroundColor: 'rgba(45, 90, 67, 0.09)'
          }}
        >
          DECISION STUDIO
        </span>

        {selectedCareerTitle && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              CAREER:
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}
            >
              {selectedCareerTitle}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
