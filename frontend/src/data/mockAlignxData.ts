import type { CareerRecommendation, MarketSignal, OpportunityNode, CareerDnaProfile } from '../types/alignx';

export const INITIAL_CAREERS: CareerRecommendation[] = [
  {
    id: 'ai-engineer',
    title: 'AI / Machine Learning Systems Engineer',
    domain: 'Intelligent Systems & Neural Computing',
    tagline: 'Designing high-throughput model inference pipelines and edge intelligence engines.',
    scores: {
      studentFit: 94,
      financialFit: 82,
      familyAlignment: 88,
      marketFit: 95,
      locationFit: 86,
      overallScore: 91
    },
    growthRate: '+31% CAGR',
    salaryRange: '₹14L — ₹36L CTC',
    riskLevel: 'Moderate',
    topLocations: ['Bangalore', 'Hyderabad', 'Chennai', 'Singapore'],
    requiredSkills: ['PyTorch / JAX', 'Distributed Systems', 'CUDA / GPU Optimization', 'Vector Databases', 'MLOps'],
    studentSkillGaps: ['Low-level Tensor Compilation', 'Distributed Tracing'],
    strengthsMatch: ['Strong mathematical foundation', 'High algorithmic aptitude (92/100)', 'Abstract logic preference'],
    whyRecommended: [
      'Exceptional alignment between analytical aptitude (88) and neural compute requirements.',
      'Tier-1 market demand across Tier-1 tech hubs with 31% annual hiring velocity.',
      'Affordable local UG pathways with self-funded or sponsored MS optionality.'
    ],
    educationPath: 'B.Tech Computer Science / AI & Data Science → Specialization in Edge AI',
    entranceExams: ['JEE Advanced / Mains', 'GATE Computer Science', 'BITSAT'],
    scholarships: ['Reliance Foundation Scholarship', 'KVPY / INSPIRE Fellowship', 'ACM India Student Grant']
  },
  {
    id: 'semiconductor-architect',
    title: 'Semiconductor VLSI & Silicon Architect',
    domain: 'Hardware Engineering & Microelectronics',
    tagline: 'Architecting next-generation RISC-V compute fabrics and physical synthesis layouts.',
    scores: {
      studentFit: 89,
      financialFit: 86,
      familyAlignment: 85,
      marketFit: 92,
      locationFit: 80,
      overallScore: 87
    },
    growthRate: '+24% CAGR',
    salaryRange: '₹12L — ₹30L CTC',
    riskLevel: 'Low',
    topLocations: ['Bangalore', 'Chennai', 'Hyderabad', 'Berlin'],
    requiredSkills: ['SystemVerilog / UVM', 'ASIC Flow & Synthesis', 'Computer Architecture', 'FPGA Prototyping', 'Static Timing Analysis'],
    studentSkillGaps: ['Physical Design DRC/LVS', 'PCIe / CXL Protocols'],
    strengthsMatch: ['Hardware systems curiosity', 'High precision spatial intuition', 'Deterministic thinking style'],
    whyRecommended: [
      'Matches disciplined systematic mindset with strong physics-electronics baseline.',
      'Massive national semiconductor mission subsidies driving unprecedented domestic silicon hiring.',
      'Long-tenure job stability with exceptional career longevity and patent opportunities.'
    ],
    educationPath: 'B.Tech Electronics & Communication / Electrical Engineering → M.Tech VLSI',
    entranceExams: ['JEE Mains', 'GATE Electronics & Comm', 'VITEEE'],
    scholarships: ['India Semiconductor Mission (ISM) Grant', 'DRDO Young Scientist Fellowship']
  },
  {
    id: 'quant-risk-analyst',
    title: 'Quantitative Systems & Risk Strategist',
    domain: 'Mathematical Finance & Algorithmic Trading',
    tagline: 'Modeling stochastic volatility, high-frequency execution regimes, and cross-asset liquidity risk.',
    scores: {
      studentFit: 86,
      financialFit: 78,
      familyAlignment: 76,
      marketFit: 88,
      locationFit: 82,
      overallScore: 83
    },
    growthRate: '+19% CAGR',
    salaryRange: '₹18L — ₹45L CTC',
    riskLevel: 'High',
    topLocations: ['Mumbai', 'Bangalore', 'Singapore', 'London'],
    requiredSkills: ['Stochastic Calculus', 'C++ Low Latency', 'Time-series Econometrics', 'Python / Polars', 'Risk Arbitrage'],
    studentSkillGaps: ['C++ Order Book Mechanics', 'Options Greeks Surface Modeling'],
    strengthsMatch: ['Hyper-quantitative processing', 'Fast statistical inference', 'Calculated risk appetite'],
    whyRecommended: [
      'Leverages top 5% numerical test results and quick mathematical intuition.',
      'High starting compensation enables immediate debt retirement and capital independence.',
      'Requires higher tolerance for performance volatility.'
    ],
    educationPath: 'B.Tech/BS Mathematics & Computing / Economics → CQF or M.S. Quantitative Finance',
    entranceExams: ['JEE Advanced', 'ISI Admission Test', 'GRE Quantitative (168+)'],
    scholarships: ['Tata Merit Scholarship', 'K.C. Mahindra Education Trust']
  },
  {
    id: 'robotics-firmware',
    title: 'Autonomous Robotics & Firmware Engineer',
    domain: 'Cyber-Physical Systems & Automation',
    tagline: 'Bridging physical sensor telemetry with real-time RTOS kinematics and SLAM autonomy.',
    scores: {
      studentFit: 84,
      financialFit: 85,
      familyAlignment: 82,
      marketFit: 86,
      locationFit: 78,
      overallScore: 83
    },
    growthRate: '+18% CAGR',
    salaryRange: '₹10L — ₹26L CTC',
    riskLevel: 'Moderate',
    topLocations: ['Pune', 'Chennai', 'Bangalore', 'Tokyo'],
    requiredSkills: ['ROS 2 / Navigation2', 'Embedded C / C++', 'Kalman Filters / SLAM', 'RTOS (FreeRTOS/Zephyr)', 'CAN Bus Protocols'],
    studentSkillGaps: ['Nonlinear Control Theory', 'LiDAR Sensor Fusion Tuning'],
    strengthsMatch: ['Hands-on maker orientation', 'Spatial kinematics comprehension', 'Root-cause persistence'],
    whyRecommended: [
      'Direct convergence of software logic with tangible kinetic machinery.',
      'Surging defense, agritech, and warehouse automation ventures across India and East Asia.',
      'Balanced capital outlay during academic training.'
    ],
    educationPath: 'B.Tech Mechatronics / Mechanical + CS Minor → Autonomous Systems Certification',
    entranceExams: ['JEE Mains', 'GATE Mechanical / Instrumentation', 'MET'],
    scholarships: ['SERB Student Innovation Grant', 'Maruti Suzuki Tech Scholar Award']
  }
];

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
  subType: 'Analytical Synthesizer (Type 7-A)',
  description: 'You thrive when disassembling ambiguous complex systems into deterministic, predictable mathematical abstractions. Rather than treating decisions as emotional impulses, you evaluate risk surfaces, feedback loops, and long-term leverage.',
  traits: [
    { dimension: 'Algorithmic Decomposition', score: 92, descriptor: 'Structured Problem Solver', implication: 'Naturally divides multi-tier challenges into modular executable pipelines.' },
    { dimension: 'Spatial & Structural Logic', score: 86, descriptor: 'High Architectural Topology', implication: 'Visualizes interconnected dependencies, data flows, and physical constraints.' },
    { dimension: 'Empirical Skepticism', score: 81, descriptor: 'Data-Driven Validation', implication: 'Rejects unfounded claims; relies on verifiable telemetry and measured benchmarks.' },
    { dimension: 'Systemic Persistence', score: 88, descriptor: 'Resilient Debugger', implication: 'Retains cognitive focus through extended root-cause analysis without fatigue.' },
    { dimension: 'Calculated Risk Tolerance', score: 68, descriptor: 'Prudent Opportunist', implication: 'Willing to take non-consensus bets when downside is strictly bounded.' }
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
    category: 'Cognitive Preference',
    scenario: 'You are handed a complex system with a critical bottleneck. How do you naturally begin?',
    choices: [
      { text: 'Analyze instrumented logs, metrics, and trace telemetry to isolate exact variance.', tag: 'Data-Driven Analytic' },
      { text: 'Redraw the architectural block diagram and verify boundary assumptions.', tag: 'Architectural Synthesizer' },
      { text: 'Formulate hypotheses and run controlled empirical mini-experiments.', tag: 'Empirical Experimenter' },
      { text: 'Look at the team workflows and communication handoffs between owners.', tag: 'Socio-Technical Leader' }
    ]
  },
  {
    id: 2,
    category: 'Risk & Ambiguity',
    scenario: 'You can choose between two career projects over the next 18 months. Which draws you more?',
    choices: [
      { text: 'A proven, prestigious domain with high certainty and guaranteed top 10% compensation.', tag: 'Prudent Optimizer' },
      { text: 'An emergent, uncharted sector (e.g., Neuromorphic Silicon) with immense upside but high initial ambiguity.', tag: 'Frontier Explorer' },
      { text: 'An entrepreneurial cross-disciplinary effort where you own the full product lifecycle.', tag: 'Venture Architect' },
      { text: 'A mission-critical national security or public infrastructure system with long-lasting impact.', tag: 'Public Impact Anchor' }
    ]
  },
  {
    id: 3,
    category: 'Work Environment',
    scenario: 'At the end of an intensive workweek, what makes you feel the deepest satisfaction?',
    choices: [
      { text: 'A clean, mathematically elegant codebase that runs with zero runtime faults.', tag: 'Precision Craftsman' },
      { text: 'A tangible prototype or hardware board activating in physical reality.', tag: 'Physical Creator' },
      { text: 'A strategic presentation where complex market dynamics were decoded for leadership.', tag: 'Strategic Communicator' },
      { text: 'Resolving a high-stakes emergency that saved thousands of user operations.', tag: 'Mission Critical Fixer' }
    ]
  }
];
