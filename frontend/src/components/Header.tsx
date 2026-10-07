import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

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
  currentUser?: { id: string; name: string; email: string } | null;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
  onResetSession?: () => void;
  hasSessionProgress?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  currentUser,
  onOpenAuth,
  onSignOut,
  onResetSession,
  hasSessionProgress = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Group active view states
  const isHomeActive = currentView === 'home';
  const isAssessmentActive = ['onboarding', 'discovery', 'aptitude', 'dna'].includes(currentView);
  const isDecisionActive = ['dashboard', 'twin', 'whatif', 'roadmap'].includes(currentView);
  const isFamilyActive = currentView === 'parent';

  const navPillars = [
    {
      id: 'home' as AppView,
      num: '01',
      label: 'OVERVIEW',
      isActive: isHomeActive
    },
    {
      id: (isAssessmentActive ? currentView : 'onboarding') as AppView,
      num: '02',
      label: 'ASSESSMENT',
      isActive: isAssessmentActive
    },
    {
      id: (isDecisionActive ? currentView : 'dashboard') as AppView,
      num: '03',
      label: 'DECISION ENGINE',
      isActive: isDecisionActive
    },
    {
      id: 'parent' as AppView,
      num: '04',
      label: 'FAMILY PORTAL',
      isActive: isFamilyActive
    }
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '60px',
        backgroundColor: 'rgba(246, 245, 241, 0.95)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(24, 24, 22, 0.12)',
        width: '100%'
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 40px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Brand: ALIGNX . in Big Shoulders Display with Pine period */}
        <div
          onClick={() => onSelectView('home')}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '2px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          title="Return to ALIGNX Overview"
        >
          <span
            style={{
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontSize: '24px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#181816'
            }}
          >
            ALIGNX
          </span>
          <span style={{ color: '#2D5A43', fontSize: '24px', fontWeight: 900 }}>.</span>
        </div>

        {/* Center: 4 Core Routes in Martian Mono */}
        <nav
          style={{ display: 'flex', alignItems: 'center', gap: '30px' }}
          className="hide-mobile"
          aria-label="Main navigation"
        >
          {navPillars.map((pillar) => (
            <button
              key={pillar.num}
              onClick={() => onSelectView(pillar.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 0',
                cursor: 'pointer',
                fontFamily: "'Martian Mono', monospace",
                fontSize: '10px',
                fontWeight: pillar.isActive ? 700 : 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: pillar.isActive ? '#2D5A43' : '#6E6A61',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                position: 'relative',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!pillar.isActive) e.currentTarget.style.color = '#181816';
              }}
              onMouseLeave={(e) => {
                if (!pillar.isActive) e.currentTarget.style.color = '#6E6A61';
              }}
            >
              <span style={{ opacity: pillar.isActive ? 1 : 0.6, fontSize: '9px' }}>{pillar.num} ·</span>
              <span>{pillar.label}</span>
              {pillar.isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: '#2D5A43'
                  }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Right Actions: [RESET] -> SIGN IN -> ■ START ASSESSMENT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Reset Session button (visible when progress exists) */}
          {hasSessionProgress && onResetSession && (
            <button
              onClick={onResetSession}
              style={{
                background: 'none',
                border: 'none',
                color: '#6E6A61',
                fontSize: '9.5px',
                fontFamily: "'Martian Mono', monospace",
                cursor: 'pointer',
                letterSpacing: '0.06em',
                padding: '4px 6px',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#B91C1C')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6A61')}
              title="Reset current session progress"
            >
              [RESET]
            </button>
          )}

          {/* SIGN IN or USER PROFILE */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '9.5px',
                  color: '#2D5A43',
                  fontWeight: 600,
                  letterSpacing: '0.04em'
                }}
              >
                {currentUser.name?.split(' ')[0]?.toUpperCase() || 'STUDENT'}
              </span>
              <button
                onClick={onSignOut}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6E6A61',
                  fontSize: '9.5px',
                  fontFamily: "'Martian Mono', monospace",
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#181816')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6A61')}
              >
                (SIGN OUT)
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                background: 'none',
                border: '1px solid rgba(24, 24, 22, 0.22)',
                borderRadius: '0px',
                color: '#181816',
                fontFamily: "'Martian Mono', monospace",
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                height: '34px',
                padding: '0 14px',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2D5A43';
                e.currentTarget.style.color = '#2D5A43';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(24, 24, 22, 0.22)';
                e.currentTarget.style.color = '#181816';
              }}
            >
              SIGN IN
            </button>
          )}

          {/* Primary CTA: ■ START ASSESSMENT */}
          <button
            onClick={() => onSelectView('onboarding')}
            style={{
              height: '34px',
              padding: '0 18px',
              backgroundColor: '#181816',
              color: '#F6F5F1',
              border: 'none',
              borderRadius: '0px',
              fontFamily: "'Martian Mono', monospace",
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2D5A43')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#181816')}
          >
            <span>■</span>
            <span>START ASSESSMENT</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
            className="show-mobile-flex"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} color="#181816" /> : <Menu size={20} color="#181816" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: 0,
            right: 0,
            backgroundColor: '#F6F5F1',
            borderBottom: '1px solid rgba(24, 24, 22, 0.16)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            zIndex: 99
          }}
        >
          {navPillars.map((pillar) => (
            <button
              key={pillar.num}
              onClick={() => {
                onSelectView(pillar.id);
                setMobileMenuOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontFamily: "'Martian Mono', monospace",
                fontSize: '11px',
                fontWeight: pillar.isActive ? 700 : 500,
                color: pillar.isActive ? '#2D5A43' : '#181816',
                padding: '8px 0',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(24, 24, 22, 0.08)'
              }}
            >
              {pillar.num} · {pillar.label}
            </button>
          ))}
          {currentUser ? (
            <button
              onClick={() => {
                onSignOut?.();
                setMobileMenuOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontFamily: "'Martian Mono', monospace",
                fontSize: '11px',
                color: '#6E6A61',
                padding: '8px 0',
                cursor: 'pointer'
              }}
            >
              SIGN OUT ({currentUser.name})
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenAuth?.();
                setMobileMenuOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontFamily: "'Martian Mono', monospace",
                fontSize: '11px',
                color: '#2D5A43',
                padding: '8px 0',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              SIGN IN
            </button>
          )}
        </div>
      )}
    </header>
  );
};
