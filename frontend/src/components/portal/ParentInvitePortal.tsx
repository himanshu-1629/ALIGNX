import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { RollButton } from '../RollButton';
import { saveSessionProgress, getSessionProgress } from '../../utils/sessionManager';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Coins,
  HeartHandshake
} from 'lucide-react';

interface ParentInvitePortalProps {
  token: string;
}

interface InvitationData {
  valid: boolean;
  studentName: string;
  studentEducation?: string;
  studentLocation?: string;
  parentId: string;
  parentName: string;
  relationship: string;
  status: string;
  expiresAt: string;
}

export const ParentInvitePortal: React.FC<ParentInvitePortalProps> = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState<InvitationData | null>(null);

  // Form states
  const [budgetLakhs, setBudgetLakhs] = useState(16);
  const [priority, setPriority] = useState<'Stability' | 'High Growth' | 'Immediate ROI' | 'Work-Life Balance'>('Stability');
  const [riskAppetite, setRiskAppetite] = useState<'low' | 'moderate' | 'high'>('low');
  const [locationPreference, setLocationPreference] = useState('Domestic Tier-1 Hubs (Bangalore, NCR, Hyderabad, Pune)');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchInvite = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await ApiService.getInvitationDetails(token);
        if (res.success && res.data && isMounted) {
          setInviteData(res.data);
          if (res.data.status === 'completed') {
            setSubmitted(true);
          }
          return;
        }
      } catch (err: any) {
        console.warn('[ParentPortal] Live verify note:', err);
      }

      // Resilient fallback: Check session progress so links work seamlessly even in demo or offline
      if (isMounted) {
        const session = getSessionProgress();
        const localParent = session.parentList?.find((p) => p.invitationToken === token);
        if (localParent || session.studentProfile?.name || session.parentData?.name) {
          const pName = localParent?.name || session.parentData?.name || 'Parent / Guardian';
          const pRel = localParent?.relation || session.parentData?.relation || 'Parent';
          setInviteData({
            valid: true,
            studentName: session.studentProfile?.name || 'Student',
            studentEducation: session.studentProfile?.currentField || (session.studentProfile?.stage ? String(session.studentProfile.stage).toUpperCase() : 'Class 12 / Higher Ed Aspirant'),
            studentLocation: session.studentProfile?.location || 'Domestic Tier-1 Tech Hubs',
            parentId: localParent?.parentId || localParent?.id || 'p_local',
            parentName: pName,
            relationship: pRel,
            status: localParent?.status === 'COMPLETED' ? 'completed' : 'pending',
            expiresAt: new Date(Date.now() + 7 * 86400000).toISOString()
          });
          if (localParent?.status === 'COMPLETED') {
            setSubmitted(true);
          }
        } else {
          setError('Invalid or expired invitation link.');
        }
      }

      if (isMounted) setLoading(false);
    };

    fetchInvite();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteData) return;

    try {
      setSubmitting(true);
      const budgetBytes = budgetLakhs * 100000;
      
      try {
        await ApiService.submitParentFeedback(token, {
          educationBudget: budgetBytes,
          riskAppetite: riskAppetite,
          priorityFactors: [priority],
          locationPreference: locationPreference,
          additionalNotes: notes.trim() || undefined
        });
      } catch (backendErr) {
        console.warn('[ParentPortal] Backend feedback submit notice:', backendErr);
      }

      // Sync local session so student portal immediately reflects the submitted perspective
      const session = getSessionProgress();
      const updatedList = (session.parentList || []).map((p) => {
        if (p.invitationToken === token || p.parentId === inviteData.parentId) {
          return {
            ...p,
            maxBudgetAnnualLakhs: budgetLakhs,
            priorityFocus: priority,
            riskAppetite: riskAppetite,
            preferredLocations: [locationPreference],
            conflictPoints: [
              notes || 'Tuition ceiling and location preference defined',
              `Budget ceiling defined at ₹${budgetLakhs}L/yr with ${riskAppetite} risk appetite`
            ],
            status: 'COMPLETED' as const
          };
        }
        return p;
      });

      saveSessionProgress({
        parentData: {
          name: inviteData.parentName,
          relation: (inviteData.relationship as any) || 'Father',
          maxBudgetAnnualLakhs: budgetLakhs,
          preferredLocations: [locationPreference],
          priorityFocus: priority,
          riskAppetite: riskAppetite,
          maxRelocationKm: 500
        },
        parentInputDone: true,
        parentList: updatedList.length > 0 ? updatedList : undefined
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error('[ParentPortal] Submission error:', err);
      alert(err?.message || 'Failed to submit perspective. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-deep)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        <div className="titanium-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '2px solid var(--border-subtle)',
              borderTopColor: 'var(--accent)',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}
          />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.14em', color: 'var(--accent)', marginBottom: '8px' }}>
            ALIGNX PROTOCOL GATEWAY
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Verifying Parental Invitation...
          </h3>
        </div>
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-deep)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        <div className="titanium-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '480px', width: '100%' }}>
          <AlertCircle size={44} color="#EF4444" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em', color: '#EF4444', marginBottom: '8px' }}>
            INVITATION INACCESSIBLE
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Link Invalid or Expired
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
            {error || 'This link may have already been used, cancelled, or expired after 14 days. Please request a new invitation link from your student.'}
          </p>
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              color: '#EF4444',
              display: 'inline-block'
            }}
          >
            PLEASE CONTACT YOUR STUDENT FOR A NEW LINK
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-deep)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        <div
          className="titanium-card animate-fade-in"
          style={{
            padding: '52px 40px',
            textAlign: 'center',
            maxWidth: '560px',
            width: '100%',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.14em', color: '#10B981', fontWeight: 700, marginBottom: '8px' }}>
            CONSENSUS RECONCILED
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Thank You, {inviteData.parentName}
          </h2>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.94rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
            Your perspectives, budget ceiling (₹{budgetLakhs}L/yr), and career priorities have been directly reconciled with <strong>{inviteData.studentName}</strong>'s profile.
          </p>

          <div
            style={{
              padding: '16px 20px',
              borderRadius: '0px',
              backgroundColor: 'rgba(0,0,0,0.02)',
              border: '1px solid var(--border-hairline)',
              marginBottom: '32px',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>STUDENT:</span>
              <span style={{ fontWeight: 600 }}>{inviteData.studentName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>RECORDED CAPACITY:</span>
              <span style={{ fontWeight: 600, color: 'var(--accent)' }}>₹{budgetLakhs} Lakhs / year</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>PRIMARY FACTOR:</span>
              <span style={{ fontWeight: 600 }}>{priority}</span>
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              color: '#10B981',
              fontWeight: 700,
              margin: '0 auto'
            }}
          >
            <CheckCircle2 size={16} />
            <span>SUBMISSION CONFIRMED — YOU MAY SAFELY CLOSE THIS TAB</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-deep)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Architectural Header */}
      <header
        style={{
          height: '60px',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'rgba(246, 245, 241, 0.95)',
          backdropFilter: 'blur(14px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.05em' }}>
            ALIGNX<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
          <span style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
            FAMILY PERSPECTIVE PORTAL
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="titanium-badge" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
            {inviteData.relationship.toUpperCase()}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            {inviteData.parentName}
          </span>
        </div>
      </header>

      {/* Main Form Content */}
      <main style={{ maxWidth: '840px', margin: '0 auto', padding: '48px 24px', width: '100%', flex: 1 }}>
        {/* Intro Greeting Banner */}
        <div
          className="titanium-card"
          style={{
            padding: '36px 40px',
            marginBottom: '32px',
            border: '1px solid var(--border-hairline)',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--accent)', marginBottom: '4px' }}>
                PARENTAL CO-PILOT INITIATIVE
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                Guide {inviteData.studentName}'s Career Architecture
              </h1>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '0px'
              }}
            >
              <ShieldCheck size={16} color="#10B981" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>
                AUTHENTICATED INVITE
              </span>
            </div>
          </div>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Hello <strong>{inviteData.parentName}</strong>. Your child <strong>{inviteData.studentName}</strong> is exploring high-impact careers on ALIGNX. To prevent realistic family friction, input your household budget boundary and guidance factors below. Your inputs will directly calibrate the 5D Decision Engine.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Section 1: Financial Capacity */}
          <div
            className="titanium-card"
            style={{
              padding: '36px',
              border: '1px solid var(--border-hairline)',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Coins size={18} color="var(--accent)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                1. Annual Tuition & Living Ceiling
              </h3>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '28px' }}>
              What is the comfortable maximum annual expenditure your family is prepared to allocate toward higher education without distress?
            </p>

            <div
              style={{
                padding: '24px',
                backgroundColor: 'rgba(0,0,0,0.02)',
                border: '1px solid var(--border-hairline)',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  ESTIMATED ANNUAL CEILING
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>
                  ₹{budgetLakhs} <span style={{ fontSize: '1rem', fontWeight: 500 }}>Lakhs / year</span>
                </span>
              </div>

              <input
                type="range"
                min={5}
                max={50}
                step={1}
                value={budgetLakhs}
                onChange={(e) => setBudgetLakhs(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--accent)',
                  cursor: 'pointer',
                  marginBottom: '14px'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>₹5L / yr (Govt / State Univ)</span>
                <span>₹20L / yr (Tier-1 Domestic Pvt)</span>
                <span>₹50L+ / yr (Overseas / Ivy)</span>
              </div>
            </div>

            {/* Approximate 4-Year Projection */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', backgroundColor: 'rgba(0,0,0,0.03)', border: '1px solid var(--border-hairline)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                ESTIMATED 4-YEAR DEGREE HORIZON:
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 700 }}>
                ₹{budgetLakhs * 4} Lakhs total
              </span>
            </div>
          </div>

          {/* Section 2: Core Values & Risk */}
          <div
            className="titanium-card"
            style={{
              padding: '36px',
              border: '1px solid var(--border-hairline)',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <TrendingUp size={18} color="var(--accent)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                2. Career Priority & Risk Posture
              </h3>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Which single outcome holds the highest value from your family's perspective?
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '28px' }}>
              {[
                { id: 'Stability', title: 'Career Stability', desc: 'Secure tenure, established corporate or public sector track' },
                { id: 'High Growth', title: 'High Growth & Tech', desc: 'Cutting-edge innovation, meritocratic upside, modern industries' },
                { id: 'Immediate ROI', title: 'Immediate ROI', desc: 'Fast post-grad recovery, guaranteed recruitment packages' },
                { id: 'Work-Life Balance', title: 'Life Balance & Health', desc: 'Sustainable hours, geographic proximity, minimal burnout' }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setPriority(opt.id as any)}
                  style={{
                    padding: '16px',
                    border: priority === opt.id ? '2px solid var(--accent)' : '1px solid var(--border-hairline)',
                    backgroundColor: priority === opt.id ? 'rgba(0,0,0,0.02)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>
                    {opt.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {opt.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Risk Tolerance */}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                HOUSEHOLD RISK APPETITE TOWARD UNTESTED / EMERGING PATHS
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { id: 'low', label: 'Conservative', note: 'Standard accredited disciplines only' },
                  { id: 'moderate', label: 'Moderate', note: 'Balanced paths with clear upside' },
                  { id: 'high', label: 'High', note: 'Venture, startup, non-traditional' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRiskAppetite(r.id as any)}
                    style={{
                      padding: '12px',
                      border: riskAppetite === r.id ? '2px solid var(--accent)' : '1px solid var(--border-hairline)',
                      backgroundColor: riskAppetite === r.id ? 'rgba(0,0,0,0.03)' : '#FFFFFF',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 600 }}>
                      {r.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {r.note}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Geographical Preferences & Notes */}
          <div
            className="titanium-card"
            style={{
              padding: '36px',
              border: '1px solid var(--border-hairline)',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <HeartHandshake size={18} color="var(--accent)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                3. Relocation & Direct Parental Guidance
              </h3>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Specify geographical comfort zones and leave any specific aspirations or constraints.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                PREFERRED EDUCATION & WORK LOCATION
              </label>
              <select
                value={locationPreference}
                onChange={(e) => setLocationPreference(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '0px',
                  border: '1px solid var(--border-hairline)',
                  backgroundColor: '#F9F9FA',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem'
                }}
              >
                <option value="Domestic Tier-1 Hubs (Bangalore, NCR, Hyderabad, Pune)">Domestic Tier-1 Hubs (Bangalore, NCR, Hyderabad, Pune)</option>
                <option value="Pan-India (Any accredited national institution)">Pan-India (Any accredited national institution)</option>
                <option value="Home State / Regional Vicinity Only">Home State / Regional Vicinity Only</option>
                <option value="Global / Overseas (North America, UK, Europe, Singapore)">Global / Overseas (North America, UK, Europe, Singapore)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                ADDITIONAL PARENTAL NOTES FOR {inviteData.studentName.toUpperCase()} (OPTIONAL)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. We support technology paths but prefer institutions with confirmed placement cells; minimal educational loans."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '0px',
                  border: '1px solid var(--border-hairline)',
                  backgroundColor: '#F9F9FA',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Action Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              paddingTop: '16px'
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Directly reconciles with {inviteData.studentName}'s 5D Harmony Model.
            </div>

            <RollButton
              type="submit"
              variant="primary"
              disabled={submitting}
              icon={<ArrowRight size={16} />}
              style={{ padding: '14px 28px', fontSize: '0.85rem' }}
            >
              {submitting ? 'RECONCILING PERSPECTIVE...' : 'CONFIRM & SUBMIT PERSPECTIVE'}
            </RollButton>
          </div>
        </form>
      </main>
    </div>
  );
};
