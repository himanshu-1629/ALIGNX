import React, { useState, useEffect, useRef } from 'react';

interface AuthenticCompassProps {
  size?: number | string;
  rotationDeg?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const AuthenticCompass: React.FC<AuthenticCompassProps> = ({
  size = 360,
  rotationDeg = 0,
  className,
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Subtle interactive 3D parallax tilt on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from compass center (-1 to 1 range within 400px radius)
      const dx = (e.clientX - centerX) / 400;
      const dy = (e.clientY - centerY) / 400;

      // Restrict max tilt to 6 degrees for subtle luxury horology feel
      const maxTilt = 6;
      const tiltX = Math.max(-maxTilt, Math.min(maxTilt, -dy * maxTilt));
      const tiltY = Math.max(-maxTilt, Math.min(maxTilt, dx * maxTilt));

      setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 });
      setIsHovered(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Degree ticks generation (360 degrees)
  const degreeMarks = Array.from({ length: 72 }).map((_, i) => {
    const deg = i * 5; // Every 5 degrees
    const isMajor = deg % 30 === 0;
    const isMedium = deg % 10 === 0 && !isMajor;
    return { deg, isMajor, isMedium };
  });

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        position: 'relative',
        userSelect: 'none',
        perspective: '900px',
        ...style
      }}
    >
      {/* Dynamic 3D Housing Container with Parallax & Scroll Rotation */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotate(${rotationDeg}deg)`,
          transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          filter: 'drop-shadow(0 26px 44px rgba(24, 24, 22, 0.22)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12))'
        }}
      >
        <svg
          viewBox="0 0 500 500"
          width="100%"
          height="100%"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Metallic Brushed Titanium Gradients */}
            <linearGradient id="titaniumBezel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ECE9E2" />
              <stop offset="25%" stopColor="#C4BFAF" />
              <stop offset="50%" stopColor="#F9F8F5" />
              <stop offset="75%" stopColor="#9E988A" />
              <stop offset="100%" stopColor="#DDD8CD" />
            </linearGradient>

            <linearGradient id="innerChamberWall" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E1E1C" />
              <stop offset="50%" stopColor="#121210" />
              <stop offset="100%" stopColor="#252522" />
            </linearGradient>

            {/* Recessed Dial Radial Vignette */}
            <radialGradient id="dialFaceGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F5F3ED" />
              <stop offset="70%" stopColor="#ECE9E2" />
              <stop offset="92%" stopColor="#DDD8CD" />
              <stop offset="100%" stopColor="#C0BBAE" />
            </radialGradient>

            {/* Needle 3D Bevel Gradients: North Deep Botanical Pine */}
            <linearGradient id="needleNorthLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3E7D5C" />
              <stop offset="100%" stopColor="#2D5A43" />
            </linearGradient>
            <linearGradient id="needleNorthDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#224835" />
              <stop offset="100%" stopColor="#183627" />
            </linearGradient>

            {/* Needle 3D Bevel Gradients: South Stainless Steel */}
            <linearGradient id="needleSouthLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#ECE9E2" />
            </linearGradient>
            <linearGradient id="needleSouthDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B4AFA3" />
              <stop offset="100%" stopColor="#8C8679" />
            </linearGradient>

            {/* Brass Pivot Collar & Ruby Jewel Bearing */}
            <radialGradient id="rubyJewel" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FF6B7A" />
              <stop offset="40%" stopColor="#9B111E" />
              <stop offset="85%" stopColor="#4A050B" />
              <stop offset="100%" stopColor="#1E0003" />
            </radialGradient>

            <linearGradient id="brassHub" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#AA820A" />
              <stop offset="100%" stopColor="#664D00" />
            </linearGradient>

            {/* Domed Convex Glass Glare Arc */}
            <linearGradient id="glassCurvedGlare" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.15" />
              <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.08" />
            </linearGradient>

            {/* Knurled Outer Bezel Teeth Pattern */}
            <pattern id="knurledRim" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M0 10 L10 0 M0 0 L10 10" stroke="rgba(24,24,22,0.18)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* 1. OUTER HEAVY CASE & KNURLED CHASSIS */}
          <circle cx="250" cy="250" r="244" fill="#C5C0B3" stroke="#181816" strokeWidth="2.5" />
          <circle cx="250" cy="250" r="240" fill="url(#knurledRim)" />

          {/* 2. BRUSHED TITANIUM BEZEL RING */}
          <circle cx="250" cy="250" r="236" fill="url(#titaniumBezel)" stroke="#181816" strokeWidth="2" />
          <circle cx="250" cy="250" r="222" fill="none" stroke="rgba(24,24,22,0.3)" strokeWidth="1.2" />

          {/* Surveyor Inscription on Outer Ring */}
          <path
            id="bezelTextArcTop"
            d="M 65,250 A 185,185 0 0,1 435,250"
            fill="none"
          />
          <text
            fontFamily="'Martian Mono', monospace"
            fontSize="6.8"
            fontWeight="600"
            letterSpacing="0.22em"
            fill="#5E5A51"
            textAnchor="middle"
          >
            <textPath href="#bezelTextArcTop" startOffset="50%">
              SWISS PRECISION CALIBRATION · AZIMUTH HORIZON
            </textPath>
          </text>

          <path
            id="bezelTextArcBottom"
            d="M 435,250 A 185,185 0 0,1 65,250"
            fill="none"
          />
          <text
            fontFamily="'Martian Mono', monospace"
            fontSize="6.8"
            fontWeight="600"
            letterSpacing="0.24em"
            fill="#5E5A51"
            textAnchor="middle"
          >
            <textPath href="#bezelTextArcBottom" startOffset="50%">
              ALIGNX INSTRUMENT CO. · SPEC NO. 2026-05D
            </textPath>
          </text>

          {/* 3. RECESSED REHAUT (INNER CHAMBER DEPTH WALL) */}
          <circle cx="250" cy="250" r="208" fill="url(#innerChamberWall)" stroke="#181816" strokeWidth="2" />
          <circle cx="250" cy="250" r="198" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

          {/* 4. RECESSED MAIN DIAL FACE */}
          <circle cx="250" cy="250" r="195" fill="url(#dialFaceGrad)" stroke="#181816" strokeWidth="1.5" />
          
          {/* Inner Azimuth Track Rings */}
          <circle cx="250" cy="250" r="186" fill="none" stroke="#2D5A43" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="250" cy="250" r="158" fill="none" stroke="rgba(24,24,22,0.25)" strokeWidth="1" />
          <circle cx="250" cy="250" r="120" fill="none" stroke="rgba(45,90,67,0.2)" strokeWidth="1" strokeDasharray="4 6" />

          {/* 5. 360-DEGREE AZIMUTH GRADUATION TICKS */}
          {degreeMarks.map(({ deg, isMajor, isMedium }) => {
            const rad = (deg * Math.PI) / 180;
            const rOuter = 195;
            const rInner = isMajor ? 172 : isMedium ? 178 : 183;
            const x1 = 250 + Math.sin(rad) * rInner;
            const y1 = 250 - Math.cos(rad) * rInner;
            const x2 = 250 + Math.sin(rad) * rOuter;
            const y2 = 250 - Math.cos(rad) * rOuter;

            // Major degree text numerals (000, 030, 060, etc.)
            const textR = 163;
            const tx = 250 + Math.sin(rad) * textR;
            const ty = 250 - Math.cos(rad) * textR;

            return (
              <g key={deg}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isMajor ? '#2D5A43' : isMedium ? '#181816' : 'rgba(24,24,22,0.5)'}
                  strokeWidth={isMajor ? 2.2 : isMedium ? 1.4 : 0.8}
                />
                {isMajor && (
                  <text
                    x={tx}
                    y={ty + 2.8}
                    fontFamily="'Martian Mono', monospace"
                    fontSize="6.5"
                    fontWeight="700"
                    fill="#3D3A33"
                    textAnchor="middle"
                    transform={`rotate(${deg}, ${tx}, ${ty})`}
                  >
                    {String(deg).padStart(3, '0')}°
                  </text>
                )}
              </g>
            );
          })}

          {/* 6. EIGHT-POINT FACETED COMPASS ROSE (Background Dial Star) */}
          <g opacity="0.88">
            {/* North Point */}
            <polygon points="250,250 240,240 250,118" fill="#2D5A43" />
            <polygon points="250,250 260,240 250,118" fill="#1B4332" />
            {/* South Point */}
            <polygon points="250,250 240,260 250,382" fill="#B4AFA3" />
            <polygon points="250,250 260,260 250,382" fill="#8C8679" />
            {/* East Point */}
            <polygon points="250,250 260,240 382,250" fill="#2D5A43" />
            <polygon points="250,250 260,260 382,250" fill="#1B4332" />
            {/* West Point */}
            <polygon points="250,250 240,240 118,250" fill="#B4AFA3" />
            <polygon points="250,250 240,260 118,250" fill="#8C8679" />

            {/* Intercardinal Points (NE, SE, SW, NW) */}
            <polygon points="250,250 246,242 344,156" fill="#A8D0BC" opacity="0.6" />
            <polygon points="250,250 254,246 344,156" fill="#2D5A43" opacity="0.6" />
            <polygon points="250,250 254,254 344,344" fill="#DDD8CD" opacity="0.6" />
            <polygon points="250,250 246,258 344,344" fill="#9C978D" opacity="0.6" />
            <polygon points="250,250 242,254 156,344" fill="#DDD8CD" opacity="0.6" />
            <polygon points="250,250 246,246 156,344" fill="#9C978D" opacity="0.6" />
            <polygon points="250,250 242,246 156,156" fill="#A8D0BC" opacity="0.6" />
            <polygon points="250,250 246,242 156,156" fill="#2D5A43" opacity="0.6" />
          </g>

          {/* 7. PROMINENT CARDINAL DIRECTION LABELS IN PROPER UPRIGHT ORIENTATION */}
          {/* NORTH (N) at 12 o'clock */}
          <g>
            <polygon points="250,88 255,98 245,98" fill="#2D5A43" />
            <text
              x="250"
              y="82"
              fontFamily="'Big Shoulders Display', sans-serif"
              fontSize="26"
              fontWeight="900"
              letterSpacing="0.05em"
              fill="#2D5A43"
              textAnchor="middle"
            >
              N
            </text>
          </g>

          {/* EAST (E) at 3 o'clock */}
          <text
            x="414"
            y="259"
            fontFamily="'Big Shoulders Display', sans-serif"
            fontSize="22"
            fontWeight="800"
            fill="#181816"
            textAnchor="middle"
          >
            E
          </text>

          {/* SOUTH (S) at 6 o'clock */}
          <text
            x="250"
            y="426"
            fontFamily="'Big Shoulders Display', sans-serif"
            fontSize="22"
            fontWeight="800"
            fill="#181816"
            textAnchor="middle"
          >
            S
          </text>

          {/* WEST (W) at 9 o'clock */}
          <text
            x="86"
            y="259"
            fontFamily="'Big Shoulders Display', sans-serif"
            fontSize="22"
            fontWeight="800"
            fill="#181816"
            textAnchor="middle"
          >
            W
          </text>

          {/* Subtle Intercardinal Markers */}
          <text x="352" y="152" fontFamily="'Martian Mono', monospace" fontSize="8.5" fontWeight="600" fill="#6E6A61" textAnchor="middle">NE</text>
          <text x="352" y="356" fontFamily="'Martian Mono', monospace" fontSize="8.5" fontWeight="600" fill="#6E6A61" textAnchor="middle">SE</text>
          <text x="148" y="356" fontFamily="'Martian Mono', monospace" fontSize="8.5" fontWeight="600" fill="#6E6A61" textAnchor="middle">SW</text>
          <text x="148" y="152" fontFamily="'Martian Mono', monospace" fontSize="8.5" fontWeight="600" fill="#6E6A61" textAnchor="middle">NW</text>

          {/* 8. SCULPTED 3D MAGNETIC COMPASS NEEDLE (Pointing Upright to True North) */}
          <g filter="drop-shadow(0 6px 14px rgba(0, 0, 0, 0.35))">
            {/* NORTH HALF (Deep Botanical Pine with Dual-Plane Bevel) */}
            {/* Left Light Bevel */}
            <polygon points="250,250 236,242 250,72" fill="url(#needleNorthLight)" />
            {/* Right Dark Bevel */}
            <polygon points="250,250 264,242 250,72" fill="url(#needleNorthDark)" />
            {/* Luminous North Pointer Arrowhead */}
            <polygon points="250,60 256,76 244,76" fill="#3E7D5C" stroke="#181816" strokeWidth="0.8" />
            <circle cx="250" cy="74" r="2.2" fill="#E8F5E9" />

            {/* SOUTH HALF (Polished Titanium / Surgical Steel with Dual-Plane Bevel) */}
            {/* Left Light Bevel */}
            <polygon points="250,250 236,258 250,428" fill="url(#needleSouthLight)" />
            {/* Right Dark Bevel */}
            <polygon points="250,250 264,258 250,428" fill="url(#needleSouthDark)" />
            {/* South Tail Arrowhead */}
            <polygon points="250,440 255,426 245,426" fill="#9C978D" stroke="#181816" strokeWidth="0.8" />
          </g>

          {/* 9. CENTRAL BRASS HUB & RUBY JEWEL BEARING PIVOT */}
          <g filter="drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4))">
            {/* Brass Outer Collar */}
            <circle cx="250" cy="250" r="24" fill="url(#brassHub)" stroke="#181816" strokeWidth="1.5" />
            <circle cx="250" cy="250" r="19" fill="#181816" />
            <circle cx="250" cy="250" r="17" fill="url(#titaniumBezel)" stroke="#181816" strokeWidth="0.8" />
            
            {/* Polished Ruby Jewel Pivot Bearing */}
            <circle cx="250" cy="250" r="12" fill="url(#rubyJewel)" stroke="#4A050B" strokeWidth="1" />
            {/* Specular White Glint on Jewel */}
            <circle cx="246" cy="246" r="3.2" fill="#FFFFFF" opacity="0.85" />
            <circle cx="248" cy="248" r="1.2" fill="#FFFFFF" opacity="0.95" />
          </g>

          {/* 10. CONVEX SAPPHIRE GLASS DOME REFLECTION (Authentic Watch Crystal Highlight) */}
          <path
            d="M 120,135 Q 250,75 380,135 A 195,195 0 0,0 120,135 Z"
            fill="url(#glassCurvedGlare)"
            pointerEvents="none"
          />
          {/* Rim Glare Arc */}
          <path
            d="M 90,210 A 194,194 0 0,1 210,90"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.4"
            pointerEvents="none"
          />
        </svg>
      </div>
    </div>
  );
};
