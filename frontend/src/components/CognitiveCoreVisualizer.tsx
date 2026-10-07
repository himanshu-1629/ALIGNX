import React, { useState } from 'react';
import { Cpu, Zap, Target, Shield, Globe } from 'lucide-react';

interface CognitiveDimension {
  id: string;
  name: string;
  score: number;
  pole: string;
  tagline: string;
  icon: React.ReactNode;
  angle: number; // in degrees for radar plot
}

const DIMENSIONS: CognitiveDimension[] = [
  {
    id: 'aptitude',
    name: 'Algorithmic Logic',
    score: 82,
    pole: 'COGNITIVE DEPTH',
    tagline: 'High facility with recursive structures & spatial kinematics.',
    icon: <Cpu size={14} />,
    angle: 0
  },
  {
    id: 'synthesis',
    name: 'Hardware-Software Synthesis',
    score: 74,
    pole: 'INTEREST VECTOR',
    tagline: 'Inclined towards physical compute & embedded execution.',
    icon: <Zap size={14} />,
    angle: 72
  },
  {
    id: 'aspiration',
    name: 'Frontier Ambition',
    score: 91,
    pole: 'DRIVE COEFFICIENT',
    tagline: 'High leverage preference for core tech infrastructure.',
    icon: <Target size={14} />,
    angle: 144
  },
  {
    id: 'risk',
    name: 'Risk Calibration',
    score: 43,
    pole: 'DECISION PROFILE',
    tagline: 'Prudent, structured tolerance for bounded asymmetric bets.',
    icon: <Shield size={14} />,
    angle: 216
  },
  {
    id: 'mobility',
    name: 'Global Mobility',
    score: 88,
    pole: 'CORRIDOR AGILITY',
    tagline: 'Seamless readiness for national & APAC regional relocation.',
    icon: <Globe size={14} />,
    angle: 288
  }
];

export const CognitiveCoreVisualizer: React.FC = () => {
  const [activeDimId, setActiveDimId] = useState<string>('aptitude');
  const activeDim = DIMENSIONS.find((d) => d.id === activeDimId) || DIMENSIONS[0];

  // Radar geometry calculations (center at 200, 200; radius 130)
  const cx = 200;
  const cy = 200;
  const maxR = 135;

  const getCoordinates = (angleDeg: number, radius: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad)
    };
  };

  // Polygon points based on scores
  const polyPoints = DIMENSIONS.map((d) => {
    const r = (d.score / 100) * maxR;
    const pt = getCoordinates(d.angle, r);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '40px',
        alignItems: 'center',
        padding: '36px',
        borderRadius: '0px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-hairline)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.05)'
      }}
      className="scroll-reveal-scale responsive-stack"
    >
      {/* Left: The Signature Radar Gyroscope */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          minHeight: '420px'
        }}
      >
        <svg
          viewBox="0 0 400 400"
          style={{ width: '100%', maxWidth: '380px', height: 'auto', overflow: 'visible' }}
        >
          <defs>
            <radialGradient id="radarMesh" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(45, 90, 67, 0.22)" />
              <stop offset="100%" stopColor="rgba(45, 90, 67, 0.04)" />
            </radialGradient>
          </defs>

          {/* Background Concentric Radar Rings (20%, 40%, 60%, 80%, 100%) */}
          {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={maxR * level}
              fill="none"
              stroke="rgba(0, 0, 0, 0.08)"
              strokeDasharray={level === 1.0 ? 'none' : '3 3'}
              strokeWidth="1"
            />
          ))}

          {/* Radial Spokes */}
          {DIMENSIONS.map((d) => {
            const edge = getCoordinates(d.angle, maxR);
            return (
              <line
                key={d.id}
                x1={cx}
                y1={cy}
                x2={edge.x}
                y2={edge.y}
                stroke="rgba(0, 0, 0, 0.1)"
                strokeWidth="1"
              />
            );
          })}

          {/* Dynamic Cognitive Polygon Mesh */}
          <polygon
            points={polyPoints}
            fill="url(#radarMesh)"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Interactive Dimension Nodes on the Polygon */}
          {DIMENSIONS.map((d) => {
            const r = (d.score / 100) * maxR;
            const pt = getCoordinates(d.angle, r);
            const isSelected = activeDimId === d.id;

            return (
              <g
                key={d.id}
                onClick={() => setActiveDimId(d.id)}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
                {isSelected && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="12"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1"
                    className="animate-pulse-subtle"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? '#FFFFFF' : 'var(--accent)'}
                  stroke={isSelected ? 'var(--accent)' : '#000000'}
                  strokeWidth="2"
                />

                {/* Score Marker */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fill={isSelected ? '#FFFFFF' : 'var(--text-secondary)'}
                  fontFamily="var(--font-mono)"
                  fontSize="11"
                  fontWeight="600"
                >
                  {d.score}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Gyroscope Bottom Footnote */}
        <div
          style={{
            marginTop: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
            textAlign: 'center'
          }}
        >
          INTERACTIVE 5-AXIS COGNITIVE TENSOR MATRIX
        </div>
      </div>

      {/* Right: Modern Scannable Telemetry Cards (NO wall of text) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', color: 'var(--accent)', marginBottom: '8px' }}>
            ACTIVE VECTOR ANALYSIS
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            {activeDim.name}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '8px' }}>
            {activeDim.tagline}
          </p>
        </div>

        {/* 5 Tactile Key Controls for Fast Inspection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          {DIMENSIONS.map((d) => {
            const isSelected = activeDimId === d.id;
            return (
              <div
                key={d.id}
                onClick={() => setActiveDimId(d.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '0px',
                  backgroundColor: isSelected ? 'rgba(45, 90, 67, 0.09)' : 'var(--bg-panel)',
                  border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-hairline)',
                  cursor: 'pointer',
                  transition: 'all 0.18s var(--ease-apple)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: isSelected ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {d.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.76rem',
                      letterSpacing: '0.06em',
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: isSelected ? 600 : 400
                    }}
                  >
                    {d.name.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Micro Progress Bar */}
                  <div style={{ width: '64px', height: '4px', backgroundColor: 'rgba(0, 0, 0, 0.06)', borderRadius: '0px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${d.score}%`,
                        height: '100%',
                        backgroundColor: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                        borderRadius: '0px'
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: isSelected ? 'var(--accent)' : 'var(--text-primary)'
                    }}
                  >
                    {d.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
