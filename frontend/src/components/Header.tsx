import React, { useState } from 'react';
import { Menu, X, ArrowRight, Sparkles, SlidersHorizontal, Users2, Compass, Layers } from 'lucide-react';

export type AppView =
  | 'home'
  | 'onboarding'
  | 'discovery'
  | 'aptitude'
  | 'dna'
  | 'parent'
  | 'dashboard'
  | 'twin'
  | 'whatif'
  | 'roadmap';

interface HeaderProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onSelectView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Group views into 5 human-centered core pillars (eliminates 10-button cognitive overload)
  const isAssessmentActive = ['onboarding', 'discovery', 'aptitude', 'dna'].includes(currentView);
  const isDecisionActive = ['dashboard', 'twin', 'whatif'].includes(currentView);
  const isFamilyActive = currentView === 'parent';
  const isRoadmapActive = currentView === 'roadmap';
  const isHomeActive = currentView === 'home';

  const navPillars = [
    {
      id: 'home' as AppView,
      label: 'Overview',
      isActive: isHomeActive,
      icon: <Compass size={14} />,
      badge: null
    },
    {
      id: (isAssessmentActive ? currentView : 'onboarding') as AppView,
      label: 'Assessment',
      isActive: isAssessmentActive,
      icon: <Sparkles size={14} />,
      badge: isAssessmentActive ? 'Active' : null
    },
    {
      id: (isDecisionActive ? currentView : 'dashboard') as AppView,
      label: 'Decision Engine',
      isActive: isDecisionActive,
      icon: <SlidersHorizontal size={14} />,
      badge: '5D'
    },
    {
      id: 'parent' as AppView,
      label: 'Family Portal',
      isActive: isFamilyActive,
      icon: <Users2 size={14} />,
      badge: null
    },
    {
      id: 'roadmap' as AppView,
      label: 'Roadmap',
      isActive: isRoadmapActive,
      icon: <Layers size={14} />,
      badge: null
    }
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid var(--border-hairline)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
        width: '100%',
        transition: 'all 0.3s ease'
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 28px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}
      >
        {/* Brand Identity */}
        <div
          onClick={() => onSelectView('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          {/* Architectural ALIGNX Mark */}
          <div
            style={{
              width: '26px',
              height: '26px',
              border: '1.5px solid var(--accent)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--accent-dim)'
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                border: '1.5px solid var(--text-primary)',
                transform: 'rotate(45deg)'
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  letterSpacing: '0.02em',
                  color: 'var(--text-primary)'
                }}
              >
                ALIGNX
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  letterSpacing: '0.08em',
                  padding: '1px 5px',
                  backgroundColor: 'var(--accent-dim)',
                  borderRadius: '4px'
                }}
              >
                AI 5D
              </span>
            </div>
          </div>
        </div>

        {/* Streamlined Desktop Navigation (5 Pillars only) */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '6px',
            padding: '4px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '980px',
            border: '1px solid var(--border-hairline)'
          }}
          className="desktop-nav"
        >
          {navPillars.map((item) => (
            <button
              key={item.label}
              onClick={() => onSelectView(item.id)}
              style={{
                background: item.isActive ? '#FFFFFF' : 'transparent',
                border: item.isActive ? '1px solid var(--border-hairline)' : '1px solid transparent',
                color: item.isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: item.isActive ? 600 : 500,
                padding: '7px 16px',
                borderRadius: '980px',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                boxShadow: item.isActive ? '0 2px 6px rgba(0, 0, 0, 0.05)' : 'none',
                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ color: item.isActive ? 'var(--accent)' : 'var(--text-muted)', display: 'flex' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    backgroundColor: item.isActive ? 'var(--accent-dim)' : 'rgba(0,0,0,0.04)',
                    color: item.isActive ? 'var(--accent)' : 'var(--text-muted)',
                    fontWeight: 600
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Action Button & Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => onSelectView(isHomeActive ? 'onboarding' : 'dashboard')}
            className="btn-alignx-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{isHomeActive ? 'START ASSESSMENT' : 'VIEW ENGINE'}</span>
            <ArrowRight size={13} />
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid var(--border-hairline)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              padding: '7px',
              cursor: 'pointer'
            }}
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (5 clean pillars) */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {navPillars.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onSelectView(item.id);
                setMobileMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: item.isActive ? '#FFFFFF' : 'transparent',
                border: item.isActive ? '1px solid var(--border-hairline)' : '1px solid transparent',
                color: item.isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: item.isActive ? 600 : 500,
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: item.isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--accent)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--accent-dim)'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 960px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
