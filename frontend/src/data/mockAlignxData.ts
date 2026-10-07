import type { CareerRecommendation, MarketSignal, OpportunityNode, CareerDnaProfile } from '../types/alignx';
import { ALL_AUTHENTIC_CAREERS } from './allCareers';

// All 25 Authentic STEAM Careers generated from database/seeds/careers.json via the ALIGNX Decision Engine
export const INITIAL_CAREERS: CareerRecommendation[] = ALL_AUTHENTIC_CAREERS;

export const MARKET_SIGNALS: MarketSignal[] = [
  { sector: 'AI & NEURAL COMPUTE', growthPercent: 31, talentShortage: 'Critical', keyHubs: ['Bangalore', 'Hyderabad', 'Singapore'], driver: 'Enterprise LLM deployments and sovereign GPU clusters' },
  { sector: 'SEMICONDUCTOR & VLSI', growthPercent: 24, talentShortage: 'Critical', keyHubs: ['Chennai', 'Bangalore', 'Berlin'], driver: 'Global supply-chain reshoring & India Semiconductor Mission' },
  { sector: 'AUTONOMOUS ROBOTICS', growthPercent: 18, talentShortage: 'Elevated', keyHubs: ['Pune', 'Chennai', 'Tokyo'], driver: 'Industrial automation, drone logistics & surgical robotics' },
  { sector: 'CYBERSECURITY & DEFENSE TECH', growthPercent: 22, talentShortage: 'Elevated', keyHubs: ['Hyderabad', 'Delhi NCR', 'Tel Aviv'], driver: 'Critical national infrastructure & zero-trust compliance' },
  { sector: 'CLEAN ENERGY & BATTERY TECH', growthPercent: 27, talentShortage: 'Elevated', keyHubs: ['Chennai', 'Pune', 'Toronto'], driver: 'Grid-scale storage, EV chemistries & hydrogen fuel transitions' },
  { sector: 'QUANTITATIVE COMPUTING', growthPercent: 19, talentShortage: 'Stable', keyHubs: ['Mumbai', 'Singapore', 'London'], driver: 'Algorithmic market making and systematic multi-asset funds' }
];

export const OPPORTUNITY_NODES: OpportunityNode[] = [
  { city: 'Bangalore', country: 'India', coordinates: { x: 38, y: 64 }, primarySectors: ['AI Systems', 'Silicon Design', 'SaaS'], avgStartingCtcLakhs: 16.5, livingCostIndex: 'Medium' },
  { city: 'Chennai', country: 'India', coordinates: { x: 42, y: 70 }, primarySectors: ['DeepTech Hardware', 'EV & CleanTech', 'Semiconductors'], avgStartingCtcLakhs: 13.0, livingCostIndex: 'Medium' },
  { city: 'Hyderabad', country: 'India', coordinates: { x: 40, y: 58 }, primarySectors: ['Cloud Infrastructure', 'Cybersecurity', 'Life Sciences'], avgStartingCtcLakhs: 14.5, livingCostIndex: 'Low' },
  { city: 'Pune', country: 'India', coordinates: { x: 32, y: 56 }, primarySectors: ['Automotive Robotics', 'Industrial IoT', 'Embedded'], avgStartingCtcLakhs: 12.0, livingCostIndex: 'Low' },
  { city: 'Singapore', country: 'Singapore', coordinates: { x: 68, y: 72 }, primarySectors: ['Quantitative Finance', 'APAC DeepTech', 'Venture'], avgStartingCtcLakhs: 36.0, livingCostIndex: 'High' },
  { city: 'Berlin', country: 'Germany', coordinates: { x: 22, y: 28 }, primarySectors: ['Applied AI', 'Robotics', 'Industrial 4.0'], avgStartingCtcLakhs: 32.0, livingCostIndex: 'Medium' },
  { city: 'Tokyo', country: 'Japan', coordinates: { x: 88, y: 44 }, primarySectors: ['Kinetic Robotics', 'Semiconductors', 'Precision Sensors'], avgStartingCtcLakhs: 34.0, livingCostIndex: 'High' },
  { city: 'Toronto', country: 'Canada', coordinates: { x: 12, y: 35 }, primarySectors: ['AI Research', 'Quantum Computing', 'Biotech'], avgStartingCtcLakhs: 38.0, livingCostIndex: 'High' }
];

export const DEFAULT_CAREER_DNA: CareerDnaProfile = {
  dominantArchetype: 'SYSTEMS ARCHITECT & ALGORITHMIC STRATEGIST',
  subType: 'Investigative-Analytical (Type 7-A)',
  description: 'You thrive when disassembling ambiguous complex systems into deterministic, predictable mathematical abstractions. Rather than treating decisions as emotional impulses, you evaluate risk surfaces, feedback loops, and long-term leverage.',
  traits: [
    { dimension: 'Algorithmic Decomposition', score: 95, descriptor: 'Investigative & Systematic', implication: 'Naturally divides multi-tier challenges into modular executable pipelines.' },
    { dimension: 'Spatial & Structural Logic', score: 86, descriptor: 'High Architectural Topology', implication: 'Visualizes interconnected dependencies, data flows, and physical constraints.' },
    { dimension: 'Empirical Skepticism', score: 90, descriptor: 'Data-Driven Validation', implication: 'Rejects unfounded claims; relies on verifiable telemetry and measured benchmarks.' },
    { dimension: 'Systemic Persistence', score: 88, descriptor: 'Resilient Debugger', implication: 'Retains cognitive focus through extended root-cause analysis without fatigue.' },
    { dimension: 'Calculated Risk Tolerance', score: 72, descriptor: 'Prudent Opportunist', implication: 'Willing to take non-consensus bets when downside is strictly bounded.' }
  ],
  idealEnvironments: [
    'Deep engineering labs with high individual autonomy',
    'High-signal technical teams with low bureaucracy',
    'Environments prioritizing rigorous logic over organizational politics'
  ]
};

export const LIFE_STAGE_DATA = [
  {
    stage: 'class10' as const,
    label: 'Class 10',
    question: 'WHAT SHOULD I STUDY NEXT?',
    context: 'Subject stream selection (PCM, PCB, Commerce, Arts) + foundational aptitude mapping.',
    deliverable: 'Subject Stream Matrix, Aptitude Diagnostics, 5-Year Horizon Projection'
  },
  {
    stage: 'class12' as const,
    label: 'Class 12',
    question: 'WHAT SHOULD I DO AFTER SCHOOL?',
    context: 'Degree pathways, entrance exam trade-offs, college tier vs. family budget optimization.',
    deliverable: 'Degree Feasibility Matrix, Entrance Strategy, Scholarship Roadmap'
  },
  {
    stage: 'ug' as const,
    label: 'Undergraduate',
    question: 'WHAT SHOULD I SPECIALIZE IN?',
    context: 'Core vs interdisciplinary specializations, industry internships, research vs. employment.',
    deliverable: 'Specialization Radar, Skill Gap Audit, Portfolio Blueprint'
  },
  {
    stage: 'pg' as const,
    label: 'Postgraduate',
    question: 'WHAT COMES NEXT?',
    context: 'R&D leadership vs management tracks, global relocation vs domestic high-growth ecosystems.',
    deliverable: 'Market Yield Analysis, Geographic Opportunity Map, ROI Calculator'
  },
  {
    stage: 'professional' as const,
    label: 'Professional',
    question: 'WHAT SHOULD MY NEXT MOVE BE?',
    context: 'Strategic career pivots, upskilling into emergent technologies, executive vs specialist track.',
    deliverable: 'Pivot Risk Assessment, Compensation Arbitrage, Transition Plan'
  }
];

export const APTITUDE_QUESTIONS = [
  {
    id: 1,
    dimension: 'Abstract Logic',
    llmTag: 'cognitive.abstract_logic',
    weight: 0.20,
    prompt: 'In a distributed state machine, if node A transmits a consensus token every 3ms and node B pulses every 5ms, what is the earliest instant past 100ms when both nodes synchronize pulses?',
    options: [
      { text: '105 ms (Least Common Multiple harmonic)', score: 20 },
      { text: '115 ms', score: 0 },
      { text: '120 ms (Sub-harmonic pulse)', score: 10 },
      { text: '100 ms', score: 0 }
    ],
    rationale: 'LCM of 3 and 5 is 15. The first multiple of 15 strictly greater than 100 is 105.'
  },
  {
    id: 2,
    dimension: 'Systems Thinking',
    llmTag: 'cognitive.systems_thinking',
    weight: 0.20,
    prompt: 'When server latency surges by 40% under peak load, cache misses spike 300%. Which first-principles intervention minimizes systemic degradation?',
    options: [
      { text: 'Probabilistic cache eviction + adaptive load shedding at API ingress', score: 20 },
      { text: 'Double CPU core allocation without diagnosing bottleneck profile', score: 6 },
      { text: 'Simultaneously restart all active worker nodes', score: 0 },
      { text: 'Temporarily bypass token authentication checks to reduce roundtrips', score: 0 }
    ],
    rationale: 'Adaptive load shedding protects downstream relational stores from catastrophic stampedes.'
  },
  {
    id: 3,
    dimension: 'Quantitative Estimation',
    llmTag: 'cognitive.quantitative_estimation',
    weight: 0.20,
    prompt: 'An autonomous EV battery pack discharges from 90% to 20% over 280 km of highway cruising. Under 15% headwind aerodynamic drag, how many km will a 50% charge yield?',
    options: [
      { text: 'Approximately 170 km', score: 20 },
      { text: 'Approximately 240 km', score: 5 },
      { text: 'Approximately 110 km', score: 8 },
      { text: 'Approximately 310 km', score: 0 }
    ],
    rationale: '70% drop = 280 km (4 km/%). 50% nominal = 200 km. Deducting 15% aerodynamic drag yields ~170 km.'
  },
  {
    id: 4,
    dimension: 'Spatial & Architecture',
    llmTag: 'cognitive.spatial_architecture',
    weight: 0.20,
    prompt: 'A 3D silicon cube of 4x4x4 micro-cores is sliced diagonally along opposing vertex planes. How many planar communication interconnect buses cross the cut boundary?',
    options: [
      { text: '16 orthogonal planar interconnects', score: 20 },
      { text: '8 planar interconnect buses', score: 6 },
      { text: '32 planar interconnect buses', score: 8 },
      { text: '4 planar interconnect buses', score: 0 }
    ],
    rationale: 'A planar cross-section along the 4x4 internal grid slices exactly 16 orthogonal bus lines.'
  },
  {
    id: 5,
    dimension: 'Ambiguity & Risk Tolerance',
    llmTag: 'cognitive.risk_tolerance',
    weight: 0.20,
    prompt: 'You must allocate research capital between Option A (90% chance of 1.2x steady yield) and Option B (30% chance of 5.5x breakthrough upside, 70% chance of zero return). How do you decide?',
    options: [
      { text: 'Compute Expected Value (A=1.08x vs B=1.65x) and hedge downside with a barbell allocation', score: 20 },
      { text: 'Commit 100% to Option A to eliminate failure risk completely', score: 10 },
      { text: 'Commit 100% to Option B purely for maximum theoretical upside without downside reserve', score: 12 },
      { text: 'Postpone decision indefinitely until complete market certainty emerges', score: 0 }
    ],
    rationale: 'Option B offers higher expected return (1.65x vs 1.08x); a barbell strategy captures asymmetric convex upside while capping catastrophic drawdown.'
  }
];

export const DISCOVERY_SCENARIOS = [
  {
    id: 1,
    category: 'Realistic & Hands-on (R)',
    scenario: 'You are given access to a makerspace with robotics microcontrollers, 3D printers, and code debuggers. Where do you naturally gravitate first?',
    choices: [
      { text: 'Assembling and soldering micro-controllers and wiring physical sensor actuators.', tag: 'Realistic / Hardware Builder' },
      { text: 'Writing algorithmic firmware code to optimize computational PID control loops.', tag: 'Investigative / Algorithmist' },
      { text: 'Designing the ergonomic physical casing and aesthetic industrial CAD enclosure.', tag: 'Artistic / Industrial Designer' },
      { text: 'Organizing the sprint roadmap and orchestrating team member milestones.', tag: 'Enterprising / Project Lead' }
    ]
  },
  {
    id: 2,
    category: 'Investigative & Research (I)',
    scenario: 'You encounter a complex system anomaly with inconsistent telemetry data. How do you approach the problem?',
    choices: [
      { text: 'Formulate mathematical hypotheses and inspect system logs to derive the root cause.', tag: 'Investigative / Analytical Debugger' },
      { text: 'Swap hardware boards and test physical voltage rails with an oscilloscope.', tag: 'Realistic / Diagnostic Technician' },
      { text: 'Interview user cohorts to observe how their interaction triggers the anomaly.', tag: 'Social / User Advocate' },
      { text: 'Document standard operating procedures and write automated compliance checks.', tag: 'Conventional / Quality Assurance' }
    ]
  },
  {
    id: 3,
    category: 'Artistic & Expressive (A)',
    scenario: 'When evaluating a software application or technological platform, what bothers you most?',
    choices: [
      { text: 'Clunky visual design, poor typography hierarchy, and unintuitive user experience.', tag: 'Artistic / UX Architect' },
      { text: 'Sub-optimal algorithmic latency, unindexed database queries, and memory leaks.', tag: 'Investigative / Performance Engineer' },
      { text: 'Fragile business model with negative unit economics and no customer moat.', tag: 'Enterprising / Venture Strategist' },
      { text: 'Lack of accessible onboarding guides and patient customer empathy.', tag: 'Social / Community Mentor' }
    ]
  },
  {
    id: 4,
    category: 'Social & Collaborative (S)',
    scenario: 'During an intensive technical hackathon, what role energizes you the most?',
    choices: [
      { text: 'Mentoring teammates, resolving cross-functional friction, and synthesizing team clarity.', tag: 'Social / Team Catalyst' },
      { text: 'Pitching to hackathon judges with persuasive narratives and commercial viability.', tag: 'Enterprising / Visionary Pitcher' },
      { text: 'Deep solitary focus writing core algorithmic pipelines without interruptions.', tag: 'Investigative / Deep Coder' },
      { text: 'Building the continuous deployment pipeline and setting up Git branching rules.', tag: 'Conventional / Infrastructure Lead' }
    ]
  },
  {
    id: 5,
    category: 'Enterprising & Leadership (E)',
    scenario: 'A breakthrough patent emerges in your field. How do you evaluate its primary value?',
    choices: [
      { text: 'Identifying immediate commercialization avenues, startup spin-offs, and enterprise licensing.', tag: 'Enterprising / Venture Architect' },
      { text: 'Dissecting the mathematical proofs and underlying physics to assess scientific validity.', tag: 'Investigative / Research Scientist' },
      { text: 'Determining how the technology can democratize healthcare, education, or public access.', tag: 'Social / Public Good Pioneer' },
      { text: 'Testing compliance against regulatory safety standards and data privacy mandates.', tag: 'Conventional / Governance Specialist' }
    ]
  },
  {
    id: 6,
    category: 'Conventional & Systems (C)',
    scenario: 'When starting a large-scale project, what is your foundational priority?',
    choices: [
      { text: 'Establishing clear architectural schemas, typed data contracts, and reproducible CI tests.', tag: 'Conventional / Systems Architect' },
      { text: 'Exploring rapid exploratory spikes without worrying about documentation yet.', tag: 'Artistic / Rapid Prototyper' },
      { text: 'Benchmarking competitive products and market demand pricing elasticity.', tag: 'Enterprising / Market Analyst' },
      { text: 'Conducting peer reviews and aligning stakeholder expectations.', tag: 'Social / Collaborative Lead' }
    ]
  }
];
