import React, { useState, useEffect, useRef } from 'react';

export const EquilibriumRadar3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  // Smooth continuous idle rotation
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setRotation((prev) => (prev + delta * 18) % 360);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Subtle interactive mouse parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setMouseOffset({ x: nx * 10, y: -ny * 10 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '30px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      {/* SVG Spatial Canvas containing the 3D Polyhedral Visual and Editorial Callout Lines */}
      <svg
        viewBox="0 0 1000 600"
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Subtle Ambient Contact Occlusion Drop Shadow */}
          <radialGradient id="trayShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(24, 24, 22, 0.22)" />
            <stop offset="60%" stopColor="rgba(24, 24, 22, 0.08)" />
            <stop offset="100%" stopColor="rgba(24, 24, 22, 0)" />
          </radialGradient>

          {/* Tray Metallic Chamfer Gradient */}
          <linearGradient id="trayBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ECE9E2" />
            <stop offset="50%" stopColor="#C4BFAF" />
            <stop offset="100%" stopColor="#E4E0D7" />
          </linearGradient>

          {/* Polyhedral Facet Shading Gradients (Deep Botanical Pine with Glass Depth) */}
          <linearGradient id="polyFacetTopLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3E7D5C" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#2D5A43" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="polyFacetTopDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#244F3A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#183627" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="polyFacetBottom" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B3F2E" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10251B" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="polyFacetAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#529972" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#2D5A43" stopOpacity="0.65" />
          </linearGradient>

          {/* Vertex Glow Radial Gradient */}
          <radialGradient id="vertexGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A8D0BC" />
            <stop offset="40%" stopColor="#2D5A43" />
            <stop offset="100%" stopColor="rgba(45, 90, 67, 0)" />
          </radialGradient>

          <radialGradient id="centroidPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#A8D0BC" />
            <stop offset="70%" stopColor="#2D5A43" />
            <stop offset="100%" stopColor="rgba(45, 90, 67, 0)" />
          </radialGradient>
        </defs>

        {/* 1. SOFT AMBIENT CONTACT SHADOW UNDER THE ISOMETRIC TRAY */}
        <ellipse cx="500" cy="460" rx="280" ry="70" fill="url(#trayShadow)" />

        {/* 2. ISOMETRIC SQUARE TITANIUM BASE TRAY */}
        <g transform={`translate(${mouseOffset.x * 0.4}, ${mouseOffset.y * 0.4})`}>
          {/* Base Plate Shadow Lip */}
          <polygon
            points="500,310 740,390 500,470 260,390"
            fill="#DED9CE"
            stroke="rgba(24, 24, 22, 0.25)"
            strokeWidth="1.5"
          />
          {/* Inner Recessed Surface */}
          <polygon
            points="500,320 726,390 500,460 274,390"
            fill="#ECE9E2"
            stroke="#2D5A43"
            strokeWidth="1.2"
          />
          {/* Subtle Grid Coordinates on Tray */}
          <line x1="387" y1="355" x2="613" y2="425" stroke="rgba(24, 24, 22, 0.12)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="613" y1="355" x2="387" y2="425" stroke="rgba(24, 24, 22, 0.12)" strokeWidth="1" strokeDasharray="3 3" />
        </g>

        {/* 3. FLOATING 3D POLYHEDRAL RADAR CRYSTAL (Rotated with dynamic angle) */}
        <g transform={`translate(${500 + mouseOffset.x}, ${270 + mouseOffset.y})`}>
          {/* Outer Orbital Orbit Ring */}
          <ellipse
            cx="0"
            cy="0"
            rx="160"
            ry="45"
            fill="none"
            stroke="rgba(45, 90, 67, 0.35)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            transform={`rotate(${rotation * 0.5})`}
          />

          {/* Polyhedron Geometry Calculation */}
          {(() => {
            const rad = (rotation * Math.PI) / 180;
            const radius = 115;
            const topY = -120;
            const botY = 100;

            // 5 Equatorial vertices of the pentagonal radar
            const v = Array.from({ length: 5 }).map((_, i) => {
              const a = rad + (i * 2 * Math.PI) / 5;
              const vx = Math.cos(a) * radius;
              const vy = Math.sin(a) * (radius * 0.42); // Isometric vertical foreshortening
              return { x: vx, y: vy, z: Math.sin(a) };
            });

            return (
              <g>
                {/* Internal Golden Radar Vectors & Harmonic Axis Lines */}
                <g opacity="0.65">
                  {v.map((pt, i) => (
                    <line
                      key={`core-${i}`}
                      x1="0"
                      y1="0"
                      x2={pt.x}
                      y2={pt.y}
                      stroke="#C9A227"
                      strokeWidth="1.2"
                      strokeDasharray="2 3"
                    />
                  ))}
                  {/* Central Axis Spine */}
                  <line x1="0" y1={topY} x2="0" y2={botY} stroke="#2D5A43" strokeWidth="1.4" strokeDasharray="4 4" />
                </g>

                {/* Back Facets & Bottom Cone */}
                <polygon
                  points={`${v[0].x},${v[0].y} ${v[1].x},${v[1].y} 0,${botY}`}
                  fill="url(#polyFacetBottom)"
                  stroke="#183627"
                  strokeWidth="1"
                />
                <polygon
                  points={`${v[1].x},${v[1].y} ${v[2].x},${v[2].y} 0,${botY}`}
                  fill="url(#polyFacetBottom)"
                  stroke="#183627"
                  strokeWidth="1"
                />
                <polygon
                  points={`${v[2].x},${v[2].y} ${v[3].x},${v[3].y} 0,${botY}`}
                  fill="url(#polyFacetBottom)"
                  stroke="#183627"
                  strokeWidth="1"
                />
                <polygon
                  points={`${v[3].x},${v[3].y} ${v[4].x},${v[4].y} 0,${botY}`}
                  fill="url(#polyFacetBottom)"
                  stroke="#183627"
                  strokeWidth="1"
                />
                <polygon
                  points={`${v[4].x},${v[4].y} ${v[0].x},${v[0].y} 0,${botY}`}
                  fill="url(#polyFacetBottom)"
                  stroke="#183627"
                  strokeWidth="1"
                />

                {/* Top Cone Facets */}
                <polygon
                  points={`${v[0].x},${v[0].y} ${v[1].x},${v[1].y} 0,${topY}`}
                  fill="url(#polyFacetTopLight)"
                  stroke="#2D5A43"
                  strokeWidth="1.4"
                />
                <polygon
                  points={`${v[1].x},${v[1].y} ${v[2].x},${v[2].y} 0,${topY}`}
                  fill="url(#polyFacetTopDark)"
                  stroke="#2D5A43"
                  strokeWidth="1.4"
                />
                <polygon
                  points={`${v[2].x},${v[2].y} ${v[3].x},${v[3].y} 0,${topY}`}
                  fill="url(#polyFacetAccent)"
                  stroke="#2D5A43"
                  strokeWidth="1.4"
                />
                <polygon
                  points={`${v[3].x},${v[3].y} ${v[4].x},${v[4].y} 0,${topY}`}
                  fill="url(#polyFacetTopDark)"
                  stroke="#2D5A43"
                  strokeWidth="1.4"
                />
                <polygon
                  points={`${v[4].x},${v[4].y} ${v[0].x},${v[0].y} 0,${topY}`}
                  fill="url(#polyFacetTopLight)"
                  stroke="#2D5A43"
                  strokeWidth="1.4"
                />

                {/* Equatorial Wireframe Belt */}
                <polygon
                  points={v.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="rgba(45, 90, 67, 0.35)"
                  stroke="#A8D0BC"
                  strokeWidth="1.6"
                />

                {/* Glowing Emerald Vertices */}
                {v.map((pt, i) => (
                  <g key={`vertex-${i}`}>
                    <circle cx={pt.x} cy={pt.y} r="12" fill="url(#vertexGlow)" opacity="0.8" />
                    <circle cx={pt.x} cy={pt.y} r="4.5" fill="#A8D0BC" stroke="#181816" strokeWidth="1" />
                    <circle cx={pt.x} cy={pt.y} r="1.8" fill="#FFFFFF" />
                  </g>
                ))}

                {/* Apex Top Vertex */}
                <circle cx="0" cy={topY} r="16" fill="url(#vertexGlow)" opacity="0.9" />
                <circle cx="0" cy={topY} r="5.5" fill="#E8F5E9" stroke="#181816" strokeWidth="1.2" />
                <circle cx="0" cy={topY} r="2.2" fill="#FFFFFF" />

                {/* Bottom Apex Vertex */}
                <circle cx="0" cy={botY} r="10" fill="url(#vertexGlow)" opacity="0.7" />
                <circle cx="0" cy={botY} r="4" fill="#A8D0BC" stroke="#181816" strokeWidth="1" />

                {/* Central Luminous Equilibrium Core Centroid */}
                <circle cx="0" cy="0" r="18" fill="url(#centroidPulse)" />
                <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" stroke="#2D5A43" strokeWidth="1.5" />
              </g>
            );
          })()}
        </g>

        {/* ========================================================
            4. MINIMALIST HAIRLINE CALLOUT LINES & EDITORIAL LABELS
            ======================================================== */}

        {/* CALLOUT 01: Top-Left -> Upper Apex (5-Axis Geometry) */}
        <g>
          {/* Target node on apex */}
          <circle cx="500" cy="150" r="3" fill="#2D5A43" />
          {/* Hairline pointer path */}
          <polyline
            points="500,150 430,95 180,95"
            fill="none"
            stroke="#2D5A43"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          {/* Accent square node */}
          <rect x="175" y="92" width="6" height="6" fill="#181816" />
          {/* Text Labels */}
          <text
            x="175"
            y="76"
            fontFamily="'Martian Mono', monospace"
            fontSize="10"
            fontWeight="700"
            letterSpacing="0.12em"
            fill="#2D5A43"
          >
            01 · 5-AXIS ISOMETRIC POLYHEDRON
          </text>
          <text
            x="175"
            y="114"
            fontFamily="'Martian Mono', monospace"
            fontSize="9"
            fontWeight="500"
            letterSpacing="0.06em"
            fill="#6E6A61"
          >
            DYNAMIC EQUILIBRIUM SURFACE
          </text>
        </g>

        {/* CALLOUT 02: Top-Right -> Lateral Vertices (Cognitive & Capital Envelope) */}
        <g>
          <circle cx="590" cy="245" r="3" fill="#2D5A43" />
          <polyline
            points="590,245 680,140 860,140"
            fill="none"
            stroke="#2D5A43"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <rect x="859" y="137" width="6" height="6" fill="#181816" />
          <text
            x="860"
            y="120"
            fontFamily="'Martian Mono', monospace"
            fontSize="10"
            fontWeight="700"
            letterSpacing="0.12em"
            fill="#2D5A43"
            textAnchor="end"
          >
            02 · COGNITIVE & CAPITAL WEIGHTS
          </text>
          <text
            x="860"
            y="158"
            fontFamily="'Martian Mono', monospace"
            fontSize="9"
            fontWeight="500"
            letterSpacing="0.06em"
            fill="#6E6A61"
            textAnchor="end"
          >
            GLOWING APEX VERTICES
          </text>
        </g>

        {/* CALLOUT 03: Bottom-Left -> Base Tray & Ground Plane */}
        <g>
          <circle cx="390" cy="405" r="3" fill="#2D5A43" />
          <polyline
            points="390,405 280,480 140,480"
            fill="none"
            stroke="#2D5A43"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <rect x="135" y="477" width="6" height="6" fill="#181816" />
          <text
            x="135"
            y="462"
            fontFamily="'Martian Mono', monospace"
            fontSize="10"
            fontWeight="700"
            letterSpacing="0.12em"
            fill="#2D5A43"
          >
            03 · LABOR MARKET HORIZON
          </text>
          <text
            x="135"
            y="498"
            fontFamily="'Martian Mono', monospace"
            fontSize="9"
            fontWeight="500"
            letterSpacing="0.06em"
            fill="#6E6A61"
          >
            10-YEAR ABSORPTION CAPACITY
          </text>
        </g>

        {/* CALLOUT 04: Bottom-Right -> Centroid Center (Equilibrium) */}
        <g>
          <circle cx="500" cy="270" r="3" fill="#2D5A43" />
          <polyline
            points="500,270 650,370 860,370"
            fill="none"
            stroke="#2D5A43"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <rect x="859" y="367" width="6" height="6" fill="#181816" />
          <text
            x="860"
            y="352"
            fontFamily="'Martian Mono', monospace"
            fontSize="10"
            fontWeight="700"
            letterSpacing="0.12em"
            fill="#2D5A43"
            textAnchor="end"
          >
            04 · PERFECT ALIGNMENT CENTROID
          </text>
          <text
            x="860"
            y="388"
            fontFamily="'Martian Mono', monospace"
            fontSize="9"
            fontWeight="500"
            letterSpacing="0.06em"
            fill="#6E6A61"
            textAnchor="end"
          >
            CONVERGENCE AT 0.0° SKEW
          </text>
        </g>
      </svg>
    </div>
  );
};
