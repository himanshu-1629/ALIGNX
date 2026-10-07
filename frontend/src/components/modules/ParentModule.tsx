import React, { useState } from 'react';
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
  Sliders
} from 'lucide-react';

interface ParentModuleProps {
  onContinue: () => void;
  onBack?: () => void;
}

export const ParentModule: React.FC<ParentModuleProps> = ({ onContinue, onBack }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeParentToFill, setActiveParentToFill] = useState<ParentInput | null>(null);

  // Check if session previously had completed parent data
  const initialSession = getSessionProgress();
  const initialParents: ParentInput[] = initialSession.parentData
    ? [
        {
          name: initialSession.parentData.name || 'Rajesh Sharma',
          relation: initialSession.parentData.relation || 'Father',
          maxBudgetAnnualLakhs: initialSession.parentData.maxBudgetAnnualLakhs || 16,
          preferredLocations: initialSession.parentData.preferredLocations || ['Bangalore', 'Chennai'],
          riskAppetite: initialSession.parentData.riskAppetite || 'moderate',
          priorityFocus: (initialSession.parentData.priorityFocus as any) || 'Stability',
          conflictPoints: ['Budget ceiling defined at ₹' + (initialSession.parentData.maxBudgetAnnualLakhs || 16) + 'L/yr'],
          status: 'COMPLETED'
        }
      ]
    : [];

  const [parents, setParents] = useState<ParentInput[]>(initialParents);

  // Form states for adding parent
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState<'Father' | 'Mother' | 'Guardian'>('Father');
  const [newEmail, setNewEmail] = useState('');
  const [newBudget, setNewBudget] = useState(15);

  // Form states for Parent Response simulation modal
  const [fillBudget, setFillBudget] = useState(15);
  const [fillPriority, setFillPriority] = useState<'Stability' | 'High Growth' | 'Immediate ROI' | 'Work-Life Balance'>('Stability');
  const [fillRisk, setFillRisk] = useState<'low' | 'moderate' | 'high'>('low');
  const [fillLocation, setFillLocation] = useState('Domestic Tier-1 Tech Hubs');
  const [fillConcerns, setFillConcerns] = useState('Prefers domestic Tier-1 institute over high educational debt; requires placement certainty');

  const hasCompletedParent = parents.some(p => p.status === 'COMPLETED');

  const handleCopyLink = (index: number, token: string) => {
    const url = `https://portal.alignx.ai/parent/invite?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleAddParent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newRecord: ParentInput = {
      name: newName.trim(),
      relation: newRelation,
      maxBudgetAnnualLakhs: newBudget,
      preferredLocations: ['Domestic Hubs'],
      riskAppetite: 'low',
      priorityFocus: 'Stability',
      conflictPoints: [],
      status: 'PENDING'
    };

    // Try sending invite to backend if available
    try {
      if (newEmail) {
        await ApiService.inviteParent({
          parentName: newName.trim(),
          parentEmail: newEmail.trim()
        });
      }
    } catch {
      // Offline fallback
    }

    setParents(prev => [...prev, newRecord]);
    setNewName('');
    setNewEmail('');
    setShowAddModal(false);
  };

  const handleQuickAdd = (relation: 'Father' | 'Mother', defaultName: string) => {
    const newRecord: ParentInput = {
      name: defaultName,
      relation,
      maxBudgetAnnualLakhs: relation === 'Father' ? 15 : 18,
      preferredLocations: ['Bangalore', 'Chennai', 'Mumbai'],
      riskAppetite: relation === 'Father' ? 'low' : 'moderate',
      priorityFocus: relation === 'Father' ? 'Stability' : 'Work-Life Balance',
      conflictPoints: [],
      status: 'PENDING'
    };
    setParents(prev => [...prev, newRecord]);
  };

  const handleOpenFillModal = (parent: ParentInput) => {
    setActiveParentToFill(parent);
    setFillBudget(parent.maxBudgetAnnualLakhs || 15);
    setFillPriority(parent.priorityFocus || 'Stability');
    setFillRisk(parent.riskAppetite || 'low');
  };

  const handleSubmitParentResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeParentToFill) return;

    const updatedParents = parents.map(p => {
      if (p.name === activeParentToFill.name && p.relation === activeParentToFill.relation) {
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

    // Persist to session
    const primary = updatedParents.find(p => p.status === 'COMPLETED') || updatedParents[0];
    saveSessionProgress({
      parentData: {
        name: primary.name,
        relation: primary.relation,
        maxBudgetAnnualLakhs: primary.maxBudgetAnnualLakhs,
        preferredLocations: primary.preferredLocations || ['Bangalore', 'Chennai'],
        priorityFocus: primary.priorityFocus || 'Stability',
        riskAppetite: primary.riskAppetite || 'low',
        maxRelocationKm: 500
      }
    });
  };

  const handleSaveAndContinue = async () => {
    if (!hasCompletedParent) return;

    const completed = parents.filter(p => p.status === 'COMPLETED');
    const primary = completed[0] || parents[0];

    saveSessionProgress({
      parentInputDone: true,
      lastActiveView: 'dashboard',
      parentData: {
        name: primary.name,
        relation: primary.relation,
        maxBudgetAnnualLakhs: primary.maxBudgetAnnualLakhs,
        preferredLocations: primary.preferredLocations || ['Bangalore', 'Chennai'],
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

    // Submit parent invitation & feedback to backend asynchronously
    ApiService.inviteParent({
      parentName: primary?.name || 'Parent',
      parentEmail: 'parent@family.internal',
      relation: primary?.relation || 'Father'
    }).then(res => {
      if (res?.data?.inviteToken) {
        return ApiService.submitParentFeedback(res.data.inviteToken, {
          maxBudget: (primary?.maxBudgetAnnualLakhs || 15) * 100000,
          riskTolerance: primary?.riskAppetite || 'low',
          preferredLocations: primary?.preferredLocations || ['Bangalore', 'Chennai']
        });
      }
    }).catch(err => {
      console.warn('[ALIGNX Parent] Backend sync note:', err);
    });

    onContinue();
  };

  const conflictIndex = hasCompletedParent ? 24 : 50;

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
            PHASE 05 / FAMILY CONSTRAINTS & MULTI-DIMENSIONAL RECONCILIATION
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
            STEP 01 / PARENT IDENTIFICATION
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px' }}>
            Who are your parents or guardians?
          </h2>

          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 28px', fontSize: '0.96rem', lineHeight: 1.55 }}>
            To calculate your financial feasibility score (20%) and family alignment score (15%), identify your parents or guardians. They will provide their tuition budget ceiling and career priorities.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleQuickAdd('Father', 'Rajesh Sharma')}
              className="alignx-key"
              style={{ padding: '12px 22px', fontSize: '0.84rem' }}
            >
              <Plus size={14} />
              <span>ADD FATHER (RAJESH SHARMA)</span>
            </button>

            <button
              onClick={() => handleQuickAdd('Mother', 'Sunita Sharma')}
              className="alignx-key"
              style={{ padding: '12px 22px', fontSize: '0.84rem' }}
            >
              <Plus size={14} />
              <span>ADD MOTHER (SUNITA SHARMA)</span>
            </button>

            <RollButton
              onClick={() => setShowAddModal(true)}
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
                    GATE ACTIVE: AWAITING PARENT DATA
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
                  CONSENSUS ESTABLISHED: 5D WEIGHTING UNLOCKED
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Parental budget cap (₹{parents.find(p => p.status === 'COMPLETED')?.maxBudgetAnnualLakhs}L/yr) and risk appetite successfully reconciled with student aptitude. You can now synthesize your 5D Decision Dashboard.
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
                  {hasCompletedParent ? `FRICTION: ${conflictIndex}% (HIGH CONSENSUS)` : 'FRICTION: AWAITING INPUT'}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  {hasCompletedParent
                    ? 'Strong structural cohesion. Slight divergence in educational debt tolerance vs upfront starting compensation.'
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
                <ShieldCheck size={22} color={hasCompletedParent ? '#10B981' : 'var(--accent)'} />
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>RECONCILIATION STATUS</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600, color: hasCompletedParent ? '#10B981' : '#F59E0B' }}>
                    {hasCompletedParent ? 'SOLVABLE WITHOUT DEBT STRESS' : 'AWAITING PARENT FEEDBACK'}
                  </div>
                </div>
              </div>
            </div>

            {/* Cohesion Meter */}
            <div style={{ height: '4px', backgroundColor: 'var(--border-hairline)', width: '100%', marginBottom: '10px', borderRadius: '0px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: hasCompletedParent ? `${100 - conflictIndex}%` : '20%', backgroundColor: hasCompletedParent ? 'var(--accent)' : '#EF4444', transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>FAMILY ALIGNMENT: {hasCompletedParent ? `${100 - conflictIndex}%` : 'CALCULATING...'}</span>
              <span>DIVERGENCE: {hasCompletedParent ? `${conflictIndex}%` : 'PENDING'}</span>
            </div>
          </div>

          {/* Parent Cards Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--text-secondary)' }}>
              FAMILY PROFILES ({parents.length})
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="alignx-key"
              style={{ padding: '7px 14px', fontSize: '0.72rem' }}
            >
              <Plus size={13} />
              <span>ADD ANOTHER GUARDIAN</span>
            </button>
          </div>

          {/* Parent Cards List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '36px' }}>
            {parents.map((p, i) => {
              const isCompleted = p.status === 'COMPLETED';
              const token = `inv_${i}_${p.relation.toLowerCase()}`;

              return (
                <div
                  key={i}
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
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
                      {p.name}
                    </h3>

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
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '14px', borderTop: '1px solid var(--border-hairline)' }}>
                    <button
                      onClick={() => handleCopyLink(i, token)}
                      className="alignx-key"
                      style={{ padding: '8px 12px', fontSize: '0.72rem', flex: 1 }}
                    >
                      {copiedIndex === i ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                      <span>{copiedIndex === i ? 'LINK COPIED' : 'COPY INVITE'}</span>
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
                      <span>{isCompleted ? 'UPDATE PERSPECTIVE' : 'FILL AS PARENT'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
              style={{ padding: '12px 18px', fontSize: '0.76rem' }}
            >
              <span>← CAREER DNA</span>
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
              STEP 01 / PARENT IDENTIFICATION
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
                  placeholder="e.g. Rajesh Sharma"
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
                <RollButton type="submit" variant="primary">
                  GENERATE INVITATION
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
              Provide household financial limits, career priorities, and geographical bounds to unblock the 5D Decision Dashboard.
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
                  {(['low', 'moderate', 'high'] as const).map(risk => (
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
                  PARENT GUIDANCE & CONCERNS
                </label>
                <textarea
                  rows={2}
                  value={fillConcerns}
                  onChange={(e) => setFillConcerns(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '0px',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: '#F9F9FA',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveParentToFill(null)}
                  className="alignx-key"
                  style={{ padding: '8px 16px' }}
                >
                  CANCEL
                </button>
                <RollButton type="submit" variant="primary">
                  SUBMIT PARENT PERSPECTIVE →
                </RollButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
