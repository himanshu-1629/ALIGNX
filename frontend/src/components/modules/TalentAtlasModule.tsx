import React, { useState } from 'react';
import {
  MapPin,
  TrendingUp,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import type { AppView } from '../Header';

interface StateData {
  id: string;
  name: string;
  capital: string;
  zone: 'South' | 'West' | 'North' | 'Central';
  tagline: string;
  startingCtcLakhs: number;
  fiveYearCtcLakhs: number;
  hiringVelocity: number;
  arbitrageYield: string;
  topCareers: {
    title: string;
    domain: string;
    surge: string;
    avgCtc: number;
  }[];
  keyHubs: string[];
  keyEmployers: string[];
  feederInstitutes: string[];
  deficitTag: string;
}

const INDIAN_STATES_DATA: StateData[] = [
  {
    id: 'karnataka',
    name: 'Karnataka',
    capital: 'Bengaluru Corridor',
    zone: 'South',
    tagline: 'DeepTech, AI Infrastructure & Global Innovation Alliances',
    startingCtcLakhs: 18.5,
    fiveYearCtcLakhs: 38.0,
    hiringVelocity: 38,
    arbitrageYield: '1.85x Tech Alpha (High Urban Capex)',
    topCareers: [
      { title: 'AI & Machine Learning Engineer', domain: 'AI & Data Science', surge: '+42%', avgCtc: 21.5 },
      { title: 'Autonomous Robotics & Drone Architect', domain: 'Robotics & Hardware', surge: '+34%', avgCtc: 18.0 },
      { title: 'Cloud & Distributed Systems Architect', domain: 'Software & Cloud', surge: '+29%', avgCtc: 19.5 },
      { title: 'Semiconductor VLSI Physical Design', domain: 'Hardware Systems', surge: '+36%', avgCtc: 17.0 }
    ],
    keyHubs: ['Whitefield', 'Electronic City', 'Outer Ring Road', 'Koramangala'],
    keyEmployers: ['Google DeepMind Lab', 'NVIDIA Research', 'Infosys Center of AI', 'ISRO Tech Base', 'Flipkart'],
    feederInstitutes: ['IISc Bengaluru', 'IIIT-Bangalore', 'RV College of Engineering', 'BMS College'],
    deficitTag: 'CRITICAL: GPU Kernel Developers & Distributed ML Engineers'
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    capital: 'Mumbai · Pune Twin Cluster',
    zone: 'West',
    tagline: 'Capital Markets, Quantitative Finance & Mechatronic EV R&D',
    startingCtcLakhs: 17.2,
    fiveYearCtcLakhs: 35.5,
    hiringVelocity: 29,
    arbitrageYield: '1.70x Capital Alpha (Tier-1 Financial Nexus)',
    topCareers: [
      { title: 'Quantitative Algorithm Strategist', domain: 'Quantitative Finance', surge: '+44%', avgCtc: 24.0 },
      { title: 'Electric Vehicle & Battery Mechatronics', domain: 'Hardware Systems', surge: '+31%', avgCtc: 16.5 },
      { title: 'Cyber Defense & Cryptographic Security', domain: 'Cybersecurity', surge: '+28%', avgCtc: 17.8 },
      { title: 'FinTech Distributed Systems Architect', domain: 'Software & Cloud', surge: '+26%', avgCtc: 18.2 }
    ],
    keyHubs: ['BKC Mumbai', 'Hinjawadi Pune', 'Powai Tech Cluster', 'Chakan Auto Hub'],
    keyEmployers: ['Tower Research', 'Goldman Sachs Tech', 'Tata Motors EV Lab', 'Morgan Stanley', 'NPCI'],
    feederInstitutes: ['IIT Bombay', 'COEP Technological University', 'VJTI Mumbai', 'SPIT Mumbai'],
    deficitTag: 'CRITICAL: High-Frequency Trading Systems & Battery Chemistry'
  },
  {
    id: 'telangana',
    name: 'Telangana',
    capital: 'Hyderabad Cyber-Corridor',
    zone: 'South',
    tagline: 'Bio-Computing, Cloud Hyperscalers & Semiconductor Packaging',
    startingCtcLakhs: 15.8,
    fiveYearCtcLakhs: 32.0,
    hiringVelocity: 33,
    arbitrageYield: '2.15x CoL Arbitrage (Optimized Living Yield)',
    topCareers: [
      { title: 'Computational Biologist & Genomic Analyst', domain: 'Biotech & Health', surge: '+37%', avgCtc: 16.0 },
      { title: 'Cloud Infrastructure & DevOps Engineer', domain: 'Software & Cloud', surge: '+31%', avgCtc: 17.0 },
      { title: 'Advanced Semiconductor Verification', domain: 'Hardware Systems', surge: '+35%', avgCtc: 15.5 },
      { title: 'Enterprise Generative AI Integrator', domain: 'AI & Data Science', surge: '+39%', avgCtc: 18.5 }
    ],
    keyHubs: ['HITEC City', 'Financial District', 'Genome Valley', 'Gachibowli'],
    keyEmployers: ['Microsoft IDC', 'Amazon Web Services', 'Dr. Reddy’s Digital Lab', 'Qualcomm', 'Novartis'],
    feederInstitutes: ['IIT Hyderabad', 'IIIT-Hyderabad', 'BITS Pilani Hyderabad', 'JNTU'],
    deficitTag: 'CRITICAL: Bioinformaticians & ASIC Verification Leads'
  },
  {
    id: 'delhi_ncr',
    name: 'Delhi-NCR',
    capital: 'Gurugram · Noida Metro Area',
    zone: 'North',
    tagline: 'Consumer Scale Platforms, GovTech & AI Product Management',
    startingCtcLakhs: 16.4,
    fiveYearCtcLakhs: 33.5,
    hiringVelocity: 27,
    arbitrageYield: '1.75x Scale Alpha (National Capital Ecosystem)',
    topCareers: [
      { title: 'Product Management Systems Architect', domain: 'Design & Product', surge: '+30%', avgCtc: 19.0 },
      { title: 'Data Platform & Analytics Engineer', domain: 'AI & Data Science', surge: '+28%', avgCtc: 17.5 },
      { title: 'Zero-Trust Cyber Defense Specialist', domain: 'Cybersecurity', surge: '+33%', avgCtc: 16.8 },
      { title: 'Supply Chain AI & Logistics Optimizer', domain: 'Enterprise Tech', surge: '+25%', avgCtc: 15.5 }
    ],
    keyHubs: ['Cyber City Gurugram', 'Golf Course Ext.', 'Sector 62 Noida', 'Aerocity'],
    keyEmployers: ['Zomato Tech', 'Paytm Core', 'Airtel Digital', 'Adobe India', 'Samsung R&D'],
    feederInstitutes: ['IIT Delhi', 'DTU', 'NSUT Delhi', 'IIIT-Delhi'],
    deficitTag: 'CRITICAL: High-Concurrency Backend & Cyber Forensics'
  },
  {
    id: 'tamil_nadu',
    name: 'Tamil Nadu',
    capital: 'Chennai · Coimbatore Belt',
    zone: 'South',
    tagline: 'SaaS Powerhouse, Industrial IoT & Renewable Mobility Hub',
    startingCtcLakhs: 14.2,
    fiveYearCtcLakhs: 29.5,
    hiringVelocity: 25,
    arbitrageYield: '2.20x Stability Yield (Low Attrition Cluster)',
    topCareers: [
      { title: 'Enterprise SaaS Full-Stack Architect', domain: 'Software & Cloud', surge: '+28%', avgCtc: 16.0 },
      { title: 'Embedded Systems & Firmware Engineer', domain: 'Hardware & Robotics', surge: '+32%', avgCtc: 15.0 },
      { title: 'Renewable Power Grid Systems Architect', domain: 'CleanTech & Energy', surge: '+35%', avgCtc: 14.5 },
      { title: 'Industrial Robotics Automation Engineer', domain: 'Hardware Systems', surge: '+27%', avgCtc: 14.0 }
    ],
    keyHubs: ['OMR Tech Corridor', 'Sriperumbudur Industrial SEZ', 'Taramani', 'Coimbatore IT Hub'],
    keyEmployers: ['Zoho Corporation', 'Freshworks', 'Ather Energy R&D', 'Ford Global Tech', 'Hyundai R&D'],
    feederInstitutes: ['IIT Madras', 'Anna University', 'PSG College of Technology', 'NIT Trichy'],
    deficitTag: 'CRITICAL: Embedded Real-Time Firmware & EV Powertrain'
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    capital: 'GIFT City · Ahmedabad · Sanand',
    zone: 'West',
    tagline: 'International FinTech SEZ, Green Hydrogen & Silicon Fabs',
    startingCtcLakhs: 14.8,
    fiveYearCtcLakhs: 31.0,
    hiringVelocity: 41,
    arbitrageYield: '2.35x High Growth Yield (Fastest Expanding Hub)',
    topCareers: [
      { title: 'GIFT City Cross-Border Quant Analyst', domain: 'Quantitative Finance', surge: '+48%', avgCtc: 21.0 },
      { title: 'Semiconductor Fabrication Operations', domain: 'Hardware Systems', surge: '+45%', avgCtc: 16.5 },
      { title: 'Clean Hydrogen & Energy Systems Lead', domain: 'CleanTech & Energy', surge: '+38%', avgCtc: 15.0 },
      { title: 'Chemical Data & Materials Modeler', domain: 'Biotech & Health', surge: '+29%', avgCtc: 13.5 }
    ],
    keyHubs: ['GIFT City SEZ Gandhinagar', 'Sanand Industrial Cluster', 'Dholera Special Region'],
    keyEmployers: ['Tata Semiconductor Fab', 'NSE International Exchange', 'Adani Clean Energy', 'Micron Assembly'],
    feederInstitutes: ['IIT Gandhinagar', 'SVNIT Surat', 'DA-IICT Gandhinagar', 'Nirma University'],
    deficitTag: 'CRITICAL: Clean Hydrogen Process Engineers & Fab Yield Leads'
  },
  {
    id: 'kerala',
    name: 'Kerala',
    capital: 'Kochi · Thiruvananthapuram',
    zone: 'South',
    tagline: 'SpaceTech Ecosystem, Marine Robotics & Digital Health',
    startingCtcLakhs: 12.8,
    fiveYearCtcLakhs: 26.0,
    hiringVelocity: 23,
    arbitrageYield: '2.50x Quality-of-Life CoL Arbitrage',
    topCareers: [
      { title: 'Aerospace & Spacecraft Telemetry Engineer', domain: 'Hardware & Robotics', surge: '+34%', avgCtc: 15.0 },
      { title: 'Spatial Computing & AR/VR Systems Lead', domain: 'Design & Product', surge: '+28%', avgCtc: 13.5 },
      { title: 'Marine Autonomous Vehicle Engineer', domain: 'Robotics & Hardware', surge: '+30%', avgCtc: 14.0 },
      { title: 'Digital Health AI Informatics Specialist', domain: 'Biotech & Health', surge: '+26%', avgCtc: 13.0 }
    ],
    keyHubs: ['Technopark Trivandrum', 'Infopark Kochi', 'ISRO Propulsion Cluster'],
    keyEmployers: ['VSSC / ISRO Hub', 'Tata Elxsi Innovation', 'NeST Digital', 'Maker Village Kochi'],
    feederInstitutes: ['IIST Thiruvananthapuram', 'NIT Calicut', 'CET Trivandrum', 'CUSAT'],
    deficitTag: 'CRITICAL: Satellite Avionics & Autonomous Subsea Control'
  }
];

const NATIONAL_POPULAR_CAREERS = [
  {
    id: 'ai-ml',
    rank: 1,
    title: 'AI & Machine Learning Engineer',
    domain: 'AI & Data Science',
    nationalSurge: '+41.8%',
    startingCtc: '₹18 - ₹24 LPA',
    fiveYearCtc: '₹38 - ₹65 LPA',
    popularityScore: 98,
    topStates: ['Karnataka', 'Telangana', 'Delhi-NCR'],
    shortageIndex: 'SEVERELY DEFICIENT (-46% Talent Gap)',
    whyPopular: 'Explosion of Generative AI foundational model training, enterprise automation, and sovereign GPU cloud installations across India.'
  },
  {
    id: 'quant-finance',
    rank: 2,
    title: 'Quantitative Algorithm Strategist',
    domain: 'Quantitative Finance',
    nationalSurge: '+38.5%',
    startingCtc: '₹22 - ₹36 LPA',
    fiveYearCtc: '₹55 - ₹1.2 Cr LPA',
    popularityScore: 95,
    topStates: ['Maharashtra', 'Gujarat (GIFT)', 'Karnataka'],
    shortageIndex: 'CRITICAL DEFICIT (-52% Talent Gap)',
    whyPopular: 'Algorithmic trading desks, high-frequency market makers, and GIFT City tax incentives driving record compensation premiums.'
  },
  {
    id: 'autonomous-robotics',
    rank: 3,
    title: 'Autonomous Robotics & Drone Architect',
    domain: 'Hardware & Robotics',
    nationalSurge: '+34.2%',
    startingCtc: '₹15 - ₹20 LPA',
    fiveYearCtc: '₹32 - ₹48 LPA',
    popularityScore: 92,
    topStates: ['Karnataka', 'Tamil Nadu', 'Maharashtra'],
    shortageIndex: 'HIGH DEFICIT (-38% Talent Gap)',
    whyPopular: 'Defense modernization, precision agricultural drones, and automated warehouse logistics scaling under Make-in-India mandates.'
  },
  {
    id: 'semiconductor-vlsi',
    rank: 4,
    title: 'Semiconductor VLSI & Chip Architect',
    domain: 'Hardware Systems',
    nationalSurge: '+39.4%',
    startingCtc: '₹16 - ₹22 LPA',
    fiveYearCtc: '₹35 - ₹55 LPA',
    popularityScore: 90,
    topStates: ['Karnataka', 'Gujarat', 'Telangana'],
    shortageIndex: 'CRITICAL DEFICIT (-58% Talent Gap)',
    whyPopular: 'India Semiconductor Mission (ISM) driving multi-billion dollar fab and ATMP assembly operations across Gujarat, Bengaluru, and Noida.'
  },
  {
    id: 'cleantech-energy',
    rank: 5,
    title: 'CleanTech & Green Hydrogen Systems Lead',
    domain: 'CleanTech & Energy',
    nationalSurge: '+33.0%',
    startingCtc: '₹14 - ₹19 LPA',
    fiveYearCtc: '₹28 - ₹42 LPA',
    popularityScore: 88,
    topStates: ['Gujarat', 'Tamil Nadu', 'Maharashtra'],
    shortageIndex: 'MODERATE DEFICIT (-30% Talent Gap)',
    whyPopular: 'National Green Hydrogen Mission and massive solar-wind grid storage investments creating brand-new engineering disciplines.'
  },
  {
    id: 'computational-biology',
    rank: 6,
    title: 'Computational Biologist & Drug Designer',
    domain: 'Biotech & Health',
    nationalSurge: '+31.8%',
    startingCtc: '₹13 - ₹18 LPA',
    fiveYearCtc: '₹28 - ₹40 LPA',
    popularityScore: 85,
    topStates: ['Telangana', 'Karnataka', 'Maharashtra'],
    shortageIndex: 'HIGH DEFICIT (-36% Talent Gap)',
    whyPopular: 'Shift towards AI-driven molecular synthesis and custom genomic medicine, transforming India into a drug discovery capital.'
  }
];

interface TalentAtlasModuleProps {
  onStartAssessment: (view?: AppView) => void;
}

export const TalentAtlasModule: React.FC<TalentAtlasModuleProps> = ({ onStartAssessment }) => {
  const [selectedStateId, setSelectedStateId] = useState<string>('karnataka');
  const [activeTab, setActiveTab] = useState<'states' | 'popular' | 'arbitrage'>('states');
  const [zoneFilter, setZoneFilter] = useState<'All' | 'South' | 'West' | 'North'>('All');

  const selectedState = INDIAN_STATES_DATA.find((s) => s.id === selectedStateId) || INDIAN_STATES_DATA[0];

  const filteredStates = INDIAN_STATES_DATA.filter((s) => {
    if (zoneFilter === 'All') return true;
    return s.zone === zoneFilter;
  });

  return (
    <div
      style={{
        backgroundColor: '#F6F5F1',
        minHeight: '100vh',
        padding: '40px 24px 80px',
        color: '#181816'
      }}
    >
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        {/* Top Breadcrumb & Public Notice Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontFamily: "'Martian Mono', monospace",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#2D5A43',
                backgroundColor: 'rgba(45, 90, 67, 0.1)',
                padding: '4px 10px',
                border: '1px solid rgba(45, 90, 67, 0.25)'
              }}
            >
              PUBLIC INTELLIGENCE · NO LOGIN REQUIRED
            </span>
            <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#6E6A61' }}>
              MoSPI PLFS 2023-24 GROUND TRUTH
            </span>
          </div>

          <button
            onClick={() => onStartAssessment('onboarding')}
            style={{
              height: '38px',
              padding: '0 20px',
              backgroundColor: '#181816',
              color: '#F6F5F1',
              border: 'none',
              borderRadius: '0px',
              fontFamily: "'Martian Mono', monospace",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2D5A43')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#181816')}
          >
            <span>■</span>
            <span>START CALIBRATED ASSESSMENT</span>
          </button>
        </div>

        {/* Section Header */}
        <div style={{ marginBottom: '36px', borderBottom: '1px solid rgba(24, 24, 22, 0.12)', paddingBottom: '28px' }}>
          <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '12px', letterSpacing: '0.16em', color: '#2D5A43', marginBottom: '8px' }}>
            02 · GEOSPATIAL TALENT & CAREER ATLAS (BHARAT)
          </div>
          <h1
            style={{
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              margin: '0 0 14px 0'
            }}
          >
            WHERE CAREERS THRIVE ACROSS INDIA
          </h1>
          <p
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '16px',
              color: '#6E6A61',
              maxWidth: '820px',
              lineHeight: 1.6,
              margin: 0
            }}
          >
            Explore compensation velocity, state-by-state tech corridor specializations, talent deficit tags, and career emergence across India before taking your personalized assessment.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0px',
            borderBottom: '1px solid rgba(24, 24, 22, 0.16)',
            marginBottom: '32px'
          }}
        >
          {[
            { id: 'states' as const, label: '01 · STATE & TECH CORRIDOR ATLAS', icon: <MapPin size={13} /> },
            { id: 'popular' as const, label: '02 · NATIONAL CAREER SURGE MATRIX', icon: <TrendingUp size={13} /> },
            { id: 'arbitrage' as const, label: '03 · SALARY VS COST-OF-LIVING ARBITRAGE', icon: <BarChart3 size={13} /> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '14px 22px',
                  backgroundColor: isActive ? '#ECE9E2' : 'transparent',
                  color: isActive ? '#181816' : '#6E6A61',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #2D5A43' : '2px solid transparent',
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.18s ease'
                }}
              >
                <span style={{ color: isActive ? '#2D5A43' : '#6E6A61' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ====================================================================
            TAB 1: STATE & TECH CORRIDOR ATLAS
            ==================================================================== */}
        {activeTab === 'states' && (
          <div>
            {/* Zone Filter Pill Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#6E6A61', marginRight: '6px' }}>
                FILTER REGION:
              </span>
              {(['All', 'South', 'West', 'North'] as const).map((zone) => (
                <button
                  key={zone}
                  onClick={() => setZoneFilter(zone)}
                  style={{
                    padding: '6px 14px',
                    backgroundColor: zoneFilter === zone ? '#2D5A43' : '#ECE9E2',
                    color: zoneFilter === zone ? '#FFFFFF' : '#181816',
                    border: '1px solid rgba(24, 24, 22, 0.1)',
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '10.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {zone.toUpperCase()} HUBS
                </button>
              ))}
            </div>

            {/* Split Layout: State Navigation List on Left, Active State Deep-Dive on Right */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(280px, 360px) 1fr',
                gap: '24px',
                alignItems: 'start'
              }}
              className="responsive-stack"
            >
              {/* Left Column: State Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredStates.map((st) => {
                  const isSelected = selectedStateId === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStateId(st.id)}
                      style={{
                        padding: '18px 20px',
                        backgroundColor: isSelected ? '#FFFFFF' : '#ECE9E2',
                        border: isSelected ? '1.5px solid #2D5A43' : '1px solid rgba(24, 24, 22, 0.12)',
                        boxShadow: isSelected ? '0 8px 24px rgba(45, 90, 67, 0.08)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = '#F0EEE8';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = '#ECE9E2';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontFamily: "'Big Shoulders Display', sans-serif",
                            fontSize: '22px',
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase',
                            color: isSelected ? '#2D5A43' : '#181816'
                          }}
                        >
                          {st.name}
                        </span>
                        <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61' }}>
                          {st.zone.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#181816', fontWeight: 600, marginBottom: '6px' }}>
                        {st.capital}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#6E6A61' }}>
                        <span>AVG ENTRY: ₹{st.startingCtcLakhs}L</span>
                        <span style={{ color: '#2D5A43', fontWeight: 700 }}>+{st.hiringVelocity}% YoY</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Active State Comprehensive Intelligence Board */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(24, 24, 22, 0.16)',
                  padding: '36px',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.04)'
                }}
              >
                {/* State Title Header */}
                <div style={{ borderBottom: '1px solid rgba(24, 24, 22, 0.12)', paddingBottom: '22px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                    <div>
                      <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#2D5A43', fontWeight: 700, letterSpacing: '0.12em' }}>
                        {selectedState.zone.toUpperCase()} INDIA INNOVATION CORRIDOR
                      </span>
                      <h2
                        style={{
                          fontFamily: "'Big Shoulders Display', sans-serif",
                          fontSize: '38px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          margin: '4px 0 6px 0',
                          lineHeight: 1
                        }}
                      >
                        {selectedState.name} — {selectedState.capital}
                      </h2>
                      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', color: '#6E6A61' }}>
                        {selectedState.tagline}
                      </div>
                    </div>

                    {/* Deficit Badge */}
                    <div
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        fontFamily: "'Martian Mono', monospace",
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#DC2626',
                        letterSpacing: '0.06em'
                      }}
                    >
                      {selectedState.deficitTag}
                    </div>
                  </div>
                </div>

                {/* 3 Metric High-Density Counters */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '16px',
                    marginBottom: '28px'
                  }}
                >
                  <div style={{ padding: '16px', backgroundColor: '#F6F5F1', border: '1px solid rgba(24, 24, 22, 0.1)' }}>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#6E6A61' }}>
                      STARTING CTC (ENTRY)
                    </div>
                    <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '32px', fontWeight: 800, color: '#181816', margin: '4px 0' }}>
                      ₹{selectedState.startingCtcLakhs} LPA
                    </div>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#2D5A43' }}>
                      Across Seeded STEAM Roles
                    </div>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: '#F6F5F1', border: '1px solid rgba(24, 24, 22, 0.1)' }}>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#6E6A61' }}>
                      5-YEAR COMPOUND CTC
                    </div>
                    <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '32px', fontWeight: 800, color: '#2D5A43', margin: '4px 0' }}>
                      ₹{selectedState.fiveYearCtcLakhs} LPA
                    </div>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61' }}>
                      Senior Trajectory Horizon
                    </div>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: '#F6F5F1', border: '1px solid rgba(24, 24, 22, 0.1)' }}>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#6E6A61' }}>
                      HIRING VELOCITY
                    </div>
                    <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '32px', fontWeight: 800, color: '#181816', margin: '4px 0' }}>
                      +{selectedState.hiringVelocity}%
                    </div>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#2D5A43' }}>
                      Annual Talent Intake Surge
                    </div>
                  </div>
                </div>

                {/* Top In-Demand Careers in This State */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#181816', marginBottom: '14px' }}>
                    MOST IN-DEMAND CAREER ROLES IN {selectedState.name.toUpperCase()}:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                    {selectedState.topCareers.map((c, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '14px 16px',
                          backgroundColor: '#ECE9E2',
                          border: '1px solid rgba(24, 24, 22, 0.12)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '10px'
                        }}
                      >
                        <div>
                          <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '9.5px', color: '#2D5A43', fontWeight: 600 }}>
                            {c.domain.toUpperCase()}
                          </div>
                          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', fontWeight: 700, color: '#181816', marginTop: '2px' }}>
                            {c.title}
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(24, 24, 22, 0.08)', paddingTop: '8px' }}>
                          <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#181816', fontWeight: 700 }}>
                            ₹{c.avgCtc}L Entry
                          </span>
                          <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#2D5A43', fontWeight: 700 }}>
                            {c.surge}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Hubs, Employers, and Institutes */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    borderTop: '1px solid rgba(24, 24, 22, 0.12)',
                    paddingTop: '24px',
                    marginBottom: '28px'
                  }}
                  className="responsive-stack"
                >
                  <div>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#6E6A61', marginBottom: '8px' }}>
                      KEY TECH SUB-DISTRICTS:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedState.keyHubs.map((hub, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '4px 10px',
                            backgroundColor: '#F6F5F1',
                            border: '1px solid rgba(24, 24, 22, 0.1)',
                            fontFamily: "'Martian Mono', monospace",
                            fontSize: '10.5px'
                          }}
                        >
                          {hub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#6E6A61', marginBottom: '8px' }}>
                      PROMINENT RESEARCH LABS & HIRERS:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedState.keyEmployers.map((emp, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '4px 10px',
                            backgroundColor: '#F6F5F1',
                            border: '1px solid rgba(24, 24, 22, 0.1)',
                            fontFamily: "'Martian Mono', monospace",
                            fontSize: '10.5px'
                          }}
                        >
                          {emp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Strip on State Board */}
                <div
                  style={{
                    backgroundColor: '#181816',
                    color: '#F6F5F1',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '20px', fontWeight: 700, letterSpacing: '0.04em' }}>
                      CURIOUS HOW YOUR APTITUDE MATCHES {selectedState.name.toUpperCase()}’S ROLES?
                    </div>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#A7A29A' }}>
                      Run our 5D mathematical model to calibrate your fit score across 25 career options.
                    </div>
                  </div>

                  <button
                    onClick={() => onStartAssessment('onboarding')}
                    style={{
                      height: '38px',
                      padding: '0 20px',
                      backgroundColor: '#2D5A43',
                      color: '#FFFFFF',
                      border: 'none',
                      fontFamily: "'Martian Mono', monospace",
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>TEST MY FIT</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 2: NATIONAL CAREER SURGE MATRIX
            ==================================================================== */}
        {activeTab === 'popular' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#2D5A43', fontWeight: 700, letterSpacing: '0.12em' }}>
                MACRO HIRING TELEMETRY (2024–2028 FORECAST)
              </div>
              <h3 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', margin: '4px 0' }}>
                TOP HIGH-VELOCITY STEAM CAREERS IN INDIA
              </h3>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#6E6A61', margin: 0 }}>
                Ranked by industry talent deficit, starting yield in Indian Rupees, and multi-year trajectory strength.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {NATIONAL_POPULAR_CAREERS.map((c) => (
                <div
                  key={c.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(24, 24, 22, 0.14)',
                    padding: '24px 28px',
                    display: 'grid',
                    gridTemplateColumns: '80px 1.4fr 1.2fr 1fr',
                    gap: '24px',
                    alignItems: 'center'
                  }}
                  className="responsive-stack"
                >
                  {/* Rank Column */}
                  <div>
                    <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#6E6A61', display: 'block' }}>
                      RANK
                    </span>
                    <span style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '38px', fontWeight: 800, color: '#2D5A43' }}>
                      #{c.rank}
                    </span>
                  </div>

                  {/* Career & Domain */}
                  <div>
                    <span
                      style={{
                        fontFamily: "'Martian Mono', monospace",
                        fontSize: '9.5px',
                        color: '#2D5A43',
                        fontWeight: 700,
                        backgroundColor: 'rgba(45, 90, 67, 0.08)',
                        padding: '2px 8px',
                        display: 'inline-block',
                        marginBottom: '4px'
                      }}
                    >
                      {c.domain.toUpperCase()}
                    </span>
                    <h4 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '24px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px 0' }}>
                      {c.title}
                    </h4>
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#6E6A61', margin: 0, lineHeight: 1.45 }}>
                      {c.whyPopular}
                    </p>
                  </div>

                  {/* Compensation & Surge */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Martian Mono', monospace", fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: '#6E6A61' }}>ENTRY SALARY:</span>
                      <span style={{ fontWeight: 700, color: '#181816' }}>{c.startingCtc}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Martian Mono', monospace", fontSize: '11px', marginBottom: '8px' }}>
                      <span style={{ color: '#6E6A61' }}>5-YR COMPOUND:</span>
                      <span style={{ fontWeight: 700, color: '#2D5A43' }}>{c.fiveYearCtc}</span>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Martian Mono', monospace",
                        fontSize: '9.5px',
                        fontWeight: 700,
                        color: '#DC2626',
                        backgroundColor: 'rgba(239, 68, 68, 0.06)',
                        padding: '3px 8px',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                      }}
                    >
                      {c.shortageIndex}
                    </div>
                  </div>

                  {/* Geographic Nodes & CTA */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61', marginBottom: '4px' }}>
                      TOP HUBS IN INDIA:
                    </div>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#181816', marginBottom: '12px' }}>
                      {c.topStates.join(' · ')}
                    </div>
                    <button
                      onClick={() => onStartAssessment('onboarding')}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#181816',
                        color: '#F6F5F1',
                        border: 'none',
                        fontFamily: "'Martian Mono', monospace",
                        fontSize: '10.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2D5A43')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#181816')}
                    >
                      CHECK FIT →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 3: SALARY VS COST-OF-LIVING ARBITRAGE
            ==================================================================== */}
        {activeTab === 'arbitrage' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(24, 24, 22, 0.14)',
              padding: '36px'
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#2D5A43', fontWeight: 700, letterSpacing: '0.12em' }}>
                INDIAN URBAN REALITY FORMULA
              </div>
              <h3 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', margin: '4px 0' }}>
                NET WEALTH RETENTION AFTER HOUSING & LIVING COSTS
              </h3>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#6E6A61', margin: 0 }}>
                High starting CTCs in Mumbai and Bengaluru face steep rent and commuting overheads. Emerging corridors like Hyderabad, Pune, and GIFT City offer superior real savings ratios.
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Martian Mono', monospace", fontSize: '11.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #181816', textAlign: 'left', backgroundColor: '#F6F5F1' }}>
                    <th style={{ padding: '12px 16px' }}>STATE / TECH HUB</th>
                    <th style={{ padding: '12px 16px' }}>AVG ENTRY CTC</th>
                    <th style={{ padding: '12px 16px' }}>LIVING INDEX</th>
                    <th style={{ padding: '12px 16px' }}>NET SAVINGS MARGIN</th>
                    <th style={{ padding: '12px 16px' }}>CORE INDUSTRY CLUSTERS</th>
                  </tr>
                </thead>
                <tbody>
                  {INDIAN_STATES_DATA.map((st) => (
                    <tr
                      key={st.id}
                      style={{
                        borderBottom: '1px solid rgba(24, 24, 22, 0.1)',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9F8F5')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                        <span style={{ color: '#2D5A43' }}>{st.name}</span>
                        <span style={{ color: '#6E6A61', display: 'block', fontSize: '10px' }}>{st.capital}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>₹{st.startingCtcLakhs} LPA</td>
                      <td style={{ padding: '14px 16px', color: '#6E6A61' }}>
                        {st.id === 'karnataka' || st.id === 'maharashtra' ? 'High Capex (₹35k/mo rent)' : st.id === 'telangana' ? 'Moderate (₹22k/mo rent)' : 'Optimized (₹16k/mo rent)'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#2D5A43', fontWeight: 700 }}>
                        {st.arbitrageYield}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#181816' }}>
                        {st.tagline}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid rgba(24, 24, 22, 0.12)', paddingTop: '24px' }}>
              <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '24px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                READY TO CALCULATE YOUR EXACT 5-DIMENSION CAREER FIT?
              </div>
              <button
                onClick={() => onStartAssessment('onboarding')}
                style={{
                  height: '42px',
                  padding: '0 28px',
                  backgroundColor: '#2D5A43',
                  color: '#FFFFFF',
                  border: 'none',
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                ■ START 5D ASSESSMENT (PROFILE & GOALS)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
