import React, { useState } from 'react';
import type { ParentInput } from '../../types/alignx';
import { RollButton } from '../RollButton';
import { saveSessionProgress, getSessionProgress } from '../../utils/sessionManager';
import { ArrowRight, Copy, Check, Users, ShieldCheck, Plus, CheckCircle2, ChevronLeft } from 'lucide-react';

interface ParentModuleProps {
  onContinue: () => void;
  onBack?: () => void;
}

export const ParentModule: React.FC<ParentModuleProps> = ({ onContinue, onBack }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Parent records aligned to Decision Engine schema
  const [parents, setParents] = useState<ParentInput[]>([
    {
      name: 'Rajesh Sharma',
      relation: 'Father',
      maxBudgetAnnualLakhs: 15,
      preferredLocations: ['Chennai', 'Bangalore', 'Mumbai'],
      riskAppetite: 'low',
      priorityFocus: 'Stability',
      conflictPoints: ['Prefers domestic Tier-1 over high unhedged educational debt', 'Desires brand pedigree (IIT / BITS / Tier-1)'],
      status: 'COMPLETED'
    },
    {
      name: 'Sunita Sharma',
      relation: 'Mother',
      maxBudgetAnnualLakhs: 18,
      preferredLocations: ['Bangalore', 'Pune', 'Hyderabad'],
      riskAppetite: 'moderate',
      priorityFocus: 'Work-Life Balance',
      conflictPoints: ['Supports frontier R&D if institutional stipend covers living overhead'],
      status: 'COMPLETED'
    }
  ]);

  // Form states for adding parent
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('Guardian');
  const [newBudget, setNewBudget] = useState(15);
  const [newPriority, setNewPriority] = useState<'Stability' | 'High Growth' | 'Immediate ROI' | 'Work-Life Balance'>('Stability');


  const invitationToken = 'alignx_inv_8f93a7d21b';
  const invitationUrl = `https://portal.alignx.ai/parent/invite?token=${invitationToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const newRecord: ParentInput = {
      name: newName,
      relation: newRelation,
      maxBudgetAnnualLakhs: newBudget,
      preferredLocations: ['Domestic Tech Hubs'],
      riskAppetite: 'moderate',
      priorityFocus: newPriority,
      conflictPoints: [`Budget ceiling set at ₹${newBudget}L/yr`],
      status: 'COMPLETED'
    };
    setParents(prev => [...prev, newRecord]);
    setNewName('');
    setShowAddModal(false);
  };

  const handleSaveAndContinue = () => {

    // Save exact schema payload to session storage
    saveSessionProgress({
      parentInputDone: true,
      lastActiveView: 'dashboard',
      parentData: {
        name: parents[0]?.name || 'Parent Record',
        relation: parents[0]?.relation || 'Father',
        maxBudgetAnnualLakhs: parents[0]?.maxBudgetAnnualLakhs || 15,
        preferredLocations: parents[0]?.preferredLocations || ['Bangalore', 'Chennai'],
        priorityFocus: parents[0]?.priorityFocus || 'Stability',
        riskAppetite: parents[0]?.riskAppetite || 'low',
        maxRelocationKm: 500
      },
      completedStages: {
        ...getSessionProgress().completedStages,
        parent: true,
        dashboard: false
      }
    });

    onContinue();
  };

  const conflictIndex = 28; // Low manageable friction

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
          Parent Perspective & Financial Reality
        </h1>

        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '780px' }}>
          Sustainable career decisions must reconcile individual cognitive potential with household financial boundaries, risk appetite, and geographic relocation limits.
        </p>
      </div>

      {/* Invitation Link Box */}
      <div
        className="titanium-card"
        style={{
          border: '1px solid var(--accent-border)',
          backgroundColor: 'rgba(197, 155, 109, 0.08)',
          padding: '24px 28px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.16em', marginBottom: '6px' }}>
            SECURE ASYNCHRONOUS PARENT PORTAL
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
            Parents can submit their budget cap, debt comfort, and relocation preferences privately without conflict.
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {invitationUrl}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="alignx-key"
          style={{ padding: '10px 18px' }}
        >
          {copiedLink ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
          <span>{copiedLink ? 'LINK COPIED' : 'COPY PARENT LINK'}</span>
        </button>
      </div>

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
              FRICTION: {conflictIndex}% (HIGH CONSENSUS)
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              Strong structural cohesion. Slight divergence in educational debt tolerance vs upfront starting compensation.
            </p>
          </div>

          <div
            style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '14px 18px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <ShieldCheck size={22} color="var(--accent)" />
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>RECONCILIATION STATUS</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600, color: '#10B981' }}>
                SOLVABLE WITHOUT DEBT STRESS
              </div>
            </div>
          </div>
        </div>

        {/* Cohesion Meter */}
        <div style={{ height: '4px', backgroundColor: 'var(--border-hairline)', width: '100%', marginBottom: '10px', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${100 - conflictIndex}%`, backgroundColor: 'var(--accent)', transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <span>FAMILY ALIGNMENT: {100 - conflictIndex}% (EXCELLENT)</span>
          <span>DIVERGENCE: {conflictIndex}% (OPTIMIZATION SURFACE)</span>
        </div>
      </div>

      {/* Parent Cards Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--text-secondary)' }}>
          CAPTURED HOUSEHOLD PROFILES ({parents.length})
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="alignx-key"
          style={{ padding: '7px 14px', fontSize: '0.72rem' }}
        >
          <Plus size={13} />
          <span>ADD GUARDIAN RECORD</span>
        </button>
      </div>

      {/* Parent Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {parents.map((p, i) => (
          <div
            key={i}
            className="titanium-card"
            style={{
              padding: '26px',
              border: '1px solid var(--border-hairline)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {p.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)' }}>
                    {p.relation.toUpperCase()}
                  </div>
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    padding: '3px 8px',
                    borderRadius: '980px',
                    border: '1px solid var(--accent-border)',
                    backgroundColor: 'rgba(197, 155, 109, 0.1)',
                    color: 'var(--accent-light)'
                  }}
                >
                  {p.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '14px 0', borderTop: '1px solid var(--border-hairline)', paddingTop: '14px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>ANNUAL BUDGET CAP</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>₹{p.maxBudgetAnnualLakhs}L / YR</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>PRIMARY DESIRED OUTCOME</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{p.priorityFocus}</div>
                </div>
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                DELIBERATION CONSTRAINTS:
              </div>
              <ul style={{ paddingLeft: '16px', fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                {p.conflictPoints.map((pt, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Add Parent Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            className="titanium-card"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '36px',
              border: '1px solid var(--accent-border)'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, marginBottom: '20px', letterSpacing: '-0.02em' }}>
              Add Guardian Constraint Vector
            </h3>

            <form onSubmit={handleAddParent} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    RELATION
                  </label>
                  <select
                    value={newRelation}
                    onChange={e => setNewRelation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Sponsor">Sponsor</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    BUDGET CAP (₹ LAKHS/YR)
                  </label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={e => setNewBudget(Number(e.target.value))}
                    min="2"
                    max="60"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  PREFERRED CAREER ORIENTATION
                </label>
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  <option value="Stability">Long-Term Stability & Pedigree</option>
                  <option value="High Growth">High Growth & Emergent Technology</option>
                  <option value="Immediate ROI">Immediate Break-Even & Fast ROI</option>
                  <option value="Work-Life Balance">Sustainable Work-Life Balance</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="alignx-key"
                  style={{ padding: '10px 16px' }}
                >
                  CANCEL
                </button>
                <RollButton type="submit" variant="primary">
                  SAVE RECORD
                </RollButton>
              </div>
            </form>
          </div>
        </div>
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
            <CheckCircle2 size={15} color="var(--accent)" />
            <span>HOUSEHOLD CONSTRAINTS RECONCILED WITH 5D WEIGHTING PROTOCOL</span>
          </div>
        </div>

        <RollButton
          onClick={handleSaveAndContinue}
          variant="primary"
          icon={<ArrowRight size={16} />}
        >
          SYNTHESIZE 5D DECISION DASHBOARD
        </RollButton>
      </div>
    </div>
  );
};
