import React, { useState } from 'react';
import { Menu, X, Compass, Activity } from 'lucide-react';

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

  const navItems: { id: AppView; num: string; label: string }[] = [
    { id: 'home', num: '00', label: 'CINEMATIC JOURNEY' },
    { id: 'onboarding', num: '01', label: 'ONBOARDING' },
    { id: 'discovery', num: '02', label: 'DISCOVERY' },
    { id: 'aptitude', num: '03', label: 'APTITUDE' },
    { id: 'dna', num: '04', label: 'CAREER DNA' },
    { id: 'parent', num: '05', label: 'FAMILY' },
    { id: 'dashboard', num: '06', label: 'DECISION ENGINE' },
    { id: 'twin', num: '07', label: 'CAREER TWIN' },
    { id: 'whatif', num: '08', label: 'WHAT-IF LAB' },
    { id: 'roadmap', num: '09', label: 'ROADMAP' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(7, 19, 29, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-hairline)',
        width: '100%',
        transition: 'all 0.3s ease'
      }}
    >
      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 24px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        {/* Brand / Logo */}
        <div
          onClick={() => onSelectView('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer'
          }}
        >
          {/* Architectural ALIGNX Geometric Mark */}
          <div
            style={{
              width: '28px',
              height: '28px',
              border: '1px solid var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '14px',
                height: '14px',
                border: '1px solid var(--text-primary)',
                transform: 'rotate(45deg)'
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '0.04em',
                  color: 'var(--text-primary)'
                }}
              >
                ALIGNX
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--accent)',
                  letterSpacing: '0.12em'
                }}
              >
                INTELLIGENCE
              </span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.08em'
              }}
            >
              DECISION INTELLIGENCE
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '4px',
            overflowX: 'auto',
            padding: '4px 0'
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                style={{
                  background: isActive ? 'rgba(216, 111, 69, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(216, 111, 69, 0.4)' : '1px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.65rem' }}>
                  {item.num}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* System telemetry & Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-hairline)',
              padding: '6px 12px'
            }}
            className="telemetry-badge"
          >
            <Activity size={12} color="var(--accent)" />
            <span>MODELS: DETERMINISTIC 5D</span>
          </div>

          <button
            onClick={() => onSelectView(currentView === 'home' ? 'dashboard' : 'home')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: currentView === 'home' ? 'var(--accent)' : 'transparent',
              border: currentView === 'home' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
              color: currentView === 'home' ? '#FFFFFF' : 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
          >
            <Compass size={13} />
            <span>{currentView === 'home' ? 'ENTER ENGINE →' : 'VIEW NARRATIVE'}</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'inline-flex',
              background: 'transparent',
              border: '1px solid var(--border-hairline)',
              color: 'var(--text-primary)',
              padding: '8px',
              cursor: 'pointer'
            }}
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectView(item.id);
                setMobileMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                textAlign: 'left',
                backgroundColor: currentView === item.id ? 'var(--accent-dim)' : 'transparent',
                border: currentView === item.id ? '1px solid var(--accent-border)' : '1px solid var(--border-hairline)',
                color: currentView === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              <span style={{ color: 'var(--accent)' }}>{item.num}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 1080px) {
          .desktop-nav {
            display: flex !important;
          }
          .telemetry-badge {
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
