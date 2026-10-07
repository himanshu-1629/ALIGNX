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

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCareerId, setSelectedCareerId] = useState<string>('ai-engineer');
  const [, setStudentProfile] = useState<StudentProfile | null>(null);
  const [sessionProgress, setSessionProgress] = useState<AlignxSessionProgress>(getSessionProgress());

  // Refresh session progress whenever view changes
  useEffect(() => {
    setSessionProgress(getSessionProgress());
  }, [currentView]);

  const handleEnterApp = (view: AppView = 'onboarding') => {
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
                    if (isPast || isActive) {
                      setCurrentView(step.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: isPast || isActive ? 'pointer' : 'default',
                    opacity: isActive ? 1 : isPast ? 0.85 : 0.45,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '980px',
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
          <OnboardingModule onComplete={handleOnboardingComplete} />
        )}

        {currentView === 'discovery' && (
          <DiscoveryModule onComplete={handleDiscoveryComplete} />
        )}

        {currentView === 'aptitude' && (
          <AptitudeModule onComplete={handleAptitudeComplete} />
        )}

        {currentView === 'dna' && (
          <CareerDnaModule onContinue={handleDnaContinue} />
        )}

        {currentView === 'parent' && (
          <ParentModule onContinue={handleParentContinue} />
        )}

        {currentView === 'dashboard' && (
          <RecommendationsModule
            onSelectCareerTwin={handleSelectCareerTwin}
            onOpenWhatIf={handleOpenWhatIf}
          />
        )}

        {currentView === 'twin' && (
          <CareerTwinModule
            careerId={selectedCareerId}
            onOpenRoadmap={handleOpenRoadmap}
          />
        )}

        {currentView === 'whatif' && (
          <WhatIfModule onContinueToRoadmap={handleOpenRoadmap} />
        )}

        {currentView === 'roadmap' && (
          <RoadmapModule careerId={selectedCareerId} />
        )}
      </main>
    </div>
  );
}

export default App;
