import type { LifeStage, AptitudeQuestion } from '../types/alignx';
import type { DiscoveryScenario } from './mockAlignxData';

// ============================================================================
// STAGE-SPECIFIC DISCOVERY SCENARIOS (RIASEC: R, I, A, S, E, C)
// ============================================================================

export const CLASS10_DISCOVERY_SCENARIOS: DiscoveryScenario[] = [
  {
    id: 1,
    missionCode: "MISSION 01 // SECTOR: ROBOTICS & HARDWARE LAB",
    category: "Realistic — Physical Systems & Hands-on Building",
    scenario: "During the regional inter-school science exhibition, the motorized drive mechanism of your solar water purifier prototype jams 20 minutes before judges arrive.",
    dilemma: "Where is your immediate instinct to intervene and resolve the breakdown?",
    choices: [
      {
        id: "A",
        archetype: "HARDWARE BUILDER",
        badge: "R: REALISTIC",
        title: "Disassemble Motor & Solder Wire Bypass",
        description: "Open the toolkit, strip the motor housing insulation with wire cutters, and solder a direct mechanical bypass.",
        riasecDelta: { R: 35, C: 10 },
        traitBonus: { trait: "builder", label: "Hands-on Tools & Physical Fabrication" },
        tag: "Realistic - Hardware Builder",
        text: "[A] HARDWARE BUILDER — Hands-on physical disassembly, tool operation, and mechanical repair."
      },
      {
        id: "B",
        archetype: "LAB DIAGNOSTICIAN",
        badge: "I: INVESTIGATIVE",
        title: "Test Voltage Circuit with Multimeter",
        description: "Probe each capacitor on the breadboard with a digital multimeter to discover why the surge occurred.",
        riasecDelta: { I: 30, R: 15 },
        traitBonus: { trait: "analytical", label: "Circuit Diagnostics & Root-Cause Discovery" },
        tag: "Investigative - Electronics Systems",
        text: "[B] LAB DIAGNOSTICIAN — Deep diagnostic debugging, electrical telemetry, and root-cause analysis."
      },
      {
        id: "C",
        archetype: "TEAM LEADER",
        badge: "E: ENTERPRISING",
        title: "Pitch Presentation While Buying Time",
        description: "Step up to the judges' table, present your project poster and working simulations with charisma to secure an extension.",
        riasecDelta: { E: 30, S: 15 },
        traitBonus: { trait: "leadership", label: "Confident Pitching & Tactical Problem-Solving" },
        tag: "Enterprising - Team Leader",
        text: "[C] TEAM LEADER — High-stakes communication, quick thinking, and resourcefulness."
      },
      {
        id: "D",
        archetype: "PROJECT SCRIBE",
        badge: "C: CONVENTIONAL",
        title: "Verify Calibration Checklist & Schematics",
        description: "Check the step-by-step assembly manual, document the incident in the lab journal, and follow standard safety reset protocol.",
        riasecDelta: { C: 35, R: 10 },
        traitBonus: { trait: "conventional", label: "Standardized Checklists & Accurate Records" },
        tag: "Conventional - Standards Auditor",
        text: "[D] PROJECT SCRIBE — Systematic documentation, structured checklists, and adherence to safety norms."
      }
    ]
  },
  {
    id: 2,
    missionCode: "MISSION 02 // SECTOR: SCIENCE OLYMPIAD & RESEARCH",
    category: "Investigative — Scientific Method & Mathematical Discovery",
    scenario: "In an inter-school chemistry titration experiment, your group's solution turns unexpected deep emerald green instead of the textbook pink.",
    dilemma: "How do you investigate and understand this anomalous observation?",
    choices: [
      {
        id: "A",
        archetype: "RESEARCH SCIENTIST",
        badge: "I: INVESTIGATIVE",
        title: "Formulate Hypotheses & Run Control Trials",
        description: "Calculate chemical molarity deviations, formulate three test hypotheses, and run micro-scale repeat trials to isolate the trace reactant.",
        riasecDelta: { I: 35, A: 10 },
        traitBonus: { trait: "research", label: "Scientific Inquiry & Empirical Experimentation" },
        tag: "Investigative - Research Scientist",
        text: "[A] RESEARCH SCIENTIST — Advanced logic, chemistry hypothesis, and controlled testing."
      },
      {
        id: "B",
        archetype: "APPARATUS SPECIALIST",
        badge: "R: REALISTIC",
        title: "Inspect Glassware & Reagent Purity",
        description: "Thoroughly rinse pipettes with deionized water, re-weigh the dry chemical powders on analytical scales, and inspect physical glassware.",
        riasecDelta: { R: 30, I: 15 },
        traitBonus: { trait: "builder", label: "Precision Lab Instruments & Calibration" },
        tag: "Realistic - Apparatus Specialist",
        text: "[B] APPARATUS SPECIALIST — Physical precision instruments, glassware preparation, and sample purity."
      },
      {
        id: "C",
        archetype: "SCIENCE COMMUNICATOR",
        badge: "A: ARTISTIC",
        title: "Design Visual Infographic of the Reaction",
        description: "Create an illustrative color-transition diagram explaining the molecular reaction steps for the science fair bulletin board.",
        riasecDelta: { A: 30, I: 15 },
        traitBonus: { trait: "creative", label: "Visual Storytelling & Creative Synthesis" },
        tag: "Artistic - Science Illustrator",
        text: "[C] SCIENCE COMMUNICATOR — Creative visual diagrams, illustrative charts, and conceptual communication."
      },
      {
        id: "D",
        archetype: "STANDARDS AUDITOR",
        badge: "C: CONVENTIONAL",
        title: "Log Measurement Variance in Lab Ledger",
        description: "Record exact drops, milliliters, and room temperatures into the official logbook to ensure grading rubric compliance.",
        riasecDelta: { C: 30, I: 15 },
        traitBonus: { trait: "analytical", label: "Strict Data Ledger & Systematic Verification" },
        tag: "Conventional - Lab Auditor",
        text: "[D] STANDARDS AUDITOR — Meticulous record-keeping, standardized logging, and strict data accuracy."
      }
    ]
  },
  {
    id: 3,
    missionCode: "MISSION 03 // SECTOR: CREATIVE ARTS & DIGITAL MEDIA",
    category: "Artistic — Creative Expression & Design Architecture",
    scenario: "Your school is launching its annual fest and Golden Jubilee publication. Your team must design the visual identity, website layout, and theme.",
    dilemma: "Which dimension of this creative initiative do you lead?",
    choices: [
      {
        id: "A",
        archetype: "VISUAL DESIGNER",
        badge: "A: ARTISTIC",
        title: "Craft Expressive Branding & Color Palette",
        description: "Paint illustrations, curate harmonious vintage-modern color schemes, and craft an unforgettable festival logo.",
        riasecDelta: { A: 35, I: 10 },
        traitBonus: { trait: "creative", label: "Aesthetic Direction & Visual Expression" },
        tag: "Artistic - Visual Designer",
        text: "[A] VISUAL DESIGNER — Artistic layouts, color theory, and compelling creative motifs."
      },
      {
        id: "B",
        archetype: "EDITORIAL STRATEGIST",
        badge: "I: INVESTIGATIVE",
        title: "Research 50-Year Historical Archives",
        description: "Dig into past yearbooks, interview retired alumni, and compile an analytical timeline of the school's historical achievements.",
        riasecDelta: { I: 30, A: 15 },
        traitBonus: { trait: "research", label: "Historical Investigation & Archival Analysis" },
        tag: "Investigative - Editorial Researcher",
        text: "[B] EDITORIAL STRATEGIST — Deep archival research, investigative journalism, and documentary structure."
      },
      {
        id: "C",
        archetype: "STUDENT COUNSELOR",
        badge: "S: SOCIAL",
        title: "Collect Student Stories & Personal Journeys",
        description: "Interview shy and diverse students across classes to ensure every quiet voice and unique personal achievement is celebrated.",
        riasecDelta: { S: 30, A: 15 },
        traitBonus: { trait: "social", label: "Empathy, Listening & Community Inclusion" },
        tag: "Social - Community Voice",
        text: "[C] STUDENT COUNSELOR — Empathetic interviews, community connection, and inclusive storytelling."
      },
      {
        id: "D",
        archetype: "PRODUCTION MANAGER",
        badge: "C: CONVENTIONAL",
        title: "Manage Print Grid, Deadlines & Budget",
        description: "Set up the page layout grids, coordinate printer quotes, track budget expenses, and guarantee delivery by the printing cutoff.",
        riasecDelta: { C: 30, A: 15 },
        traitBonus: { trait: "conventional", label: "Production Schedules, Budgets & Precision Grids" },
        tag: "Conventional - Production Manager",
        text: "[D] PRODUCTION MANAGER — Strict scheduling, budget controls, and print production workflows."
      }
    ]
  },
  {
    id: 4,
    missionCode: "MISSION 04 // SECTOR: COMMUNITY OUTREACH & RELIEF",
    category: "Social — Human Empathy, Mentorship & Mediation",
    scenario: "During a student disaster relief drive, tempers flare as two volunteer groups argue aggressively over neighborhood distribution routes.",
    dilemma: "How do you restore peace and maximize relief impact?",
    choices: [
      {
        id: "A",
        archetype: "PEACEMAKER & MEDIATOR",
        badge: "S: SOCIAL",
        title: "Host Open Dialogue Circle & Reconcile",
        description: "Gather team captains in a quiet space, listen deeply to their stress, validate their hard work, and co-design a balanced assignment plan.",
        riasecDelta: { S: 35, E: 10 },
        traitBonus: { trait: "social", label: "Conflict De-escalation & Empathetic Facilitation" },
        tag: "Social - Community Mediator",
        text: "[A] PEACEMAKER & MEDIATOR — Active listening, emotional intelligence, and harmonious reconciliation."
      },
      {
        id: "B",
        archetype: "CRISIS LOGISTICIAN",
        badge: "C: CONVENTIONAL",
        title: "Standardize Inventory Rations by Family Size",
        description: "Draft an orderly ration roster, seal supply kits with tamper-evident labels, and verify recipient signatures for total fairness.",
        riasecDelta: { C: 30, S: 15 },
        traitBonus: { trait: "conventional", label: "Systematic Inventory & Fair Distribution" },
        tag: "Conventional - Relief Logistics",
        text: "[B] CRISISIS LOGISTICIAN — Fair procedural protocols, inventory spreadsheets, and accountability."
      },
      {
        id: "C",
        archetype: "CAMPAIGN COMMANDER",
        badge: "E: ENTERPRISING",
        title: "Rally Volunteers with an Inspiring Speech",
        description: "Step in decisively, remind everyone of the families counting on them, set clear targets, and inspire high team energy.",
        riasecDelta: { E: 30, S: 15 },
        traitBonus: { trait: "leadership", label: "Dynamic Motivation & Decisive Coordination" },
        tag: "Enterprising - Campaign Commander",
        text: "[C] CAMPAIGN COMMANDER — Charismatic motivation, energetic direction, and goal-oriented focus."
      },
      {
        id: "D",
        archetype: "RESOURCE ANALYST",
        badge: "I: INVESTIGATIVE",
        title: "Model Optimal Route Map with GIS Data",
        description: "Calculate delivery travel times and population density to plot the most efficient relief route on map coordinates.",
        riasecDelta: { I: 30, S: 15 },
        traitBonus: { trait: "analytical", label: "Quantitative Route Optimization" },
        tag: "Investigative - Resource Analyst",
        text: "[D] RESOURCE ANALYST — Spatial optimization, route calculation, and data-driven logistics."
      }
    ]
  },
  {
    id: 5,
    missionCode: "MISSION 05 // SECTOR: STUDENT ENTREPRENEURSHIP",
    category: "Enterprising — Leadership, Strategy & Persuasion",
    scenario: "At the school winter carnival, your team has a seed budget of ₹2,000 to launch an interactive booth to fund sports equipment for underprivileged students.",
    dilemma: "How do you maximize both visitor enthusiasm and revenue yield?",
    choices: [
      {
        id: "A",
        archetype: "VENTURE FOUNDER",
        badge: "E: ENTERPRISING",
        title: "Launch High-Energy Gamified Challenge",
        description: "Announce live megaphone leaderboard challenges, bundle discounted game tickets, and aggressively pitch visitors to participate.",
        riasecDelta: { E: 35, S: 10 },
        traitBonus: { trait: "leadership", label: "Bold Commercial Strategy & High Persuasion" },
        tag: "Enterprising - Venture Founder",
        text: "[A] VENTURE FOUNDER — Dynamic sales, competitive incentives, and revenue generation."
      },
      {
        id: "B",
        archetype: "CREATIVE PRODUCER",
        badge: "A: ARTISTIC",
        title: "Build Glowing Neon Arcade Setup",
        description: "Design an eye-catching booth with handmade lighting, custom trophy pins, and creative visual gimmicks that draw crowds instantly.",
        riasecDelta: { A: 30, E: 15 },
        traitBonus: { trait: "creative", label: "Spatial Attraction & Visual Merchandising" },
        tag: "Artistic - Experience Designer",
        text: "[B] CREATIVE PRODUCER — Experiential aesthetics, handcrafted visual rewards, and festive mood."
      },
      {
        id: "C",
        archetype: "MECHANICAL INVENTOR",
        badge: "R: REALISTIC",
        title: "Engineer Clever Physics-Based Game Rig",
        description: "Construct a wooden labyrinth game or magnetic ring toss with custom balance mechanics that run smoothly all evening.",
        riasecDelta: { R: 30, E: 15 },
        traitBonus: { trait: "builder", label: "Mechanical Engineering & Physical Rig Building" },
        tag: "Realistic - Hardware Game Maker",
        text: "[C] MECHANICAL INVENTOR — Hands-on carpentry, physics puzzles, and reliable mechanism design."
      },
      {
        id: "D",
        archetype: "CASH FLOW SENTINEL",
        badge: "C: CONVENTIONAL",
        title: "Track Token Ledger & Profit Margin",
        description: "Count coin cashbox tallies every hour, calculate gross profit margins, and protect funds with strict bookkeeping.",
        riasecDelta: { C: 30, E: 15 },
        traitBonus: { trait: "conventional", label: "Accounting Discipline & Margin Calculation" },
        tag: "Conventional - Cash Controller",
        text: "[D] CASH FLOW SENTINEL — Financial ledgering, margin audit, and inventory safeguards."
      }
    ]
  },
  {
    id: 6,
    missionCode: "MISSION 06 // SECTOR: ACADEMIC COUNCIL & GOVERNANCE",
    category: "Conventional — Data Integrity, Systems & Quality Standards",
    scenario: "During the annual inter-house quiz championship, two houses raise conflicting claims about question phrasing and scoring fairness.",
    dilemma: "How do you arbitrate and safeguard tournament integrity?",
    choices: [
      {
        id: "A",
        archetype: "CHIEF ARBITER",
        badge: "C: CONVENTIONAL",
        title: "Audit Rulebook Line-by-Line & Re-score",
        description: "Pull the signed tournament charter, compare the taped question transcript against the rubric, and issue a fair written ruling.",
        riasecDelta: { C: 35, I: 10 },
        traitBonus: { trait: "conventional", label: "Impartial Due Process & Institutional Standards" },
        tag: "Conventional - Chief Arbiter",
        text: "[A] CHIEF ARBITER — Strict rulebook interpretation, written governance, and procedural justice."
      },
      {
        id: "B",
        archetype: "FACT RESEARCHER",
        badge: "I: INVESTIGATIVE",
        title: "Cross-Reference Source Encyclopedias",
        description: "Verify authoritative primary reference books and scientific literature to determine absolute factual veracity.",
        riasecDelta: { I: 30, C: 15 },
        traitBonus: { trait: "research", label: "Primary Source Verification & Truth Discovery" },
        tag: "Investigative - Fact Researcher",
        text: "[B] FACT RESEARCHER — Scholarly research, citation validation, and objective proof."
      },
      {
        id: "C",
        archetype: "STUDENT OMBUDSMAN",
        badge: "S: SOCIAL",
        title: "Facilitate Mutual Consensus Agreement",
        description: "Convene house captains, hear each perspective without interruption, and craft a sportsmanlike compromise.",
        riasecDelta: { S: 30, C: 15 },
        traitBonus: { trait: "social", label: "Consensus Building & Sportsmanship Culture" },
        tag: "Social - Student Ombudsman",
        text: "[C] STUDENT OMBUDSMAN — Respectful consensus, fair play ethics, and social harmony."
      },
      {
        id: "D",
        archetype: "STAGE DIRECTOR",
        badge: "E: ENTERPRISING",
        title: "Host Live Tie-Breaker Rapid Fire",
        description: "Take the microphone on stage, declare a dramatic sudden-death tiebreaker question, and keep the audience energized.",
        riasecDelta: { E: 30, C: 15 },
        traitBonus: { trait: "leadership", label: "Decisive Executive Command & Showmanship" },
        tag: "Enterprising - Event Director",
        text: "[D] STAGE DIRECTOR — Quick leadership resolution, crowd engagement, and energetic momentum."
      }
    ]
  }
];

export const CLASS12_DISCOVERY_SCENARIOS: DiscoveryScenario[] = [
  {
    id: 1,
    missionCode: "MISSION 01 // SECTOR: HARDWARE ROBOTICS OLYMPIAD",
    category: "Realistic — Physical Systems & Embedded Electronics",
    scenario: "Your team's competitive drone loses its obstacle-avoidance sensor feed 40 minutes before the national youth robotics trials.",
    dilemma: "Where is your immediate instinct to intervene and resolve the breakdown?",
    choices: [
      {
        id: "A",
        archetype: "AVIONICS TECHNICIAN",
        badge: "R: REALISTIC",
        title: "Re-solder Flight Controller Gyro & Pins",
        description: "Desolder the unstable I2C header pins, clean the PCB solder pads, and rewire an isolated 5V power regulator.",
        riasecDelta: { R: 35, C: 10 },
        traitBonus: { trait: "builder", label: "PCB Solder Repair & Power Circuit Tuning" },
        tag: "Realistic - Avionics Tech",
        text: "[A] AVIONICS TECHNICIAN — Hardware repair, micro-soldering, and power distribution diagnostics."
      },
      {
        id: "B",
        archetype: "EMBEDDED CODER",
        badge: "I: INVESTIGATIVE",
        title: "Flash Filtered Kalman Firmware Patch",
        description: "Connect via USB serial, parse gyro sensor drift offsets, and compile a tuned low-pass filter algorithm into the microcontroller.",
        riasecDelta: { I: 30, R: 15 },
        traitBonus: { trait: "analytical", label: "Algorithmic Filter Tuning & Firmware Debug" },
        tag: "Investigative - Firmware Engineer",
        text: "[B] EMBEDDED CODER — Firmware debugging, mathematical state estimation, and sensor fusion."
      },
      {
        id: "C",
        archetype: "FLIGHT DIRECTOR",
        badge: "E: ENTERPRISING",
        title: "Re-plan Flight Trajectory for Manual Nav",
        description: "Brief the pilot to execute an altitude-bounded flight plan avoiding blind spots and negotiate flight trial order.",
        riasecDelta: { E: 30, S: 15 },
        traitBonus: { trait: "leadership", label: "Strategic Flight Tactics & Pilot Command" },
        tag: "Enterprising - Flight Director",
        text: "[C] FLIGHT DIRECTOR — Tactical operational strategy, team alignment, and rapid replanning."
      },
      {
        id: "D",
        archetype: "TELEMETRY AUDITOR",
        badge: "C: CONVENTIONAL",
        title: "Execute Pre-Flight Safety Verification",
        description: "Run through the aeronautical safety checklist, log battery cell resistance, and ensure test-range compliance.",
        riasecDelta: { C: 35, R: 10 },
        traitBonus: { trait: "conventional", label: "Pre-Flight Protocol & Failsafe Compliance" },
        tag: "Conventional - Safety Inspector",
        text: "[D] TELEMETRY AUDITOR — Rigorous pre-flight checklists, parameter verification, and risk prevention."
      }
    ]
  },
  {
    id: 2,
    missionCode: "MISSION 02 // SECTOR: MATHEMATICAL COMPUTATION & AI",
    category: "Investigative — Algorithms, Mathematics & Theoretical Analysis",
    scenario: "For a national computer science showcase, your vision model begins misclassifying ambiguous edge-case samples under varying lighting.",
    dilemma: "How do you isolate and correct this algorithmic vulnerability?",
    choices: [
      {
        id: "A",
        archetype: "ALGORITHM THEORIST",
        badge: "I: INVESTIGATIVE",
        title: "Analyze Gradient Loss & Feature Invariance",
        description: "Plot convolution activation layers, calculate loss function variances, and implement contrast-invariant data augmentation.",
        riasecDelta: { I: 35, A: 10 },
        traitBonus: { trait: "research", label: "Mathematical Modeling & Neural Feature Maps" },
        tag: "Investigative - Algorithm Theorist",
        text: "[A] ALGORITHM THEORIST — Deep algorithmic math, loss function analysis, and feature representation."
      },
      {
        id: "B",
        archetype: "SYSTEM BENCHMARKER",
        badge: "R: REALISTIC",
        title: "Profile Edge Compute & Quantize Weights",
        description: "Quantize neural network tensor weights to INT8 to run at 60 FPS on edge accelerators without overheating.",
        riasecDelta: { R: 30, I: 15 },
        traitBonus: { trait: "builder", label: "Edge Hardware Acceleration & INT8 Quantization" },
        tag: "Realistic - Hardware Accelerators",
        text: "[B] SYSTEM BENCHMARKER — Embedded edge inference, hardware memory constraints, and runtime speed."
      },
      {
        id: "C",
        archetype: "DATA VISUALIZER",
        badge: "A: ARTISTIC",
        title: "Design Intuitive Model Explainability UI",
        description: "Build an interactive visual heatmap dashboard that intuitively shows non-technical users where the AI is looking.",
        riasecDelta: { A: 30, I: 15 },
        traitBonus: { trait: "creative", label: "Model Interpretability & Visual UX" },
        tag: "Artistic - Visual UX Designer",
        text: "[C] DATA VISUALIZER — Cognitive visual interfaces, interactive heatmaps, and design clarity."
      },
      {
        id: "D",
        archetype: "VALIDATION SENTINEL",
        badge: "C: CONVENTIONAL",
        title: "Deploy Automated Test Matrix on 1,000 Images",
        description: "Structure a deterministic regression test harness to measure precision, recall, and F1 scores across every benchmark lighting condition.",
        riasecDelta: { C: 30, I: 15 },
        traitBonus: { trait: "analytical", label: "Automated Evaluation & Metric Benchmarking" },
        tag: "Conventional - Test Engineer",
        text: "[D] VALIDATION SENTINEL — Systematic test pipelines, strict statistical bounds, and QA standards."
      }
    ]
  },
  {
    id: 3,
    missionCode: "MISSION 03 // SECTOR: CREATIVE TECH & IMMERSIVE MEDIA",
    category: "Artistic — Spatial Design, Game Engine & Visual Narrative",
    scenario: "Your team is building an interactive virtual reality educational simulation on molecular biology for high school classrooms.",
    dilemma: "Which dimension of this immersive project do you champion?",
    choices: [
      {
        id: "A",
        archetype: "WORLD BUILDER & 3D ARTIST",
        badge: "A: ARTISTIC",
        title: "Sculpt 3D Cellular Landscapes & Lighting",
        description: "Model organic cell membranes, dynamic bioluminescent shaders, and cinematic soundscapes that inspire wonder.",
        riasecDelta: { A: 35, I: 10 },
        traitBonus: { trait: "creative", label: "Spatial World-Building & Artistic Direction" },
        tag: "Artistic - 3D Environment Artist",
        text: "[A] WORLD BUILDER & 3D ARTIST — Immersive world building, 3D modeling, lighting, and aesthetic emotion."
      },
      {
        id: "B",
        archetype: "BIOPHYSICS MODELER",
        badge: "I: INVESTIGATIVE",
        title: "Simulate Accurate Molecular Physics",
        description: "Code deterministic Brownian motion, electrostatic potential charges, and receptor binding thermodynamics.",
        riasecDelta: { I: 30, A: 15 },
        traitBonus: { trait: "research", label: "Computational Biophysics & Accurate Simulation" },
        tag: "Investigative - Simulation Scientist",
        text: "[B] BIOPHYSICS MODELER — Scientific accuracy, physical simulation formulas, and molecular biology."
      },
      {
        id: "C",
        archetype: "STUDENT UX RESEARCHER",
        badge: "S: SOCIAL",
        title: "Conduct Usability Tests with Classmates",
        description: "Observe students exploring the VR experience, note motion sickness triggers, and redesign tutorials for clarity.",
        riasecDelta: { S: 30, A: 15 },
        traitBonus: { trait: "social", label: "Empathetic User Testing & Inclusive Pedagogy" },
        tag: "Social - UX Researcher",
        text: "[C] STUDENT UX RESEARCHER — User empathy, intuitive learning pathways, and human-centered design."
      },
      {
        id: "D",
        archetype: "ASSET PIPELINE ARCHITECT",
        badge: "C: CONVENTIONAL",
        title: "Enforce Polygon Budgets & Version Control",
        description: "Set strict polycount limits, organize Git LFS versioning, and document step-by-step export guidelines for smooth 90 FPS rendering.",
        riasecDelta: { C: 30, A: 15 },
        traitBonus: { trait: "conventional", label: "Asset Pipeline Optimization & Technical Standards" },
        tag: "Conventional - Technical Director",
        text: "[D] ASSET PIPELINE ARCHITECT — Structural asset optimization, git version control, and performance quotas."
      }
    ]
  },
  {
    id: 4,
    missionCode: "MISSION 04 // SECTOR: YOUTH CLIMATE & PUBLIC POLICY",
    category: "Social — Community Mobilization & Collective Impact",
    scenario: "Your regional student council has been granted a ₹5 Lakh grant from the municipal board to improve clean water access in suburban schools.",
    dilemma: "How do you lead this public initiative for lasting social change?",
    choices: [
      {
        id: "A",
        archetype: "COALITION BUILDER",
        badge: "S: SOCIAL",
        title: "Unite School Leaders & Parent Associations",
        description: "Host townhalls across schools, listen to local parent concerns, and build an enthusiastic community volunteer coalition.",
        riasecDelta: { S: 35, E: 10 },
        traitBonus: { trait: "social", label: "Community Leadership & Stakeholder Consensus" },
        tag: "Social - Community Organizer",
        text: "[A] COALITION BUILDER — Community consensus, grassroots coalition building, and stakeholder care."
      },
      {
        id: "B",
        archetype: "PROGRAM DIRECTOR",
        badge: "E: ENTERPRISING",
        title: "Pitch Government Officials for Matching Funds",
        description: "Deliver a compelling presentation to municipal commissioners, leverage media coverage, and double the grant with CSR partnerships.",
        riasecDelta: { E: 30, S: 15 },
        traitBonus: { trait: "leadership", label: "Public Advocacy & High-Impact Resource Acquisition" },
        tag: "Enterprising - Civic Campaigner",
        text: "[B] PROGRAM DIRECTOR — Strategic advocacy, institutional persuasion, and philanthropic fundraising."
      },
      {
        id: "C",
        archetype: "ENVIRONMENTAL DATA ANALYST",
        badge: "I: INVESTIGATIVE",
        title: "Map Contamination Hotspots with Water Sensors",
        description: "Test pH, dissolved solids, and microbial levels across 20 school taps to prioritize funding to the most vulnerable locations.",
        riasecDelta: { I: 30, S: 15 },
        traitBonus: { trait: "analytical", label: "Empirical Environmental Diagnostics" },
        tag: "Investigative - Environmental Analyst",
        text: "[C] ENVIRONMENTAL DATA ANALYST — Scientific telemetry, contamination mapping, and evidence-based allocation."
      },
      {
        id: "D",
        archetype: "COMPLIANCE SENTINEL",
        badge: "C: CONVENTIONAL",
        title: "Audit Grant Allocation & Contractor Bids",
        description: "Establish transparent vendor bidding, track expense receipts in an open ledger, and submit certified municipal accounts.",
        riasecDelta: { C: 30, S: 15 },
        traitBonus: { trait: "conventional", label: "Transparent Public Bookkeeping & Fiscal Audits" },
        tag: "Conventional - Fiscal Auditor",
        text: "[D] COMPLIANCE SENTINEL — Fiscal transparency, vendor verification, and regulatory accountability."
      }
    ]
  },
  {
    id: 5,
    missionCode: "MISSION 05 // SECTOR: HACKATHON VENTURE ACCELERATOR",
    category: "Enterprising — Strategy, Venture Pitch & Market Execution",
    scenario: "At an all-India high school hackathon, your prototype AI study tool reaches the final round. Angel investors offer ₹10 Lakh in pre-seed validation.",
    dilemma: "What is your strategic priority to turn this prototype into a sustainable venture?",
    choices: [
      {
        id: "A",
        archetype: "CHIEF EXECUTIVE OFFICER",
        badge: "E: ENTERPRISING",
        title: "Define Go-to-Market Strategy & User Growth",
        description: "Structure a viral campus ambassador distribution loop, pitch institutional schools, and negotiate favorable term sheets.",
        riasecDelta: { E: 35, S: 10 },
        traitBonus: { trait: "leadership", label: "Commercial Growth & Venture Strategy" },
        tag: "Enterprising - Startup Founder",
        text: "[A] CHIEF EXECUTIVE OFFICER — Visionary growth, stakeholder negotiation, and business viability."
      },
      {
        id: "B",
        archetype: "CHIEF TECHNOLOGY OFFICER",
        badge: "I: INVESTIGATIVE",
        title: "Harden Architecture & Scalable Latency",
        description: "Refactor backend API endpoints, migrate to auto-scaling serverless containers, and benchmark sub-100ms response times.",
        riasecDelta: { I: 30, E: 15 },
        traitBonus: { trait: "research", label: "Scalable Cloud Architecture & Backend Performance" },
        tag: "Investigative - Systems Architect",
        text: "[B] CHIEF TECHNOLOGY OFFICER — Cloud infrastructure, distributed scaling, and technical durability."
      },
      {
        id: "C",
        archetype: "HEAD OF PRODUCT EXPERIENCE",
        badge: "A: ARTISTIC",
        title: "Refine Design System & Delightful UX",
        description: "Polish typography, micro-animations, and intuitive keyboard navigation so studying feels effortless and rewarding.",
        riasecDelta: { A: 30, E: 15 },
        traitBonus: { trait: "creative", label: "Product Craft, Micro-interactions & Design Polish" },
        tag: "Artistic - Product Designer",
        text: "[C] HEAD OF PRODUCT EXPERIENCE — Design refinement, intuitive interfaces, and emotional resonance."
      },
      {
        id: "D",
        archetype: "CHIEF COMPLIANCE OFFICER",
        badge: "C: CONVENTIONAL",
        title: "Enforce Student Data Privacy & GDPR Standards",
        description: "Implement student data anonymization, terms of service agreements, and parental consent frameworks.",
        riasecDelta: { C: 30, E: 15 },
        traitBonus: { trait: "conventional", label: "Privacy Compliance & Governance Frameworks" },
        tag: "Conventional - Compliance Officer",
        text: "[D] CHIEF COMPLIANCE OFFICER — Legal compliance, privacy by design, and governance rigor."
      }
    ]
  },
  {
    id: 6,
    missionCode: "MISSION 06 // SECTOR: EXAM ADMISSIONS & ACADEMIC INTEGRITY",
    category: "Conventional — Systems Verification, Rules & Precision",
    scenario: "Your national student union is asked to review disputed entrance exam percentile normalizations across multiple shifts with uneven difficulty.",
    dilemma: "How do you audit and resolve the percentile fairness crisis?",
    choices: [
      {
        id: "A",
        archetype: "LEAD STATISTICAL AUDITOR",
        badge: "C: CONVENTIONAL",
        title: "Audit Shift Distribution Standard Deviations",
        description: "Apply equi-percentile equi-variance formulas, verify raw score bell curves, and draft a formal normalization whitepaper.",
        riasecDelta: { C: 35, I: 10 },
        traitBonus: { trait: "conventional", label: "Mathematical Normalization & Procedural Audit" },
        tag: "Conventional - Statistical Auditor",
        text: "[A] LEAD STATISTICAL AUDITOR — Strict statistical rigor, standardization models, and procedural equity."
      },
      {
        id: "B",
        archetype: "DATA MODELER",
        badge: "I: INVESTIGATIVE",
        title: "Simulate Item Response Theory (IRT) Curves",
        description: "Run computer simulations evaluating question difficulty discrimination coefficients to detect anomalous outlier questions.",
        riasecDelta: { I: 30, C: 15 },
        traitBonus: { trait: "research", label: "Psychometric Item Response Analysis" },
        tag: "Investigative - Psychometrician",
        text: "[B] DATA MODELER — Computational psychometrics, algorithmic verification, and error analysis."
      },
      {
        id: "C",
        archetype: "STUDENT OMBUDSPERSON",
        badge: "S: SOCIAL",
        title: "Counsel Anxious Candidates & Facilitate Clarity",
        description: "Address student panic, run transparent explanation webinars, and provide counseling hotlines for impacted applicants.",
        riasecDelta: { S: 30, C: 15 },
        traitBonus: { trait: "social", label: "Public Reassurance, Empathy & Crisis Counseling" },
        tag: "Social - Student Counselor",
        text: "[C] STUDENT OMBUDSPERSON — Transparent dialogue, emotional support, and public reassurance."
      },
      {
        id: "D",
        archetype: "REFORM ADVOCATE",
        badge: "E: ENTERPRISING",
        title: "Present Policy Reform to the Ministry Board",
        description: "Deliver a decisive executive briefing to the National Testing Authority with actionable multi-year exam reform recommendations.",
        riasecDelta: { E: 30, C: 15 },
        traitBonus: { trait: "leadership", label: "Institutional Negotiation & Executive Influence" },
        tag: "Enterprising - Policy Strategist",
        text: "[D] REFORM ADVOCATE — High-level institutional persuasion, policy strategy, and public impact."
      }
    ]
  }
];

// Re-export original UG scenarios as standard UG scenarios
import { DISCOVERY_SCENARIOS as UG_SCENARIOS } from './mockAlignxData';
export { UG_SCENARIOS };

export const PG_DISCOVERY_SCENARIOS: DiscoveryScenario[] = [
  {
    id: 1,
    missionCode: "MISSION 01 // SECTOR: HIGH-PERFORMANCE RESEARCH COMPUTE",
    category: "Realistic — Physical Systems, HPC Clusters & Infrastructure",
    scenario: "During a 72-hour LLM pre-training run on your university lab's 128-GPU liquid-cooled cluster, thermal throttling triggers an emergency coolant valve leak.",
    dilemma: "Where is your immediate instinct to intervene and resolve the breakdown?",
    choices: [
      {
        id: "A",
        archetype: "HPC INFRASTRUCTURE ENGINEER",
        badge: "R: REALISTIC",
        title: "Isolate Coolant Loop & Swap Manifold Seals",
        description: "Don safety gear, manually close manifold isolation valves, replace degraded fluoropolymer O-rings, and repressurize the dielectric loop.",
        riasecDelta: { R: 35, C: 10 },
        traitBonus: { trait: "builder", label: "Physical HPC Plumbing & Thermal System Repair" },
        tag: "Realistic - HPC Hardware Engineer",
        text: "[A] HPC INFRASTRUCTURE ENGINEER — Direct physical maintenance, thermal engineering, and emergency hardware isolation."
      },
      {
        id: "B",
        archetype: "DISTRIBUTED SYSTEMS RESEARCHER",
        badge: "I: INVESTIGATIVE",
        title: "Migrate Checkpoint Weights Across Nodes",
        description: "Write an emergency Slurm scheduler script to save distributed PyTorch model state tensors and re-route compute to healthy racks.",
        riasecDelta: { I: 30, R: 15 },
        traitBonus: { trait: "analytical", label: "Distributed Checkpoint Recovery & GPU Topology" },
        tag: "Investigative - Distributed Systems",
        text: "[B] DISTRIBUTED SYSTEMS RESEARCHER — Distributed systems fault tolerance, kernel orchestration, and telemetry."
      },
      {
        id: "C",
        archetype: "LAB PRINCIPAL INVESTIGATOR",
        badge: "E: ENTERPRISING",
        title: "Coordinate Cloud Spillover Credits with Sponsor",
        description: "Call enterprise industry sponsors, negotiate $40k emergency cloud GPU credits, and prevent research timeline collapse.",
        riasecDelta: { E: 30, S: 15 },
        traitBonus: { trait: "leadership", label: "Strategic Sponsorship & Resource Mobilization" },
        tag: "Enterprising - Research Director",
        text: "[C] LAB PRINCIPAL INVESTIGATOR — Crisis leadership, external sponsorship leverage, and resource management."
      },
      {
        id: "D",
        archetype: "LAB SAFETY & COMPLIANCE CHAIR",
        badge: "C: CONVENTIONAL",
        title: "Execute OSHA & Environmental Audit Protocol",
        description: "Halt high-voltage feeds, log incident telemetry, file hazardous material documentation, and mandate safety recertification.",
        riasecDelta: { C: 35, R: 10 },
        traitBonus: { trait: "conventional", label: "Lab Safety Certification & Regulatory Reporting" },
        tag: "Conventional - Safety Compliance",
        text: "[D] LAB SAFETY & COMPLIANCE CHAIR — Strict safety protocols, incident documentation, and formal auditing."
      }
    ]
  },
  {
    id: 2,
    missionCode: "MISSION 02 // SECTOR: THEORETICAL MACHINE LEARNING & PROOFS",
    category: "Investigative — Fundamental Research, Mathematics & Falsification",
    scenario: "Your PhD dissertation empirical experiments produce results that directly contradict a widely cited peer-reviewed mathematical theorem in neural optimization.",
    dilemma: "How do you rigorously challenge or reconcile this theoretical anomaly?",
    choices: [
      {
        id: "A",
        archetype: "THEORETICAL RESEARCHER",
        badge: "I: INVESTIGATIVE",
        title: "Construct Formal Counterexample & Re-prove Bounds",
        description: "Deconstruct the original lemma's Lipschitz continuity assumptions, isolate the unstated boundary edge case, and draft a formal mathematical proof.",
        riasecDelta: { I: 35, A: 10 },
        traitBonus: { trait: "research", label: "Mathematical Falsification & Rigorous Proofs" },
        tag: "Investigative - Theoretical Proofs",
        text: "[A] THEORETICAL RESEARCHER — Pure mathematics, proof deconstruction, and fundamental theoretical contributions."
      },
      {
        id: "B",
        archetype: "EMPIRICAL RIG ARCHITECT",
        badge: "R: REALISTIC",
        title: "Build Automated Monte Carlo Verification Rig",
        description: "Engineer an ablation pipeline across 50 random seeds and 10 million simulated parameter trajectories to measure anomaly recurrence.",
        riasecDelta: { R: 30, I: 15 },
        traitBonus: { trait: "builder", label: "High-Throughput Simulation & Statistical Rigor" },
        tag: "Realistic - Simulation Rig Architect",
        text: "[B] EMPIRICAL RIG ARCHITECT — High-throughput computational validation, deterministic seeds, and reproducible data."
      },
      {
        id: "C",
        archetype: "CONCEPTUAL PHILOSOPHER",
        badge: "A: ARTISTIC",
        title: "Synthesize Novel Visual Mental Model",
        description: "Formulate an elegant geometric metaphor and interactive visual topological manifold that re-frames how the community perceives the problem.",
        riasecDelta: { A: 30, I: 15 },
        traitBonus: { trait: "creative", label: "Conceptual Reframing & Visual Topology" },
        tag: "Artistic - Conceptual Theorist",
        text: "[C] CONCEPTUAL PHILOSOPHER — Paradigm synthesis, geometric visualization, and conceptual paradigm shifts."
      },
      {
        id: "D",
        archetype: "METHODOLOGY AUDITOR",
        badge: "C: CONVENTIONAL",
        title: "Conduct Blind Pre-Registered Replication",
        description: "Publish code and dataset hashes on OpenReview, pre-register evaluation protocols, and invite independent labs to replicate findings blindly.",
        riasecDelta: { C: 30, I: 15 },
        traitBonus: { trait: "analytical", label: "Open Science Protocols & Pre-Registered Trials" },
        tag: "Conventional - Scientific Integrity",
        text: "[D] METHODOLOGY AUDITOR — Strict open-science protocols, reproducible code packages, and validation standards."
      }
    ]
  },
  {
    id: 3,
    missionCode: "MISSION 03 // SECTOR: MULTIMODAL HUMAN-AGENT INTERACTION",
    category: "Artistic — Spatial UI, Cognitive Semiotics & Creative Systems",
    scenario: "Your lab is developing an augmented-reality interface that allows neurosurgeons to interact with real-time 3D brain tractography scans during operations.",
    dilemma: "Which core dimension of this high-consequence system do you architect?",
    choices: [
      {
        id: "A",
        archetype: "SPATIAL COGNITION DESIGNER",
        badge: "A: ARTISTIC",
        title: "Design Sub-Millimeter Spatial Visual Grammar",
        description: "Craft a zero-clutter holographic visual language with volumetric depth culling so critical vascular pathways are instantly intuitive.",
        riasecDelta: { A: 35, I: 10 },
        traitBonus: { trait: "creative", label: "Spatial Visual Semiotics & Volumetric Rendering" },
        tag: "Artistic - Spatial Systems Designer",
        text: "[A] SPATIAL COGNITION DESIGNER — Volumetric spatial UX, cognitive ergonomics, and visual hierarchy."
      },
      {
        id: "B",
        archetype: "NEUROLOGICAL ALGORITHM SCIENTIST",
        badge: "I: INVESTIGATIVE",
        title: "Model Real-Time Brain Deformity Physics",
        description: "Implement finite-element biomechanical tissue models to adjust hologram coordinates as brain tissue shifts dynamically in surgery.",
        riasecDelta: { I: 30, A: 15 },
        traitBonus: { trait: "research", label: "Biomechanical Physics & Finite-Element Math" },
        tag: "Investigative - Computational Biomechanist",
        text: "[B] NEUROLOGICAL ALGORITHM SCIENTIST — Biomechanical modeling, non-rigid registration, and physics simulation."
      },
      {
        id: "C",
        archetype: "CLINICAL HUMAN-FACTORS LEAD",
        badge: "S: SOCIAL",
        title: "Embed in Operating Theaters with Surgical Teams",
        description: "Observe surgical stress responses, interview chief neurosurgeons, and optimize interaction modalities to prevent cognitive overload.",
        riasecDelta: { S: 30, A: 15 },
        traitBonus: { trait: "social", label: "High-Stakes Clinical Empathy & Surgeon Safety" },
        tag: "Social - Clinical Human Factors",
        text: "[C] CLINICAL HUMAN-FACTORS LEAD — Empathetic clinical observation, cognitive safety, and human-in-the-loop UX."
      },
      {
        id: "D",
        archetype: "MEDICAL DEVICE REGULATORY LEAD",
        badge: "C: CONVENTIONAL",
        title: "Standardize FDA Class-II Software Dossier",
        description: "Structure IEC-62304 medical software life-cycle traceability matrices, risk classification trees, and verification test logs.",
        riasecDelta: { C: 30, A: 15 },
        traitBonus: { trait: "conventional", label: "FDA/ISO Medical Device Regulatory Compliance" },
        tag: "Conventional - Regulatory Architect",
        text: "[D] MEDICAL DEVICE REGULATORY LEAD — Strict regulatory filings, safety classification, and risk management."
      }
    ]
  },
  {
    id: 4,
    missionCode: "MISSION 04 // SECTOR: ACADEMIC LAB CULTURE & ETHICS",
    category: "Social — Mentorship, Intellectual Property & Lab Mediation",
    scenario: "A fierce intellectual property dispute erupts between a senior tenured faculty member and an international graduate student over primary credit on a breakthrough patent.",
    dilemma: "How do you navigate and resolve this ethical and interpersonal conflict?",
    choices: [
      {
        id: "A",
        archetype: "ACADEMIC OMBUDSPERSON",
        badge: "S: SOCIAL",
        title: "Mediate Restorative Justice Dialogue",
        description: "Convene confidential bilateral sessions, validate the vulnerable student's career anxieties, and craft an equitable co-inventorship agreement.",
        riasecDelta: { S: 35, E: 10 },
        traitBonus: { trait: "social", label: "Power-Imbalance Mediation & Ethical Protection" },
        tag: "Social - Academic Ombudsperson",
        text: "[A] ACADEMIC OMBUDSPERSON — Confidential mediation, power imbalance remediation, and restorative agreements."
      },
      {
        id: "B",
        archetype: "IP ARBITRATION EXPERT",
        badge: "C: CONVENTIONAL",
        title: "Audit Git Commits & Lab Notebooks",
        description: "Perform timestamped digital forensics on git commits, timestamped lab notebook hashes, and email records to establish primary authorship.",
        riasecDelta: { C: 30, S: 15 },
        traitBonus: { trait: "conventional", label: "Forensic IP Audit & Evidence-Based Authorship" },
        tag: "Conventional - IP Forensics",
        text: "[B] IP ARBITRATION EXPERT — Objective evidentiary review, timestamp verification, and institutional copyright norms."
      },
      {
        id: "C",
        archetype: "DEPARTMENT CHAIR",
        badge: "E: ENTERPRISING",
        title: "Structure Commercial Spinout with Equity Split",
        description: "Re-frame the conflict by proposing a university spinout company where faculty serves as Chief Scientist and student takes CEO/Co-Founder equity.",
        riasecDelta: { E: 30, S: 15 },
        traitBonus: { trait: "leadership", label: "Win-Win Commercial Restructuring & Strategic Incentives" },
        tag: "Enterprising - Technology Commercializer",
        text: "[C] DEPARTMENT CHAIR — Strategic equity restructuring, commercial incentive alignment, and dispute transcendence."
      },
      {
        id: "D",
        archetype: "SCIENTIFIC INTEGRITY RESEARCHER",
        badge: "I: INVESTIGATIVE",
        title: "Review Publication Ethics Guidelines (COPE)",
        description: "Evaluate Committee on Publication Ethics (COPE) global case precedents to create an institutional benchmark for graduate research credit.",
        riasecDelta: { I: 30, S: 15 },
        traitBonus: { trait: "research", label: "Scholarly Ethics Precedents & Epistemic Fairness" },
        tag: "Investigative - Ethics Scholar",
        text: "[D] SCIENTIFIC INTEGRITY RESEARCHER — Scholarly ethics guidelines, international precedents, and normative principles."
      }
    ]
  },
  {
    id: 5,
    missionCode: "MISSION 05 // SECTOR: DEEPTECH SPINOUT & VENTURE CAPITAL",
    category: "Enterprising — Venture Commercialization, Valuation & Strategy",
    scenario: "Your university tech transfer office selects your patented lab technology for a $2.5M Series Seed venture spinout round with leading frontier tech investors.",
    dilemma: "What is your strategic focus as you navigate this commercialization threshold?",
    choices: [
      {
        id: "A",
        archetype: "FOUNDING CEO",
        badge: "E: ENTERPRISING",
        title: "Negotiate Term Sheet & Define Market Moat",
        description: "Defend cap-table equity dilution, articulate non-linear enterprise customer lifetime value, and lead customer discovery with enterprise pilots.",
        riasecDelta: { E: 35, S: 10 },
        traitBonus: { trait: "leadership", label: "Cap-Table Negotiation & Strategic Enterprise Vision" },
        tag: "Enterprising - DeepTech Founder",
        text: "[A] FOUNDING CEO — Capital allocation, commercial negotiation, and high-velocity go-to-market execution."
      },
      {
        id: "B",
        archetype: "CHIEF SCIENTIFIC OFFICER",
        badge: "I: INVESTIGATIVE",
        title: "Defend Frontier Research Roadmap & Patents",
        description: "Maintain scientific rigor, expand core defensive patents, and ensure enterprise productization does not compromise technical superiority.",
        riasecDelta: { I: 30, E: 15 },
        traitBonus: { trait: "research", label: "Defensive IP Fortification & DeepTech R&D" },
        tag: "Investigative - Chief Scientific Officer",
        text: "[B] CHIEF SCIENTIFIC OFFICER — Deep technological defensibility, patent portfolio strategy, and fundamental discovery."
      },
      {
        id: "C",
        archetype: "LEAD SYSTEMS PROTOTYPER",
        badge: "R: REALISTIC",
        title: "Build Production-Ready Alpha Hardware Rig",
        description: "Transition delicate lab-bench apparatus into rugged, rack-mountable, industrial-grade alpha prototypes ready for customer deployments.",
        riasecDelta: { R: 30, E: 15 },
        traitBonus: { trait: "builder", label: "Industrial Prototyping & Field Reliability" },
        tag: "Realistic - Hardware Prototyper",
        text: "[C] LEAD SYSTEMS PROTOTYPER — Industrial design, physical hardening, and production-grade transition."
      },
      {
        id: "D",
        archetype: "GENERAL COUNSEL & COMPLIANCE",
        badge: "C: CONVENTIONAL",
        title: "Establish Clean Technology Transfer Licensing",
        description: "Draft comprehensive university royalty agreements, export control compliance (ITAR/EAR), and clean corporate governance bylaws.",
        riasecDelta: { C: 30, E: 15 },
        traitBonus: { trait: "conventional", label: "Tech Transfer Licensing & Corporate Governance" },
        tag: "Conventional - Corporate Counsel",
        text: "[D] GENERAL COUNSEL & COMPLIANCE — Strict legal governance, clean IP assignment, and regulatory risk reduction."
      }
    ]
  },
  {
    id: 6,
    missionCode: "MISSION 06 // SECTOR: INSTITUTIONAL RESEARCH INTEGRITY & IRB",
    category: "Conventional — Institutional Review, Bioethics & Research Rigor",
    scenario: "An anonymous whistleblower alleges that a flagship clinical research dataset from your institute contains p-hacked statistical anomalies.",
    dilemma: "How do you lead the institutional investigation to preserve scientific credibility?",
    choices: [
      {
        id: "A",
        archetype: "CHIEF INTEGRITY OFFICER",
        badge: "C: CONVENTIONAL",
        title: "Execute Forensic Audit of Raw Sensor Logs",
        description: "Impound original laboratory notebooks and raw database timestamp dumps, checking against published figures for data tampering.",
        riasecDelta: { C: 35, I: 10 },
        traitBonus: { trait: "conventional", label: "Forensic Data Audits & Procedural Standards" },
        tag: "Conventional - Scientific Auditor",
        text: "[A] CHIEF INTEGRITY OFFICER — Systematic data verification, chain-of-custody logging, and regulatory impartiality."
      },
      {
        id: "B",
        archetype: "BIOSTATISTICAL DIAGNOSTICIAN",
        badge: "I: INVESTIGATIVE",
        title: "Run Benford's Law & Distribution Analyses",
        description: "Analyze digit frequency distributions, run Bayesian re-evaluations of published p-values, and identify artificial variance suppression.",
        riasecDelta: { I: 30, C: 15 },
        traitBonus: { trait: "research", label: "Statistical Forensics & Distributional Anomalies" },
        tag: "Investigative - Biostatistician",
        text: "[B] BIOSTATISTICAL DIAGNOSTICIAN — High-level statistical forensics, anomaly detection algorithms, and empirical rigor."
      },
      {
        id: "C",
        archetype: "ETHICS COMMITTEE MEDIATOR",
        badge: "S: SOCIAL",
        title: "Protect Whistleblower & Support Junior Trainees",
        description: "Ensure the whistleblower remains protected from retaliation while providing mental health and career counseling to lab students.",
        riasecDelta: { S: 30, C: 15 },
        traitBonus: { trait: "social", label: "Whistleblower Protection & Trainee Advocacy" },
        tag: "Social - Institutional Ombudsman",
        text: "[C] ETHICS COMMITTEE MEDIATOR — Human vulnerability protection, psychological safety, and institutional compassion."
      },
      {
        id: "D",
        archetype: "INSTITUTIONAL SPOKESPERSON",
        badge: "E: ENTERPRISING",
        title: "Draft Transparent Public Accountability Report",
        description: "Hold a press briefing with journal editors and federal grant sponsors, presenting a swift, transparent roadmap for institutional reform.",
        riasecDelta: { E: 30, C: 15 },
        traitBonus: { trait: "leadership", label: "Public Accountability & Strategic Governance" },
        tag: "Enterprising - Institutional Director",
        text: "[D] INSTITUTIONAL SPOKESPERSON — Transparent external relations, strategic reputation recovery, and leadership command."
      }
    ]
  }
];

export const PROFESSIONAL_DISCOVERY_SCENARIOS: DiscoveryScenario[] = [
  {
    id: 1,
    missionCode: "MISSION 01 // SECTOR: MISSION-CRITICAL INFRASTRUCTURE",
    category: "Realistic — Production Architecture, High-Consequence SRE",
    scenario: "At 2:15 AM on Black Friday, your enterprise cloud database cluster suffers a split-brain failover, causing connection starvation across payments.",
    dilemma: "Where is your immediate instinct to intervene and resolve the breakdown?",
    choices: [
      {
        id: "A",
        archetype: "STAFF SYSTEMS ENGINEER",
        badge: "R: REALISTIC",
        title: "SSH to Primary Node & Force Quorum Reset",
        description: "Access out-of-band console access, inspect Raft consensus logs, manually isolate the partitioned replica, and restore database quorum.",
        riasecDelta: { R: 35, C: 10 },
        traitBonus: { trait: "builder", label: "Production SRE Hands-on Triage & Cluster Repair" },
        tag: "Realistic - Staff SRE",
        text: "[A] STAFF SYSTEMS ENGINEER — Direct console intervention, low-level consensus triage, and cluster recovery."
      },
      {
        id: "B",
        archetype: "ROOT-CAUSE DIAGNOSTICIAN",
        badge: "I: INVESTIGATIVE",
        title: "Analyze Distributed Traces & TCP TCP_NODELAY",
        description: "Correlate eBPF network packet drops with distributed OpenTelemetry spans to isolate subtle socket buffer deadlocks in kernel queues.",
        riasecDelta: { I: 30, R: 15 },
        traitBonus: { trait: "analytical", label: "eBPF Packet Telemetry & Kernel Queue Tracing" },
        tag: "Investigative - Systems Diagnostics",
        text: "[B] ROOT-CAUSE DIAGNOSTICIAN — Kernel tracing, network socket diagnostics, and deep distributed telemetry."
      },
      {
        id: "C",
        archetype: "INCIDENT COMMANDER",
        badge: "E: ENTERPRISING",
        title: "Take Command, Activate Degraded Mode & Brief Execs",
        description: "Declare SEV-0 incident command, spin down non-critical services to throttle load, and brief C-suite executives on mitigation timelines.",
        riasecDelta: { E: 30, S: 15 },
        traitBonus: { trait: "leadership", label: "Crisis Command & Executive Business Continuity" },
        tag: "Enterprising - Incident Commander",
        text: "[C] INCIDENT COMMANDER — High-stakes incident leadership, tactical trade-offs, and executive communication."
      },
      {
        id: "D",
        archetype: "POST-MORTEM & COMPLIANCE LEAD",
        badge: "C: CONVENTIONAL",
        title: "Execute SLA Impact Ledger & Incident Record",
        description: "Capture millisecond timeline logs, initiate customer SLA credit ledgers, and mandate blameless post-mortem actions within 48 hours.",
        riasecDelta: { C: 35, R: 10 },
        traitBonus: { trait: "conventional", label: "SLA Auditing & Blameless Post-Mortem Rigor" },
        tag: "Conventional - SLA Sentinel",
        text: "[D] POST-MORTEM & COMPLIANCE LEAD — Systematic timeline documentation, contractual SLA audits, and preventive governance."
      }
    ]
  },
  {
    id: 2,
    missionCode: "MISSION 02 // SECTOR: ENTERPRISE AI & PRODUCTION ML",
    category: "Investigative — Research, Latent Embeddings & Model Diagnostics",
    scenario: "Your company's production recommendation engine exhibits a sudden 18% decline in user conversion, but offline test set metrics still show 98% accuracy.",
    dilemma: "How do you diagnose and eliminate this high-dimensional production discrepancy?",
    choices: [
      {
        id: "A",
        archetype: "PRINCIPAL AI SCIENTIST",
        badge: "I: INVESTIGATIVE",
        title: "Detect Covariate Drift in Latent Embedding Spaces",
        description: "Compute Wasserstein distance between training distributions and live request vectors to pinpoint covariate shift in latent user embeddings.",
        riasecDelta: { I: 35, A: 10 },
        traitBonus: { trait: "research", label: "High-Dimensional Distribution Shift Analysis" },
        tag: "Investigative - Principal AI Scientist",
        text: "[A] PRINCIPAL AI SCIENTIST — Advanced statistical distances, distribution shift analysis, and embedding geometry."
      },
      {
        id: "B",
        archetype: "ML SYSTEMS ARCHITECT",
        badge: "R: REALISTIC",
        title: "Audit Feature Store Pipeline Jitter & Latencies",
        description: "Inspect Redis feature store read timeouts and Kafka streaming consumer lag that could silently inject default fallback values.",
        riasecDelta: { R: 30, I: 15 },
        traitBonus: { trait: "builder", label: "Real-Time Feature Streaming & Cache Telemetry" },
        tag: "Realistic - ML Systems Architect",
        text: "[B] ML SYSTEMS ARCHITECT — Streaming pipeline telemetry, real-time caching, and infrastructure validation."
      },
      {
        id: "C",
        archetype: "COGNITIVE PRODUCT STRATEGIST",
        badge: "A: ARTISTIC",
        title: "Qualitative User Journey & Contextual Redesign",
        description: "Shadow live users to observe real decision friction, redesign recommendation card visual hierarchy, and inject delight into suggestions.",
        riasecDelta: { A: 30, I: 15 },
        traitBonus: { trait: "creative", label: "Behavioral Context & Intuitive Presentation" },
        tag: "Artistic - Cognitive Product Lead",
        text: "[C] COGNITIVE PRODUCT STRATEGIST — User mental models, aesthetic recommendation design, and contextual resonance."
      },
      {
        id: "D",
        archetype: "PRODUCTION EVALUATION GOVERNOR",
        badge: "C: CONVENTIONAL",
        title: "Deploy Continuous Real-Time Shadow Pipeline",
        description: "Institute a strict shadow deployment canary with automated rollback thresholds and continuous Kolmogorov-Smirnov statistical tests.",
        riasecDelta: { C: 30, I: 15 },
        traitBonus: { trait: "analytical", label: "Canary Guardrails & Automated Rollback Policies" },
        tag: "Conventional - ML Governance",
        text: "[D] PRODUCTION EVALUATION GOVERNOR — Canary deployment guardrails, automated rollback criteria, and data governance."
      }
    ]
  },
  {
    id: 3,
    missionCode: "MISSION 03 // SECTOR: ENTERPRISE DESIGN SYSTEMS & UX",
    category: "Artistic — Design Systems, Spatial Aesthetics & Accessibility",
    scenario: "Your company is redesigning its core B2B SaaS platform used by 50,000 daily professionals. Engineering, design, and accessibility are in deadlock.",
    dilemma: "Which dimension of this platform transformation do you champion?",
    choices: [
      {
        id: "A",
        archetype: "HEAD OF DESIGN ARCHITECTURE",
        badge: "A: ARTISTIC",
        title: "Craft Unified High-Density Design Language",
        description: "Author a cohesive token-based design system balancing sleek typography, crisp natural palettes, and frictionless micro-interactions.",
        riasecDelta: { A: 35, I: 10 },
        traitBonus: { trait: "creative", label: "Systemic Design Aesthetics & Typographic Tokens" },
        tag: "Artistic - Design Systems Architect",
        text: "[A] HEAD OF DESIGN ARCHITECTURE — Cohesive visual tokens, design craft, and elegant high-density information display."
      },
      {
        id: "B",
        archetype: "FRONTEND FRAMEWORK ARCHITECT",
        badge: "R: REALISTIC",
        title: "Optimize Zero-Runtime CSS & Sub-60fps DOM",
        description: "Architect lightweight web components with virtualized scrolling, zero-runtime CSS variables, and instant keyboard navigation.",
        riasecDelta: { R: 30, A: 15 },
        traitBonus: { trait: "builder", label: "Virtualized DOM Rendering & Sub-60fps Performance" },
        tag: "Realistic - Frontend Architect",
        text: "[B] FRONTEND FRAMEWORK ARCHITECT — Extreme rendering performance, virtualized DOM trees, and zero-runtime architecture."
      },
      {
        id: "C",
        archetype: "CUSTOMER ADOPTION DIRECTOR",
        badge: "S: SOCIAL",
        title: "Partner with Power Users in Transition Labs",
        description: "Establish customer transition advisory councils, listen to daily muscle-memory frustrations, and design onboarding pathways.",
        riasecDelta: { S: 30, A: 15 },
        traitBonus: { trait: "social", label: "Customer Change-Management & Empathy Labs" },
        tag: "Social - Customer Success Architect",
        text: "[C] CUSTOMER ADOPTION DIRECTOR — Change management, customer empathy, and friction-free user migration."
      },
      {
        id: "D",
        archetype: "WCAG & ACCESSIBILITY SENTINEL",
        badge: "C: CONVENTIONAL",
        title: "Enforce Strict WCAG 2.2 AAA & Screen Reader Norms",
        description: "Mandate automated accessibility CI test gates, semantic ARIA landmarks, and 7:1 contrast compliance across all theme tokens.",
        riasecDelta: { C: 30, A: 15 },
        traitBonus: { trait: "conventional", label: "WCAG 2.2 Compliance & Automated Accessibility Gates" },
        tag: "Conventional - Accessibility Sentinel",
        text: "[D] WCAG & ACCESSIBILITY SENTINEL — Strict accessibility compliance, automated CI gating, and regulatory conformance."
      }
    ]
  },
  {
    id: 4,
    missionCode: "MISSION 04 // SECTOR: ORGANIZATIONAL STRATEGY & CULTURE",
    category: "Social — Leadership Development, Retention & Restructuring",
    scenario: "Following an unexpected corporate merger, your 60-person engineering organization suffers severe morale decline and resignation threats.",
    dilemma: "How do you stabilize talent, restore trust, and realign the team?",
    choices: [
      {
        id: "A",
        archetype: "VP OF PEOPLE & TALENT ARCHITECTURE",
        badge: "S: SOCIAL",
        title: "Conduct 1-on-1 Stay Interviews & Rebuild Trust",
        description: "Block 30 days for candid, vulnerable 1-on-1s with high-impact engineers, address compensation inequities, and co-author career ladders.",
        riasecDelta: { S: 35, E: 10 },
        traitBonus: { trait: "social", label: "Psychological Safety, Retention & Empathetic Leadership" },
        tag: "Social - People Leader",
        text: "[A] VP OF PEOPLE & TALENT ARCHITECTURE — Empathetic listening, psychological safety, and individual career protection."
      },
      {
        id: "B",
        archetype: "VP OF ENGINEERING",
        badge: "E: ENTERPRISING",
        title: "Reorganize Teams Around High-Growth Bets",
        description: "Dissolve legacy silos, empower technical leads with clear P&L ownership, and rally everyone around a bold unified mission.",
        riasecDelta: { E: 30, S: 15 },
        traitBonus: { trait: "leadership", label: "Organizational Realignment & Strategic Momentum" },
        tag: "Enterprising - Engineering Executive",
        text: "[B] VP OF ENGINEERING — Decisive organizational restructuring, executive clarity, and ambitious goals."
      },
      {
        id: "C",
        archetype: "ORGANIZATIONAL ANALYST",
        badge: "I: INVESTIGATIVE",
        title: "Model Attrition Risk Using Communication Graphs",
        description: "Analyze PR review velocity and cross-team communication centrality to identify isolated pockets of disenfranchised engineers.",
        riasecDelta: { I: 30, S: 15 },
        traitBonus: { trait: "analytical", label: "Social Network Analysis & Attrition Modeling" },
        tag: "Investigative - Organizational Scientist",
        text: "[C] ORGANIZATIONAL ANALYST — Network centrality graphs, quantitative burnout signals, and data-backed diagnostics."
      },
      {
        id: "D",
        archetype: "TOTAL REWARDS & HR SENTINEL",
        badge: "C: CONVENTIONAL",
        title: "Standardize Levels, Bands & Retention Grants",
        description: "Publish clear salary bands, standardized performance rubrics, and formal retention equity vesting schedules.",
        riasecDelta: { C: 30, S: 15 },
        traitBonus: { trait: "conventional", label: "Transparent Compensation Bands & Fair Policies" },
        tag: "Conventional - Compensation Architect",
        text: "[D] TOTAL REWARDS & HR SENTINEL — Structured compensation leveling, transparent performance bands, and objective equity."
      }
    ]
  },
  {
    id: 5,
    missionCode: "MISSION 05 // SECTOR: EXECUTIVE CAPITAL ALLOCATION",
    category: "Enterprising — Capital Allocation, M&A & Strategic Pivots",
    scenario: "As general manager of an enterprise product line, you have ₹25 Crores in unallocated capex. You must decide whether to acquire, pivot, or expand.",
    dilemma: "Which strategic growth initiative do you champion to the board of directors?",
    choices: [
      {
        id: "A",
        archetype: "CHIEF STRATEGY OFFICER",
        badge: "E: ENTERPRISING",
        title: "Acquire DeepTech Target & Capture Market Share",
        description: "Acquire a nimble, high-patent AI startup, eliminate an aggressive competitor, and capture 35% market share within 12 months.",
        riasecDelta: { E: 35, S: 10 },
        traitBonus: { trait: "leadership", label: "Aggressive M&A Strategy & Market Expansion" },
        tag: "Enterprising - Corporate Strategist",
        text: "[A] CHIEF STRATEGY OFFICER — Bold strategic M&A, aggressive market capture, and high-stakes capital bets."
      },
      {
        id: "B",
        archetype: "R&D INNOVATION DIRECTOR",
        badge: "I: INVESTIGATIVE",
        title: "Fund Frontier In-House DeepTech R&D",
        description: "Allocate 80% to a secretive skunkworks team developing proprietary foundational intellectual property with multi-year moats.",
        riasecDelta: { I: 30, E: 15 },
        traitBonus: { trait: "research", label: "Proprietary IP Fortification & Long-Horizon R&D" },
        tag: "Investigative - R&D Director",
        text: "[B] R&D INNOVATION DIRECTOR — Multi-year intellectual property creation, fundamental tech moats, and technical depth."
      },
      {
        id: "C",
        archetype: "PLATFORM ECOSYSTEM ARCHITECT",
        badge: "A: ARTISTIC",
        title: "Build Global Developer Ecosystem & App Store",
        description: "Fund open-source APIs, developer conferences, and an intuitive developer portal that fosters vibrant third-party innovation.",
        riasecDelta: { A: 30, E: 15 },
        traitBonus: { trait: "creative", label: "Ecosystem Design, Developer Experience & Community" },
        tag: "Artistic - Ecosystem Architect",
        text: "[C] PLATFORM ECOSYSTEM ARCHITECT — Creative platform ecosystems, developer experience design, and open network effects."
      },
      {
        id: "D",
        archetype: "CHIEF FINANCIAL ARBITER",
        badge: "C: CONVENTIONAL",
        title: "Optimize Working Capital & Share Buybacks",
        description: "Repay high-interest corporate debt, streamline operating working capital, and guarantee predictable 14% IRR dividends to shareholders.",
        riasecDelta: { C: 30, E: 15 },
        traitBonus: { trait: "conventional", label: "Fiscal Prudence, IRR Discipline & Risk Mitigation" },
        tag: "Conventional - Finance Arbiter",
        text: "[D] CHIEF FINANCIAL ARBITER — Strict IRR modeling, disciplined balance sheet management, and prudent fiduciary governance."
      }
    ]
  },
  {
    id: 6,
    missionCode: "MISSION 06 // SECTOR: ENTERPRISE GOVERNANCE & IPO PREP",
    category: "Conventional — SOC-2, Regulatory Compliance & Risk Governance",
    scenario: "Ahead of a planned US/Indian IPO, an independent external security audit flags 4 critical data governance vulnerabilities in customer databases.",
    dilemma: "How do you resolve these compliance risks to clear the institutional audit?",
    choices: [
      {
        id: "A",
        archetype: "CHIEF TRUST & COMPLIANCE OFFICER",
        badge: "C: CONVENTIONAL",
        title: "Implement Strict Zero-Trust & SOC-2 Audit Controls",
        description: "Enforce role-based column encryption, immutable audit logging with cryptographic proof, and certify SOC-2 Type II clearance.",
        riasecDelta: { C: 35, I: 10 },
        traitBonus: { trait: "conventional", label: "Cryptographic Audit Logs & Zero-Trust Governance" },
        tag: "Conventional - Trust & Compliance Lead",
        text: "[A] CHIEF TRUST & COMPLIANCE OFFICER — Institutional security controls, immutable audit trails, and certification standards."
      },
      {
        id: "B",
        archetype: "CHIEF INFORMATION SECURITY OFFICER",
        badge: "I: INVESTIGATIVE",
        title: "Conduct Red-Team Threat Modeling & Pen-Testing",
        description: "Deploy internal ethical offensive engineers to attempt exploit vectors against live cluster boundaries to expose real vulnerability surfaces.",
        riasecDelta: { I: 30, C: 15 },
        traitBonus: { trait: "research", label: "Adversarial Threat Modeling & Exploit Diagnostics" },
        tag: "Investigative - Security Researcher",
        text: "[B] CHIEF INFORMATION SECURITY OFFICER — Adversarial threat analysis, exploit vector isolation, and deep vulnerability research."
      },
      {
        id: "C",
        archetype: "ENTERPRISE SECURITY ADVOCATE",
        badge: "S: SOCIAL",
        title: "Conduct Security Training & Blameless Workshops",
        description: "Train 500+ engineers through interactive, hands-on secure coding workshops, replacing fear with an empowering security culture.",
        riasecDelta: { S: 30, C: 15 },
        traitBonus: { trait: "social", label: "Security Culture, Empathy & Educational Enablement" },
        tag: "Social - Security Culture Champion",
        text: "[C] ENTERPRISE SECURITY ADVOCATE — Culture transformation, human-first security coaching, and collective responsibility."
      },
      {
        id: "D",
        archetype: "BOARD AUDIT COMMITTEE CHAIR",
        badge: "E: ENTERPRISING",
        title: "Restructure Risk Governance & Reassure Bankers",
        description: "Direct executive remediation timelines, present certified mitigation milestones to underwriting investment banks, and keep the IPO on schedule.",
        riasecDelta: { E: 30, C: 15 },
        traitBonus: { trait: "leadership", label: "Executive Governance & Investor Confidence" },
        tag: "Enterprising - Board Committee Lead",
        text: "[D] BOARD AUDIT COMMITTEE CHAIR — Fiduciary leadership, investor confidence preservation, and executive oversight."
      }
    ]
  }
];

// Map of discovery scenarios by life stage
export const DISCOVERY_SCENARIOS_BY_STAGE: Record<LifeStage, DiscoveryScenario[]> = {
  class10: CLASS10_DISCOVERY_SCENARIOS,
  class12: CLASS12_DISCOVERY_SCENARIOS,
  ug: UG_SCENARIOS,
  pg: PG_DISCOVERY_SCENARIOS,
  professional: PROFESSIONAL_DISCOVERY_SCENARIOS
};

export function getDiscoveryScenariosForStage(stage?: LifeStage): DiscoveryScenario[] {
  if (stage && DISCOVERY_SCENARIOS_BY_STAGE[stage]) {
    return DISCOVERY_SCENARIOS_BY_STAGE[stage];
  }
  return UG_SCENARIOS;
}

// ============================================================================
// STAGE-SPECIFIC COGNITIVE APTITUDE QUESTIONS (5 VECTORS)
// ============================================================================

export const CLASS10_APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 1,
    dimension: "Logical & Deductive Reasoning",
    llmTag: "cognitive.logical",
    weight: 0.2,
    prompt: "In an inter-school science symposium: School Alpha scored higher than School Beta. School Gamma scored higher than School Delta. School Beta scored higher than School Gamma. Which school finished with the lowest score?",
    options: [
      { text: "School Delta", score: 20 },
      { text: "School Gamma", score: 14 },
      { text: "School Beta", score: 10 },
      { text: "School Alpha", score: 6 }
    ],
    rationale: "Correct answer is School Delta. The score hierarchy is Alpha > Beta > Gamma > Delta. Delta finished lowest."
  },
  {
    id: 2,
    dimension: "Numerical Facility & Pattern Reasoning",
    llmTag: "cognitive.numerical",
    weight: 0.2,
    prompt: "Examine the number series: 4, 9, 16, 25, 36, ___ . Which number logically continues the progression?",
    options: [
      { text: "49", score: 20 },
      { text: "47", score: 13 },
      { text: "45", score: 10 },
      { text: "50", score: 7 }
    ],
    rationale: "Correct answer is 49. The sequence represents consecutive squares: 2², 3², 4², 5², 6², 7² = 49."
  },
  {
    id: 3,
    dimension: "Systemic & Analytical Problem Solving",
    llmTag: "cognitive.analytical",
    weight: 0.2,
    prompt: "On a science lab beam balance: 3 iron bolts balance exactly with 1 brass weight. A second scale shows 2 brass weights balance exactly with 1 steel block. How many iron bolts balance with 1 steel block?",
    options: [
      { text: "6 Iron Bolts", score: 20 },
      { text: "5 Iron Bolts", score: 13 },
      { text: "4 Iron Bolts", score: 10 },
      { text: "8 Iron Bolts", score: 6 }
    ],
    rationale: "Correct answer is 6 Iron Bolts. 1 Steel = 2 Brass = 2 * (3 Bolts) = 6 Bolts."
  },
  {
    id: 4,
    dimension: "Spatial Orientation & Navigation Reasoning",
    llmTag: "cognitive.spatial",
    weight: 0.2,
    prompt: "Starting from the school library, you walk 20 meters North, turn 90° clockwise, walk 15 meters, turn 90° clockwise again, and walk 20 meters. Which direction are you from the library right now?",
    options: [
      { text: "East", score: 20 },
      { text: "West", score: 13 },
      { text: "North", score: 9 },
      { text: "South", score: 6 }
    ],
    rationale: "Correct answer is East. Walking 20m N, 15m E, then 20m S brings you to a point exactly 15m directly East of your starting position."
  },
  {
    id: 5,
    dimension: "Verbal & Relational Analogy",
    llmTag: "cognitive.verbal",
    weight: 0.2,
    prompt: "Complete the scientific instrument analogy: 'BAROMETER' is to 'PRESSURE' as 'ANEMOMETER' is to '______'.",
    options: [
      { text: "WIND SPEED", score: 20 },
      { text: "HUMIDITY", score: 13 },
      { text: "RAINFALL", score: 10 },
      { text: "TEMPERATURE", score: 7 }
    ],
    rationale: "Correct answer is WIND SPEED. A barometer measures atmospheric pressure; an anemometer measures wind velocity/speed."
  }
];

export const CLASS12_APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 1,
    dimension: "Logical & Deductive Reasoning",
    llmTag: "cognitive.logical",
    weight: 0.2,
    prompt: "Consider the conditional rules: All quantum simulators are high-throughput systems. No high-throughput system exhibits unbounded latency. System X exhibits unbounded latency. Which conclusion MUST be true?",
    options: [
      { text: "System X is NOT a quantum simulator", score: 20 },
      { text: "System X is a high-throughput system", score: 6 },
      { text: "System X is a classical emulator", score: 9 },
      { text: "No definitive deduction is possible", score: 13 }
    ],
    rationale: "Correct answer is System X is NOT a quantum simulator. By contraposition, unbounded latency implies NOT high-throughput, which implies NOT quantum simulator."
  },
  {
    id: 2,
    dimension: "Numerical Facility & Pattern Reasoning",
    llmTag: "cognitive.numerical",
    weight: 0.2,
    prompt: "Identify the next number in the recursive sequence: 5, 12, 26, 54, ___ .",
    options: [
      { text: "110", score: 20 },
      { text: "108", score: 14 },
      { text: "112", score: 10 },
      { text: "106", score: 7 }
    ],
    rationale: "Correct answer is 110. The recurrence relation is x_(n+1) = (x_n * 2) + 2: (54 * 2) + 2 = 110."
  },
  {
    id: 3,
    dimension: "Systemic & Analytical Problem Solving",
    llmTag: "cognitive.analytical",
    weight: 0.2,
    prompt: "Pipeline Alpha fills a compute job buffer in 6 hours alone. Pipeline Beta fills it in 3 hours alone. Working simultaneously at constant rates, how many hours will both pipelines take to fill 1.5 times the job buffer?",
    options: [
      { text: "3.0 Hours", score: 20 },
      { text: "2.0 Hours", score: 10 },
      { text: "4.5 Hours", score: 7 },
      { text: "2.5 Hours", score: 14 }
    ],
    rationale: "Correct answer is 3.0 Hours. Combined rate = (1/6 + 1/3) = 1/2 buffer per hour. Time for 1.5 buffers = 1.5 / 0.5 = 3.0 hours."
  },
  {
    id: 4,
    dimension: "Spatial Topology & Projection",
    llmTag: "cognitive.spatial",
    weight: 0.2,
    prompt: "A solid 3x3x3 wooden cube is painted black on all exterior faces, then cut into 27 identical 1x1x1 unit cubes. How many unit cubes have EXACTLY two painted faces?",
    options: [
      { text: "12", score: 20 },
      { text: "8", score: 14 },
      { text: "6", score: 10 },
      { text: "1", score: 6 }
    ],
    rationale: "Correct answer is 12. Cubes with exactly 2 painted faces sit along the middle of each of the 12 edges (1 cube per edge * 12 edges = 12)."
  },
  {
    id: 5,
    dimension: "Verbal & Relational Analogy",
    llmTag: "cognitive.verbal",
    weight: 0.2,
    prompt: "Complete the physics & thermodynamic analogy: 'ENTROPY' is to 'ORDER' as 'RESISTANCE' is to '______'.",
    options: [
      { text: "CONDUCTANCE", score: 20 },
      { text: "VOLTAGE", score: 13 },
      { text: "CAPACITANCE", score: 7 },
      { text: "CURRENT", score: 10 }
    ],
    rationale: "Correct answer is CONDUCTANCE. Entropy is the conceptual opposite of physical order; electrical resistance is the reciprocal opposite of electrical conductance."
  }
];

// Re-export original UG aptitude questions as standard UG questions
import { APTITUDE_QUESTIONS as UG_APTITUDE_QUESTIONS } from './mockAlignxData';
export { UG_APTITUDE_QUESTIONS };

export const PG_APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 1,
    dimension: "Epistemic & Deductive Logic",
    llmTag: "cognitive.logical",
    weight: 0.2,
    prompt: "A hypothesis H states: 'All non-convex optimization loss surfaces in overparameterized networks have zero spurious local minima.' Which empirical finding would conclusively falsify hypothesis H?",
    options: [
      { text: "A single certified saddle-point with strictly positive training loss and positive definite Hessian", score: 20 },
      { text: "A network trained with stochastic gradient descent reaching 99.8% accuracy", score: 6 },
      { text: "A proof that convex landscapes have a unique global optimum", score: 9 },
      { text: "An ablation run where learning rate schedule fails to converge", score: 13 }
    ],
    rationale: "Correct answer is finding a single certified local minimum (positive definite Hessian with positive loss), which provides a direct counterexample to the claim that all local minima are zero-loss."
  },
  {
    id: 2,
    dimension: "Stochastic & Quantitative Facility",
    llmTag: "cognitive.numerical",
    weight: 0.2,
    prompt: "A distributed system node fails with independent probability 0.1 per hour. What is the approximate probability that at least one of 3 parallel independent redundant nodes survives an 1-hour window?",
    options: [
      { text: "0.999 (99.9%)", score: 20 },
      { text: "0.900 (90.0%)", score: 10 },
      { text: "0.970 (97.0%)", score: 14 },
      { text: "0.729 (72.9%)", score: 7 }
    ],
    rationale: "Correct answer is 0.999. Probability of all 3 failing = 0.1³ = 0.001. Survival probability = 1 - 0.001 = 0.999."
  },
  {
    id: 3,
    dimension: "Non-Linear Systems Dynamics",
    llmTag: "cognitive.analytical",
    weight: 0.2,
    prompt: "In a closed feedback loop, an amplifier has open-loop gain A = 100 and negative feedback fraction β = 0.09. If gain A drops by 20% to 80 due to thermal decay, what is the approximate percentage reduction in closed-loop gain A_f = A / (1 + Aβ)?",
    options: [
      { text: "Approximately 2.5%", score: 20 },
      { text: "Exactly 20.0%", score: 6 },
      { text: "Approximately 10.0%", score: 10 },
      { text: "Approximately 0.5%", score: 13 }
    ],
    rationale: "Correct answer is ~2.5%. Initially A_f = 100/(1+9) = 10. After decay A_f = 80/(1+7.2) = 80/8.2 ≈ 9.756. Drop is (10 - 9.756)/10 ≈ 2.44%."
  },
  {
    id: 4,
    dimension: "High-Dimensional Spatial Topology",
    llmTag: "cognitive.spatial",
    weight: 0.2,
    prompt: "In an n-dimensional Euclidean space ℝⁿ, how many mutually orthogonal coordinate hyperplanes can intersect at the origin?",
    options: [
      { text: "n mutually orthogonal basis planes", score: 20 },
      { text: "2ⁿ planes", score: 10 },
      { text: "n(n-1)/2 planes", score: 14 },
      { text: "Infinity", score: 6 }
    ],
    rationale: "Correct answer is n mutually orthogonal basis vectors defining coordinate directions."
  },
  {
    id: 5,
    dimension: "Epistemological & Conceptual Analogy",
    llmTag: "cognitive.verbal",
    weight: 0.2,
    prompt: "Complete the scientific epistemological analogy: 'FALSIFIABILITY' is to 'POPPERIAN CRITERION' as 'PARADIGM SHIFT' is to '______'.",
    options: [
      { text: "KUHNIAN REVOLUTION", score: 20 },
      { text: "BAYESIAN INFERENCE", score: 13 },
      { text: "OCCAM'S RAZOR", score: 10 },
      { text: "CARTESIAN SKEPTICISM", score: 6 }
    ],
    rationale: "Correct answer is KUHNIAN REVOLUTION. Falsifiability is the signature epistemology of Karl Popper; paradigm shift is the signature concept of Thomas Kuhn."
  }
];

export const PROFESSIONAL_APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 1,
    dimension: "Strategic Deductive Logic & Constraints",
    llmTag: "cognitive.logical",
    weight: 0.2,
    prompt: "A distributed core architecture has 4 microservices (A, B, C, D). Rule 1: A requires B or C to run. Rule 2: D requires A to run, and D cannot run if C is degraded. If C is currently degraded and D is running successfully, what conclusion MUST be true?",
    options: [
      { text: "B is operational and A is operational", score: 20 },
      { text: "B is degraded", score: 6 },
      { text: "A is degraded", score: 9 },
      { text: "The system state violates deterministic logic", score: 13 }
    ],
    rationale: "Correct answer is B is operational and A is operational. D running implies A is running. A running requires (B or C). Since C cannot support running state with D, B must be operational."
  },
  {
    id: 2,
    dimension: "Quantitative Arbitrage & Unit Economics",
    llmTag: "cognitive.numerical",
    weight: 0.2,
    prompt: "An enterprise SaaS platform currently generates ₹20 Crore ARR with a 125% Net Revenue Retention (NRR) rate. Assuming zero new customer acquisition, what will ARR be from this existing customer cohort after 1 year?",
    options: [
      { text: "₹25.0 Crore", score: 20 },
      { text: "₹22.5 Crore", score: 14 },
      { text: "₹20.0 Crore", score: 7 },
      { text: "₹27.5 Crore", score: 10 }
    ],
    rationale: "Correct answer is ₹25.0 Crore. NRR of 125% means the cohort generates 1.25 * ₹20 Crore = ₹25.0 Crore."
  },
  {
    id: 3,
    dimension: "Systemic Throughput & Capacity Planning",
    llmTag: "cognitive.analytical",
    weight: 0.2,
    prompt: "A database cluster handles 10,000 QPS. A distributed Redis caching layer absorbs 70% of reads. If system traffic doubles to 20,000 QPS and cache hit rate degrades from 70% to 50%, how many QPS directly hit the database now?",
    options: [
      { text: "10,000 QPS (a 233% increase from original 3,000 QPS)", score: 20 },
      { text: "6,000 QPS", score: 10 },
      { text: "14,000 QPS", score: 7 },
      { text: "7,000 QPS", score: 14 }
    ],
    rationale: "Correct answer is 10,000 QPS. Uncached reads = 20,000 * (1 - 0.50) = 10,000 QPS hitting the DB (previously 10,000 * 0.30 = 3,000 QPS)."
  },
  {
    id: 4,
    dimension: "Organizational Topology & Dependency Graph",
    llmTag: "cognitive.spatial",
    weight: 0.2,
    prompt: "In an event-driven architecture, Service Alpha publishes events to Queue X and Queue Y. Queue X fans out to 3 workers; Queue Y fans out to 2 workers. If exactly 1 worker on Queue X fails while all other workers succeed, what fraction of total workers processed their workload?",
    options: [
      { text: "4 / 5 (80%)", score: 20 },
      { text: "3 / 5 (60%)", score: 14 },
      { text: "2 / 3 (67%)", score: 10 },
      { text: "1 / 2 (50%)", score: 7 }
    ],
    rationale: "Correct answer is 4/5 (80%). Total workers = 3 + 2 = 5. Successful workers = (3 - 1) + 2 = 4. 4/5 = 80%."
  },
  {
    id: 5,
    dimension: "Strategic Operational Analogy",
    llmTag: "cognitive.verbal",
    weight: 0.2,
    prompt: "Complete the corporate engineering analogy: 'TECHNICAL DEBT' is to 'CODE REFACTOR' as 'FINANCIAL LEVERAGE' is to '______'.",
    options: [
      { text: "BALANCE SHEET DELEVERAGING", score: 20 },
      { text: "DIVIDEND REINVESTMENT", score: 7 },
      { text: "WORKING CAPITAL EXPANSION", score: 14 },
      { text: "SHARE BUYBACK", score: 10 }
    ],
    rationale: "Correct answer is BALANCE SHEET DELEVERAGING. Technical debt must be serviced and repaid through refactoring; financial leverage (debt) must be serviced and repaid through balance sheet deleveraging."
  }
];

// Map of aptitude questions by life stage
export const APTITUDE_QUESTIONS_BY_STAGE: Record<LifeStage, AptitudeQuestion[]> = {
  class10: CLASS10_APTITUDE_QUESTIONS,
  class12: CLASS12_APTITUDE_QUESTIONS,
  ug: UG_APTITUDE_QUESTIONS,
  pg: PG_APTITUDE_QUESTIONS,
  professional: PROFESSIONAL_APTITUDE_QUESTIONS
};

export function getAptitudeQuestionsForStage(stage?: LifeStage): AptitudeQuestion[] {
  if (stage && APTITUDE_QUESTIONS_BY_STAGE[stage]) {
    return APTITUDE_QUESTIONS_BY_STAGE[stage];
  }
  return UG_APTITUDE_QUESTIONS;
}
