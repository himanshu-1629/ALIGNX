import React, { useState } from 'react';
import { MapPin, TrendingUp, DollarSign, Building2 } from 'lucide-react';

interface TechHub {
  id: string;
  city: string;
  region: string;
  country: 'India' | 'Global';
  x: number; // percentage in SVG viewBox 0-1000
  y: number; // percentage in SVG viewBox 0-600
  avgCtcLakhs: number;
  growthVelocity: number;
  shortageLevel: 'Critical' | 'Elevated' | 'Moderate';
  primaryCluster: string;
  cohesionScore: number;
  arbitrageMultiplier: string;
  keyCompanies: string[];
  description: string;
}

const HUBS: TechHub[] = [
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    region: 'Silicon Plateau',
    country: 'India',
    x: 440,
    y: 390,
    avgCtcLakhs: 18.5,
    growthVelocity: 38,
    shortageLevel: 'Critical',
    primaryCluster: 'AI & DeepTech / Cloud Infrastructure',
    cohesionScore: 94,
    arbitrageMultiplier: '1.0x (Baseline)',
    keyCompanies: ['Google DeepMind', 'Flipkart', 'Nvidia AI', 'Razorpay'],
    description: 'Dense concentration of frontier research labs, venture capital, and hyper-scale platform engineering.'
  },
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    region: 'Cyberabad Cyber Corridor',
    country: 'India',
    x: 470,
    y: 340,
    avgCtcLakhs: 16.2,
    growthVelocity: 34,
    shortageLevel: 'Elevated',
    primaryCluster: 'Enterprise Cloud & Semiconductor IP',
    cohesionScore: 91,
    arbitrageMultiplier: '1.25x Cost-Efficiency',
    keyCompanies: ['Microsoft IDC', 'Qualcomm', 'Amazon AWS', 'AMD'],
    description: 'Premier infrastructure-to-cost yield ratio with massive silicon and cloud engineering campuses.'
  },
  {
    id: 'delhi-ncr',
    city: 'Delhi NCR',
    region: 'Capital Tech Zone',
    country: 'India',
    x: 430,
    y: 165,
    avgCtcLakhs: 15.8,
    growthVelocity: 29,
    shortageLevel: 'Elevated',
    primaryCluster: 'FinTech, Consumer Platforms & Defense Tech',
    cohesionScore: 86,
    arbitrageMultiplier: '1.1x Yield',
    keyCompanies: ['Zomato', 'Paytm', 'MakeMyTrip', 'DRDO Labs'],
    description: 'Strategic proximity to national policy, deep defense-tech capital, and rapid consumer internet scale.'
  },
  {
    id: 'pune',
    city: 'Pune',
    region: 'Automotive & Deep Systems',
    country: 'India',
    x: 375,
    y: 330,
    avgCtcLakhs: 14.5,
    growthVelocity: 26,
    shortageLevel: 'Moderate',
    primaryCluster: 'Embedded Automotive & Industrial Systems',
    cohesionScore: 89,
    arbitrageMultiplier: '1.35x Cost-Efficiency',
    keyCompanies: ['Tata Technologies', 'Bajaj Auto R&D', 'Veritas', 'Kirloskar'],
    description: 'Leading mechanical-software hybrid epicenter with high long-term retention and stability.'
  },
  {
    id: 'mumbai',
    city: 'Mumbai',
    region: 'Financial Technology Core',
    country: 'India',
    x: 360,
    y: 310,
    avgCtcLakhs: 17.2,
    growthVelocity: 31,
    shortageLevel: 'Elevated',
    primaryCluster: 'Quantitative Finance & Capital Markets',
    cohesionScore: 88,
    arbitrageMultiplier: '0.85x High Living Cost',
    keyCompanies: ['NSE Tech', 'Morgan Stanley', 'Tower Research', 'JPMorgan'],
    description: 'World-class financial infrastructure engineering and high-frequency algorithmic trading desks.'
  },
  {
    id: 'chennai',
    city: 'Chennai',
    region: 'SaaS & Hardware Gateway',
    country: 'India',
    x: 475,
    y: 420,
    avgCtcLakhs: 14.8,
    growthVelocity: 28,
    shortageLevel: 'Moderate',
    primaryCluster: 'Global SaaS, Deep Automotive & Electronics',
    cohesionScore: 93,
    arbitrageMultiplier: '1.3x Cost-Efficiency',
    keyCompanies: ['Zoho Corp', 'Freshworks', 'Foxconn R&D', 'Hyundai Tech'],
    description: 'Capital-efficient engineering culture, premier bootstrapped enterprise software, and electronics synthesis.'
  },
  {
    id: 'singapore',
    city: 'Singapore',
    region: 'APAC Financial Hub',
    country: 'Global',
    x: 750,
    y: 430,
    avgCtcLakhs: 38.0,
    growthVelocity: 42,
    shortageLevel: 'Critical',
    primaryCluster: 'APAC HQ, Global Wealth Tech & AI Governance',
    cohesionScore: 85,
    arbitrageMultiplier: '2.4x Global Purchasing Leverage',
    keyCompanies: ['Sea Group', 'Grab', 'Stripe APAC', 'GIC Tech'],
    description: 'Premier gateway to Southeast Asian markets with maximum currency arbitrage and international prestige.'
  },
  {
    id: 'dubai',
    city: 'Dubai',
    region: 'MENA Innovation Gateway',
    country: 'Global',
    x: 210,
    y: 200,
    avgCtcLakhs: 34.5,
    growthVelocity: 45,
    shortageLevel: 'Critical',
    primaryCluster: 'Web3, Global Sovereign Capital & Logistics Tech',
    cohesionScore: 82,
    arbitrageMultiplier: '2.1x Tax-Free Yield',
    keyCompanies: ['Careem', 'Dubai Future Labs', 'Binance HQ', 'Emirates Tech'],
    description: 'Zero personal income tax regime, hyper-accelerated sovereign innovation funds, and global mobility.'
  },
  {
    id: 'london',
    city: 'London',
    region: 'European DeepTech Capital',
    country: 'Global',
    x: 120,
    y: 90,
    avgCtcLakhs: 46.0,
    growthVelocity: 36,
    shortageLevel: 'Critical',
    primaryCluster: 'Bioinformatics, DeepMind AI & Global FinTech',
    cohesionScore: 78,
    arbitrageMultiplier: '2.8x Currency Leverage',
    keyCompanies: ['Google DeepMind UK', 'Monzo', 'Revolut', 'Arm Cambridge'],
    description: 'World-leading fundamental artificial intelligence laboratories and European venture capital synthesis.'
  }
];

export const InteractiveOpportunityMap: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<TechHub>(HUBS[0]);
  const [filterCluster, setFilterCluster] = useState<'ALL' | 'AI' | 'FINTECH' | 'GLOBAL'>('ALL');
  const [hoveredHub, setHoveredHub] = useState<string | null>(null);

  const filteredHubs = HUBS.filter((hub) => {
    if (filterCluster === 'AI') return hub.primaryCluster.toLowerCase().includes('ai');
    if (filterCluster === 'FINTECH') return hub.primaryCluster.toLowerCase().includes('fintech') || hub.primaryCluster.toLowerCase().includes('financial') || hub.primaryCluster.toLowerCase().includes('quant');
    if (filterCluster === 'GLOBAL') return hub.country === 'Global';
    return true;
  });

  return (
    <div
      style={{
        border: '1px solid var(--border-hairline)',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}
      className="scroll-reveal-scale"
    >
      {/* Top Map Console Header & Cluster Filters */}
      <div
        style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--border-hairline)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              boxShadow: '0 0 8px rgba(158, 107, 56, 0.5)'
            }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', letterSpacing: '0.14em', color: 'var(--text-primary)', fontWeight: 600 }}>
            GEOSPATIAL TALENT ARBITRAGE GRID
          </span>
          <span style={{ height: '12px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            9 CORRIDORS ACTIVE
          </span>
        </div>

        {/* Filter Keys (Apple tactile key aesthetic, rich palette) */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'ALL CORRIDORS' },
            { id: 'AI', label: 'AI & DEEPTECH' },
            { id: 'FINTECH', label: 'QUANT & FINTECH' },
            { id: 'GLOBAL', label: 'GLOBAL ARBITRAGE' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCluster(tab.id as any)}
              className={`alignx-key ${filterCluster === tab.id ? 'active' : ''}`}
              style={{ fontSize: '0.7rem', padding: '6px 12px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Visualization Area: Split into Map Canvas + Telemetry Drawer */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          minHeight: '520px'
        }}
        className="responsive-stack"
      >
        {/* SVG Vector Map Container */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#F5F5F7',
            borderRight: '1px solid var(--border-hairline)',
            overflow: 'hidden',
            minHeight: '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="architectural-grid"
        >
          {/* Real Interactive Vector Map SVG */}
          <svg
            viewBox="0 0 900 520"
            style={{ width: '100%', height: '100%', maxHeight: '520px' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Radial gradient for map grid atmosphere */}
              <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(158, 107, 56, 0.06)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </radialGradient>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="rgba(0, 0, 0, 0.2)" />
              </linearGradient>
            </defs>

            {/* Atmosphere glow */}
            <rect width="900" height="520" fill="url(#mapGlow)" />

            {/* Geographic Latitude/Longitude Coordinate Lines (Subtle Obsidian Hairlines) */}
            <line x1="80" y1="130" x2="820" y2="130" stroke="rgba(0, 0, 0, 0.05)" strokeDasharray="4 6" />
            <line x1="80" y1="260" x2="820" y2="260" stroke="rgba(0, 0, 0, 0.08)" strokeDasharray="4 6" />
            <line x1="80" y1="390" x2="820" y2="390" stroke="rgba(0, 0, 0, 0.05)" strokeDasharray="4 6" />
            <line x1="260" y1="40" x2="260" y2="480" stroke="rgba(0, 0, 0, 0.05)" strokeDasharray="4 6" />
            <line x1="450" y1="40" x2="450" y2="480" stroke="rgba(0, 0, 0, 0.08)" strokeDasharray="4 6" />
            <line x1="680" y1="40" x2="680" y2="480" stroke="rgba(0, 0, 0, 0.05)" strokeDasharray="4 6" />

            {/* Stylized Geographic Subcontinent Outlines (India & Surrounding Maritime Corridor) */}
            <path
              d="M 390 120 
                 L 430 110 L 480 130 L 520 180 L 510 230 L 540 270 L 510 320 
                 L 480 430 L 460 460 L 440 440 L 400 400 L 360 360 L 340 310 
                 L 330 260 L 360 210 L 370 170 Z"
              fill="rgba(0, 0, 0, 0.02)"
              stroke="rgba(0, 0, 0, 0.18)"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />

            {/* Global Corridor Reference Landforms (Middle East / Europe & SE Asia) */}
            {/* Middle East Outline */}
            <path
              d="M 180 160 L 240 170 L 260 210 L 230 240 L 190 220 Z"
              fill="rgba(0, 0, 0, 0.015)"
              stroke="rgba(0, 0, 0, 0.12)"
              strokeWidth="1"
            />
            {/* Southeast Asia / Singapore Arch */}
            <path
              d="M 680 320 L 730 350 L 760 410 L 750 450 L 710 400 Z"
              fill="rgba(0, 0, 0, 0.015)"
              stroke="rgba(0, 0, 0, 0.12)"
              strokeWidth="1"
            />
            {/* UK / Europe Island Indicator */}
            <path
              d="M 100 80 L 135 70 L 145 100 L 115 110 Z"
              fill="rgba(0, 0, 0, 0.015)"
              stroke="rgba(0, 0, 0, 0.12)"
              strokeWidth="1"
            />

            {/* Flight & Talent Vector Arcs connecting Bengaluru to Global & Domestic Nodes */}
            <path
              d="M 440 390 Q 600 370 750 430"
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth="1.4"
              strokeDasharray="5 5"
              opacity="0.8"
            />
            <path
              d="M 440 390 Q 300 300 210 200"
              fill="none"
              stroke="rgba(158, 107, 56, 0.55)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <path
              d="M 440 390 Q 240 180 120 90"
              fill="none"
              stroke="rgba(158, 107, 56, 0.45)"
              strokeWidth="1"
              strokeDasharray="6 6"
            />
            <path
              d="M 440 390 Q 425 270 430 165"
              fill="none"
              stroke="rgba(0, 0, 0, 0.3)"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <path
              d="M 440 390 Q 460 365 470 340"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.6"
            />

            {/* Geographic Radar Nodes */}
            {filteredHubs.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              const isHovered = hoveredHub === hub.id;
              const isGlobal = hub.country === 'Global';

              return (
                <g
                  key={hub.id}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onClick={() => setSelectedHub(hub)}
                  onMouseEnter={() => setHoveredHub(hub.id)}
                  onMouseLeave={() => setHoveredHub(null)}
                >
                  {/* Pulsing radar rings for selected/hovered hub */}
                  {(isSelected || isHovered) && (
                    <>
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r="24"
                        fill="none"
                        stroke={isGlobal ? 'rgba(41, 151, 255, 0.4)' : 'rgba(197, 155, 109, 0.4)'}
                        strokeWidth="1"
                        className="animate-pulse-subtle"
                      />
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r="38"
                        fill="none"
                        stroke={isGlobal ? 'rgba(41, 151, 255, 0.2)' : 'rgba(197, 155, 109, 0.2)'}
                        strokeWidth="1"
                      />
                    </>
                  )}

                  {/* Core Hub Marker */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isSelected ? 6.5 : 4.5}
                    fill={isSelected ? '#FFFFFF' : isGlobal ? '#2997FF' : 'var(--accent)'}
                    stroke={isSelected ? 'var(--accent)' : '#000000'}
                    strokeWidth="2"
                  />

                  {/* City Label Badge */}
                  <g transform={`translate(${hub.x + 10}, ${hub.y - 10})`}>
                    <rect
                      x="0"
                      y="-12"
                      width={hub.city.length * 8 + 36}
                      height="22"
                      rx="4"
                      fill={isSelected ? 'rgba(197, 155, 109, 0.95)' : 'rgba(13, 16, 22, 0.88)'}
                      stroke={isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.16)'}
                      strokeWidth="1"
                    />
                    <text
                      x="8"
                      y="3"
                      fill={isSelected ? '#000000' : '#FFFFFF'}
                      fontFamily="var(--font-mono)"
                      fontSize="9.5"
                      fontWeight={isSelected ? '700' : '500'}
                      letterSpacing="0.06em"
                    >
                      {hub.city.toUpperCase()}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Map Status Bar & Coordinate Telemetry */}
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              left: '18px',
              right: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pointerEvents: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)'
            }}
          >
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>LAT: 12.97°N</span>
              <span>LON: 77.59°E</span>
              <span className="hide-mobile">DATUM: WGS84</span>
            </div>
            <div>
              CLICK ANY NODE TO INSPECT LIVE CAPITAL TELEMETRY
            </div>
          </div>
        </div>

        {/* Right Hub Telemetry Detail Drawer */}
        <div
          style={{
            padding: '36px 32px',
            backgroundColor: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '24px'
          }}
        >
          <div>
            {/* Header Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={15} color="var(--accent)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--accent)' }}>
                  {selectedHub.region.toUpperCase()}
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backgroundColor: selectedHub.country === 'Global' ? 'rgba(41, 151, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                  color: selectedHub.country === 'Global' ? '#2997FF' : 'var(--text-secondary)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {selectedHub.country.toUpperCase()} CORRIDOR
              </span>
            </div>

            {/* City Title */}
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.4rem',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--text-primary)',
                margin: '0 0 10px 0',
                textTransform: 'uppercase'
              }}
            >
              {selectedHub.city}
            </h3>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '24px' }}>
              {selectedHub.description}
            </p>

            {/* Key Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-hairline)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  <DollarSign size={13} color="var(--accent)" />
                  AVG ENTRY YIELD
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  ₹{selectedHub.avgCtcLakhs}L
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--accent)', marginTop: '2px' }}>
                  Starting CTC
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-hairline)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  <TrendingUp size={13} color="var(--accent)" />
                  GROWTH VELOCITY
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  +{selectedHub.growthVelocity}%
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Year-over-Year
                </div>
              </div>
            </div>

            {/* Structural Attributes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-hairline)', paddingTop: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  CORE SECTOR CLUSTER
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>
                  {selectedHub.primaryCluster}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  TALENT DEFICIT
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: selectedHub.shortageLevel === 'Critical' ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: 600
                  }}
                >
                  {selectedHub.shortageLevel.toUpperCase()} SHORTAGE
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  COST-OF-LIVING YIELD
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  {selectedHub.arbitrageMultiplier}
                </span>
              </div>
            </div>
          </div>

          {/* Key Employers & Ecosystem Footprint */}
          <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              <Building2 size={13} color="var(--accent)" />
              PROMINENT CAMPUS HIRERS & LABS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {selectedHub.keyCompanies.map((company, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    padding: '4px 9px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-hairline)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
