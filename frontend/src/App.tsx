import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import type { AppView } from './components/Header';
import { SubNavStepper } from './components/SubNavStepper';
import type { SubNavStep } from './components/SubNavStepper';
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
import { TalentAtlasModule } from './components/modules/TalentAtlasModule';
import { AssessmentGateModal } from './components/AssessmentGateModal';
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
  const [isAssessmentGateOpen, setIsAssessmentGateOpen] = useState(false);
  const [gateTargetView, setGateTargetView] = useState<AppView>('dashboard');

  // A student has completed assessment if they have finished onboarding and at least one core test stage
  const hasAssessmentCompleted = Boolean(
    sessionProgress?.completedStages?.dashboard ||
    sessionProgress?.completedStages?.dna ||
    (sessionProgress?.completedStages?.onboarding &&
     (sessionProgress?.completedStages?.discovery || sessionProgress?.completedStages?.aptitude))
  );

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

  // Strict Guard: User cannot use Decision Engine routes without completed assessment
  useEffect(() => {
    if (['dashboard', 'twin', 'whatif', 'roadmap'].includes(currentView) && !hasAssessmentCompleted) {
      setGateTargetView(currentView);
      setCurrentView('onboarding');
      setIsAssessmentGateOpen(true);
    }
  }, [currentView, hasAssessmentCompleted]);

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
    // Public routes that require no auth or assessment
    if (view === 'home' || view === 'explore') {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Assessment Gating: Decision Engine and Roadmap require prior assessment completion
    if (['dashboard', 'twin', 'whatif', 'roadmap'].includes(view) && !hasAssessmentCompleted) {
      setGateTargetView(view);
      setIsAssessmentGateOpen(true);
      return;
    }

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

  const handleOpenRoadmap = (careerId?: string) => {
    if (careerId) setSelectedCareerId(careerId);
    setCurrentView('roadmap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAssessmentStage = ['onboarding', 'discovery', 'aptitude', 'dna', 'parent'].includes(currentView);
  const isDecisionStage = ['dashboard', 'twin', 'whatif', 'roadmap'].includes(currentView);

  const assessmentSteps: SubNavStep[] = [
    { id: 'onboarding', num: '1', label: 'Goals & Budget' },
    { id: 'discovery', num: '2', label: 'Holland Interests' },
    { id: 'aptitude', num: '3', label: 'Cognitive Aptitude' },
    { id: 'dna', num: '4', label: 'Career DNA' },
    { id: 'parent', num: '5', label: 'Family Portal' },
  ];

  const decisionSteps: SubNavStep[] = [
    { id: 'dashboard', num: '1', label: '5D Recommendations' },
    { id: 'twin', num: '2', label: 'Career Twin Radar' },
    { id: 'whatif', num: '3', label: 'What-if Lab' },
    { id: 'roadmap', num: '4', label: 'Roadmap Blueprint' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-deep)', display: 'flex', flexDirection: 'column' }}>
      {/* Persistent Architectural Header */}
      <Header
        currentView={currentView}
        onSelectView={handleEnterApp}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onResetSession={handleResetSession}
        hasSessionProgress={!!(sessionProgress?.completedStages?.onboarding || sessionProgress?.completedStages?.discovery || sessionProgress?.completedStages?.aptitude)}
        hasAssessmentCompleted={hasAssessmentCompleted}
        onAssessmentGateTrigger={(target) => {
          setGateTargetView(target);
          setIsAssessmentGateOpen(true);
        }}
      />

      {/* Sleek Progressive Assessment Stepper Header */}
      {isAssessmentStage && (
        <SubNavStepper
          steps={assessmentSteps}
          currentView={currentView}
          completedStages={sessionProgress?.completedStages}
          onSelectStep={(stepId) => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
              return;
            }
            setCurrentView(stepId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Sleek Progressive Decision Engine Stepper Header */}
      {isDecisionStage && (
        <SubNavStepper
          steps={decisionSteps}
          currentView={currentView}
          onSelectStep={(stepId) => {
            if (!hasAssessmentCompleted) {
              setGateTargetView(stepId);
              setIsAssessmentGateOpen(true);
              return;
            }
            setCurrentView(stepId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
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

        {currentView === 'explore' && (
          <TalentAtlasModule
            onStartAssessment={handleEnterApp}
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

      {/* Prerequisite Assessment Gate Modal */}
      <AssessmentGateModal
        isOpen={isAssessmentGateOpen}
        onClose={() => setIsAssessmentGateOpen(false)}
        targetView={gateTargetView}
        sessionProgress={sessionProgress}
        onStartAssessment={handleEnterApp}
        onExploreAtlas={() => {
          setCurrentView('explore');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;
