import type { AlignxSessionProgress } from '../types/alignx';

const STORAGE_KEY = 'alignx_active_session_state';

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
    const raw = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_SESSION_PROGRESS;
  }
}

export function clearSessionProgress(): AlignxSessionProgress {
  try {
    localStorage.removeItem(STORAGE_KEY);
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
