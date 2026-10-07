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
