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

// Universal General Reasoning & Cognitive Aptitude (IQ) Assessment
export const APTITUDE_QUESTIONS = [
  {
    "id": 1,
    "dimension": "Logical & Deductive Reasoning",
    "llmTag": "cognitive.logical",
    "weight": 0.2,
    "prompt": "In a competitive race: Alex finished ahead of Blake. Charlie finished ahead of Dana. Blake finished ahead of Charlie. Who finished in the last position?",
    "options": [
      {
        "text": "Dana",
        "score": 20
      },
      {
        "text": "Charlie",
        "score": 14
      },
      {
        "text": "Blake",
        "score": 10
      },
      {
        "text": "Alex",
        "score": 6
      }
    ],
    "rationale": "Correct answer is Dana. Based on the finishes: Alex > Blake > Charlie > Dana. Dana finished in the last position."
  },
  {
    "id": 2,
    "dimension": "Numerical Facility & Pattern Reasoning",
    "llmTag": "cognitive.numerical",
    "weight": 0.2,
    "prompt": "Examine the number series: 3, 7, 15, 31, 63, ___ . Which number logically completes the sequence?",
    "options": [
      {
        "text": "95",
        "score": 7
      },
      {
        "text": "127",
        "score": 20
      },
      {
        "text": "126",
        "score": 14
      },
      {
        "text": "129",
        "score": 10
      }
    ],
    "rationale": "Correct answer is 127. Each subsequent number doubles the previous and adds 1: (63 * 2) + 1 = 127."
  },
  {
    "id": 3,
    "dimension": "Systemic & Analytical Problem Solving",
    "llmTag": "cognitive.analytical",
    "weight": 0.2,
    "prompt": "A balance scale shows: 2 apples and 1 orange balance exactly with 1 pineapple. A second scale shows 1 pineapple balances exactly with 4 apples. How many apples balance with 1 orange?",
    "options": [
      {
        "text": "1 Apple",
        "score": 10
      },
      {
        "text": "2 Apples",
        "score": 20
      },
      {
        "text": "3 Apples",
        "score": 13
      },
      {
        "text": "4 Apples",
        "score": 6
      }
    ],
    "rationale": "Correct answer is 2 Apples. Substituting 1 Pineapple = 4 Apples into scale 1 gives 2 Apples + 1 Orange = 4 Apples => 1 Orange = 2 Apples."
  },
  {
    "id": 4,
    "dimension": "Spatial Orientation & Navigation Reasoning",
    "llmTag": "cognitive.spatial",
    "weight": 0.2,
    "prompt": "You start facing North. You turn 90° clockwise, walk 10 paces forward, turn 180°, and walk 5 paces forward. Which direction are you facing right now?",
    "options": [
      {
        "text": "North",
        "score": 6
      },
      {
        "text": "West",
        "score": 20
      },
      {
        "text": "East",
        "score": 14
      },
      {
        "text": "South",
        "score": 9
      }
    ],
    "rationale": "Correct answer is West. Starting North and turning 90° clockwise faces East. A 180° turn reverses heading directly to West."
  },
  {
    "id": 5,
    "dimension": "Verbal & Relational Analogy",
    "llmTag": "cognitive.verbal",
    "weight": 0.2,
    "prompt": "Complete the functional analogy: 'COMPASS' is to 'NAVIGATION' as 'THERMOMETER' is to '______'.",
    "options": [
      {
        "text": "MERCURY",
        "score": 7
      },
      {
        "text": "TEMPERATURE",
        "score": 20
      },
      {
        "text": "WEATHER",
        "score": 10
      },
      {
        "text": "HEAT",
        "score": 14
      }
    ],
    "rationale": "Correct answer is TEMPERATURE. A compass measures direction for navigation; a thermometer measures temperature."
  }
];

// Tactical 6 Mission Scenarios (Streamlined Holland RIASEC + Archetype Synthesis)
export interface DiscoveryChoice {
  id: string;
  archetype: string;
  badge: string;
  title: string;
  description: string;
  riasecDelta: {
    R?: number;
    I?: number;
    A?: number;
    S?: number;
    E?: number;
    C?: number;
  };
  traitBonus: {
    trait: string;
    label: string;
  };
  tag: string;
  text: string;
}

export interface DiscoveryScenario {
  id: number;
  missionCode: string;
  category: string;
  scenario: string;
  dilemma: string;
  choices: DiscoveryChoice[];
}

export const DISCOVERY_SCENARIOS: DiscoveryScenario[] = [
  {
    id: 1,
    missionCode: "MISSION 01 // SECTOR: AUTONOMOUS HARDWARE",
    category: "Realistic — Physical Systems & Hardware Engineering",
    scenario: "During a high-stakes desert trial, your team's autonomous exploration rover loses ground traction and its LiDAR telemetry bus drops out 4 miles from base camp.",
    dilemma: "Where is your immediate instinct to intervene and resolve the breakdown?",
    choices: [
      {
        id: "A",
        archetype: "HARDWARE ARCHITECT",
        badge: "R: REALISTIC",
        title: "Tear Down Hardware & Re-solder Bus",
        description: "Open the field toolkit, strip the chassis shielding, and manually re-solder the severed CAN-bus wires to calibrate the drive motors.",
        riasecDelta: { R: 35, C: 10 },
        traitBonus: { trait: "builder", label: "Hands-on Prototyping & Electrical Assembly" },
        tag: "Realistic - Hardware Builder",
        text: "[A] HARDWARE ARCHITECT — Hands-on physical disassembly, tool operation, and mechanical repair."
      },
      {
        id: "B",
        archetype: "FIRMWARE DIAGNOSTICIAN",
        badge: "I: INVESTIGATIVE",
        title: "Reverse-Engineer Kernel Packet Logs",
        description: "Jack into the telemetry buffer to deconstruct sensor drop logs, isolate timing jitter, and compile a low-level patch.",
        riasecDelta: { I: 30, R: 15 },
        traitBonus: { trait: "analytical", label: "Kernel Trace & Signal Diagnostics" },
        tag: "Investigative - Firmware Systems",
        text: "[B] FIRMWARE DIAGNOSTICIAN — Deep diagnostic debugging, signal telemetry, and root-cause analysis."
      },
      {
        id: "C",
        archetype: "MISSION COMMANDER",
        badge: "E: ENTERPRISING",
        title: "Coordinate Field Extraction Strategy",
        description: "Radio team leads, reroute rover fail-safe waypoints to avoid terrain trenches, and orchestrate rapid recovery protocol.",
        riasecDelta: { E: 30, S: 15 },
        traitBonus: { trait: "leadership", label: "Crisis Command & Tactical Decision-Making" },
        tag: "Enterprising - Mission Commander",
        text: "[C] MISSION COMMANDER — High-stakes leadership, rapid coordination, and tactical resource allocation."
      },
      {
        id: "D",
        archetype: "QUALITY ASSURANCE AUDITOR",
        badge: "C: CONVENTIONAL",
        title: "Execute ISO Diagnostic Checklist",
        description: "Halt battery power cycles, execute the ISO-certified diagnostic sequence, and log failure parameters for formal technical review.",
        riasecDelta: { C: 35, R: 10 },
        traitBonus: { trait: "conventional", label: "Standardized Verification & Compliance" },
        tag: "Conventional - Standards Auditor",
        text: "[D] QUALITY ASSURANCE AUDITOR — Systematic compliance, structured checklists, and risk documentation."
      }
    ]
  },
  {
    id: 2,
    missionCode: "MISSION 02 // SECTOR: FRONTIER AI & MATHEMATICS",
    category: "Investigative — Research, Mathematics & Analytical Modeling",
    scenario: "Your organization's foundation AI model begins exhibiting subtle semantic hallucination drifts under high concurrency, baffling the product team.",
    dilemma: "How do you isolate and eliminate this high-dimensional anomaly?",
    choices: [
      {
        id: "A",
        archetype: "RESEARCH SCIENTIST",
        badge: "I: INVESTIGATIVE",
        title: "Deconstruct Loss Landscape & Math",
        description: "Deconstruct underlying loss function gradients, map vector cosine deviations, and formulate an empirical ablation hypothesis.",
        riasecDelta: { I: 35, A: 10 },
        traitBonus: { trait: "research", label: "Theoretical Modeling & Algorithmic Discovery" },
        tag: "Investigative - Research Scientist",
        text: "[A] RESEARCH SCIENTIST — Advanced mathematics, statistical mechanics, and fundamental proofs."
      },
      {
        id: "B",
        archetype: "GPU COMPUTE SPECIALIST",
        badge: "R: REALISTIC",
        title: "Profile CUDA Latency & Tensor Cores",
        description: "Profile CUDA kernel latencies and tensor core memory saturation to catch floating-point precision degradation under heavy loads.",
        riasecDelta: { R: 30, I: 15 },
        traitBonus: { trait: "builder", label: "Low-Level Compute & Hardware Acceleration" },
        tag: "Realistic - GPU Systems",
        text: "[B] GPU COMPUTE SPECIALIST — High-performance computing, kernel tuning, and memory architecture."
      },
      {
        id: "C",
        archetype: "COGNITIVE PROMPT ARCHITECT",
        badge: "A: ARTISTIC",
        title: "Engineer Dynamic Semantic Priming",
        description: "Design dynamic cognitive priming schemas and conceptual metaphors that intuitively steer attention heads back into alignment.",
        riasecDelta: { A: 30, I: 15 },
        traitBonus: { trait: "creative", label: "Conceptual Synthesis & Cognitive Framing" },
        tag: "Artistic - Cognitive Architect",
        text: "[C] COGNITIVE PROMPT ARCHITECT — Creative abstractions, novel linguistic synthesis, and mental models."
      },
      {
        id: "D",
        archetype: "REGRESSION BENCHMARK ARBITER",
        badge: "C: CONVENTIONAL",
        title: "Deploy Automated Verification Rig",
        description: "Deploy a 10,000-sample regression test pipeline to measure precision confidence intervals and enforce safety bounds.",
        riasecDelta: { C: 30, I: 15 },
        traitBonus: { trait: "analytical", label: "Empirical Benchmarking & Strict Bounds" },
        tag: "Conventional - Verification Arbiter",
        text: "[D] REGRESSION BENCHMARK ARBITER — Rigorous automated test harnesses, deterministic verification, and SLA tracking."
      }
    ]
  },
  {
    id: 3,
    missionCode: "MISSION 03 // SECTOR: NEURAL INTERFACES & SPATIAL UX",
    category: "Artistic — Creative Expression, UI/UX & Sensory Architecture",
    scenario: "Your laboratory has fabricated a non-invasive brain-computer interface headband. Today is the design review for humanity's first consumer experience with it.",
    dilemma: "Which core dimension of this breakthrough product do you champion?",
    choices: [
      {
        id: "A",
        archetype: "SPATIAL EXPERIENCE DESIGNER",
        badge: "A: ARTISTIC",
        title: "Craft Visual & Spatial Grammar",
        description: "Craft an intuitive sensory visual grammar with organic micro-interactions that make brainwave shifts feel magical, responsive, and tangible.",
        riasecDelta: { A: 35, I: 10 },
        traitBonus: { trait: "creative", label: "Sensory UX & Spatial World-Building" },
        tag: "Artistic - Spatial Designer",
        text: "[A] SPATIAL EXPERIENCE DESIGNER — World-class aesthetic design, motion typography, and emotive product interfaces."
      },
      {
        id: "B",
        archetype: "INCLUSIVE ERGONOMICS ADVOCATE",
        badge: "S: SOCIAL",
        title: "Lead Empathetic Co-Design Sessions",
        description: "Lead user empathy co-design sessions with neurodivergent individuals to ensure zero sensory overload and complete psychological ease.",
        riasecDelta: { S: 35, A: 10 },
        traitBonus: { trait: "social", label: "Human Empathy & Universal Accessibility" },
        tag: "Social - Accessibility Advocate",
        text: "[B] INCLUSIVE ERGONOMICS ADVOCATE — Human welfare, community listening, and compassionate product inclusivity."
      },
      {
        id: "C",
        archetype: "NEURO-SIGNAL RESEARCHER",
        badge: "I: INVESTIGATIVE",
        title: "Isolate Intent from EEG Noise",
        description: "Refine spatial EEG filtering transforms to isolate deliberate motor intentions from involuntary muscle noise and eye blinks.",
        riasecDelta: { I: 30, R: 15 },
        traitBonus: { trait: "research", label: "Biosignal Signal Processing & Neuro-Math" },
        tag: "Investigative - Neuro Researcher",
        text: "[C] NEURO-SIGNAL RESEARCHER — Scientific signal processing, neuro-biology, and empirical calibration."
      },
      {
        id: "D",
        archetype: "PRODUCT PROVOCATEUR",
        badge: "E: ENTERPRISING",
        title: "Direct Bold Cultural Launch Film",
        description: "Direct a cinematic product launch narrative that challenges big tech and cements the device as the defining leap for personal agency.",
        riasecDelta: { E: 30, A: 15 },
        traitBonus: { trait: "risk", label: "Visionary Storytelling & High-Stake Positioning" },
        tag: "Enterprising - Product Provocateur",
        text: "[D] PRODUCT PROVOCATEUR — Disruptive marketing, brand conviction, and high-impact cultural narratives."
      }
    ]
  },
  {
    id: 4,
    missionCode: "MISSION 04 // SECTOR: HEALTHCARE SYSTEMS & CRISIS MEDIATION",
    category: "Social — Mentorship, Collaboration & Human Impact",
    scenario: "48 hours before rolling out a critical national telemedicine platform, the engineering leads are locked in an exhausting standoff over data schema contracts.",
    dilemma: "Team morale is plunging and the deadline looms. How do you step into the fire?",
    choices: [
      {
        id: "A",
        archetype: "COLLABORATIVE MEDIATOR",
        badge: "S: SOCIAL",
        title: "Facilitate Empathetic Walk & Debrief",
        description: "Take both leads on a dedicated walk, listen deeply to unspoken burnout, and guide them to co-author an empathetic compromise they both own.",
        riasecDelta: { S: 35, E: 10 },
        traitBonus: { trait: "social", label: "Active Listening & Interpersonal Mediation" },
        tag: "Social - Collaborative Mediator",
        text: "[A] COLLABORATIVE MEDIATOR — Emotional intelligence, psychological safety, and team consensus."
      },
      {
        id: "B",
        archetype: "DECISIVE TECHNICAL LEADER",
        badge: "E: ENTERPRISING",
        title: "Make Executive Call & Reassign Tasks",
        description: "Step into the room with clarity: lay down the binding schema decision, reassign sprint bandwidth, and take personal accountability for delivery.",
        riasecDelta: { E: 30, S: 15 },
        traitBonus: { trait: "leadership", label: "Executive Governance & Courageous Accountability" },
        tag: "Enterprising - Executive Governor",
        text: "[B] DECISIVE TECHNICAL LEADER — Clear leadership authority, decisive pivots, and unblocking team paralysis."
      },
      {
        id: "C",
        archetype: "EMPIRICAL DATA ARBITER",
        badge: "I: INVESTIGATIVE",
        title: "Execute Objective 2-Hour Stress Test",
        description: "Spin up a live benchmark test to let objective latency and error metrics settle the architectural debate cleanly without ego.",
        riasecDelta: { I: 30, C: 15 },
        traitBonus: { trait: "analytical", label: "Objective Arbitration & Empirical Truth" },
        tag: "Investigative - Data Arbiter",
        text: "[C] EMPIRICAL DATA ARBITER — Scientific validation, empirical data as truth, and zero-bias adjudication."
      },
      {
        id: "D",
        archetype: "STANDARDIZED PROTOCOL ARCHITECT",
        badge: "C: CONVENTIONAL",
        title: "Codify Immutable OpenAPI Contracts",
        description: "Draft an explicit API schema contract with automated linting rules so subjective ambiguities can never derail delivery again.",
        riasecDelta: { C: 30, S: 10 },
        traitBonus: { trait: "conventional", label: "Standardized Technical Contracts & Protocols" },
        tag: "Conventional - Protocol Architect",
        text: "[D] STANDARDIZED PROTOCOL ARCHITECT — Systematic specifications, governance guardrails, and reproducible processes."
      }
    ]
  },
  {
    id: 5,
    missionCode: "MISSION 05 // SECTOR: DEEP-TECH VENTURE CREATION",
    category: "Enterprising — Strategic Leadership, Venture Creation & Commercial Scale",
    scenario: "You are stepping into an elevator on the 42nd floor with the general partner of a premier deep-tech venture firm. You have 90 seconds until the lobby doors open.",
    dilemma: "What is your high-impact pitch angle that secures a $10M Series A term sheet?",
    choices: [
      {
        id: "A",
        archetype: "MARKET DOMINANCE STRATEGIST",
        badge: "E: ENTERPRISING",
        title: "Pitch 10x Distribution Flywheel",
        description: "Showcase our 10x distribution flywheel, an unpenetrated $50B market void, and unit economics that completely outpace sluggish incumbents.",
        riasecDelta: { E: 35, C: 10 },
        traitBonus: { trait: "risk", label: "Venture Scalability & Exponential Moats" },
        tag: "Enterprising - Market Strategist",
        text: "[A] MARKET DOMINANCE STRATEGIST — High-growth commercial strategy, capital efficiency, and market expansion."
      },
      {
        id: "B",
        archetype: "DEEP-TECH MOAT INVENTOR",
        badge: "I: INVESTIGATIVE",
        title: "Demonstrate 4 Proprietary Patents",
        description: "Demonstrate 4 foundational patents in quantum-resistant hardware security that guarantee an unassailable 3-year scientific moat.",
        riasecDelta: { I: 30, E: 15 },
        traitBonus: { trait: "research", label: "Proprietary IP & Deep Scientific Defensibility" },
        tag: "Investigative - Moat Inventor",
        text: "[B] DEEP-TECH MOAT INVENTOR — Deep-tech intellectual property, breakthrough science, and technology moats."
      },
      {
        id: "C",
        archetype: "SCALED MANUFACTURING MAESTRO",
        badge: "R: REALISTIC",
        title: "Reveal Scaled Fab Supply Contracts",
        description: "Demonstrate production prototypes and supplier contracts that slash automated bill-of-materials costs by 65% across tier-1 fabs.",
        riasecDelta: { R: 30, E: 15 },
        traitBonus: { trait: "builder", label: "Hardware Economics & High-Yield Manufacturing" },
        tag: "Realistic - Production Maestro",
        text: "[C] SCALED MANUFACTURING MAESTRO — Physical manufacturing, industrial partnerships, and operational velocity."
      },
      {
        id: "D",
        archetype: "GLOBAL IMPACT CRUSADER",
        badge: "S: SOCIAL",
        title: "Show Clean Energy Equity for Millions",
        description: "Showcase how our democratized energy technology lifts 30 million underserved families out of power poverty while generating premier margins.",
        riasecDelta: { S: 30, E: 15 },
        traitBonus: { trait: "social", label: "Planetary Purpose & Triple-Bottom-Line Scale" },
        tag: "Social - Impact Crusader",
        text: "[D] GLOBAL IMPACT CRUSADER — Mission-driven entrepreneurship, social equity, and planetary transformation."
      }
    ]
  },
  {
    id: 6,
    missionCode: "MISSION 06 // SECTOR: CRITICAL SYSTEM INTEGRITY",
    category: "Conventional — High-Reliability Architecture & Data Integrity",
    scenario: "You are overseeing the live cutover of a national power grid telemetry network managing 200 gigawatts. Failure or downtime is categorically unacceptable.",
    dilemma: "What is your primary obsession during the active switchover?",
    choices: [
      {
        id: "A",
        archetype: "ZERO-FAULT INTEGRITY SENTINEL",
        badge: "C: CONVENTIONAL",
        title: "Enforce Atomic Validation Checkpoints",
        description: "Enforce atomic transaction checkpoints, dual-key verification, and mathematical checksum validation for every single state update.",
        riasecDelta: { C: 35, I: 10 },
        traitBonus: { trait: "conventional", label: "Zero-Fault Reliability & State Verification" },
        tag: "Conventional - Integrity Sentinel",
        text: "[A] ZERO-FAULT INTEGRITY SENTINEL — Extreme precision, mathematical checksums, and zero-downtime execution."
      },
      {
        id: "B",
        archetype: "MISSION SRE DEFENDER",
        badge: "R: REALISTIC",
        title: "Monitor Substation Fiber & Switches",
        description: "Monitor physical optical repeaters, backup generator frequencies, and substation switchboards to safeguard physical infrastructure.",
        riasecDelta: { R: 30, C: 15 },
        traitBonus: { trait: "builder", label: "Physical Hardware Hardening & SRE Defense" },
        tag: "Realistic - SRE Defender",
        text: "[B] MISSION SRE DEFENDER — Industrial site reliability, physical failovers, and power grid machinery."
      },
      {
        id: "C",
        archetype: "CYBER THREAT HUNTING SCIENTIST",
        badge: "I: INVESTIGATIVE",
        title: "Analyze Cryptographic Packet Entropy",
        description: "Inspect encrypted traffic handshakes for anomalous packet entropy to guarantee zero unauthorized lateral infiltration.",
        riasecDelta: { I: 30, C: 15 },
        traitBonus: { trait: "analytical", label: "Adversarial Cryptography & Packet Intelligence" },
        tag: "Investigative - Threat Hunter",
        text: "[C] CYBER THREAT HUNTING SCIENTIST — Defensive security research, cryptography, and intrusion forensics."
      },
      {
        id: "D",
        archetype: "CRITICAL OPERATIONS CONTROLLER",
        badge: "E: ENTERPRISING",
        title: "Direct Multi-Agency Broadcast Comms",
        description: "Maintain real-time voice orchestration with regional power boards, federal safety agencies, and national dispatch command centers.",
        riasecDelta: { E: 30, C: 15 },
        traitBonus: { trait: "leadership", label: "National Command & Inter-Agency Coordination" },
        tag: "Enterprising - Operations Controller",
        text: "[D] CRITICAL OPERATIONS CONTROLLER — High-command crisis orchestration, stakeholder trust, and operational clarity."
      }
    ]
  }
];
