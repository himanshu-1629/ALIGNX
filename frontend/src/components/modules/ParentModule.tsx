import React, { useState, useEffect, useCallback } from 'react';
import type { ParentInput } from '../../types/alignx';
import { RollButton } from '../RollButton';
import { saveSessionProgress, getSessionProgress } from '../../utils/sessionManager';
import { ApiService } from '../../services/api';
import {
  ArrowRight,
  Copy,
  Check,
  Users,
  ShieldCheck,
  Plus,
  CheckCircle2,
  ChevronLeft,
  Lock,
  Clock,
  Sliders,
  Trash2,
  RefreshCw,
  ExternalLink,
  Zap
} from 'lucide-react';

interface ParentModuleProps {
  onContinue: () => void;
  onBack?: () => void;
  currentUser?: { id?: string; name?: string; email?: string } | null;
}

function computeDynamicConflict(
  studentBudget: number,
  parentBudget: number,
  studentRisk: string = 'moderate',
  parentRisk: string = 'low'
): { index: number; reasons: string[] } {
  const diff = Math.abs(studentBudget - parentBudget);
  let conflict = Math.min(85, Math.max(5, Math.round((diff / Math.max(1, studentBudget)) * 40)));
  const reasons: string[] = [];

  if (parentBudget < studentBudget) {
    conflict += 15;
    reasons.push(
      `Household tuition ceiling of ₹${parentBudget}L/yr requires reliance on scholarships or loans for student target (₹${studentBudget}L/yr).`
    );
  } else if (parentBudget >= studentBudget + 4) {
    conflict = Math.max(5, conflict - 12);
    reasons.push(
      `Strong household financial runway (₹${parentBudget}L/yr) provides comfortable backing for student target (₹${studentBudget}L/yr).`
    );
  } else {
    reasons.push(
      `Strong structural harmony: parental capacity (₹${parentBudget}L/yr) closely aligns with student target (₹${studentBudget}L/yr).`
    );
  }

  if (parentRisk === 'low' && studentRisk === 'high') {
    conflict += 12;
    reasons.push(
      'Parental perspective prioritizes placement certainty and corporate pathways over entrepreneurial ventures.'
    );
  }

  return { index: Math.min(95, Math.max(5, conflict)), reasons };
}

export const ParentModule: React.FC<ParentModuleProps> = ({ onContinue, onBack, currentUser }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeParentToFill, setActiveParentToFill] = useState<ParentInput | null>(null);
  const [parents, setParents] = useState<ParentInput[]>(() => {
    const session = getSessionProgress();
    if (session.parentList && session.parentList.length > 0) {
      return session.parentList;
    }
    if (session.parentData?.name) {
      return [
        {
          id: 'p_initial',
          parentId: 'p_initial',
          name: session.parentData.name,
          relation: session.parentData.relation || 'Father',
          maxBudgetAnnualLakhs: session.parentData.maxBudgetAnnualLakhs || session.studentProfile?.budgetAnnualLakhs || 15,
          preferredLocations: session.parentData.preferredLocations || [session.studentProfile?.location || 'Domestic Hubs'],
          riskAppetite: session.parentData.riskAppetite || 'moderate',
          priorityFocus: (session.parentData.priorityFocus as any) || 'Stability',
          conflictPoints: ['Budget ceiling defined at ₹' + (session.parentData.maxBudgetAnnualLakhs || session.studentProfile?.budgetAnnualLakhs || 15) + 'L/yr'],
          status: session.parentInputDone ? 'COMPLETED' : 'PENDING'
        }
      ];
    }
    return [];
  });

  const [conflictIndex, setConflictIndex] = useState<number>(() => {
    const session = getSessionProgress();
    const sB = session.studentProfile?.budgetAnnualLakhs || 15;
    const pB = session.parentData?.maxBudgetAnnualLakhs || sB;
    return computeDynamicConflict(sB, pB).index;
  });

  const [conflictReasons, setConflictReasons] = useState<string[]>(() => {
    const session = getSessionProgress();
    const sB = session.studentProfile?.budgetAnnualLakhs || 15;
    const pB = session.parentData?.maxBudgetAnnualLakhs || sB;
    return computeDynamicConflict(sB, pB).reasons;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form states for adding parent
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState<'Father' | 'Mother' | 'Guardian'>('Father');
  const [newEmail, setNewEmail] = useState('');
  const [newBudget, setNewBudget] = useState(() => getSessionProgress().studentProfile?.budgetAnnualLakhs || 15);

  // Form states for Parent Response simulation modal
  const [fillBudget, setFillBudget] = useState(() => getSessionProgress().studentProfile?.budgetAnnualLakhs || 15);
  const [fillPriority, setFillPriority] = useState<'Stability' | 'High Growth' | 'Immediate ROI' | 'Work-Life Balance'>('Stability');
  const [fillRisk, setFillRisk] = useState<'low' | 'moderate' | 'high'>('low');
  const [fillLocation, setFillLocation] = useState(() => getSessionProgress().studentProfile?.location || 'Domestic Tech Hubs');
  const [fillConcerns, setFillConcerns] = useState('Prefers domestic Tier-1 institute over high educational debt; requires placement certainty');

  // Display name for the student
  const studentDisplayName =
    currentUser?.name ||
    getSessionProgress().studentProfile?.name ||
    'Student';

  // 1. Fetch authentic parents for this specific child from the database
  const loadStudentParents = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await ApiService.getParentStatus();
      if (res?.data) {
        if (res.data.alignmentAnalysis?.conflictIndex !== undefined) {
          setConflictIndex(res.data.alignmentAnalysis.conflictIndex);
        }
        if (res.data.alignmentAnalysis?.conflictReasons) {
          setConflictReasons(res.data.alignmentAnalysis.conflictReasons);
        }

        if (res.data.parents && res.data.parents.length > 0) {
          const mapped: ParentInput[] = res.data.parents.map((p) => {
            const rawB = p.financialProfile?.educationBudget;
            const annualLakhs = rawB
              ? (rawB >= 100000 ? Math.round(rawB / 100000) : Math.round(rawB))
              : 16;
            const mappedRisk =
              p.financialProfile?.riskAppetite === 'high'
                ? 'high'
                : p.financialProfile?.riskAppetite === 'low'
                ? 'low'
                : 'moderate';

            return {
              id: p.parentId,
              parentId: p.parentId,
              name: p.name,
              relation: p.relationship,
              email: p.email,
              phone: p.phone,
              maxBudgetAnnualLakhs: annualLakhs,
              preferredLocations: p.financialProfile?.locationPreference
                ? [p.financialProfile.locationPreference]
                : ['Domestic Tier-1 Tech Hubs'],
              riskAppetite: mappedRisk,
              priorityFocus: (p.expectations?.priorityFactors?.[0] as any) || 'Stability',
              conflictPoints: res.data.alignmentAnalysis?.conflictReasons || [],
              status: p.status === 'completed' ? 'COMPLETED' : 'PENDING',
              invitationToken: p.invitationToken,
              invitationUrl: p.invitationUrl
            };
          });

          // Merge backend records with any local records that might still be syncing
          setParents((prev) => {
            const backendIds = new Set(mapped.map((p) => p.parentId || p.id));
            const backendNames = new Set(mapped.map((p) => p.name.trim().toLowerCase()));

            const unSyncedLocal = prev.filter(
              (p) => !backendIds.has(p.parentId || p.id) && !backendNames.has(p.name.trim().toLowerCase())
            );

            const merged = [...mapped, ...unSyncedLocal];

            // Sync with local session progress
            const completed = merged.find((m) => m.status === 'COMPLETED');
            if (completed) {
              saveSessionProgress({
                parentData: {
                  name: completed.name,
                  relation: completed.relation,
                  maxBudgetAnnualLakhs: completed.maxBudgetAnnualLakhs,
                  preferredLocations: completed.preferredLocations,
                  priorityFocus: completed.priorityFocus,
                  riskAppetite: completed.riskAppetite,
                  maxRelocationKm: 500
                },
                parentInputDone: true,
                parentList: merged
              });
            } else {
              saveSessionProgress({ parentList: merged });
            }

            return merged;
          });
          return;
        } else {
          // If backend returns empty array, check if we have local parents before clearing
          setParents((prev) => {
            if (prev.length > 0) return prev;
            const session = getSessionProgress();
            if (session.parentList && session.parentList.length > 0) return session.parentList;
            return [];
          });
          return;
        }
      }
    } catch (err) {
      console.warn('[ALIGNX Parent] Live parent fetch note:', err);
    } finally {
      if (!silent) setIsRefreshing(false);
    }

    // Fallback only if network error / offline mock
    setParents((prev) => {
      if (prev.length > 0) return prev;
      const session = getSessionProgress();
      if (session.parentList && session.parentList.length > 0) {
        return session.parentList;
      }
      if (session.parentData?.name) {
        return [
          {
            name: session.parentData.name,
            relation: session.parentData.relation || 'Father',
            maxBudgetAnnualLakhs: session.parentData.maxBudgetAnnualLakhs || session.studentProfile?.budgetAnnualLakhs || 15,
            preferredLocations: session.parentData.preferredLocations || [session.studentProfile?.location || 'Domestic Tier-1 Tech Hubs'],
            riskAppetite: session.parentData.riskAppetite || 'moderate',
            priorityFocus: (session.parentData.priorityFocus as any) || 'Stability',
            conflictPoints: ['Budget ceiling defined at ₹' + (session.parentData.maxBudgetAnnualLakhs || session.studentProfile?.budgetAnnualLakhs || 15) + 'L/yr'],
            status: 'COMPLETED'
          }
        ];
      }
      return [];
    });
  }, []);

  useEffect(() => {
    loadStudentParents(false);

    // 1. BroadcastChannel for instant 0ms multi-tab sync when parent submits in another tab
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('alignx_family_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'PARENT_SUBMISSION_COMPLETED') {
          const { token, parentName, relationship, budgetLakhs, priority, riskAppetite, locationPreference, notes } = event.data;

          setParents((prev) => {
            let matched = false;
            const updated = prev.map((p) => {
              if (
                (token && p.invitationToken === token) ||
                (p.name && p.name.trim().toLowerCase() === parentName.trim().toLowerCase())
              ) {
                matched = true;
                return {
                  ...p,
                  maxBudgetAnnualLakhs: budgetLakhs,
                  priorityFocus: priority,
                  riskAppetite,
                  preferredLocations: [locationPreference],
                  conflictPoints: [
                    notes || 'Tuition ceiling defined',
                    `Budget ceiling defined at ₹${budgetLakhs}L/yr with ${riskAppetite} risk appetite`
                  ],
                  status: 'COMPLETED' as const
                };
              }
              return p;
            });

            if (!matched) {
              updated.push({
                id: `p_synced_${Date.now()}`,
                parentId: `p_synced_${Date.now()}`,
                name: parentName,
                relation: relationship,
                maxBudgetAnnualLakhs: budgetLakhs,
                preferredLocations: [locationPreference],
                priorityFocus: priority,
                riskAppetite,
                conflictPoints: [`Annual budget ceiling defined at ₹${budgetLakhs}L/yr`],
                status: 'COMPLETED'
              });
            }

            return updated;
          });

          // Dynamic calculation of conflict index
          const session = getSessionProgress();
          const sB = session.studentProfile?.budgetAnnualLakhs || 15;
          const sRisk = session.studentProfile?.riskTolerance || 'moderate';
          const { index, reasons } = computeDynamicConflict(sB, budgetLakhs, sRisk, riskAppetite);
          setConflictIndex(index);
          setConflictReasons(reasons);

          loadStudentParents(true);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported:', e);
    }

    // 2. Storage event listener for cross-tab localStorage updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'alignx_session_progress') {
        const session = getSessionProgress();
        if (session.parentList && session.parentList.length > 0) {
          setParents(session.parentList);
          const completed = session.parentList.find((p) => p.status === 'COMPLETED');
          if (completed) {
            const sB = session.studentProfile?.budgetAnnualLakhs || 15;
            const sRisk = session.studentProfile?.riskTolerance || 'moderate';
            const { index, reasons } = computeDynamicConflict(sB, completed.maxBudgetAnnualLakhs, sRisk, completed.riskAppetite);
            setConflictIndex(index);
            setConflictReasons(reasons);
          }
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 3. Auto-refresh when tab regains focus or visibility
    const handleFocus = () => loadStudentParents(true);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') loadStudentParents(true);
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    // 4. Periodic background polling
    const interval = setInterval(() => {
      loadStudentParents(true);
    }, 4000);

    return () => {
      channel?.close();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [loadStudentParents, currentUser]);

  const hasCompletedParent = parents.some((p) => p.status === 'COMPLETED');

  const generateInviteUrl = (index: number, parent: ParentInput): string => {
    const token = parent.invitationToken || `invite_${index}_${Date.now()}`;
    const session = getSessionProgress();
    const sId = ApiService.getStudentId() || currentUser?.id || '';
    const pId = parent.parentId || parent.id || '';
    const sName = encodeURIComponent(studentDisplayName || 'Student');
    const pName = encodeURIComponent(parent.name || 'Parent');
    const pRel = encodeURIComponent(parent.relation || 'Father');
    const sStage = encodeURIComponent(session.studentProfile?.currentField || session.studentProfile?.stage || 'Undergraduate');
    const sLoc = encodeURIComponent(session.studentProfile?.location || 'India');
    const sBudget = session.studentProfile?.budgetAnnualLakhs || 16;
    const query = `student=${sName}&parent=${pName}&relation=${pRel}&stage=${sStage}&loc=${sLoc}&budget=${sBudget}&studentId=${encodeURIComponent(sId)}&parentId=${encodeURIComponent(pId)}`;

    if (parent.invitationUrl && parent.invitationUrl.startsWith('http')) {
      return `${parent.invitationUrl}${parent.invitationUrl.includes('?') ? '&' : '?'}${query}`;
    } else if (parent.invitationUrl) {
      const base = `${window.location.origin}${parent.invitationUrl.startsWith('/') ? '' : '/'}${parent.invitationUrl}`;
      return `${base}${base.includes('?') ? '&' : '?'}${query}`;
    }
    return `${window.location.origin}/parent/invite/${token}?${query}`;
  };

  const handleOpenPortalInNewTab = (index: number, parent: ParentInput) => {
    const url = generateInviteUrl(index, parent);
    window.open(url, '_blank');
  };

  // Copy invitation link for parent with universal fallback
  const handleCopyLink = async (index: number, parent: ParentInput) => {
    const url = generateInviteUrl(index, parent);

    let copied = false;
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        copied = true;
      } catch (err) {
        console.warn('Clipboard writeText failed, trying execCommand fallback:', err);
      }
    }

    if (!copied) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (success) copied = true;
      } catch (e) {
        console.warn('Fallback execCommand failed:', e);
      }
    }

    if (!copied) {
      // User prompt as last resort so link is never lost
      window.prompt('Copy invitation link below:', url);
      copied = true;
    }

    if (copied) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2500);
    }
  };

  // Add Parent: saves to MongoDB under this student's family
  const handleAddParent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSubmitting(true);
    let parentId = `p_${Date.now()}`;
    let token = `inv_${Date.now()}`;
    let url = `/parent/invite/${token}`;

    try {
      const res = await ApiService.inviteParent({
        name: newName.trim(),
        relationship: newRelation,
        email: newEmail.trim() || undefined
      });

      if (res?.data) {
        parentId = res.data.parentId || parentId;
        token = res.data.invitationToken || token;
        url = res.data.invitationUrl || url;
      }
    } catch (err) {
      console.warn('[ALIGNX Parent] Backend invite creation note:', err);
    }

    const newRecord: ParentInput = {
      id: parentId,
      parentId,
      name: newName.trim(),
      relation: newRelation,
      email: newEmail.trim() || undefined,
      maxBudgetAnnualLakhs: newBudget,
      preferredLocations: ['Domestic Tier-1 Tech Hubs'],
      riskAppetite: 'low',
      priorityFocus: 'Stability',
      conflictPoints: [],
      status: 'PENDING',
      invitationToken: token,
      invitationUrl: url
    };

    setParents((prev) => {
      const next = [...prev, newRecord];
      // Immediately persist to session so polling can never wipe this record
      saveSessionProgress({
        parentList: next,
        parentData: {
          name: newRecord.name,
          relation: newRecord.relation,
          maxBudgetAnnualLakhs: newRecord.maxBudgetAnnualLakhs,
          preferredLocations: newRecord.preferredLocations,
          priorityFocus: newRecord.priorityFocus,
          riskAppetite: newRecord.riskAppetite,
          maxRelocationKm: 500
        }
      });
      return next;
    });

    setNewName('');
    setNewEmail('');
    setShowAddModal(false);
    setIsSubmitting(false);
  };

  const handleRemoveParent = async (parent: ParentInput, index: number) => {
    const pId = parent.parentId || parent.id;
    if (!window.confirm(`Are you sure you want to remove ${parent.name || 'this parent profile'}?`)) {
      return;
    }

    if (pId) {
      try {
        await ApiService.removeParent(pId);
      } catch (err) {
        console.warn('[ALIGNX Parent] Remove parent API note:', err);
      }
    }

    setParents((prev) => {
      const updated = prev.filter((p, i) => {
        if (pId) {
          return (p.parentId || p.id) !== pId;
        }
        return i !== index;
      });

      const remainingCompleted = updated.find((p) => p.status === 'COMPLETED');
      if (remainingCompleted) {
        saveSessionProgress({
          parentData: {
            name: remainingCompleted.name,
            relation: remainingCompleted.relation,
            maxBudgetAnnualLakhs: remainingCompleted.maxBudgetAnnualLakhs,
            preferredLocations: remainingCompleted.preferredLocations,
            priorityFocus: remainingCompleted.priorityFocus,
            riskAppetite: remainingCompleted.riskAppetite,
            maxRelocationKm: 500
          },
          parentInputDone: true,
          parentList: updated
        });
      } else {
        saveSessionProgress({
          parentData: null as any,
          parentInputDone: false,
          parentList: updated
        });
      }

      return updated;
    });
  };

  const handleOpenFillModal = (parent: ParentInput) => {
    setActiveParentToFill(parent);
    setFillBudget(parent.maxBudgetAnnualLakhs || 15);
    setFillPriority(parent.priorityFocus || 'Stability');
    setFillRisk(parent.riskAppetite || 'low');
  };

  // Submit Parent Perspective (direct sync to MongoDB & local state)
  const handleSubmitParentResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeParentToFill) return;

    const targetParent = activeParentToFill;
    const budgetBytes = fillBudget * 100000;

    // 1. Immediately update local state & session progress so UI transitions seamlessly
    const updatedParents = parents.map((p) => {
      if (
        (p.parentId && p.parentId === targetParent.parentId) ||
        (p.id && p.id === targetParent.id) ||
        (p.name === targetParent.name && p.relation === targetParent.relation)
      ) {
        return {
          ...p,
          maxBudgetAnnualLakhs: fillBudget,
          priorityFocus: fillPriority,
          riskAppetite: fillRisk,
          preferredLocations: [fillLocation],
          conflictPoints: [
            fillConcerns,
            `Budget ceiling defined at ₹${fillBudget}L/yr with ${fillRisk} risk appetite`
          ],
          status: 'COMPLETED' as const
        };
      }
      return p;
    });

    setParents(updatedParents);
    setActiveParentToFill(null);

    // Compute dynamic conflict index immediately
    const session = getSessionProgress();
    const sB = session.studentProfile?.budgetAnnualLakhs || 15;
    const sRisk = session.studentProfile?.riskTolerance || 'moderate';
    const { index, reasons } = computeDynamicConflict(sB, fillBudget, sRisk, fillRisk);
    setConflictIndex(index);
    setConflictReasons(reasons);

    // Persist to session immediately
    const primary = updatedParents.find((p) => p.status === 'COMPLETED') || updatedParents[0];
    saveSessionProgress({
      parentData: {
        name: primary.name,
        relation: primary.relation,
        maxBudgetAnnualLakhs: primary.maxBudgetAnnualLakhs,
        preferredLocations: primary.preferredLocations || ['Domestic Tier-1 Tech Hubs'],
        priorityFocus: primary.priorityFocus || 'Stability',
        riskAppetite: primary.riskAppetite || 'low',
        maxRelocationKm: 500
      },
      parentInputDone: true,
      parentList: updatedParents
    });

    // 2. Sync to MongoDB asynchronously in background
    try {
      if (targetParent.parentId) {
        const res = await ApiService.submitParentDirect(targetParent.parentId, {
          educationBudget: budgetBytes,
          riskAppetite: fillRisk,
          priorityFactors: [fillPriority],
          locationPreference: fillLocation,
          additionalNotes: fillConcerns
        });
        if (res?.data?.alignmentAnalysis?.conflictIndex !== undefined) {
          setConflictIndex(res.data.alignmentAnalysis.conflictIndex);
        }
        if (res?.data?.alignmentAnalysis?.conflictReasons) {
          setConflictReasons(res.data.alignmentAnalysis.conflictReasons);
        }
      } else if (targetParent.invitationToken) {
        const res = await ApiService.submitParentFeedback(targetParent.invitationToken, {
          educationBudget: budgetBytes,
          riskAppetite: fillRisk,
          priorityFactors: [fillPriority],
          locationPreference: fillLocation,
          additionalNotes: fillConcerns
        });
        if (res?.data?.alignmentAnalysis?.conflictIndex !== undefined) {
          setConflictIndex(res.data.alignmentAnalysis.conflictIndex);
        }
        if (res?.data?.alignmentAnalysis?.conflictReasons) {
          setConflictReasons(res.data.alignmentAnalysis.conflictReasons);
        }
      }
      await loadStudentParents(true);
    } catch (err) {
      console.warn('[ALIGNX Parent] Response submission note:', err);
    }
  };

  // Quick-link primary guardian using onboarded student financial bounds
  const handleQuickLinkGuardian = async () => {
    const session = getSessionProgress();
    const onboardBudget = session.studentProfile?.budgetAnnualLakhs || 15;
    const onboardRisk = session.studentProfile?.riskTolerance || 'moderate';

    setIsSubmitting(true);
    let parentId = `p_${Date.now()}`;
    let token = `inv_${Date.now()}`;
    let url = `/parent/invite/${token}`;

    try {
      const res = await ApiService.inviteParent({
        name: 'Primary Guardian',
        relationship: 'Father',
        email: 'guardian@alignx.internal'
      });
      if (res?.data) {
        parentId = res.data.parentId || parentId;
        token = res.data.invitationToken || token;
        url = res.data.invitationUrl || url;
      }
    } catch (err) {
      console.warn('[ALIGNX Parent] Quick link backend notice:', err);
    }

    const newRecord: ParentInput = {
      id: parentId,
      parentId,
      name: 'Primary Guardian',
      relation: 'Father',
      maxBudgetAnnualLakhs: onboardBudget,
      preferredLocations: ['Domestic Tier-1 Tech Hubs'],
      riskAppetite: onboardRisk === 'high' ? 'high' : onboardRisk === 'low' ? 'low' : 'moderate',
      priorityFocus: 'Stability',
      conflictPoints: [`Annual tuition ceiling confirmed at ₹${onboardBudget}L/yr`],
      status: 'COMPLETED',
      invitationToken: token,
      invitationUrl: url
    };

    setParents([newRecord]);
    saveSessionProgress({
      parentList: [newRecord],
      parentData: {
        name: newRecord.name,
        relation: newRecord.relation,
        maxBudgetAnnualLakhs: newRecord.maxBudgetAnnualLakhs,
        preferredLocations: newRecord.preferredLocations,
        priorityFocus: newRecord.priorityFocus,
        riskAppetite: newRecord.riskAppetite,
        maxRelocationKm: 500
      },
      parentInputDone: true
    });
    setIsSubmitting(false);
  };

  const handleAutoConfirmConsensus = () => {
    const session = getSessionProgress();
    const onboardBudget = session.studentProfile?.budgetAnnualLakhs || 15;
    const onboardRisk = session.studentProfile?.riskTolerance || 'moderate';
    const primary: ParentInput = parents[0] || {
      id: 'p_confirmed',
      parentId: 'p_confirmed',
      name: 'Primary Guardian',
      relation: 'Father',
      maxBudgetAnnualLakhs: onboardBudget,
      preferredLocations: ['Domestic Tier-1 Tech Hubs'],
      priorityFocus: 'Stability',
      riskAppetite: onboardRisk === 'high' ? 'high' : onboardRisk === 'low' ? 'low' : 'moderate',
      conflictPoints: [`Annual tuition ceiling confirmed at ₹${onboardBudget}L/yr`],
      status: 'COMPLETED'
    };

    const updated: ParentInput[] = parents.length > 0 ? parents.map(p => ({ ...p, status: 'COMPLETED' as const })) : [primary];
    setParents(updated);

    saveSessionProgress({
      parentInputDone: true,
      lastActiveView: 'dashboard',
      parentData: {
        name: primary.name,
        relation: primary.relation,
        maxBudgetAnnualLakhs: primary.maxBudgetAnnualLakhs,
        preferredLocations: primary.preferredLocations || ['Domestic Tier-1 Tech Hubs'],
        priorityFocus: primary.priorityFocus || 'Stability',
        riskAppetite: primary.riskAppetite || 'low',
        maxRelocationKm: 500
      },
      parentList: updated,
      completedStages: {
        ...getSessionProgress().completedStages,
        parent: true,
        dashboard: true
      }
    });

    onContinue();
  };

  const handleSaveAndContinue = async () => {
    if (!hasCompletedParent) return;

    const completed = parents.filter((p) => p.status === 'COMPLETED');
    const primary = completed[0] || parents[0];

    saveSessionProgress({
      parentInputDone: true,
      lastActiveView: 'dashboard',
      parentData: {
        name: primary.name,
        relation: primary.relation,
        maxBudgetAnnualLakhs: primary.maxBudgetAnnualLakhs,
        preferredLocations: primary.preferredLocations || [getSessionProgress().studentProfile?.location || 'Domestic Tier-1 Tech Hubs'],
        priorityFocus: primary.priorityFocus || 'Stability',
        riskAppetite: primary.riskAppetite || 'low',
        maxRelocationKm: 500
      },
      completedStages: {
        ...getSessionProgress().completedStages,
        parent: true,
        dashboard: true // Unlocks 5D Decision Engine!
      }
    });

    try {
      await ApiService.generateRecommendations();
    } catch {
      // Graceful offline fallback
    }

    onContinue();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 24px' }}>
      {/* Top Back Navigation */}
      {onBack && (
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={onBack}
            className="alignx-key"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.78rem' }}
          >
            <ChevronLeft size={14} />
            <span>BACK TO CAREER DNA</span>
          </button>
        </div>
      )}

      {/* Module Title */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '24px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Users size={18} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.18em', color: 'var(--accent)' }}>
            STUDENT: {studentDisplayName.toUpperCase()} • FAMILY PERSPECTIVE & FINANCIAL BOUNDS
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            margin: '8px 0 12px',
            color: 'var(--text-primary)'
          }}
        >
          Family Perspective & Financial Bounds
        </h1>

        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '780px', lineHeight: 1.6 }}>
          Sustainable career decisions must reconcile individual cognitive potential with household financial boundaries, parental risk tolerance, and geographic relocation limits.
        </p>
      </div>

      {/* Step 1: Identification Notice or Prompt */}
      {parents.length === 0 ? (
        <div
          className="titanium-card animate-fade-in"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px dashed var(--accent)',
            borderRadius: '0px',
            padding: '48px 36px',
            textAlign: 'center',
            marginBottom: '36px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '0px',
              backgroundColor: 'rgba(45, 90, 67, 0.09)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}
          >
            <Users size={28} />
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent)', letterSpacing: '0.16em', marginBottom: '8px' }}>
            STUDENT: {studentDisplayName.toUpperCase()} • STEP 01 / PARENT IDENTIFICATION
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px' }}>
            Who are your parents or guardians?
          </h2>

          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 28px', fontSize: '0.96rem', lineHeight: 1.55 }}>
            To calculate your financial feasibility score (20%) and family alignment score (15%), identify your parents or guardians. They will provide their tuition budget ceiling and career priorities.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setNewRelation('Father');
                setNewName('');
                setShowAddModal(true);
              }}
              className="alignx-key"
              style={{ padding: '12px 22px', fontSize: '0.84rem' }}
            >
              <Plus size={14} />
              <span>ADD FATHER</span>
            </button>

            <button
              onClick={() => {
                setNewRelation('Mother');
                setNewName('');
                setShowAddModal(true);
              }}
              className="alignx-key"
              style={{ padding: '12px 22px', fontSize: '0.84rem' }}
            >
              <Plus size={14} />
              <span>ADD MOTHER</span>
            </button>

            <RollButton
              onClick={() => {
                setNewRelation('Guardian');
                setNewName('');
                setShowAddModal(true);
              }}
              variant="primary"
              icon={<Plus size={14} />}
            >
              CUSTOM GUARDIAN ENTRY
            </RollButton>
          </div>
        </div>
      ) : (
        <>
          {/* Waiting Gate / Blocking Telemetry Banner */}
          {!hasCompletedParent ? (
            <div
              className="titanium-card animate-pulse"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.04)',
                border: '1.5px solid #EF4444',
                borderRadius: '0px',
                padding: '24px 28px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 8px 30px rgba(239, 68, 68, 0.08)'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '0px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Lock size={22} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em', color: '#EF4444', fontWeight: 700 }}>
                    GATE ACTIVE: AWAITING PARENT DATA FOR {studentDisplayName.toUpperCase()}
                  </span>
                  <span style={{ width: '6px', height: '6px', borderRadius: '0px', backgroundColor: '#EF4444', animation: 'ping 1.5s infinite' }} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Decision Engine is locked until parent perspectives are completed.
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  ALIGNX cannot synthesize your 5D career recommendations without parental consensus on financial ceilings and risk parameters. Use the parent portal link below or click <strong>"Fill as Parent"</strong> to input responses.
                </div>
              </div>
            </div>
          ) : (
            <div
              className="titanium-card"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.06)',
                border: '1.5px solid #10B981',
                borderRadius: '0px',
                padding: '22px 28px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '0px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <CheckCircle2 size={22} />
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em', color: '#10B981', fontWeight: 700, marginBottom: '2px' }}>
                  CONSENSUS ESTABLISHED: 5D WEIGHTING UNLOCKED FOR {studentDisplayName.toUpperCase()}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Parental budget cap (₹{parents.find((p) => p.status === 'COMPLETED')?.maxBudgetAnnualLakhs}L/yr) and risk parameters reconciled with student aptitude. You can now synthesize your 5D Decision Dashboard.
                </div>
              </div>
            </div>
          )}

          {/* Conflict Index & Alignment Gauge */}
          <div
            className="titanium-card"
            style={{
              padding: '32px 36px',
              marginBottom: '32px',
              border: '1px solid var(--border-hairline)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.14em' }}>
                  ALIGNX HARMONY COEFFICIENT
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, margin: '6px 0', letterSpacing: '-0.03em' }}>
                  {hasCompletedParent
                    ? `FRICTION: ${conflictIndex}% (${
                        conflictIndex <= 15
                          ? 'HIGH CONSENSUS'
                          : conflictIndex <= 30
                          ? 'MODERATE FRICTION'
                          : 'SIGNIFICANT DIVERGENCE'
                      })`
                    : 'FRICTION: AWAITING INPUT'}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  {hasCompletedParent
                    ? conflictReasons.length > 0
                      ? conflictReasons[0]
                      : conflictIndex <= 15
                      ? 'Strong structural cohesion. Parental budget ceiling provides ample runway for Tier-1 education.'
                      : conflictIndex <= 30
                      ? 'Moderate divergence in educational debt tolerance vs premium private campus tuition.'
                      : 'High divergence between parental financial ceiling and standard non-subsidized tech degree tuition.'
                    : 'Pending parental input to measure divergence between student aspirations and family financial tolerance.'}
                </p>
              </div>

              <div
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0px',
                  padding: '14px 18px',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <ShieldCheck
                  size={22}
                  color={
                    !hasCompletedParent
                      ? 'var(--accent)'
                      : conflictIndex <= 15
                      ? '#10B981'
                      : conflictIndex <= 30
                      ? '#F59E0B'
                      : '#EF4444'
                  }
                />
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>RECONCILIATION STATUS</div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: !hasCompletedParent
                        ? '#F59E0B'
                        : conflictIndex <= 15
                        ? '#10B981'
                        : conflictIndex <= 30
                        ? '#F59E0B'
                        : '#EF4444'
                    }}
                  >
                    {!hasCompletedParent
                      ? 'AWAITING PARENT FEEDBACK'
                      : conflictIndex <= 15
                      ? 'SOLVABLE WITHOUT DEBT STRESS'
                      : conflictIndex <= 30
                      ? 'BALANCED BUDGET WITH LOAN EXPOSURE'
                      : 'CONSTRAINED CEILING — SCHOLARSHIPS REQUIRED'}
                  </div>
                </div>
              </div>
            </div>

            {/* Cohesion Meter */}
            <div style={{ height: '4px', backgroundColor: 'var(--border-hairline)', width: '100%', marginBottom: '10px', borderRadius: '0px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: hasCompletedParent ? `${Math.max(5, 100 - conflictIndex)}%` : '20%',
                  backgroundColor: !hasCompletedParent
                    ? 'var(--accent)'
                    : conflictIndex <= 15
                    ? '#10B981'
                    : conflictIndex <= 30
                    ? '#F59E0B'
                    : '#EF4444',
                  transition: 'width 0.4s ease, background-color 0.4s ease'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>FAMILY ALIGNMENT: {hasCompletedParent ? `${Math.max(5, 100 - conflictIndex)}%` : 'CALCULATING...'}</span>
              <span>DIVERGENCE: {hasCompletedParent ? `${conflictIndex}%` : 'PENDING'}</span>
            </div>
          </div>

          {/* Parent Cards Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--text-secondary)' }}>
              FAMILY PROFILES FOR {studentDisplayName.toUpperCase()} ({parents.length})
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => loadStudentParents(false)}
                disabled={isRefreshing}
                className="alignx-key"
                title="Check for newly submitted parent responses"
                style={{ padding: '7px 14px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={12} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                <span>{isRefreshing ? 'CHECKING...' : 'REFRESH STATUS'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setNewRelation('Mother');
                  setNewName('');
                  setShowAddModal(true);
                }}
                className="alignx-key"
                style={{ padding: '7px 14px', fontSize: '0.72rem' }}
              >
                <Plus size={13} />
                <span>ADD ANOTHER PARENT / GUARDIAN</span>
              </button>
            </div>
          </div>

          {/* Parent Cards List or Empty State */}
          {parents.length === 0 ? (
            <div
              className="titanium-card"
              style={{
                padding: '44px 32px',
                textAlign: 'center',
                border: '1px dashed var(--border-subtle)',
                marginBottom: '36px',
                backgroundColor: 'rgba(0,0,0,0.015)'
              }}
            >
              <Users size={34} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                No Family Profiles Linked for {studentDisplayName}
              </h4>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                Each student has an independent family portal. Add a parent or guardian to measure financial tolerance and reconcile career priorities.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    setNewRelation('Father');
                    setNewName('');
                    setShowAddModal(true);
                  }}
                  className="alignx-key"
                  style={{ padding: '8px 20px', fontSize: '0.76rem' }}
                >
                  <Plus size={14} />
                  <span>ADD CUSTOM PARENT</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickLinkGuardian}
                  style={{
                    padding: '8px 20px',
                    fontSize: '0.76rem',
                    backgroundColor: 'var(--accent)',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Zap size={13} />
                  <span>QUICK-LINK PRIMARY GUARDIAN (ONBOARDED BUDGET)</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '36px' }}>
              {parents.map((p, i) => {
                const isCompleted = p.status === 'COMPLETED';

                return (
                  <div
                    key={p.parentId || p.id || i}
                    className="titanium-card"
                    style={{
                      padding: '24px',
                      border: isCompleted ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                      backgroundColor: isCompleted ? '#FFFFFF' : 'rgba(245, 158, 11, 0.02)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      {/* Status Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span className="titanium-badge" style={{ backgroundColor: 'rgba(0,0,0,0.04)', color: 'var(--text-primary)' }}>
                          {p.relation.toUpperCase()}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isCompleted ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.7rem',
                                color: '#10B981',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '0px',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)'
                              }}
                            >
                              <CheckCircle2 size={12} />
                              <span>COMPLETED</span>
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.7rem',
                                color: '#F59E0B',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '0px',
                                backgroundColor: 'rgba(245, 158, 11, 0.1)'
                              }}
                            >
                              <Clock size={12} />
                              <span>AWAITING INPUT</span>
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveParent(p, i)}
                            title={`Remove ${p.name}`}
                            aria-label={`Remove ${p.name}`}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '3px',
                              transition: 'color 0.15s, background-color 0.15s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#EF4444';
                              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'var(--text-muted)';
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        {p.name}
                      </h3>
                      {p.email && (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                          {p.email}
                        </div>
                      )}

                      {/* Metadata details */}
                      {isCompleted ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>MAX ANNUAL TUITION:</span>
                            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>₹{p.maxBudgetAnnualLakhs}L / year</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>PRIORITY FOCUS:</span>
                            <span style={{ fontWeight: 600 }}>{p.priorityFocus}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>RISK APPETITE:</span>
                            <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{p.riskAppetite}</span>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            padding: '12px 14px',
                            borderRadius: '0px',
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            border: '1px solid var(--border-hairline)',
                            marginBottom: '20px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.74rem',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          Parent invite active. Waiting for {p.name} to submit financial ceiling and career priority parameters.
                        </div>
                      )}
                    </div>

                    {/* Actions on Card */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '14px', borderTop: '1px solid var(--border-hairline)' }}>
                      <button
                        onClick={() => handleCopyLink(i, p)}
                        className="alignx-key"
                        style={{ padding: '8px 12px', fontSize: '0.72rem', flex: 1 }}
                      >
                        {copiedIndex === i ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                        <span>{copiedIndex === i ? 'COPIED' : 'COPY LINK'}</span>
                      </button>

                      <button
                        onClick={() => handleOpenPortalInNewTab(i, p)}
                        className="alignx-key"
                        title="Open live portal in new window"
                        style={{ padding: '8px 12px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ExternalLink size={12} />
                        <span>OPEN ↗</span>
                      </button>

                      <button
                        onClick={() => handleOpenFillModal(p)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '0px',
                          backgroundColor: isCompleted ? 'rgba(0,0,0,0.06)' : 'var(--accent)',
                          color: isCompleted ? 'var(--text-primary)' : '#FFFFFF',
                          border: 'none',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Sliders size={12} />
                        <span>{isCompleted ? 'UPDATE' : 'FILL IN-PERSON'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Advance to Decision Engine Dashboard */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          borderTop: '1px solid var(--border-hairline)',
          paddingTop: '28px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {onBack && (
            <button
              onClick={onBack}
              className="alignx-key"
              style={{ padding: '12px 18px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ChevronLeft size={14} />
              <span>← PREVIOUS (CAREER DNA)</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
            {hasCompletedParent ? (
              <>
                <CheckCircle2 size={15} color="#10B981" />
                <span style={{ color: '#10B981', fontWeight: 600 }}>HOUSEHOLD CONSTRAINTS RECONCILED WITH 5D PROTOCOL</span>
              </>
            ) : (
              <>
                <Lock size={15} color="#EF4444" />
                <span style={{ color: '#EF4444', fontWeight: 600 }}>DECISION ENGINE LOCKED (AWAITING PARENT DATA)</span>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {!hasCompletedParent && (
            <button
              onClick={handleAutoConfirmConsensus}
              className="alignx-key"
              style={{ padding: '12px 18px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Use student onboarded budget to reconcile household gate"
            >
              <Zap size={14} color="var(--accent)" />
              <span>BYPASS VIA ONBOARDED BUDGET</span>
            </button>
          )}

          <RollButton
            onClick={handleSaveAndContinue}
            variant="primary"
            disabled={!hasCompletedParent}
            icon={hasCompletedParent ? <ArrowRight size={16} /> : <Lock size={16} />}
            style={{
              opacity: hasCompletedParent ? 1 : 0.5,
              cursor: hasCompletedParent ? 'pointer' : 'not-allowed',
              pointerEvents: hasCompletedParent ? 'auto' : 'none'
            }}
          >
            {hasCompletedParent ? 'SYNTHESIZE 5D DECISION DASHBOARD' : 'LOCKED: AWAITING PARENT SUBMISSION'}
          </RollButton>
        </div>
      </div>

      {/* Modal: Add Parent / Guardian */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            className="titanium-card animate-fade-in"
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '480px',
              padding: '32px',
              borderRadius: '0px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.14em', marginBottom: '8px' }}>
              STUDENT: {studentDisplayName.toUpperCase()} • PARENT IDENTIFICATION
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>
              Identify Parent or Guardian
            </h2>

            <form onSubmit={handleAddParent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  RELATIONSHIP
                </label>
                <select
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '0px',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: '#F9F9FA',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Legal Guardian</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Singh"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '0px',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: '#F9F9FA',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  EMAIL ADDRESS (FOR SECURE PORTAL INVITE)
                </label>
                <input
                  type="email"
                  placeholder="e.g. parent@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '0px',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: '#F9F9FA',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  ESTIMATED ANNUAL TUITION CEILING (₹{newBudget} LAKHS/YR)
                </label>
                <input
                  type="range"
                  min={5}
                  max={40}
                  step={1}
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="alignx-key"
                  style={{ padding: '8px 16px' }}
                >
                  CANCEL
                </button>
                <RollButton type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'GENERATING...' : 'GENERATE INVITATION'}
                </RollButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Interactive Parent Response Portal */}
      {activeParentToFill && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            className="titanium-card animate-fade-in"
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '560px',
              padding: '36px',
              borderRadius: '0px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.14em' }}>
                PORTAL RECONCILIATION SIMULATOR
              </span>
              <span className="titanium-badge" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
                {activeParentToFill.relation.toUpperCase()}
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, marginBottom: '6px' }}>
              Parent Perspective: {activeParentToFill.name}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Provide household financial limits, career priorities, and geographical bounds for {studentDisplayName} to unblock the 5D Decision Dashboard.
            </p>

            <form onSubmit={handleSubmitParentResponse} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    ANNUAL TUITION & LIVING BUDGET CEILING
                  </label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)' }}>
                    ₹{fillBudget} Lakhs / year
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={40}
                  step={1}
                  value={fillBudget}
                  onChange={(e) => setFillBudget(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>₹5L/yr (Lean)</span>
                  <span>₹20L/yr (Tier-1 Domestic)</span>
                  <span>₹40L/yr (Global / Overseas)</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  PRIMARY HOUSEHOLD CAREER PRIORITY
                </label>
                <select
                  value={fillPriority}
                  onChange={(e) => setFillPriority(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '0px',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: '#F9F9FA',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="Stability">Long-Term Stability & Pedigree (Low Risk)</option>
                  <option value="High Growth">Emergent Technology & High Growth</option>
                  <option value="Immediate ROI">Immediate Break-Even & Fast Placement ROI</option>
                  <option value="Work-Life Balance">Sustainable Health & Work-Life Balance</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  HOUSEHOLD RISK APPETITE
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {(['low', 'moderate', 'high'] as const).map((risk) => (
                    <button
                      type="button"
                      key={risk}
                      onClick={() => setFillRisk(risk)}
                      style={{
                        padding: '10px',
                        borderRadius: '0px',
                        border: fillRisk === risk ? '1.5px solid var(--accent)' : '1px solid var(--border-hairline)',
                        backgroundColor: fillRisk === risk ? 'rgba(45, 90, 67, 0.09)' : '#F9F9FA',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.76rem',
                        fontWeight: fillRisk === risk ? 700 : 500,
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        color: fillRisk === risk ? 'var(--accent)' : 'var(--text-secondary)'
                      }}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  LOCATION BOUNDS
                </label>
                <input
                  type="text"
                  value={fillLocation}
                  onChange={(e) => setFillLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '0px',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: '#F9F9FA',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  KEY PARENTAL GUIDANCE / RESTRICTIONS
                </label>
                <textarea
                  rows={3}
                  value={fillConcerns}
                  onChange={(e) => setFillConcerns(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '0px',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: '#F9F9FA',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setActiveParentToFill(null)}
                  className="alignx-key"
                  style={{ padding: '8px 16px' }}
                >
                  CANCEL
                </button>
                <RollButton type="submit" variant="primary">
                  CONFIRM PARENT PERSPECTIVE
                </RollButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
