import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Lock, User } from 'lucide-react';

export type AppView =
  | 'home'
  | 'explore'
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
  hasAssessmentCompleted?: boolean;
  onAssessmentGateTrigger?: (target: AppView) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  currentUser,
  onOpenAuth,
  onSignOut,
  onResetSession,
  hasSessionProgress = false,
  hasAssessmentCompleted = false,
  onAssessmentGateTrigger
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileDropdownOpen]);

  // Group active view states
  const isHomeActive = currentView === 'home';
  const isExploreActive = currentView === 'explore';
  const isAssessmentActive = ['onboarding', 'discovery', 'aptitude', 'dna', 'parent'].includes(currentView);
  const isDecisionActive = ['dashboard', 'twin', 'whatif', 'roadmap'].includes(currentView);

  const navPillars = [
    {
      id: 'home' as AppView,
      num: '01',
      label: 'OVERVIEW',
      isActive: isHomeActive,
      isGated: false
    },
    {
      id: (isAssessmentActive ? currentView : 'onboarding') as AppView,
      num: '02',
      label: 'ASSESSMENT',
      isActive: isAssessmentActive,
      isGated: false
    },
    {
      id: (isDecisionActive ? currentView : 'dashboard') as AppView,
      num: '03',
      label: 'DECISION ENGINE',
      isActive: isDecisionActive,
      isGated: true
    },
    {
      id: 'explore' as AppView,
      num: '04',
      label: 'TALENT ATLAS',
      isActive: isExploreActive,
      isGated: false
    }
  ];

  const handleNavClick = (target: AppView, isGated: boolean) => {
    if (isGated && !hasAssessmentCompleted) {
      if (onAssessmentGateTrigger) {
        onAssessmentGateTrigger(target);
      }
      return;
    }
    onSelectView(target);
  };

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
              onClick={() => handleNavClick(pillar.id, pillar.isGated)}
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
              {pillar.isGated && !hasAssessmentCompleted && (
                <Lock size={10} style={{ opacity: 0.5, color: '#6E6A61' }} />
              )}
              {pillar.isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
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

          {/* Profile Avatar & Anchored Dropdown */}
          <div ref={profileDropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              aria-label="User Profile"
              title={currentUser ? currentUser.name : 'Account Profile'}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: profileDropdownOpen
                  ? 'rgba(45, 90, 67, 0.14)'
                  : currentUser
                  ? 'rgba(45, 90, 67, 0.08)'
                  : 'rgba(24, 24, 22, 0.04)',
                border: `1px solid ${
                  profileDropdownOpen
                    ? '#2D5A43'
                    : currentUser
                    ? 'rgba(45, 90, 67, 0.35)'
                    : 'rgba(24, 24, 22, 0.18)'
                }`,
                color: profileDropdownOpen ? '#2D5A43' : currentUser ? '#2D5A43' : '#6E6A61',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontFamily: "'Martian Mono', monospace",
                fontSize: '12px',
                fontWeight: 700,
                padding: 0,
                transition: 'all 0.18s ease',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2D5A43';
                e.currentTarget.style.color = '#2D5A43';
              }}
              onMouseLeave={(e) => {
                if (!profileDropdownOpen) {
                  e.currentTarget.style.borderColor = currentUser
                    ? 'rgba(45, 90, 67, 0.35)'
                    : 'rgba(24, 24, 22, 0.18)';
                  e.currentTarget.style.color = currentUser ? '#2D5A43' : '#6E6A61';
                }
              }}
            >
              {currentUser?.name ? (
                currentUser.name.trim().charAt(0).toUpperCase()
              ) : (
                <User size={15} />
              )}
            </button>

            {/* Profile Dropdown Card */}
            {profileDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '240px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(24, 24, 22, 0.14)',
                  borderRadius: '0px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.10)',
                  padding: '24px 20px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  zIndex: 1000,
                  animation: 'alignxProfileFade 0.18s ease-out'
                }}
              >
                {/* 1. Avatar */}
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    backgroundColor: currentUser ? 'rgba(45, 90, 67, 0.1)' : 'rgba(24, 24, 22, 0.06)',
                    border: '1px solid rgba(24, 24, 22, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '18px',
                    fontWeight: 700,
                    color: currentUser ? '#2D5A43' : '#6E6A61',
                    marginBottom: '12px'
                  }}
                >
                  {currentUser?.name ? (
                    currentUser.name.trim().charAt(0).toUpperCase()
                  ) : (
                    <User size={22} color="#6E6A61" />
                  )}
                </div>

                {/* 2. Name */}
                <div
                  style={{
                    fontFamily: "'Big Shoulders Display', sans-serif",
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#181816',
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    lineHeight: 1.2
                  }}
                >
                  {currentUser?.name || 'Guest User'}
                </div>

                {/* 3. Email (Only for logged in) */}
                {currentUser?.email && (
                  <div
                    style={{
                      fontFamily: "'Martian Mono', monospace",
                      fontSize: '10px',
                      color: '#6E6A61',
                      marginTop: '4px',
                      wordBreak: 'break-all',
                      lineHeight: 1.4
                    }}
                  >
                    {currentUser.email}
                  </div>
                )}

                {/* 4. Action Button (Sign Out OR Sign In) */}
                {currentUser ? (
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onSignOut?.();
                    }}
                    style={{
                      marginTop: '20px',
                      width: '100%',
                      height: '34px',
                      background: 'none',
                      border: '1px solid rgba(24, 24, 22, 0.22)',
                      borderRadius: '0px',
                      color: '#181816',
                      fontFamily: "'Martian Mono', monospace",
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#B91C1C';
                      e.currentTarget.style.color = '#B91C1C';
                      e.currentTarget.style.backgroundColor = 'rgba(185, 28, 28, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(24, 24, 22, 0.22)';
                      e.currentTarget.style.color = '#181816';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    SIGN OUT
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenAuth?.();
                    }}
                    style={{
                      marginTop: '20px',
                      width: '100%',
                      height: '34px',
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
                      transition: 'background-color 0.18s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2D5A43';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#181816';
                    }}
                  >
                    SIGN IN
                  </button>
                )}
              </div>
            )}
          </div>

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
                handleNavClick(pillar.id, pillar.isGated);
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
                borderBottom: '1px solid rgba(24, 24, 22, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{pillar.num} · {pillar.label}</span>
              {pillar.isGated && !hasAssessmentCompleted && (
                <span style={{ fontSize: '10px', color: '#6E6A61', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={11} />
                  <span>LOCKED</span>
                </span>
              )}
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

      <style>{`
        @keyframes alignxProfileFade {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};
