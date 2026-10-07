import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import type { AppView } from './components/Header';
import { CinematicFrames } from './components/frames/CinematicFrames';
import { OnboardingModule } from './components/modules/OnboardingModule';
import { DiscoveryModule } from './components/modules/DiscoveryModule';
import { AptitudeModule } from './components/modules/AptitudeModule';
import { CareerDnaModule } from './components/modules/CareerDnaModule';
import { ParentModule } from './components/modules/ParentModule';
import { RecommendationsModule } from './components/modules/RecommendationsModule';
import { CareerTwinModule } from './components/modules/CareerTwinModule';
import { WhatIfModule } from './components/modules/WhatIfModule';
import { RoadmapModule } from './components/modules/RoadmapModule';
import type { StudentProfile, AlignxSessionProgress } from './types/alignx';
import { getSessionProgress, saveSessionProgress, clearSessionProgress } from './utils/sessionManager';
import { AuthModal } from './components/auth/AuthModal';
import { ApiService } from './services/api';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCareerId, setSelectedCareerId] = useState<string>('ai-engineer');
  const [, setStudentProfile] = useState<StudentProfile | null>(null);
  const [sessionProgress, setSessionProgress] = useState<AlignxSessionProgress>(getSessionProgress());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('alignx_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Initialize background student session with backend on startup
  useEffect(() => {
    ApiService.ensureSession().catch(err => {
      console.warn('[ALIGNX App] Background session init note:', err);
    });
  }, []);

  // Refresh session progress whenever view changes
  useEffect(() => {
    setSessionProgress(getSessionProgress());
  }, [currentView]);

  const handleAuthSuccess = (user: { id: string; name: string; email: string }) => {
    setCurrentUser(user);
    localStorage.setItem('alignx_current_user', JSON.stringify(user));
    setIsAuthModalOpen(false);
    if (currentView === 'home') {
      setCurrentView('onboarding');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSignOut = () => {
    ApiService.clearToken();
    localStorage.removeItem('alignx_current_user');
    setCurrentUser(null);
  };

  const handleEnterApp = (view: AppView = 'onboarding') => {
    // Auth Gate: Student must sign in before answering or starting the assessment
    if (['onboarding', 'discovery', 'aptitude', 'dna', 'parent'].includes(view) && !currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetSession = () => {
    const fresh = clearSessionProgress();
    setSessionProgress(fresh);
    setStudentProfile(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOnboardingComplete = (profile: StudentProfile) => {
    setStudentProfile(profile);
    const updated = saveSessionProgress({
      lastActiveView: 'discovery',
      studentProfile: profile,
      completedStages: {
        ...sessionProgress.completedStages,
        onboarding: true
      }
    });
    setSessionProgress(updated);
    setCurrentView('discovery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDiscoveryComplete = () => {
    const updated = saveSessionProgress({
      lastActiveView: 'aptitude',
      completedStages: {
        ...sessionProgress.completedStages,
        discovery: true
      }
    });
    setSessionProgress(updated);
    setCurrentView('aptitude');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAptitudeComplete = (score: number) => {
    const updated = saveSessionProgress({
      lastActiveView: 'dna',
      aptitudeScore: score,
      completedStages: {
        ...sessionProgress.completedStages,
        aptitude: true
      }
    });
    setSessionProgress(updated);
    setCurrentView('dna');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDnaContinue = () => {
    const updated = saveSessionProgress({
      lastActiveView: 'parent',
      completedStages: {
        ...sessionProgress.completedStages,
        dna: true
      }
    });
    setSessionProgress(updated);
    setCurrentView('parent');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleParentContinue = () => {
    const updated = saveSessionProgress({
      lastActiveView: 'dashboard',
      parentInputDone: true,
      completedStages: {
        ...sessionProgress.completedStages,
        parent: true
      }
    });
    setSessionProgress(updated);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCareerTwin = (careerId: string) => {
    setSelectedCareerId(careerId);
    setCurrentView('twin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWhatIf = () => {
    setCurrentView('whatif');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRoadmap = () => {
    setCurrentView('roadmap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAssessmentStage = ['onboarding', 'discovery', 'aptitude', 'dna'].includes(currentView);

  const assessmentSteps = [
    { id: 'onboarding' as AppView, num: '1', label: 'Goals & Budget' },
    { id: 'discovery' as AppView, num: '2', label: 'Holland Interests' },
    { id: 'aptitude' as AppView, num: '3', label: 'Cognitive Aptitude' },
    { id: 'dna' as AppView, num: '4', label: 'Career DNA' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-deep)', display: 'flex', flexDirection: 'column' }}>
      {/* Persistent Architectural Header */}
      <Header
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onResetSession={handleResetSession}
        hasSessionProgress={!!(sessionProgress?.completedStages?.onboarding || sessionProgress?.completedStages?.discovery || sessionProgress?.completedStages?.aptitude)}
      />

      {/* Sleek Progressive Assessment Stepper Header */}
      {isAssessmentStage && (
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
            {assessmentSteps.map((step, idx) => {
              const isActive = currentView === step.id;
              const stepIndex = assessmentSteps.findIndex((s) => s.id === currentView);
              const isPast = idx < stepIndex;

              return (
                <div
                  key={step.id}
                  onClick={() => {
                    if (!currentUser) {
                      setIsAuthModalOpen(true);
                      return;
                    }
                    setCurrentView(step.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    opacity: isActive ? 1 : 0.75,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '0px',
                      backgroundColor: isActive ? 'var(--accent)' : isPast ? 'var(--text-primary)' : 'var(--border-hairline)',
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
                  {idx < assessmentSteps.length - 1 && (
                    <span style={{ color: 'var(--border-subtle)', marginLeft: '12px' }}>—</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main View Container */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <CinematicFrames
            onEnterApp={handleEnterApp}
            sessionProgress={sessionProgress}
            onResetSession={handleResetSession}
          />
        )}

        {currentView === 'onboarding' && (
          <OnboardingModule
            onComplete={handleOnboardingComplete}
            currentUser={currentUser}
            onRequireAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentView === 'discovery' && (
          <DiscoveryModule
            onComplete={handleDiscoveryComplete}
            onSkipToAptitude={() => {
              setCurrentView('aptitude');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'aptitude' && (
          <AptitudeModule
            onComplete={handleAptitudeComplete}
            onSkipToDna={() => {
              setCurrentView('dna');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'dna' && (
          <CareerDnaModule
            onContinue={handleDnaContinue}
            onBack={() => {
              setCurrentView('aptitude');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSkipToDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'parent' && (
          <ParentModule
            currentUser={currentUser}
            onContinue={handleParentContinue}
            onBack={() => {
              setCurrentView('dna');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'dashboard' && (
          <RecommendationsModule
            onSelectCareerTwin={handleSelectCareerTwin}
            onOpenWhatIf={handleOpenWhatIf}
            onOpenRoadmap={handleOpenRoadmap}
            sessionProgress={sessionProgress}
            onStartAssessment={(stage) => handleEnterApp(stage || 'onboarding')}
            selectedCareerId={selectedCareerId}
            onSelectCareerId={setSelectedCareerId}
          />
        )}

        {currentView === 'twin' && (
          <CareerTwinModule
            careerId={selectedCareerId}
            onOpenRoadmap={handleOpenRoadmap}
            onBackToDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenWhatIf={handleOpenWhatIf}
            onSelectCareer={(cId) => {
              setSelectedCareerId(cId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'whatif' && (
          <WhatIfModule
            careerId={selectedCareerId}
            onContinueToRoadmap={handleOpenRoadmap}
            onBackToDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenTwin={() => {
              setCurrentView('twin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'roadmap' && (
          <RoadmapModule
            careerId={selectedCareerId}
            onBackToDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToTwin={() => {
              setCurrentView('twin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenWhatIf={handleOpenWhatIf}
          />
        )}
      </main>

      {/* Lightweight Authentication & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;
