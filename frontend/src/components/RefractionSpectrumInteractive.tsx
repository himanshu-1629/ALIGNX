import React, { useState } from 'react';
import { AlignxCanvas } from './AlignxCanvas';
import { Sparkles } from 'lucide-react';

interface CareerSpectrum {
  wavelength: string;
  field: string;
  fitScore: number;
  color: string;
  marketDemand: string;
}

const SPECTRUM_DATA: CareerSpectrum[] = [
  { wavelength: '380nm (DEEP ULTRAVIOLET)', field: 'Neural Compute & AI Architecture', fitScore: 94, color: '#DFC09A', marketDemand: '+44% YoY' },
  { wavelength: '480nm (CYAN HARMONIC)', field: 'High-Frequency Quantitative Systems', fitScore: 89, color: '#C59B6D', marketDemand: '+36% YoY' },
  { wavelength: '540nm (OPTICAL EMERALD)', field: 'Embedded Robotics & Physical Syntheses', fitScore: 85, color: '#A97C4E', marketDemand: '+28% YoY' },
  { wavelength: '590nm (METALLIC AMBER)', field: 'Distributed Cloud Platforms & Core OS', fitScore: 91, color: '#D4A373', marketDemand: '+32% YoY' },
  { wavelength: '650nm (INFRARED CORE)', field: 'Technological Venture & Systems Strategy', fitScore: 82, color: '#B88959', marketDemand: '+24% YoY' }
];

export const RefractionSpectrumInteractive: React.FC = () => {
  const [refractionAngle, setRefractionAngle] = useState<number>(45);
  const [selectedSpectrumIdx, setSelectedSpectrumIdx] = useState<number>(0);

  const activeSpectrum = SPECTRUM_DATA[selectedSpectrumIdx];

  return (
    <div
      style={{
        border: '1px solid var(--border-hairline)',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)'
      }}
      className="scroll-reveal-scale"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          minHeight: '440px'
        }}
        className="responsive-stack"
      >
        {/* Left: 3D Refractive Prism Canvas with Dynamic Spectral Overlay */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#FFFFFF',
            borderRight: '1px solid var(--border-hairline)',
            minHeight: '380px'
          }}
        >
          <AlignxCanvas scrollProgress={refractionAngle / 100} />

          {/* Interactive Refractive Angle Selector */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(16px)',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-hairline)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} color="var(--accent)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--text-primary)' }}>
                DISPERSION ANGLE: {refractionAngle}°
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {[30, 45, 60, 75].map((angle) => (
                <button
                  key={angle}
                  onClick={() => setRefractionAngle(angle)}
                  className={`alignx-key ${refractionAngle === angle ? 'active' : ''}`}
                  style={{ fontSize: '0.68rem', padding: '4px 8px' }}
                >
                  {angle}°
                </button>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em'
            }}
          >
            FIG 2.1 — MATHEMATICAL PRISM DECOMPOSITION OF STUDENT CAPABILITY
          </div>
        </div>

        {/* Right: Spectral Band Selector (Scannable Cards) */}
        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px'
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.16em', color: 'var(--accent)', marginBottom: '8px' }}>
              SPECTRAL BAND {selectedSpectrumIdx + 1} OF 5
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
              {activeSpectrum.field}
            </h3>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {activeSpectrum.wavelength} • FIT ALIGNMENT: <strong style={{ color: 'var(--accent)' }}>{activeSpectrum.fitScore}%</strong>
            </div>
          </div>

          {/* 5 Spectrum Selector Keys */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SPECTRUM_DATA.map((spec, i) => {
              const isSelected = selectedSpectrumIdx === i;
              return (
                <div
                  key={i}
                  onClick={() => setSelectedSpectrumIdx(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? 'rgba(197, 155, 109, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-hairline)',
                    cursor: 'pointer',
                    transition: 'all 0.18s var(--ease-apple)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: spec.color
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                        fontWeight: isSelected ? 600 : 400
                      }}
                    >
                      {spec.field}
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: isSelected ? 'var(--accent)' : 'var(--text-muted)'
                    }}
                  >
                    {spec.fitScore}% FIT
                  </span>
                </div>
              );
            })}
          </div>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-hairline)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem'
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>INDUSTRIAL GROWTH SIGNAL:</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{activeSpectrum.marketDemand}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
