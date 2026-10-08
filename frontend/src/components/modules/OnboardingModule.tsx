import React, { useState } from 'react';
import type { LifeStage, StudentProfile } from '../../types/alignx';
import { RollButton } from '../RollButton';
import { saveSessionProgress, getSessionProgress } from '../../utils/sessionManager';
import { ApiService } from '../../services/api';
import { ArrowRight, Check } from 'lucide-react';

interface OnboardingModuleProps {
  onComplete: (profile: StudentProfile) => void;
  currentUser?: { id: string; name: string; email: string } | null;
  onRequireAuth?: () => void;
  draftProfile?: StudentProfile;
  onUpdateDraft?: (profileUpdates: Partial<StudentProfile>) => void;
}

export const OnboardingModule: React.FC<OnboardingModuleProps> = ({
  onComplete,
  currentUser,
  onRequireAuth,
  draftProfile,
  onUpdateDraft
}) => {
  const [name, setName] = useState(draftProfile?.name || currentUser?.name || 'Daksh');
  const [stage, setStage] = useState<LifeStage>(draftProfile?.stage || 'ug');
  const [currentField, setCurrentField] = useState(draftProfile?.currentField || 'Computer Science & Engineering');
  const [location, setLocation] = useState(draftProfile?.location || 'Chennai / Vellore');
  const [budgetAnnualLakhs, setBudgetAnnualLakhs] = useState<number>(draftProfile?.budgetAnnualLakhs ?? 12);
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'moderate' | 'high'>(draftProfile?.riskTolerance || 'moderate');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    draftProfile?.interests && draftProfile.interests.length > 0
      ? draftProfile.interests
      : [
          'Artificial Intelligence',
          'Hardware & Silicon Systems',
          'Quantitative Algorithms'
        ]
  );
  const [selectedAspirations, setSelectedAspirations] = useState<string[]>(
    draftProfile?.aspirations && draftProfile.aspirations.length > 0
      ? draftProfile.aspirations
      : [
          'Architect frontier technology systems',
          'Attain early financial leverage'
        ]
  );

  // Sync state if draftProfile changes externally
  React.useEffect(() => {
    if (draftProfile) {
      if (draftProfile.name !== undefined) setName(draftProfile.name);
      if (draftProfile.stage !== undefined) setStage(draftProfile.stage);
      if (draftProfile.currentField !== undefined) setCurrentField(draftProfile.currentField);
      if (draftProfile.location !== undefined) setLocation(draftProfile.location);
      if (draftProfile.budgetAnnualLakhs !== undefined) setBudgetAnnualLakhs(draftProfile.budgetAnnualLakhs);
      if (draftProfile.riskTolerance !== undefined) setRiskTolerance(draftProfile.riskTolerance);
      if (draftProfile.interests !== undefined) setSelectedInterests(draftProfile.interests);
      if (draftProfile.aspirations !== undefined) setSelectedAspirations(draftProfile.aspirations);
    }
  }, [draftProfile]);

  const interestOptions = [
    'Artificial Intelligence',
    'Hardware & Silicon Systems',
    'Quantitative Algorithms',
    'Autonomous Robotics',
    'Cybersecurity & Defense',
    'CleanTech & Energy Systems',
    'Biocomputing',
    'Cloud Distributed Systems'
  ];

  const aspirationOptions = [
    'Architect frontier technology systems',
    'Attain early financial leverage',
    'Lead high-impact R&D laboratory',
    'Build an independent venture / startup',
    'Secure prestigious global placement'
  ];

  const handleNameChange = (val: string) => {
    setName(val);
    onUpdateDraft?.({ name: val });
  };

  const handleStageChange = (val: LifeStage) => {
    setStage(val);
    onUpdateDraft?.({ stage: val });
  };

  const handleFieldChange = (val: string) => {
    setCurrentField(val);
    onUpdateDraft?.({ currentField: val });
  };

  const handleLocationChange = (val: string) => {
    setLocation(val);
    onUpdateDraft?.({ location: val });
  };

  const handleBudgetChange = (val: number) => {
    setBudgetAnnualLakhs(val);
    onUpdateDraft?.({ budgetAnnualLakhs: val });
  };

  const handleRiskChange = (val: 'low' | 'moderate' | 'high') => {
    setRiskTolerance(val);
    onUpdateDraft?.({ riskTolerance: val });
  };

  const toggleInterest = (item: string) => {
    const updated = selectedInterests.includes(item)
      ? selectedInterests.filter(i => i !== item)
      : [...selectedInterests, item];
    setSelectedInterests(updated);
    onUpdateDraft?.({ interests: updated });
  };

  const toggleAspiration = (item: string) => {
    const updated = selectedAspirations.includes(item)
      ? selectedAspirations.filter(i => i !== item)
      : [...selectedAspirations, item];
    setSelectedAspirations(updated);
    onUpdateDraft?.({ aspirations: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser && onRequireAuth) {
      onRequireAuth();
      return;
    }
    const profile: StudentProfile = {
      name,
      stage,
      currentField,
      location,
      preferredLocations: ['Bangalore', 'Chennai', 'Singapore'],
      budgetAnnualLakhs,
      riskTolerance,
      aspirations: selectedAspirations,
      interests: selectedInterests
    };

    saveSessionProgress({
      lastActiveView: 'discovery',
      studentProfile: profile,
      completedStages: {
        ...getSessionProgress().completedStages,
        onboarding: true
      }
    });

    // Synchronize profile with backend asynchronously
    ApiService.updateStudentProfile({
      name: profile.name,
      educationLevel: profile.stage === 'class10' ? 'Class 10' : profile.stage === 'class12' ? 'Class 12' : 'Undergraduate',
      location: profile.location,
      preferredLocations: profile.preferredLocations,
      budgetAnnualLakhs: profile.budgetAnnualLakhs,
      goals: profile.aspirations,
      interests: profile.interests
    }).catch(err => {
      console.warn('[ALIGNX Onboarding] Backend profile sync note:', err);
    });

    onComplete(profile);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 24px' }}>
      <div style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '24px', marginBottom: '36px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', color: 'var(--accent)' }}>
          PHASE 02 / PROTOCOL INITIALIZATION
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '8px 0 12px'
          }}
        >
          STUDENT PROFILE & ONBOARDING
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Calibrate your academic foundation, financial reality, and intellectual inclinations to prime the ALIGNX Decision Engine.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
        {/* Step 1: Identity & Life Stage */}
        <div className="titanium-card" style={{ padding: '32px', borderRadius: '14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.18em', marginBottom: '16px' }}>
            01 / IDENTITY & LIFE STAGE
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                FULL NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-deep)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                CURRENT ACADEMIC DISCIPLINE / PROGRAM
              </label>
              <input
                type="text"
                value={currentField}
                onChange={e => handleFieldChange(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-deep)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                CURRENT LOCATION / CAMPUS
              </label>
              <input
                type="text"
                value={location}
                onChange={e => handleLocationChange(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-deep)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            SELECT CURRENT LIFE STAGE
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
            {[
              { id: 'class10' as LifeStage, label: 'Class 10', desc: 'Stream & foundation' },
              { id: 'class12' as LifeStage, label: 'Class 12', desc: 'Degrees & entrance' },
              { id: 'ug' as LifeStage, label: 'Undergraduate', desc: 'Specializations' },
              { id: 'pg' as LifeStage, label: 'Postgraduate', desc: 'R&D vs management' },
              { id: 'professional' as LifeStage, label: 'Working Pro', desc: 'Career pivot' }
            ].map(item => (
              <div
                key={item.id}
                onClick={() => handleStageChange(item.id)}
                className={`alignx-key ${stage === item.id ? 'active' : ''}`}
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  height: 'auto'
                }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: stage === item.id ? 'var(--accent-light)' : 'var(--text-primary)' }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '0' }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Financial Realities & Risk */}
        <div className="titanium-card" style={{ padding: '32px', borderRadius: '14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.18em', marginBottom: '16px' }}>
            02 / REALITY & CONSTRAINTS
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  ANNUAL EDUCATION BUDGET CEILING
                </label>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                  ₹{budgetAnnualLakhs} Lakhs / Year
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="35"
                step="1"
                value={budgetAnnualLakhs}
                onChange={e => handleBudgetChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>₹2L (Public / State)</span>
                <span>₹18L (Tier-1 Tech)</span>
                <span>₹35L (Overseas / Private)</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                RISK APPETITE
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {(['low', 'moderate', 'high'] as const).map(level => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => handleRiskChange(level)}
                    className={`alignx-key ${riskTolerance === level ? 'active' : ''}`}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {level.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Interests & Aspirations */}
        <div className="titanium-card" style={{ padding: '32px', borderRadius: '14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.18em', marginBottom: '16px' }}>
            03 / TECHNICAL INCLINATIONS & AMBITIONS
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              SELECT KEY INTEREST AREAS
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {interestOptions.map(item => {
                const isSelected = selectedInterests.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleInterest(item)}
                    className={`alignx-key ${isSelected ? 'active' : ''}`}
                  >
                    {isSelected && <Check size={13} color="var(--accent)" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              PRIMARY ASPIRATIONAL FOCUS
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {aspirationOptions.map(item => {
                const isSelected = selectedAspirations.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleAspiration(item)}
                    className={`alignx-key ${isSelected ? 'active' : ''}`}
                  >
                    {isSelected && <Check size={13} color="var(--accent)" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
          <RollButton type="submit" variant="primary" icon={<ArrowRight size={15} />}>
            SAVE PROFILE & ENTER DISCOVERY
          </RollButton>
        </div>
      </form>
    </div>
  );
};
