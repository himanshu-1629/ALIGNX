import React from 'react';
import { Compass, Sparkles, SlidersHorizontal, Layers } from 'lucide-react';

interface StudioNavTabsProps {
  currentTab: 'dashboard' | 'twin' | 'whatif' | 'roadmap';
  onSelectTab: (tab: 'dashboard' | 'twin' | 'whatif' | 'roadmap') => void;
  selectedCareerTitle?: string;
  className?: string;
}

export const StudioNavTabs: React.FC<StudioNavTabsProps> = ({
  currentTab,
  onSelectTab,
  selectedCareerTitle,
  className = ''
}) => {
  const tabs = [
    {
      id: 'dashboard' as const,
      label: '5D Recommendations',
      icon: <Compass size={14} />
    },
    {
      id: 'twin' as const,
      label: 'Career Twin Radar',
      icon: <Sparkles size={14} />
    },
    {
      id: 'whatif' as const,
      label: 'What-If Lab',
      icon: <SlidersHorizontal size={14} />
    },
    {
      id: 'roadmap' as const,
      label: 'Roadmap Blueprint',
      icon: <Layers size={14} />
    }
  ];

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
        borderRadius: '16px',
        border: '1px solid var(--border-hairline)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
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
            borderRadius: '6px',
            backgroundColor: 'rgba(197, 155, 109, 0.1)'
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

      {/* Synchronized Tab Switcher Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px',
          backgroundColor: '#F5F5F7',
          borderRadius: '980px',
          border: '1px solid var(--border-hairline)'
        }}
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '980px',
                backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                border: isActive ? '1px solid var(--border-hairline)' : '1px solid transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.06)' : 'none'
              }}
            >
              <span style={{ color: isActive ? 'var(--accent)' : 'inherit', display: 'flex', alignItems: 'center' }}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
