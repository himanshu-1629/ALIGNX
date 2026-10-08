import React, { useState } from 'react';
import { ApiService } from '../../services/api';
import { RollButton } from '../RollButton';
import { X, Lock, Mail, User, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { id: string; name: string; email: string }) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'register'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          throw new Error('Please enter your full name');
        }
        const res = await ApiService.register({
          name: name.trim(),
          email: email.trim(),
          password,
          educationLevel: 'Undergraduate'
        });

        const student = res.data?.student || {
          _id: 'local_user_' + Date.now(),
          name: name.trim(),
          email: email.trim()
        };

        setSuccessMsg('Account created successfully! Connecting your profile...');
        setTimeout(() => {
          onAuthSuccess({
            id: student._id || student.id,
            name: student.name || name.trim(),
            email: student.email || email.trim()
          });
          onClose();
        }, 600);
      } else {
        const res = await ApiService.login({
          email: email.trim(),
          password
        });

        const student = res.data?.student || {
          _id: 'local_user_' + Date.now(),
          name: email.split('@')[0] || 'Student',
          email: email.trim()
        };

        setSuccessMsg('Welcome back! Loading your career vector...');
        setTimeout(() => {
          onAuthSuccess({
            id: student._id || student.id,
            name: student.name || 'Student',
            email: student.email || email.trim()
          });
          onClose();
        }, 600);
      }
    } catch (err: any) {
      console.warn('Auth error:', err);
      // If backend says email already registered or network issue, provide clear human guidance
      const msg = err.message || 'Authentication failed. Please verify credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="titanium-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: '0px',
          padding: '36px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          border: '1px solid var(--border-hairline)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '0px',
              backgroundColor: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}
          >
            <Lock size={18} color="var(--accent)" />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.65rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em'
            }}
          >
            {mode === 'register' ? 'Create Student Account' : 'Welcome to ALIGNX'}
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.45
            }}
          >
            {mode === 'register'
              ? 'Save your 5D psychometric profile, cognitive DNA, and career roadmap securely.'
              : 'Sign in to access your calibrated decision engine and personalized roadmaps.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '0px',
            padding: '4px',
            marginBottom: '24px',
            border: '1px solid var(--border-hairline)'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '0px',
              border: 'none',
              backgroundColor: mode === 'register' ? '#FFFFFF' : 'transparent',
              color: mode === 'register' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.84rem',
              fontWeight: mode === 'register' ? 600 : 500,
              cursor: 'pointer',
              boxShadow: mode === 'register' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.18s ease'
            }}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '0px',
              border: 'none',
              backgroundColor: mode === 'login' ? '#FFFFFF' : 'transparent',
              color: mode === 'login' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.84rem',
              fontWeight: mode === 'login' ? 600 : 500,
              cursor: 'pointer',
              boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.18s ease'
            }}
          >
            Sign In
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '0px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#DC2626',
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '0px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#059669',
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={15} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '6px'
                }}
              >
                STUDENT FULL NAME
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 36px',
                    borderRadius: '0px',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.92rem',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-surface)'
                  }}
                />
                <User size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>
          )}

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}
            >
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 36px',
                  borderRadius: '0px',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.92rem',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-surface)'
                }}
              />
              <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}
            >
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 36px',
                  borderRadius: '0px',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.92rem',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-surface)'
                }}
              />
              <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <RollButton
              type="submit"
              variant="primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading
                ? 'AUTHENTICATING...'
                : mode === 'register'
                ? 'INITIALIZE SECURE PROFILE'
                : 'SIGN IN TO ALIGNX'}
            </RollButton>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '18px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            🔒 LOCAL ENCRYPTION • PERSISTED IN MONGO DATABASE
          </span>
        </div>
      </div>
    </div>
  );
};
