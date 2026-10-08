import type { AlignxSessionProgress, StudentProfile, AssessmentDraftState } from '../types/alignx';

export function getStorageKey(): string {
  try {
    const raw = localStorage.getItem('alignx_current_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      const uid = parsed.id || parsed._id || parsed.email;
      if (uid) return `alignx_active_session_state_${uid}`;
    }
  } catch {
    // fallback
  }
  return 'alignx_active_session_state_guest';
}

export const DEFAULT_SESSION_PROGRESS: AlignxSessionProgress = {
  lastActiveView: 'onboarding',
  completedStages: {
    onboarding: false,
    discovery: false,
    aptitude: false,
    dna: false,
    parent: false,
    dashboard: false
  },
  parentInputDone: false,
  updatedAt: new Date().toISOString()
};

export function getSessionProgress(): AlignxSessionProgress {
  try {
    const key = getStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) return DEFAULT_SESSION_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SESSION_PROGRESS,
      ...parsed,
      completedStages: {
        ...DEFAULT_SESSION_PROGRESS.completedStages,
        ...(parsed.completedStages || {})
      }
    };
  } catch {
    return DEFAULT_SESSION_PROGRESS;
  }
}

export function saveSessionProgress(updates: Partial<AlignxSessionProgress>): AlignxSessionProgress {
  try {
    const key = getStorageKey();
    const current = getSessionProgress();
    const updated: AlignxSessionProgress = {
      ...current,
      ...updates,
      completedStages: {
        ...current.completedStages,
        ...(updates.completedStages || {})
      },
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_SESSION_PROGRESS;
  }
}

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: '',
  stage: 'ug',
  currentField: 'Computer Science & Engineering',
  location: 'Domestic Tech Hub',
  preferredLocations: ['Bangalore', 'Hyderabad', 'Pune'],
  budgetAnnualLakhs: 15,
  riskTolerance: 'moderate',
  interests: [
    'Artificial Intelligence',
    'Hardware & Silicon Systems',
    'Quantitative Algorithms'
  ],
  aspirations: [
    'Architect frontier technology systems',
    'Attain early financial leverage'
  ]
};

export const DEFAULT_ASSESSMENT_DRAFT: AssessmentDraftState = {
  profile: DEFAULT_STUDENT_PROFILE,
  discovery: {
    currentIdx: 0,
    selectedChoices: {},
    isFinished: false
  },
  aptitude: {
    currentIdx: 0,
    selectedAnswers: {},
    score: null,
    metrics: null,
    showResults: false
  },
  dna: {}
};

export function getDraftStorageKey(): string {
  try {
    const raw = localStorage.getItem('alignx_current_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      const uid = parsed.id || parsed._id || parsed.email;
      if (uid) return `alignx_assessment_draft_${uid}`;
    }
  } catch {
    // fallback
  }
  return 'alignx_assessment_draft_session';
}

export function getAssessmentDraft(): AssessmentDraftState {
  try {
    const key = getDraftStorageKey();
    const rawSession = sessionStorage.getItem(key);
    if (rawSession) {
      const parsed = JSON.parse(rawSession);
      return {
        ...DEFAULT_ASSESSMENT_DRAFT,
        ...parsed,
        profile: {
          ...DEFAULT_ASSESSMENT_DRAFT.profile,
          ...(parsed.profile || {})
        },
        discovery: {
          ...DEFAULT_ASSESSMENT_DRAFT.discovery,
          ...(parsed.discovery || {})
        },
        aptitude: {
          ...DEFAULT_ASSESSMENT_DRAFT.aptitude,
          ...(parsed.aptitude || {})
        },
        dna: {
          ...DEFAULT_ASSESSMENT_DRAFT.dna,
          ...(parsed.dna || {})
        }
      };
    }

    // Fallback: check sessionProgress if draft not yet in sessionStorage
    const progress = getSessionProgress();
    if (progress.studentProfile) {
      return {
        ...DEFAULT_ASSESSMENT_DRAFT,
        profile: {
          ...DEFAULT_ASSESSMENT_DRAFT.profile,
          ...progress.studentProfile
        },
        aptitude: {
          ...DEFAULT_ASSESSMENT_DRAFT.aptitude,
          score: progress.aptitudeScore || null,
          metrics: progress.aptitudeMetrics || null
        }
      };
    }

    return DEFAULT_ASSESSMENT_DRAFT;
  } catch {
    return DEFAULT_ASSESSMENT_DRAFT;
  }
}

export function saveAssessmentDraft(updates: Partial<AssessmentDraftState>): AssessmentDraftState {
  try {
    const key = getDraftStorageKey();
    const current = getAssessmentDraft();
    const updated: AssessmentDraftState = {
      ...current,
      ...updates,
      profile: {
        ...current.profile,
        ...(updates.profile || {})
      },
      discovery: {
        ...current.discovery,
        ...(updates.discovery || {})
      },
      aptitude: {
        ...current.aptitude,
        ...(updates.aptitude || {})
      },
      dna: {
        ...current.dna,
        ...(updates.dna || {})
      }
    };

    sessionStorage.setItem(key, JSON.stringify(updated));

    // Also synchronize profile to sessionProgress if updated
    if (updates.profile) {
      saveSessionProgress({
        studentProfile: updated.profile
      });
    }

    return updated;
  } catch (err) {
    console.warn('[SessionManager] saveAssessmentDraft error:', err);
    return DEFAULT_ASSESSMENT_DRAFT;
  }
}

export function clearAssessmentDraft(): AssessmentDraftState {
  try {
    const key = getDraftStorageKey();
    sessionStorage.removeItem(key);
    sessionStorage.removeItem('alignx_assessment_draft_session');
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith('alignx_assessment_draft_')) {
        sessionStorage.removeItem(k);
      }
    }
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_ASSESSMENT_DRAFT;
}

export function clearSessionProgress(): AlignxSessionProgress {
  try {
    clearAssessmentDraft();
    const key = getStorageKey();
    localStorage.removeItem(key);
    localStorage.removeItem('alignx_active_session_state');
    localStorage.removeItem('alignx_active_session_state_guest');
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_SESSION_PROGRESS;
}

export function calculateCompletionPercentage(progress: AlignxSessionProgress): number {
  const stages = [
    progress.completedStages.onboarding,
    progress.completedStages.discovery,
    progress.completedStages.aptitude,
    progress.completedStages.parent,
    progress.completedStages.dashboard
  ];
  const completedCount = stages.filter(Boolean).length;
  return Math.round((completedCount / stages.length) * 100);
}
