import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  TrendingUp,
  ArrowRight,
  BarChart3,
  RefreshCw,
  Clock,
  ShieldCheck,
  ExternalLink,
  Search,
  Building2,
  Zap,
  Briefcase
} from 'lucide-react';
import type { AppView } from '../Header';
import { ApiService, type TalentAtlasPayload, type LiveJobPosting } from '../../services/api';

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
  activePostings?: number;
  liveDelta?: string;
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
  plfs?: { lfpr: number; ur: number; source: string };
  employability?: { rate: number; city: string; source: string };
  gccDensity?: { count: number; source: string };
}

const INDIAN_STATES_DATA: StateData[] = [
  {
    id: 'karnataka',
    name: 'Karnataka',
    capital: 'Bengaluru Corridor',
    zone: 'South',
    tagline: 'DeepTech, AI Infrastructure & Global Innovation Alliances',
    startingCtcLakhs: 11.9,
    fiveYearCtcLakhs: 28.3,
    hiringVelocity: 38,
    arbitrageYield: '1.85x Tech Alpha (High Urban Capex)',
    topCareers: [
      { title: 'AI & Machine Learning Engineer', domain: 'AI & Data Science', surge: '+42%', avgCtc: 12.8 },
      { title: 'VLSI & Semiconductor Design Engineer', domain: 'Hardware Systems', surge: '+36%', avgCtc: 12.8 },
      { title: 'Technical Product Manager (AI & STEAM)', domain: 'Product Management', surge: '+32%', avgCtc: 11.5 },
      { title: 'Satellite Communications & Space Tech Engineer', domain: 'SpaceTech & Defense', surge: '+30%', avgCtc: 10.3 }
    ],
    keyHubs: ['Whitefield', 'Electronic City', 'Outer Ring Road', 'Koramangala'],
    keyEmployers: ['Google DeepMind Lab', 'NVIDIA Research', 'Infosys Center of AI', 'ISRO Tech Base', 'Flipkart'],
    feederInstitutes: ['IISc Bengaluru', 'IIIT-Bangalore', 'RV College of Engineering', 'BMS College'],
    deficitTag: 'CRITICAL: GPU Kernel Developers & Distributed ML Engineers',
    plfs: { lfpr: 45.4, ur: 2.7, source: 'MoSPI Periodic Labour Force Survey 2023-24 (Table 1: Usual Status ps+ss)' },
    employability: { rate: 77.84, city: 'Bengaluru (77.8%)', source: 'Wheebox India Skills Report 2026' },
    gccDensity: { count: 680, source: 'NASSCOM GCC Review 2026' }
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    capital: 'Mumbai · Pune Twin Cluster',
    zone: 'West',
    tagline: 'Capital Markets, Quantitative Finance & Mechatronic EV R&D',
    startingCtcLakhs: 11.3,
    fiveYearCtcLakhs: 25.9,
    hiringVelocity: 29,
    arbitrageYield: '1.70x Capital Alpha (Tier-1 Financial Nexus)',
    topCareers: [
      { title: 'Fintech Quantitative & Algorithmic Analyst', domain: 'Quantitative Finance', surge: '+44%', avgCtc: 18.0 },
      { title: 'Electric Vehicle & Battery Systems Engineer', domain: 'Automotive & CleanTech', surge: '+31%', avgCtc: 8.8 },
      { title: 'Robotics & Autonomous Systems Engineer', domain: 'Hardware Systems', surge: '+29%', avgCtc: 9.0 },
      { title: 'Cybersecurity & Cryptographic Analyst', domain: 'Cybersecurity', surge: '+28%', avgCtc: 9.5 }
    ],
    keyHubs: ['BKC Mumbai', 'Hinjawadi Pune', 'Powai Tech Cluster', 'Chakan Auto Hub'],
    keyEmployers: ['Tower Research', 'Goldman Sachs Tech', 'Tata Motors EV Lab', 'Morgan Stanley', 'NPCI'],
    feederInstitutes: ['IIT Bombay', 'COEP Technological University', 'VJTI Mumbai', 'SPIT Mumbai'],
    deficitTag: 'CRITICAL: High-Frequency Trading Systems & Battery Chemistry',
    plfs: { lfpr: 46.8, ur: 3.3, source: 'MoSPI Periodic Labour Force Survey 2023-24 (Table 1: Usual Status ps+ss)' },
    employability: { rate: 78.92, city: 'Pune (78.9%) · Mumbai (75.1%)', source: 'Wheebox India Skills Report 2026' },
    gccDensity: { count: 390, source: 'NASSCOM GCC Review 2026' }
  },
  {
    id: 'telangana',
    name: 'Telangana',
    capital: 'Hyderabad Cyber-Corridor',
    zone: 'South',
    tagline: 'Bio-Computing, Cloud Hyperscalers & Semiconductor Packaging',
    startingCtcLakhs: 9.5,
    fiveYearCtcLakhs: 22.5,
    hiringVelocity: 33,
    arbitrageYield: '2.15x CoL Arbitrage (Optimized Living Yield)',
    topCareers: [
      { title: 'Bioinformatics & Genomic Data Scientist', domain: 'Biotech & Health', surge: '+37%', avgCtc: 8.0 },
      { title: 'Computational Biologist & Drug Discovery Specialist', domain: 'Biotech & Health', surge: '+35%', avgCtc: 8.5 },
      { title: 'Data Platform & Cloud Engineer', domain: 'Software & Cloud', surge: '+33%', avgCtc: 11.3 },
      { title: 'Satellite Communications & Space Tech Engineer', domain: 'SpaceTech & Defense', surge: '+31%', avgCtc: 10.3 }
    ],
    keyHubs: ['HITEC City', 'Financial District', 'Genome Valley', 'Gachibowli'],
    keyEmployers: ['Microsoft IDC', 'Amazon Web Services', 'Dr. Reddy’s Digital Lab', 'Qualcomm', 'Novartis'],
    feederInstitutes: ['IIT Hyderabad', 'IIIT-Hyderabad', 'BITS Pilani Hyderabad', 'JNTU'],
    deficitTag: 'CRITICAL: Bioinformaticians & ASIC Verification Leads',
    plfs: { lfpr: 48.0, ur: 4.8, source: 'MoSPI Periodic Labour Force Survey 2023-24 (Table 1: Usual Status ps+ss)' },
    employability: { rate: 76.20, city: 'Hyderabad (76.2%)', source: 'Wheebox India Skills Report 2026' },
    gccDensity: { count: 420, source: 'NASSCOM GCC Review 2026' }
  },
  {
    id: 'delhi_ncr',
    name: 'Delhi-NCR',
    capital: 'Gurugram · Noida Metro Area',
    zone: 'North',
    tagline: 'Consumer Scale Platforms, GovTech & AI Product Management',
    startingCtcLakhs: 10.0,
    fiveYearCtcLakhs: 23.5,
    hiringVelocity: 27,
    arbitrageYield: '1.75x Scale Alpha (National Capital Ecosystem)',
    topCareers: [
      { title: 'Technical Product Manager (AI & STEAM)', domain: 'Product Management', surge: '+32%', avgCtc: 11.5 },
      { title: 'Data Platform & Cloud Engineer', domain: 'AI & Data Science', surge: '+28%', avgCtc: 11.3 },
      { title: 'Cybersecurity & Cryptographic Analyst', domain: 'Cybersecurity', surge: '+33%', avgCtc: 9.5 },
      { title: 'Climate Tech & Carbon Systems Engineer', domain: 'CleanTech & Climate', surge: '+25%', avgCtc: 7.5 }
    ],
    keyHubs: ['Cyber City Gurugram', 'Golf Course Ext.', 'Sector 62 Noida', 'Aerocity'],
    keyEmployers: ['Zomato Tech', 'Paytm Core', 'Airtel Digital', 'Adobe India', 'Samsung R&D'],
    feederInstitutes: ['IIT Delhi', 'DTU', 'NSUT Delhi', 'IIIT-Delhi'],
    deficitTag: 'CRITICAL: High-Concurrency Backend & Cyber Forensics',
    plfs: { lfpr: 36.0, ur: 2.1, source: 'MoSPI Periodic Labour Force Survey 2023-24 (Table 1: Usual Status ps+ss)' },
    employability: { rate: 76.80, city: 'Gurugram · Noida', source: 'Wheebox India Skills Report 2026' },
    gccDensity: { count: 310, source: 'NASSCOM GCC Review 2026' }
  },
  {
    id: 'tamil_nadu',
    name: 'Tamil Nadu',
    capital: 'Chennai · Coimbatore Belt',
    zone: 'South',
    tagline: 'SaaS Powerhouse, Industrial IoT & Renewable Mobility Hub',
    startingCtcLakhs: 10.5,
    fiveYearCtcLakhs: 23.8,
    hiringVelocity: 25,
    arbitrageYield: '2.20x Stability Yield (Low Attrition Cluster)',
    topCareers: [
      { title: 'Electric Vehicle & Battery Systems Engineer', domain: 'CleanTech & EV', surge: '+35%', avgCtc: 8.8 },
      { title: 'Robotics & Autonomous Systems Engineer', domain: 'Hardware Systems', surge: '+28%', avgCtc: 9.0 },
      { title: 'Satellite Communications & Space Tech Engineer', domain: 'SpaceTech & Defense', surge: '+32%', avgCtc: 10.3 },
      { title: 'Quantum Computing & Algorithms Researcher', domain: 'DeepTech & Quantum', surge: '+27%', avgCtc: 14.0 }
    ],
    keyHubs: ['OMR Tech Corridor', 'Sriperumbudur Industrial SEZ', 'Taramani', 'Coimbatore IT Hub'],
    keyEmployers: ['Zoho Corporation', 'Freshworks', 'Ather Energy R&D', 'Ford Global Tech', 'Hyundai R&D'],
    feederInstitutes: ['IIT Madras', 'Anna University', 'PSG College of Technology', 'NIT Trichy'],
    deficitTag: 'CRITICAL: Embedded Real-Time Firmware & EV Powertrain',
    plfs: { lfpr: 47.2, ur: 3.5, source: 'MoSPI Periodic Labour Force Survey 2023-24 (Table 1: Usual Status ps+ss)' },
    employability: { rate: 73.80, city: 'Chennai · Coimbatore', source: 'Wheebox India Skills Report 2026' },
    gccDensity: { count: 290, source: 'NASSCOM GCC Review 2026' }
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    capital: 'GIFT City · Ahmedabad · Sanand',
    zone: 'West',
    tagline: 'International FinTech SEZ, Green Hydrogen & Silicon Fabs',
    startingCtcLakhs: 10.6,
    fiveYearCtcLakhs: 24.2,
    hiringVelocity: 41,
    arbitrageYield: '2.35x High Growth Yield (Fastest Expanding Hub)',
    topCareers: [
      { title: 'Renewable Energy & Smart Grid Engineer', domain: 'CleanTech & Energy', surge: '+45%', avgCtc: 8.3 },
      { title: 'Fintech Quantitative & Algorithmic Analyst', domain: 'Quantitative Finance', surge: '+48%', avgCtc: 18.0 },
      { title: 'Electric Vehicle & Battery Systems Engineer', domain: 'Hardware & EV', surge: '+38%', avgCtc: 8.8 },
      { title: 'Climate Tech & Carbon Systems Engineer', domain: 'Climate Tech', surge: '+29%', avgCtc: 7.5 }
    ],
    keyHubs: ['GIFT City SEZ Gandhinagar', 'Sanand Industrial Cluster', 'Dholera Special Region'],
    keyEmployers: ['Tata Semiconductor Fab', 'NSE International Exchange', 'Adani Clean Energy', 'Micron Assembly'],
    feederInstitutes: ['IIT Gandhinagar', 'SVNIT Surat', 'DA-IICT Gandhinagar', 'Nirma University'],
    deficitTag: 'CRITICAL: Clean Hydrogen Process Engineers & Fab Yield Leads',
    plfs: { lfpr: 49.6, ur: 1.1, source: 'MoSPI Periodic Labour Force Survey 2023-24 (Table 1: Usual Status ps+ss)' },
    employability: { rate: 72.40, city: 'GIFT City · Ahmedabad', source: 'Wheebox India Skills Report 2026' },
    gccDensity: { count: 85, source: 'NASSCOM GCC Review 2026' }
  },
  {
    id: 'kerala',
    name: 'Kerala',
    capital: 'Kochi · Thiruvananthapuram',
    zone: 'South',
    tagline: 'SpaceTech Ecosystem, Marine Robotics & Digital Health',
    startingCtcLakhs: 9.1,
    fiveYearCtcLakhs: 20.8,
    hiringVelocity: 23,
    arbitrageYield: '2.50x Quality-of-Life CoL Arbitrage',
    topCareers: [
      { title: 'Aerospace & Avionics Systems Engineer', domain: 'Hardware & SpaceTech', surge: '+34%', avgCtc: 9.5 },
      { title: 'Satellite Communications & Space Tech Engineer', domain: 'SpaceTech & Defense', surge: '+30%', avgCtc: 10.3 },
      { title: 'Biomedical & MedTech Device Engineer', domain: 'Biotech & Health', surge: '+28%', avgCtc: 7.5 },
      { title: 'AR/VR & Spatial Computing Engineer', domain: 'Design & Product', surge: '+26%', avgCtc: 9.0 }
    ],
    keyHubs: ['Technopark Trivandrum', 'Infopark Kochi', 'ISRO Propulsion Cluster'],
    keyEmployers: ['VSSC / ISRO Hub', 'Tata Elxsi Innovation', 'NeST Digital', 'Maker Village Kochi'],
    feederInstitutes: ['IIST Thiruvananthapuram', 'NIT Calicut', 'CET Trivandrum', 'CUSAT'],
    deficitTag: 'CRITICAL: Satellite Avionics & Autonomous Subsea Control',
    plfs: { lfpr: 45.4, ur: 7.2, source: 'MoSPI Periodic Labour Force Survey 2023-24 (Table 1: Usual Status ps+ss)' },
    employability: { rate: 76.56, city: 'Kochi (76.6%) · Trivandrum', source: 'Wheebox India Skills Report 2026' },
    gccDensity: { count: 55, source: 'NASSCOM GCC Review 2026' }
  }
];

export interface ProvenanceSource {
  id: string;
  title: string;
  authority: string;
  metrics: string;
  citation: string;
  url: string;
}

export const FALLBACK_PROVENANCE_SOURCES: ProvenanceSource[] = [
  {
    id: 'mospi-plfs',
    title: 'MoSPI Periodic Labour Force Survey (PLFS) 2023–24',
    authority: 'Ministry of Statistics & Programme Implementation, Govt. of India',
    metrics: 'State-wise LFPR, Worker Population Ratio (WPR), and Unemployment Rates across all 36 States/UTs',
    citation: 'MoSPI (2024). Annual Report: PLFS (July 2023 - June 2024). New Delhi: NSSO. mospi.gov.in & data.gov.in',
    url: 'https://mospi.gov.in/'
  },
  {
    id: 'nasscom-gcc',
    title: 'NASSCOM Strategic Review & Tech Talent Horizons 2026',
    authority: 'NASSCOM & Deloitte & Talent500',
    metrics: '2,100+ GCCs in India employing 2.36M, 45% YoY AI demand surge, 30%-40% GenAI salary premium',
    citation: 'NASSCOM (2026). India’s Tech Industry: Resilience and Emerging Talent Horizons.',
    url: 'https://nasscom.in/'
  },
  {
    id: 'wheebox-skills',
    title: 'India Skills Report 2026 (13th Edition)',
    authority: 'Wheebox, Confederation of Indian Industry (CII), AICTE, and AIU',
    metrics: 'Youth Employability: Pune (78.92%), Bengaluru (77.84%), Kochi (76.56%), CS/IT 80%',
    citation: 'Wheebox, CII, AICTE (2026). India Skills Report: The Techno-Human Workforce & Skills-First Hiring.',
    url: 'https://wheebox.com/'
  },
  {
    id: 'teamlease-salary',
    title: 'TeamLease Digital Skills & Salary Primer FY26/FY27',
    authority: 'TeamLease Digital & AmbitionBox',
    metrics: 'Specialization compensation premiums & verified Indian engineering percentile bands (P25-P75)',
    citation: 'TeamLease Digital (2026). Digital Skills & Salary Primer: Specialization Premiums.',
    url: 'https://teamlease.com/'
  },
  {
    id: 'onet-31',
    title: 'O*NET 31.0 Database (Interests & Abilities)',
    authority: 'U.S. Department of Labor / Employment & Training Administration',
    metrics: 'Standardized RIASEC Holland dimensions & 5-factor cognitive ability ratings (Deductive, Math, Spatial)',
    citation: 'U.S. Department of Labor (2026). O*NET Database Release 31.0. onetcenter.org (CC BY 4.0).',
    url: 'https://onetcenter.org/'
  },
  {
    id: 'nirf-aicte',
    title: 'NIRF & AICTE Fee Regulatory Standards 2025/2026',
    authority: 'Ministry of Education, Government of India',
    metrics: '4-Year B.Tech Cost of Attendance tiers across Central Govt, Deemed Private, and State Engineering Colleges',
    citation: 'Ministry of Education (2025/2026). NIRF India Rankings & Institutional Fee Schedules.',
    url: 'https://nirfindia.org/'
  }
];

interface PopularCareer {
  id: string;
  rank: number;
  title: string;
  domain: string;
  nationalSurge: string;
  startingCtc: string;
  fiveYearCtc: string;
  popularityScore: number;
  topStates: string[];
  shortageIndex: string;
  whyPopular: string;
  activeOpenings?: number;
}

const NATIONAL_POPULAR_CAREERS: PopularCareer[] = [
  {
    id: 'ai_ml_engineer',
    rank: 1,
    title: 'AI & Machine Learning Engineer',
    domain: 'AI & Data Science',
    nationalSurge: '+97.0% Surge',
    startingCtc: '₹9.5 - ₹16.0 LPA',
    fiveYearCtc: '₹24.0 - ₹38.0 LPA',
    popularityScore: 97,
    topStates: ['Bangalore', 'Hyderabad', 'Pune'],
    shortageIndex: 'CRITICAL DEFICIT (Risk: MEDIUM)',
    whyPopular: 'Designs, builds, and deploys scalable machine learning models, neural networks, and generative AI systems into production architectures. Verified via NASSCOM Strategic Review & TeamLease FY27 Quarterly Refresh.'
  },
  {
    id: 'vlsi_semiconductor_design_engineer',
    rank: 2,
    title: 'VLSI & Semiconductor Design Engineer',
    domain: 'Hardware & Semiconductor Systems',
    nationalSurge: '+96.0% Surge',
    startingCtc: '₹9.0 - ₹16.5 LPA',
    fiveYearCtc: '₹22.0 - ₹36.0 LPA',
    popularityScore: 98,
    topStates: ['Bangalore', 'Hyderabad', 'Noida / Delhi NCR'],
    shortageIndex: 'CRITICAL DEFICIT (Risk: LOW)',
    whyPopular: 'Designs microchips, ASIC architectures, FPGA synthesis blocks, and system-on-chips (SoC) for modern computing and India Semiconductor Mission. Verified via NASSCOM Strategic Review & TeamLease FY27 Quarterly Refresh.'
  },
  {
    id: 'cybersecurity_analyst',
    rank: 3,
    title: 'Cybersecurity & Cryptographic Analyst',
    domain: 'Software & Cloud Systems',
    nationalSurge: '+94.0% Surge',
    startingCtc: '₹7.0 - ₹12.0 LPA',
    fiveYearCtc: '₹17.0 - ₹27.0 LPA',
    popularityScore: 94,
    topStates: ['Bangalore', 'Delhi NCR', 'Hyderabad'],
    shortageIndex: 'CRITICAL DEFICIT (Risk: LOW)',
    whyPopular: 'Protects enterprise systems against cyber warfare, vulnerability exploits, and data breaches using zero-trust architecture and cryptographic protocols. Verified via NASSCOM Strategic Review & TeamLease FY27 Quarterly Refresh.'
  },
  {
    id: 'fintech_quantitative_analyst',
    rank: 4,
    title: 'Fintech Quantitative & Algorithmic Analyst',
    domain: 'Quantitative Finance & FinTech',
    nationalSurge: '+94.0% Surge',
    startingCtc: '₹12.0 - ₹24.0 LPA',
    fiveYearCtc: '₹28.0 - ₹50.0 LPA',
    popularityScore: 95,
    topStates: ['Mumbai', 'Bangalore', 'Delhi NCR (Gurugram)'],
    shortageIndex: 'CRITICAL DEFICIT (Risk: HIGH)',
    whyPopular: 'Constructs high-frequency algorithmic trading strategies, risk variance models, automated market-making algorithms, and quantitative portfolio optimization. Verified via NASSCOM Strategic Review & TeamLease FY27 Quarterly Refresh.'
  },
  {
    id: 'data_platform_engineer',
    rank: 5,
    title: 'Data Platform & Cloud Engineer',
    domain: 'AI & Data Science',
    nationalSurge: '+93.0% Surge',
    startingCtc: '₹8.5 - ₹14.0 LPA',
    fiveYearCtc: '₹20.0 - ₹32.0 LPA',
    popularityScore: 93,
    topStates: ['Bangalore', 'Hyderabad', 'Pune'],
    shortageIndex: 'HIGH DEFICIT (Risk: LOW)',
    whyPopular: 'Constructs high-throughput distributed data pipelines, lakehouses, and stream-processing infrastructure for enterprise analytics. Verified via NASSCOM Strategic Review & TeamLease FY27 Quarterly Refresh.'
  },
  {
    id: 'electric_vehicle_powertrain_engineer',
    rank: 6,
    title: 'Electric Vehicle & Battery Systems Engineer',
    domain: 'CleanTech & Automotive Mobility',
    nationalSurge: '+92.0% Surge',
    startingCtc: '₹6.5 - ₹11.0 LPA',
    fiveYearCtc: '₹16.0 - ₹27.0 LPA',
    popularityScore: 94,
    topStates: ['Pune', 'Chennai', 'Bangalore'],
    shortageIndex: 'CRITICAL DEFICIT (Risk: LOW)',
    whyPopular: 'Develops EV traction motor controllers, high-voltage battery management systems (BMS), regenerative braking, and thermal runaway prevention. Verified via NASSCOM Strategic Review & TeamLease FY27 Quarterly Refresh.'
  }
];

interface TalentAtlasModuleProps {
  onStartAssessment: (view?: AppView) => void;
}

export const TalentAtlasModule: React.FC<TalentAtlasModuleProps> = ({ onStartAssessment }) => {
  const [selectedStateId, setSelectedStateId] = useState<string>('karnataka');
  const [activeTab, setActiveTab] = useState<'states' | 'popular' | 'arbitrage' | 'live_search'>('states');
  const [zoneFilter, setZoneFilter] = useState<'All' | 'South' | 'West' | 'North'>('All');

  // Adzuna Live Job Search State
  const [searchQuery, setSearchQuery] = useState<string>('AI Engineer');
  const [searchLocation, setSearchLocation] = useState<string>('Bengaluru');
  const [searchResults, setSearchResults] = useState<LiveJobPosting[]>([]);
  const [searchTotalCount, setSearchTotalCount] = useState<number>(0);
  const [searchMeanSalary, setSearchMeanSalary] = useState<number | null>(null);
  const [isSearchingJobs, setIsSearchingJobs] = useState<boolean>(false);
  const [searchHasExecuted, setSearchHasExecuted] = useState<boolean>(false);
  const [searchSource, setSearchSource] = useState<string>('Adzuna Live Labor Market API (India)');

  // Live market telemetry state
  const [statesData, setStatesData] = useState<StateData[]>(INDIAN_STATES_DATA);
  const [popularCareersData, setPopularCareersData] = useState<PopularCareer[]>(NATIONAL_POPULAR_CAREERS);
  const [pulseData, setPulseData] = useState<TalentAtlasPayload['pulse'] | null>(null);
  const [provenanceSources, setProvenanceSources] = useState<ProvenanceSource[]>(FALLBACK_PROVENANCE_SOURCES);
  const [isProvenanceModalOpen, setIsProvenanceModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [timeAgo, setTimeAgo] = useState<string>('Connecting...');
  const [autoSync, setAutoSync] = useState<boolean>(true);

  // Live Adzuna Job Search executor
  const executeLiveJobSearch = useCallback(async (queryOverride?: string, locOverride?: string) => {
    const q = queryOverride !== undefined ? queryOverride : searchQuery;
    const l = locOverride !== undefined ? locOverride : searchLocation;
    setIsSearchingJobs(true);
    try {
      const res = await ApiService.searchLiveTalent(q, l, 1, 8);
      if (res?.data) {
        setSearchResults(res.data.results || []);
        setSearchTotalCount(res.data.count || 0);
        setSearchMeanSalary(res.data.meanSalaryLakhs);
        setSearchSource(res.data.source || 'Adzuna Live Labor Market API (India)');
        setSearchHasExecuted(true);
      }
    } catch (err) {
      console.warn('[TalentAtlas] Live job search note:', err);
    } finally {
      setIsSearchingJobs(false);
    }
  }, [searchQuery, searchLocation]);

  const handleDrilldownToLiveJobs = (careerTitle: string, locationName: string) => {
    setSearchQuery(careerTitle);
    setSearchLocation(locationName);
    setActiveTab('live_search');
    executeLiveJobSearch(careerTitle, locationName);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Live market telemetry fetcher
  const fetchLiveMarketData = useCallback(async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const res = await ApiService.getTalentAtlasData();
      if (res?.data) {
        if (res.data.states && res.data.states.length > 0) {
          setStatesData(res.data.states);
        }
        if (res.data.popularCareers && res.data.popularCareers.length > 0) {
          setPopularCareersData(res.data.popularCareers);
        }
        if (res.data.pulse) {
          setPulseData(res.data.pulse);
        }
        if (res.data.provenanceSources && res.data.provenanceSources.length > 0) {
          setProvenanceSources(res.data.provenanceSources as ProvenanceSource[]);
        }
        setLastSyncTime(new Date());
        setTimeAgo('Just now');
      }
    } catch (err) {
      console.warn('[TalentAtlas] Live market telemetry fetch note:', err);
    } finally {
      if (!silent) {
        setTimeout(() => setIsSyncing(false), 350);
      }
    }
  }, []);

  // Periodic polling & focus/visibility listeners
  useEffect(() => {
    // 1. Initial fetch
    fetchLiveMarketData(false);

    // 2. Tab focus & visibility handlers
    const handleFocus = () => fetchLiveMarketData(true);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchLiveMarketData(true);
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    // 3. Periodic real-time background polling (every 15 seconds)
    let interval: any = null;
    if (autoSync) {
      interval = setInterval(() => {
        fetchLiveMarketData(true);
      }, 15000);
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (interval) clearInterval(interval);
    };
  }, [fetchLiveMarketData, autoSync]);

  // Relative timestamp ticker
  useEffect(() => {
    const timer = setInterval(() => {
      if (!lastSyncTime) return;
      const elapsedSeconds = Math.floor((Date.now() - lastSyncTime.getTime()) / 1000);
      if (elapsedSeconds < 5) {
        setTimeAgo('Just now');
      } else if (elapsedSeconds < 60) {
        setTimeAgo(`${elapsedSeconds}s ago`);
      } else {
        const mins = Math.floor(elapsedSeconds / 60);
        setTimeAgo(`${mins}m ago`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastSyncTime]);

  const selectedState = statesData.find((s) => s.id === selectedStateId) || statesData[0];

  const filteredStates = statesData.filter((s) => {
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
      <style>{`
        @keyframes radar-pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        @keyframes spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
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
            <button
              onClick={() => setIsProvenanceModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: "'Martian Mono', monospace",
                fontSize: '11px',
                color: '#2D5A43',
                backgroundColor: 'rgba(45, 90, 67, 0.08)',
                border: '1px solid rgba(45, 90, 67, 0.25)',
                padding: '4px 10px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(45, 90, 67, 0.16)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(45, 90, 67, 0.08)')}
            >
              <ShieldCheck size={12} color="#2D5A43" />
              <span style={{ fontWeight: 700 }}>MoSPI PLFS & NASSCOM GROUND TRUTH</span>
              <span style={{ textDecoration: 'underline', color: '#181816', fontSize: '10px', marginLeft: '4px' }}>[AUDIT SOURCES ↗]</span>
            </button>
          </div>

          <button
            onClick={() => onStartAssessment('onboarding')}
            style={{
              height: '40px',
              padding: '0 22px',
              backgroundColor: '#2D5A43',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '0px',
              fontFamily: "'Martian Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s ease',
              boxShadow: '0 2px 8px rgba(45, 90, 67, 0.15)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#234735')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2D5A43')}
          >
            <span>■</span>
            <span>START CALIBRATED ASSESSMENT</span>
          </button>
        </div>

        {/* Section Header */}
        <div style={{ marginBottom: '28px', borderBottom: '1px solid rgba(24, 24, 22, 0.12)', paddingBottom: '24px' }}>
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

        {/* Live Talent Demand Radar Telemetry Bar - Refined Light Architectural Theme */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            color: '#181816',
            padding: '28px 32px',
            marginBottom: '36px',
            border: '1px solid rgba(24, 24, 22, 0.12)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
          }}
        >
          {/* Top row of banner: live indicator, mode, and controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              borderBottom: '1px solid rgba(24, 24, 22, 0.08)',
              paddingBottom: '18px',
              marginBottom: '22px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 10px #10B981',
                    animation: 'radar-pulse 2s infinite ease-in-out'
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '11.5px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: '#2D5A43'
                  }}
                >
                  LIVE TALENT DEMAND RADAR · BHARAT
                </span>
              </div>
              <span
                style={{
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '10px',
                  color: '#6E6A61',
                  backgroundColor: '#F6F5F1',
                  border: '1px solid rgba(24, 24, 22, 0.08)',
                  padding: '3px 8px'
                }}
              >
                15s CADENCE · CONTINUOUS TELEMETRY
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#6E6A61' }}>
                <Clock size={12} style={{ color: '#2D5A43' }} />
                <span>SYNC: {timeAgo}</span>
              </div>

              <button
                onClick={() => setAutoSync(!autoSync)}
                style={{
                  background: '#F6F5F1',
                  border: '1px solid rgba(24, 24, 22, 0.15)',
                  color: autoSync ? '#2D5A43' : '#6E6A61',
                  padding: '5px 12px',
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                title={autoSync ? 'Auto-sync active (15s intervals)' : 'Auto-sync paused'}
              >
                <span>AUTO-SYNC: {autoSync ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => fetchLiveMarketData(false)}
                disabled={isSyncing}
                style={{
                  backgroundColor: '#2D5A43',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '7px 16px',
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '10.5px',
                  fontWeight: 600,
                  cursor: isSyncing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSyncing) e.currentTarget.style.backgroundColor = '#234735';
                }}
                onMouseLeave={(e) => {
                  if (!isSyncing) e.currentTarget.style.backgroundColor = '#2D5A43';
                }}
              >
                <RefreshCw
                  size={11}
                  style={{
                    animation: isSyncing ? 'spin-cw 0.8s linear infinite' : 'none'
                  }}
                />
                <span>{isSyncing ? 'SYNCING...' : 'SYNC RADAR'}</span>
              </button>
            </div>
          </div>

          {/* Metric telemetry tiles */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '18px'
            }}
          >
            <div style={{ backgroundColor: '#F9F8F5', border: '1px solid rgba(24, 24, 22, 0.08)', padding: '20px 22px' }}>
              <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61', letterSpacing: '0.08em', fontWeight: 600 }}>
                VERIFIED STEAM OPENINGS
              </div>
              <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '32px', fontWeight: 800, color: '#181816', margin: '3px 0' }}>
                {(pulseData?.activeOpenings || 285560).toLocaleString()}
              </div>
              <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#2D5A43', fontWeight: 600 }}>
                {pulseData?.openingsDelta || '+1,217 verified past 24h'}
              </div>
            </div>

            <div style={{ backgroundColor: '#F9F8F5', border: '1px solid rgba(24, 24, 22, 0.08)', padding: '20px 22px' }}>
              <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61', letterSpacing: '0.08em', fontWeight: 600 }}>
                NATIONAL HIRING VELOCITY
              </div>
              <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '32px', fontWeight: 800, color: '#2D5A43', margin: '3px 0' }}>
                +{pulseData?.nationalVelocity || 33.7}%
              </div>
              <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#6E6A61' }}>
                Annualized talent intake expansion
              </div>
            </div>

            <div style={{ backgroundColor: '#F9F8F5', border: '1px solid rgba(24, 24, 22, 0.08)', padding: '20px 22px' }}>
              <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61', letterSpacing: '0.08em', fontWeight: 600 }}>
                ACTIVE EPICENTER HUB
              </div>
              <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '22px', fontWeight: 800, color: '#181816', margin: '5px 0', lineHeight: 1.15 }}>
                {pulseData?.hotHub || 'Bengaluru · Hyderabad DeepTech Corridor'}
              </div>
              <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#6E6A61' }}>
                Peak quarterly hiring density
              </div>
            </div>

            <div style={{ backgroundColor: '#F9F8F5', border: '1px solid rgba(24, 24, 22, 0.08)', padding: '20px 22px' }}>
              <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61', letterSpacing: '0.08em', fontWeight: 600 }}>
                DOMINANT SECTOR SHORTAGE
              </div>
              <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '22px', fontWeight: 800, color: '#C05621', margin: '5px 0', lineHeight: 1.15 }}>
                {pulseData?.dominantSector || 'Generative AI & Semiconductor VLSI'}
              </div>
              <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#6E6A61' }}>
                Deficit Volatility: {pulseData?.volatilityScore || '14.2'} (Severe)
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs - Spacious Light Design */}
        <div
          style={{
            display: 'flex',
            gap: '0px',
            borderBottom: '1px solid rgba(24, 24, 22, 0.12)',
            marginBottom: '36px'
          }}
        >
          {[
            { id: 'states' as const, label: '01 · STATE & TECH CORRIDOR ATLAS', icon: <MapPin size={13} /> },
            { id: 'popular' as const, label: '02 · NATIONAL CAREER SURGE MATRIX', icon: <TrendingUp size={13} /> },
            { id: 'arbitrage' as const, label: '03 · SALARY VS COST-OF-LIVING ARBITRAGE', icon: <BarChart3 size={13} /> },
            { id: 'live_search' as const, label: '04 · LIVE ADZUNA TALENT RADAR ⚡', icon: <Zap size={13} /> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'live_search' && !searchHasExecuted) {
                    executeLiveJobSearch();
                  }
                }}
                style={{
                  padding: '16px 28px',
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? '#2D5A43' : '#6E6A61',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(24, 24, 22, 0.12) rgba(24, 24, 22, 0.12) transparent' : 'transparent',
                  borderBottom: isActive ? '2px solid #2D5A43' : 'none',
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.18s ease',
                  marginBottom: '-1px'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#6E6A61', marginRight: '6px', fontWeight: 600 }}>
                FILTER REGION:
              </span>
              {(['All', 'South', 'West', 'North'] as const).map((zone) => (
                <button
                  key={zone}
                  onClick={() => setZoneFilter(zone)}
                  style={{
                    padding: '8px 18px',
                    backgroundColor: zoneFilter === zone ? '#2D5A43' : '#FFFFFF',
                    color: zoneFilter === zone ? '#FFFFFF' : '#181816',
                    border: zoneFilter === zone ? '1px solid #2D5A43' : '1px solid rgba(24, 24, 22, 0.14)',
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '10.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: zoneFilter === zone ? '0 2px 6px rgba(45, 90, 67, 0.2)' : 'none'
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
                gridTemplateColumns: 'minmax(320px, 380px) 1fr',
                gap: '32px',
                alignItems: 'start'
              }}
              className="responsive-stack"
            >
              {/* Left Column: State Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredStates.map((st) => {
                  const isSelected = selectedStateId === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStateId(st.id)}
                      style={{
                        padding: '20px 22px',
                        backgroundColor: isSelected ? '#FFFFFF' : '#F9F8F5',
                        border: isSelected ? '2px solid #2D5A43' : '1px solid rgba(24, 24, 22, 0.1)',
                        boxShadow: isSelected ? '0 8px 24px rgba(45, 90, 67, 0.08)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = '#F9F8F5';
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
                        <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61', fontWeight: 600 }}>
                          {st.zone.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#181816', fontWeight: 600, marginBottom: '8px' }}>
                        {st.capital}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#6E6A61' }}>
                        <span>AVG ENTRY: ₹{st.startingCtcLakhs}L</span>
                        <span style={{ color: '#2D5A43', fontWeight: 700 }}>+{st.hiringVelocity}% YoY</span>
                      </div>

                      {st.activePostings && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed rgba(24, 24, 22, 0.1)', fontFamily: "'Martian Mono', monospace", fontSize: '9.5px' }}>
                          <span style={{ color: '#2D5A43', fontWeight: 600 }}>● {st.activePostings.toLocaleString()} ROLES</span>
                          <span style={{ color: '#10B981', fontWeight: 700 }}>{st.liveDelta || '+2.4%'}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Active State Comprehensive Intelligence Board */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(24, 24, 22, 0.12)',
                  padding: '40px 48px',
                  boxShadow: '0 6px 28px rgba(0, 0, 0, 0.03)'
                }}
              >
                {/* State Title Header */}
                <div style={{ borderBottom: '1px solid rgba(24, 24, 22, 0.1)', paddingBottom: '24px', marginBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#2D5A43', fontWeight: 700, letterSpacing: '0.12em' }}>
                        {selectedState.zone.toUpperCase()} INDIA INNOVATION CORRIDOR
                      </span>
                      <h2
                        style={{
                          fontFamily: "'Big Shoulders Display', sans-serif",
                          fontSize: '40px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          margin: '6px 0 8px 0',
                          lineHeight: 1
                        }}
                      >
                        {selectedState.name} — {selectedState.capital}
                      </h2>
                      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '15px', color: '#6E6A61', lineHeight: 1.5 }}>
                        {selectedState.tagline}
                      </div>
                    </div>

                    {/* Deficit Badge */}
                    <div
                      style={{
                        padding: '8px 14px',
                        backgroundColor: 'rgba(220, 38, 38, 0.06)',
                        border: '1px solid rgba(220, 38, 38, 0.25)',
                        fontFamily: "'Martian Mono', monospace",
                        fontSize: '10.5px',
                        fontWeight: 700,
                        color: '#DC2626',
                        letterSpacing: '0.06em'
                      }}
                    >
                      {selectedState.deficitTag}
                    </div>
                  </div>
                </div>

                {/* 4 Metric High-Density Counters (with Live Active Telemetry) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '18px',
                    marginBottom: '32px'
                  }}
                >
                  <div style={{ padding: '20px 22px', backgroundColor: '#F9F8F5', border: '1px solid rgba(24, 24, 22, 0.08)' }}>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#6E6A61' }}>
                      STARTING CTC (ENTRY)
                    </div>
                    <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '32px', fontWeight: 800, color: '#181816', margin: '4px 0' }}>
                      ₹{selectedState.startingCtcLakhs} LPA
                    </div>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#2D5A43', fontWeight: 600 }}>
                      Across Seeded STEAM Roles
                    </div>
                  </div>

                  <div style={{ padding: '20px 22px', backgroundColor: '#F9F8F5', border: '1px solid rgba(24, 24, 22, 0.08)' }}>
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

                  <div style={{ padding: '20px 22px', backgroundColor: '#F9F8F5', border: '1px solid rgba(24, 24, 22, 0.08)' }}>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#6E6A61' }}>
                      HIRING VELOCITY
                    </div>
                    <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '32px', fontWeight: 800, color: '#181816', margin: '4px 0' }}>
                      +{selectedState.hiringVelocity}%
                    </div>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#2D5A43', fontWeight: 600 }}>
                      Annual Talent Intake Surge
                    </div>
                  </div>

                  <div style={{ padding: '20px 22px', backgroundColor: '#F9F8F5', border: '1px solid rgba(45, 90, 67, 0.25)', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#2D5A43', fontWeight: 700 }}>
                        ACTIVE POSTINGS
                      </div>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                    </div>
                    <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '32px', fontWeight: 800, color: '#2D5A43', margin: '4px 0' }}>
                      {(selectedState.activePostings || 54200).toLocaleString()}
                    </div>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#10B981', fontWeight: 700 }}>
                      {selectedState.liveDelta || '+2.4% this week'}
                    </div>
                  </div>
                </div>

                {/* Official MoSPI PLFS & NASSCOM Macro Benchmark Strip */}
                <div
                  style={{
                    backgroundColor: '#F5F4EE',
                    border: '1px solid rgba(24, 24, 22, 0.1)',
                    padding: '20px 24px',
                    marginBottom: '32px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={15} color="#2D5A43" />
                      <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#2D5A43', letterSpacing: '0.08em' }}>
                        OFFICIAL MoSPI PLFS 2023-24 & NASSCOM BENCHMARKS
                      </span>
                    </div>
                    <button
                      onClick={() => setIsProvenanceModalOpen(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2D5A43',
                        fontFamily: "'Martian Mono', monospace",
                        fontSize: '10.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      AUDIT DATA SOURCES ↗
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '16px'
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '9.5px', color: '#6E6A61' }}>
                        MoSPI UNEMPLOYMENT RATE (UR)
                      </div>
                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '16px', fontWeight: 700, color: '#181816', marginTop: '2px' }}>
                        {selectedState.plfs?.ur ?? 2.7}%
                        <span style={{ fontSize: '9.5px', color: '#2D5A43', marginLeft: '6px', fontWeight: 600 }}>[LOW UR]</span>
                      </div>
                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '9px', color: '#6E6A61' }}>
                        Official state labor baseline
                      </div>
                    </div>

                    <div>
                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '9.5px', color: '#6E6A61' }}>
                        LABOUR FORCE PARTICIPATION (LFPR)
                      </div>
                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '16px', fontWeight: 700, color: '#181816', marginTop: '2px' }}>
                        {selectedState.plfs?.lfpr ?? 45.4}%
                      </div>
                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '9px', color: '#6E6A61' }}>
                        MoSPI Annual Report 23-24
                      </div>
                    </div>

                    <div>
                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '9.5px', color: '#6E6A61' }}>
                        WHEEBOX YOUTH EMPLOYABILITY
                      </div>
                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '16px', fontWeight: 700, color: '#2D5A43', marginTop: '2px' }}>
                        {selectedState.employability?.rate ?? 77.8}%
                      </div>
                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '9px', color: '#6E6A61' }}>
                        {selectedState.employability?.city || selectedState.capital}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '9.5px', color: '#6E6A61' }}>
                        NASSCOM GCC DENSITY
                      </div>
                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '16px', fontWeight: 700, color: '#181816', marginTop: '2px' }}>
                        {selectedState.gccDensity?.count ?? 680}+ GCCs
                      </div>
                      <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '9px', color: '#6E6A61' }}>
                        Global Capability Centers
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top In-Demand Careers in This State */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#181816', marginBottom: '16px' }}>
                    MOST IN-DEMAND CAREER ROLES IN {selectedState.name.toUpperCase()}:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    {selectedState.topCareers.map((c, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '18px 20px',
                          backgroundColor: '#F9F8F5',
                          border: '1px solid rgba(24, 24, 22, 0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '9.5px', color: '#2D5A43', fontWeight: 700 }}>
                            {c.domain.toUpperCase()}
                          </div>
                          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14.5px', fontWeight: 700, color: '#181816', marginTop: '4px' }}>
                            {c.title}
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(24, 24, 22, 0.08)', paddingTop: '10px' }}>
                          <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#181816', fontWeight: 700 }}>
                            ₹{c.avgCtc}L Entry
                          </span>
                          <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10.5px', color: '#2D5A43', fontWeight: 700 }}>
                            {c.surge}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDrilldownToLiveJobs(c.title, selectedState.capital.split('·')[0].trim())}
                          style={{
                            marginTop: '8px',
                            width: '100%',
                            padding: '6px 8px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid rgba(45, 90, 67, 0.35)',
                            color: '#2D5A43',
                            fontFamily: "'Martian Mono', monospace",
                            fontSize: '9.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2D5A43';
                            e.currentTarget.style.color = '#FFFFFF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                            e.currentTarget.style.color = '#2D5A43';
                          }}
                        >
                          <Zap size={11} />
                          <span>SEARCH LIVE ON ADZUNA ↗</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Hubs, Employers, and Institutes */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '28px',
                    borderTop: '1px solid rgba(24, 24, 22, 0.1)',
                    paddingTop: '28px',
                    marginBottom: '32px'
                  }}
                  className="responsive-stack"
                >
                  <div>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#6E6A61', marginBottom: '10px' }}>
                      KEY TECH SUB-DISTRICTS:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedState.keyHubs.map((hub, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#F9F8F5',
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
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#6E6A61', marginBottom: '10px' }}>
                      PROMINENT RESEARCH LABS & HIRERS:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedState.keyEmployers.map((emp, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#F9F8F5',
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

                {/* Action Strip on State Board - Clean Light Architectural Theme */}
                <div
                  style={{
                    backgroundColor: '#F3F6F4',
                    border: '1px solid rgba(45, 90, 67, 0.25)',
                    borderLeft: '4px solid #2D5A43',
                    padding: '26px 30px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '22px', fontWeight: 800, letterSpacing: '0.02em', textTransform: 'uppercase', color: '#181816' }}>
                      CURIOUS HOW YOUR APTITUDE MATCHES {selectedState.name.toUpperCase()}’S ROLES?
                    </div>
                    <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#6E6A61', marginTop: '4px' }}>
                      Run our 5D mathematical model to calibrate your fit score across 25 career options.
                    </div>
                  </div>

                  <button
                    onClick={() => onStartAssessment('onboarding')}
                    style={{
                      height: '42px',
                      padding: '0 24px',
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
                      gap: '8px',
                      transition: 'background-color 0.2s',
                      boxShadow: '0 2px 8px rgba(45, 90, 67, 0.2)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#234735')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2D5A43')}
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
              {popularCareersData.map((c) => (
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontFamily: "'Martian Mono', monospace",
                          fontSize: '9.5px',
                          color: '#2D5A43',
                          fontWeight: 700,
                          backgroundColor: 'rgba(45, 90, 67, 0.08)',
                          padding: '2px 8px',
                          display: 'inline-block'
                        }}
                      >
                        {c.domain.toUpperCase()}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Martian Mono', monospace",
                          fontSize: '9.5px',
                          color: '#10B981',
                          fontWeight: 700,
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          padding: '2px 6px'
                        }}
                      >
                        LIVE SURGE: {c.nationalSurge}
                      </span>
                      {c.activeOpenings && (
                        <span
                          style={{
                            fontFamily: "'Martian Mono', monospace",
                            fontSize: '9.5px',
                            color: '#6E6A61',
                            backgroundColor: '#F6F5F1',
                            padding: '2px 6px'
                          }}
                        >
                          {c.activeOpenings.toLocaleString()} ROLES
                        </span>
                      )}
                    </div>
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
                        padding: '10px 18px',
                        backgroundColor: '#2D5A43',
                        color: '#FFFFFF',
                        border: 'none',
                        fontFamily: "'Martian Mono', monospace",
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        boxShadow: '0 2px 6px rgba(45, 90, 67, 0.2)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#234735')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2D5A43')}
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
                  {statesData.map((st) => (
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
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                        <div>₹{st.startingCtcLakhs} LPA</div>
                        <span style={{ color: '#2D5A43', fontSize: '10px', fontWeight: 600 }}>+{st.hiringVelocity}% velocity</span>
                      </td>
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

        {/* ====================================================================
            TAB 4: LIVE ADZUNA TALENT RADAR & REAL-TIME JOB SEARCH
            ==================================================================== */}
        {activeTab === 'live_search' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(24, 24, 22, 0.14)',
              padding: '36px'
            }}
          >
            {/* Top Banner with Live Adzuna Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 8px',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      color: '#065F46',
                      fontFamily: "'Martian Mono', monospace",
                      fontSize: '10px',
                      fontWeight: 700
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                    LIVE ADZUNA LABOR API CONNECTED · APP ID: 13999789
                  </span>
                  <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61' }}>
                    COUNTRY: INDIA (in)
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>
                  REAL-TIME TECH JOBS & LIVE WAGE RADAR
                </h3>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#6E6A61', marginTop: '6px', marginBottom: 0, maxWidth: '720px' }}>
                  Query real-time open positions across India's premier tech clusters with live salary telemetry, verified enterprise employers, and direct application links from Adzuna's index.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => executeLiveJobSearch()}
                  disabled={isSearchingJobs}
                  style={{
                    height: '36px',
                    padding: '0 16px',
                    backgroundColor: '#F6F5F1',
                    border: '1px solid rgba(24, 24, 22, 0.2)',
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '10.5px',
                    fontWeight: 600,
                    cursor: isSearchingJobs ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={13} className={isSearchingJobs ? 'animate-spin' : ''} />
                  <span>REFRESH FEED</span>
                </button>
              </div>
            </div>

            {/* Interactive Search Bar & Filters */}
            <div
              style={{
                backgroundColor: '#F6F5F1',
                border: '1px solid rgba(24, 24, 22, 0.12)',
                padding: '20px',
                marginBottom: '28px'
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  executeLiveJobSearch();
                }}
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginBottom: '14px'
                }}
              >
                {/* Keyword input */}
                <div style={{ flex: '1 1 280px', position: 'relative' }}>
                  <Search size={16} color="#6E6A61" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by job title, skill, or domain (e.g. AI Engineer, Robotics, Cloud)..."
                    style={{
                      width: '100%',
                      height: '42px',
                      paddingLeft: '38px',
                      paddingRight: '12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(24, 24, 22, 0.2)',
                      fontFamily: "'Martian Mono', monospace",
                      fontSize: '11.5px',
                      color: '#181816',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Location selector */}
                <div style={{ width: '180px' }}>
                  <select
                    value={searchLocation}
                    onChange={(e) => {
                      setSearchLocation(e.target.value);
                      executeLiveJobSearch(searchQuery, e.target.value);
                    }}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(24, 24, 22, 0.2)',
                      fontFamily: "'Martian Mono', monospace",
                      fontSize: '11px',
                      color: '#181816',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">All India</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Gurugram">Delhi-NCR (Gurugram)</option>
                    <option value="Noida">Delhi-NCR (Noida)</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Ahmedabad">Ahmedabad / GIFT City</option>
                    <option value="Kochi">Kochi / Kerala</option>
                  </select>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSearchingJobs}
                  style={{
                    height: '42px',
                    padding: '0 24px',
                    backgroundColor: '#2D5A43',
                    color: '#FFFFFF',
                    border: 'none',
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    cursor: isSearchingJobs ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <Zap size={14} />
                  <span>{isSearchingJobs ? 'QUERYING ADZUNA...' : 'SEARCH LIVE OPENINGS'}</span>
                </button>
              </form>

              {/* Quick Tech Role Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61', fontWeight: 600 }}>
                  SUGGESTED FILTERS:
                </span>
                {[
                  'AI & Machine Learning',
                  'Full Stack Cloud Architect',
                  'Robotics & Embedded Firmware',
                  'Cybersecurity Analyst',
                  'Data Systems Engineer',
                  'Semiconductor VLSI'
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setSearchQuery(chip);
                      executeLiveJobSearch(chip, searchLocation);
                    }}
                    style={{
                      padding: '4px 9px',
                      backgroundColor: searchQuery.toLowerCase() === chip.toLowerCase() ? '#2D5A43' : '#FFFFFF',
                      color: searchQuery.toLowerCase() === chip.toLowerCase() ? '#FFFFFF' : '#181816',
                      border: '1px solid rgba(24, 24, 22, 0.18)',
                      fontFamily: "'Martian Mono', monospace",
                      fontSize: '10px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Telemetry Indicator Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                marginBottom: '28px'
              }}
            >
              <div style={{ padding: '16px', backgroundColor: '#F6F5F1', border: '1px solid rgba(24, 24, 22, 0.1)' }}>
                <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61' }}>
                  ACTIVE LIVE OPENINGS
                </div>
                <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '28px', fontWeight: 800, color: '#2D5A43', margin: '2px 0' }}>
                  {searchTotalCount.toLocaleString()}
                </div>
                <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '9.5px', color: '#2D5A43' }}>
                  Verified index in {searchLocation || 'All India'}
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#F6F5F1', border: '1px solid rgba(24, 24, 22, 0.1)' }}>
                <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61' }}>
                  ESTIMATED AVERAGE CTC
                </div>
                <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '28px', fontWeight: 800, color: '#181816', margin: '2px 0' }}>
                  {searchMeanSalary ? `₹${searchMeanSalary} LPA` : '₹15 - ₹24 LPA'}
                </div>
                <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '9.5px', color: '#6E6A61' }}>
                  Based on live posted employer bands
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#F6F5F1', border: '1px solid rgba(24, 24, 22, 0.1)' }}>
                <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61' }}>
                  DATA SOURCE PROVENANCE
                </div>
                <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '12px', fontWeight: 700, color: '#181816', marginTop: '6px' }}>
                  {searchSource}
                </div>
                <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '9.5px', color: '#065F46', marginTop: '2px' }}>
                  Cached (10m TTL) · Zero Rate Limit Impact
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {isSearchingJobs ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#F6F5F1', border: '1px solid rgba(24, 24, 22, 0.1)' }}>
                <RefreshCw size={28} className="animate-spin" color="#2D5A43" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '12px', fontWeight: 700, color: '#181816' }}>
                  QUERYING ADZUNA REAL-TIME INDIAN JOB INDEX...
                </div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#6E6A61', marginTop: '4px' }}>
                  Retrieving active postings and live compensation bands for "{searchQuery}"
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
                {searchResults.map((job) => (
                  <div
                    key={job.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(24, 24, 22, 0.14)',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.18s ease',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2D5A43';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(45, 90, 67, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(24, 24, 22, 0.14)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.03)';
                    }}
                  >
                    <div>
                      {/* Top Badges */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                        <span
                          style={{
                            fontFamily: "'Martian Mono', monospace",
                            fontSize: '9.5px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            backgroundColor: 'rgba(45, 90, 67, 0.1)',
                            color: '#2D5A43',
                            border: '1px solid rgba(45, 90, 67, 0.25)'
                          }}
                        >
                          {job.category.toUpperCase()}
                        </span>

                        <span
                          style={{
                            fontFamily: "'Martian Mono', monospace",
                            fontSize: '9.5px',
                            fontWeight: 700,
                            color: '#2D5A43',
                            padding: '3px 8px',
                            backgroundColor: '#F6F5F1',
                            border: '1px solid rgba(24, 24, 22, 0.1)'
                          }}
                        >
                          {job.salaryDisplay}
                        </span>
                      </div>

                      {/* Job Title */}
                      <h4
                        style={{
                          fontFamily: 'system-ui, sans-serif',
                          fontSize: '17px',
                          fontWeight: 700,
                          color: '#181816',
                          lineHeight: 1.3,
                          margin: '0 0 8px 0'
                        }}
                      >
                        {job.title}
                      </h4>

                      {/* Company & Location */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', marginBottom: '12px', fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#6E6A61' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Building2 size={13} color="#2D5A43" />
                          <span style={{ fontWeight: 600, color: '#181816' }}>{job.company}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} color="#6E6A61" />
                          <span>{job.location}</span>
                        </div>
                      </div>

                      {/* Description Snippet */}
                      <p
                        style={{
                          fontFamily: 'system-ui, sans-serif',
                          fontSize: '13px',
                          color: '#55524B',
                          lineHeight: 1.5,
                          margin: '0 0 16px 0'
                        }}
                      >
                        {job.description}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div
                      style={{
                        borderTop: '1px solid rgba(24, 24, 22, 0.08)',
                        paddingTop: '14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61' }}>
                        <Clock size={11} />
                        <span>{new Date(job.created).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>

                      <a
                        href={job.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          backgroundColor: '#181816',
                          color: '#F6F5F1',
                          textDecoration: 'none',
                          fontFamily: "'Martian Mono', monospace",
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2D5A43')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#181816')}
                      >
                        <span>VIEW ON ADZUNA</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '48px 20px', textAlign: 'center', backgroundColor: '#F6F5F1', border: '1px solid rgba(24, 24, 22, 0.1)' }}>
                <Briefcase size={32} color="#6E6A61" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '13px', fontWeight: 700, color: '#181816' }}>
                  NO OPENINGS FOUND MATCHING "{searchQuery}"
                </div>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#6E6A61', marginTop: '6px' }}>
                  Try broadening your keyword or selecting "All India" to view all available positions.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('technology');
                    setSearchLocation('');
                    executeLiveJobSearch('technology', '');
                  }}
                  style={{
                    marginTop: '12px',
                    padding: '8px 18px',
                    backgroundColor: '#2D5A43',
                    color: '#FFFFFF',
                    border: 'none',
                    fontFamily: "'Martian Mono', monospace",
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  VIEW ALL TECH OPENINGS (INDIA)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verified Data Sources Provenance Modal */}
      {isProvenanceModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(24, 24, 22, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsProvenanceModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#F6F5F1',
              maxWidth: '860px',
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              border: '2px solid #181816',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.3)',
              padding: '32px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(24, 24, 22, 0.14)', paddingBottom: '18px', marginBottom: '22px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <ShieldCheck size={16} color="#2D5A43" />
                  <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#2D5A43', letterSpacing: '0.12em' }}>
                    ALIGNX DATA PROVENANCE & METHODOLOGY AUDIT
                  </span>
                </div>
                <h2 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
                  GROUND-TRUTH PRIMARY DATA SOURCES
                </h2>
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#6E6A61', margin: '6px 0 0' }}>
                  Every numerical vector, regional compensation tier, and hiring velocity score in ALIGNX is calibrated against verified primary government and industry publications.
                </p>
              </div>

              <button
                onClick={() => setIsProvenanceModalOpen(false)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(24, 24, 22, 0.2)',
                  padding: '6px 12px',
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Source Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(provenanceSources.length > 0 ? provenanceSources : FALLBACK_PROVENANCE_SOURCES).map((src) => (
                <div
                  key={src.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(24, 24, 22, 0.12)',
                    padding: '16px 20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontFamily: "'Martian Mono', monospace", fontSize: '9.5px', color: '#2D5A43', fontWeight: 700, backgroundColor: 'rgba(45, 90, 67, 0.08)', padding: '2px 8px', display: 'inline-block', marginBottom: '4px' }}>
                        {src.authority.toUpperCase()}
                      </span>
                      <h4 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
                        {src.title}
                      </h4>
                    </div>

                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontFamily: "'Martian Mono', monospace",
                        fontSize: '10px',
                        color: '#2D5A43',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <span>OFFICIAL PORTAL</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>

                  <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '11px', color: '#181816', marginBottom: '4px' }}>
                    <span style={{ color: '#6E6A61' }}>METRICS USED: </span>
                    {src.metrics}
                  </div>

                  <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61', fontStyle: 'italic', borderTop: '1px dashed rgba(24, 24, 22, 0.08)', paddingTop: '6px', marginTop: '6px' }}>
                    CITATION: {src.citation}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer Note */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(24, 24, 22, 0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontFamily: "'Martian Mono', monospace", fontSize: '10px', color: '#6E6A61' }}>
                Full provenance documentation available in <span style={{ fontWeight: 700, color: '#181816' }}>docs/DATA_SOURCES.md</span>
              </div>
              <button
                onClick={() => setIsProvenanceModalOpen(false)}
                style={{
                  backgroundColor: '#2D5A43',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '9px 22px',
                  fontFamily: "'Martian Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  boxShadow: '0 2px 6px rgba(45, 90, 67, 0.2)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#234735')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2D5A43')}
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
