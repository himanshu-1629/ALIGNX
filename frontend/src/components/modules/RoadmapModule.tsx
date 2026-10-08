import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_CAREERS } from '../../data/mockAlignxData';
import { ALL_AUTHENTIC_CAREERS } from '../../data/allCareers';
import { ApiService } from '../../services/api';
import {
  Calendar,
  BookOpen,
  Award,
  GraduationCap,
  Printer,
  ArrowLeft,
  Compass,
  Sliders,
  Clock,
  CheckSquare,
  Square,
  ShieldCheck,
  Layers,
  Code,
  DollarSign,
  RotateCcw
} from 'lucide-react';

import type { AlignxSessionProgress, LifeStage } from '../../types/alignx';

interface RoadmapModuleProps {
  careerId?: string;
  sessionProgress?: AlignxSessionProgress;
  onSelectCareer?: (careerId: string) => void;
  onBackToDashboard?: () => void;
  onBackToTwin?: () => void;
  onOpenWhatIf?: () => void;
}

// ---------------------------------------------------------------------------
// DOMAIN INTELLIGENCE ENGINE (Authentic tools, certs, capstones per STEAM career)
// ---------------------------------------------------------------------------
interface CareerDomainIntel {
  tools: string[];
  certifications: Array<{ name: string; issuer: string; level: string; url?: string }>;
  capstones: Array<{ title: string; description: string; architecture: string; outcomes: string[] }>;
  recommendedVenues: string[];
}

const DOMAIN_INTEL_CATALOG: Record<string, CareerDomainIntel> = {
  ai_ml_engineer: {
    tools: ['Python 3.11+', 'PyTorch / CUDA', 'Hugging Face Transformers', 'vLLM & TensorRT-LLM', 'Docker / MLflow', 'Weights & Biases'],
    certifications: [
      { name: 'AWS Certified Machine Learning - Specialty', issuer: 'Amazon Web Services', level: 'Industry Gold' },
      { name: 'Google Cloud Professional Machine Learning Engineer', issuer: 'Google Cloud', level: 'Advanced' },
      { name: 'DeepLearning.AI Deep Learning Specialization', issuer: 'DeepLearning.AI', level: 'Foundational' }
    ],
    capstones: [
      {
        title: 'Distributed Multi-GPU LLM Fine-Tuning & Quantized Serving Engine',
        description: 'Architect an end-to-end distributed instruction fine-tuning pipeline utilizing QLoRA/LoRA on open-weights foundation models, packaged into a high-throughput vLLM serving container with FP8 quantization and sub-15ms TTFT (Time-To-First-Token).',
        architecture: 'Data Prep (Apache Arrow) → Ray Train (Multi-GPU LoRA) → Quantization (AWQ/FP8) → vLLM API Gateway with Prometheus telemetry.',
        outcomes: ['Trained model benchmarked against OpenLLM leaderboard', 'Deployed streaming endpoint on cloud GPU instance', 'Complete open-source Git repository with automated CI/CD']
      },
      {
        title: 'Multimodal Vision-Language Reasoning Agent for Medical Scans',
        description: 'Construct a visual reasoning system that cross-references radiological scans with clinical EHR logs using vision-transformer cross-attention heads, calibrated with conformal prediction for clinically bounded uncertainty intervals.',
        architecture: 'CLIP Vision Encoder → Cross-Attention Multi-Modal Bridge → Quantized Reasoning LLM → Conformal Uncertainty Filter.',
        outcomes: ['Published evaluation paper on arXiv / HuggingFace model hub', '94.2% diagnostic agreement rate on public benchmark dataset']
      }
    ],
    recommendedVenues: ['NeurIPS / ICML / ICLR proceedings', 'arXiv:cs.AI & cs.LG', 'Hugging Face Open LLM Leaderboard', 'PyTorch Official Ecosystem']
  },
  vlsi_design_engineer: {
    tools: ['SystemVerilog / Verilog', 'Cadence Virtuoso', 'Synopsys Design Compiler', 'ModelSim / QuestaSim', 'Xilinx Vivado', 'SPICE / Ngspice'],
    certifications: [
      { name: 'Cadence Certified Associate - Custom IC Design', issuer: 'Cadence Design Systems', level: 'Industry Standard' },
      { name: 'Synopsys Physical Design & Static Timing Analysis', issuer: 'Synopsys', level: 'Advanced' },
      { name: 'Arm Accredited Engineer (AAE)', issuer: 'Arm', level: 'Specialist' }
    ],
    capstones: [
      {
        title: '5-Stage Pipelined RISC-V (RV32I) Microprocessor Core with Static Timing Closure',
        description: 'Design and synthesize a fully compliant 32-bit RISC-V core from RTL scratch in SystemVerilog, featuring 2-bit saturating counter branch prediction, full forwarding logic, and Static Timing Analysis (STA) clean at 250 MHz on 28nm standard cells.',
        architecture: 'Instruction Fetch (IF) → Decode (ID) → Execute (EX) → Memory Access (MEM) → Write Back (WB) + Hazard Forwarding Unit.',
        outcomes: ['Verified against 100% of official RISC-V architectural compliance test suites', 'Synthesized GDSII layout generated via OpenLane/SkyWater 130nm PDK', 'Zero setup/hold timing violations reported']
      },
      {
        title: 'Low-Power Sub-28nm Folded-Cascode Operational Transconductance Amplifier',
        description: 'Design full custom analog layout with DRC/LVS clean verification, conducting Monte Carlo mismatch simulations across PVT (Process, Voltage, Temperature) corners to achieve >75 dB open-loop gain and 65° phase margin.',
        architecture: 'Differential Input Pair → Folded Cascode Stage → Bias Generation Circuit → Miller Compensation Network.',
        outcomes: ['DRC / LVS clean layout verified in Cadence Virtuoso', 'Extracted post-layout netlist simulated across 500 Monte Carlo runs']
      }
    ],
    recommendedVenues: ['IEEE International Solid-State Circuits Conference (ISSCC)', 'IEEE Transactions on VLSI Systems', 'OpenLane / SkyWater Open-PDK Hub']
  },
  robotics_automation_engineer: {
    tools: ['ROS 2 (Humble / Iron)', 'Gazebo Harmonic', 'C++17 / Python', 'NVIDIA Isaac Sim', 'OpenCV / Point Cloud (PCL)', 'SolidWorks / URDF'],
    certifications: [
      { name: 'Certified ROS 2 Roboticist', issuer: 'Open Robotics & ConstructSim', level: 'Core Competency' },
      { name: 'NVIDIA Isaac Robotics Developer Certificate', issuer: 'NVIDIA Deep Learning Institute', level: 'Advanced' },
      { name: 'Siemens / FANUC Industrial Automation Specialist', issuer: 'Siemens SITRAIN', level: 'Industry Ready' }
    ],
    capstones: [
      {
        title: 'Autonomous Mobile Robot (AMR) Navigation with 3D LiDAR SLAM & Dynamic Nav2',
        description: 'Develop an autonomous mobile robot platform in ROS 2 integrating 3D LiDAR point-cloud filtering, Cartographer SLAM for real-time map generation, and a customized DWB local planner capable of dynamic obstacle avoidance at 1.5 m/s.',
        architecture: 'LiDAR Telemetry → PointCloud2 Filter → Cartographer SLAM → Costmap2D Pipeline → Nav2 Controller Server → Motor Actuators.',
        outcomes: ['Real-time indoor waypoint navigation achieved with sub-5cm localization error', 'Full Gazebo digital twin simulation running alongside real-world hardware testbed']
      },
      {
        title: '6-DoF Robotic Arm Kinematics & Vision-Guided Pick-and-Place Automation',
        description: 'Implement analytical inverse kinematics with MoveIt 2 motion planning and an eye-in-hand RGB-D camera pipeline classifying and sorting industrial components using YOLOv8 bounding boxes in real time.',
        architecture: 'Intel RealSense RGB-D → YOLOv8 Object Detection → 3D Pose Estimation → MoveIt 2 Trajectory Generation → URDF Arm Controller.',
        outcomes: ['Cycle time reduced to under 4.2 seconds per picked part', '100% collision-free trajectory verification across 1,000 continuous simulation cycles']
      }
    ],
    recommendedVenues: ['IEEE ICRA (Robotics and Automation)', 'IEEE IROS Conference', 'ROS 2 Discourse & Open Robotics Repository']
  },
  cybersecurity_analyst: {
    tools: ['Wireshark & Tshark', 'Burp Suite Professional', 'Metasploit / Cobalt Strike', 'Splunk / Elastic SIEM', 'Ghidra / IDA Free', 'Snort / Suricata IDS'],
    certifications: [
      { name: 'OffSec Certified Professional (OSCP)', issuer: 'OffSec', level: 'Industry Gold Standard' },
      { name: 'CompTIA Security+ / CySA+', issuer: 'CompTIA', level: 'Foundational' },
      { name: 'Certified Information Systems Security Professional (CISSP)', issuer: 'ISC2', level: 'Executive' }
    ],
    capstones: [
      {
        title: 'Automated Zero-Trust SIEM Pipeline with AI Anomaly Threat Hunting',
        description: 'Deploy a multi-node Elastic Stack / Splunk architecture ingesting Sysmon and NetFlow logs, accompanied by custom Sigma detection rules for MITRE ATT&CK techniques (T1059, T1003) and an automated SOAR quarantine playbook.',
        architecture: 'Endpoint Telemetry (Sysmon) → Logstash Parser → Elasticsearch Index → Sigma Alerting Rules → Python SOAR Webhook.',
        outcomes: ['Mean Time to Detect (MTTD) simulated ransomware attacks reduced under 45 seconds', 'Zero-Trust microsegmentation policy verified via automated breach simulations']
      },
      {
        title: 'Binary Reverse Engineering & Automated Kernel Exploit Mitigation',
        description: 'Analyze obfuscated malware binaries inside isolated sandbox environments using Ghidra, identifying memory corruption vulnerabilities and writing custom eBPF kernel security filters to neutralize privilege escalation.',
        architecture: 'Sample Disassembly (Ghidra) → Dynamic Tracing (GDB / strace) → eBPF Kernel Probe (BCC) → Threat Signature Generation.',
        outcomes: ['Published comprehensive incident response technical report', 'Custom eBPF detector open-sourced with reproducible exploit demonstrations']
      }
    ],
    recommendedVenues: ['DEF CON / Black Hat Briefings', 'MITRE ATT&CK Knowledge Base', 'CVE / NIST National Vulnerability Database']
  },
  clean_energy_specialist: {
    tools: ['MATLAB / Simulink', 'HOMER Pro', 'PVsyst 7', 'COMSOL Multiphysics', 'OpenDSS', 'Python (SciPy, PyPSA)'],
    certifications: [
      { name: 'BEE Certified Energy Auditor / Manager', issuer: 'Bureau of Energy Efficiency (India)', level: 'Statutory Gold' },
      { name: 'NABCEP PV Installation Professional', issuer: 'NABCEP', level: 'International' },
      { name: 'Certified Energy Manager (CEM)', issuer: 'Association of Energy Engineers', level: 'Advanced' }
    ],
    capstones: [
      {
        title: 'Lithium-Ion Battery Management System (BMS) with Extended Kalman Filter SoC',
        description: 'Design a closed-loop BMS control algorithm in MATLAB/Simulink estimating battery State-of-Charge (SoC) and State-of-Health (SoH) within 1.5% accuracy under dynamic drive cycles, incorporating cell balancing and thermal runaway prevention.',
        architecture: 'Cell Voltage/Current Sensors → Noise Filter → Extended Kalman Filter (EKF) → Passive Balancing PWM → CAN Bus Telemetry.',
        outcomes: ['Algorithm validated against official WLTP and US06 electric vehicle driving schedules', 'Thermal runaway onset detected >45 seconds before critical threshold']
      },
      {
        title: '100% Renewable Island Microgrid Optimization with Levelized Cost Analysis',
        description: 'Model a decentralized 5 MW microgrid incorporating solar PV, green hydrogen fuel cells, and battery storage using PyPSA, optimizing dispatch schedules to minimize LCOE while ensuring 99.99% grid stability.',
        architecture: 'Solar Irradiance Forecast → Battery State Predictor → Linear Programming Dispatch Optimizer → Inverter Frequency Controller.',
        outcomes: ['Achieved 22% lower levelized cost of energy compared to traditional diesel backup', 'Complete techno-economic feasibility dossier formatted for institutional financing']
      }
    ],
    recommendedVenues: ['IEEE Transactions on Sustainable Energy', 'International Renewable Energy Agency (IRENA) Publications', 'MNRE India Tech Reports']
  },
  quantum_computing_researcher: {
    tools: ['Qiskit (IBM Quantum)', 'PennyLane (Xanadu)', 'Cirq (Google)', 'QuTiP', 'Julia / Python', 'LaTeX / Overleaf'],
    certifications: [
      { name: 'IBM Certified Associate Quantum Developer - Qiskit', issuer: 'IBM Quantum', level: 'Industry Standard' },
      { name: 'MIT xPRO Quantum Computing Professional Certificate', issuer: 'MIT', level: 'Academic Gold' }
    ],
    capstones: [
      {
        title: 'Variational Quantum Eigensolver (VQE) for Molecular Ground-State Energy Estimation',
        description: 'Implement a noise-resilient VQE algorithm in Qiskit to compute the ground-state potential energy surface of Lithium Hydride (LiH) across varying bond lengths, comparing UCCSD ansatz convergence against classical FCI benchmarks.',
        architecture: 'Fermionic Hamiltonian Mapper → Parity Mapping → Parameterized Quantum Circuit (UCCSD) → Classical COBYLA Optimizer.',
        outcomes: ['Reached chemical accuracy (1.6 mHa) under simulated depolarizing noise models', 'Executed successfully on real IBM Quantum 5-qubit hardware cloud backend']
      },
      {
        title: 'Quantum Error Correction Surface Code Syndrome Decoder Simulation',
        description: 'Simulate Distance-3 and Distance-5 rotated surface codes under Pauli error channels, implementing a high-speed Minimum-Weight Perfect Matching (MWPM) decoder in Python/C++ to measure the fault-tolerant pseudo-threshold.',
        architecture: 'Data & Ancilla Qubit Grid → Stabilizer Syndrome Measurement Circuit → MWPM Graph Matching → Correction Operator Application.',
        outcomes: ['Demonstrated threshold suppression with logical error rate scaling below 10^-5', 'Full reproducible codebase published with interactive Jupyter explanations']
      }
    ],
    recommendedVenues: ['Physical Review X Quantum (PRX)', 'IBM Quantum Experience Researcher Forum', 'IEEE Quantum Week']
  },
  fintech_engineer: {
    tools: ['C++20 / Low-Latency Systems', 'Python (Polars, NumPy)', 'FIX Protocol / QuickFIX', 'TimescaleDB / kdb+', 'Docker', 'Linux Kernel Bypass (DPDK)'],
    certifications: [
      { name: 'Certificate in Quantitative Finance (CQF)', issuer: 'Fitch Learning', level: 'Premier Industry Gold' },
      { name: 'Financial Risk Manager (FRM Level 1)', issuer: 'GARP', level: 'Global Accreditation' },
      { name: 'CFA Institute Investment Foundations', issuer: 'CFA Institute', level: 'Foundational' }
    ],
    capstones: [
      {
        title: 'Ultra-Low Latency Lock-Free Limit Order Book & Order Matching Engine in C++20',
        description: 'Construct a deterministic limit order book handling L3 market data with nanosecond-level cache-friendly memory layouts, processing >1.5 million orders per second with P99 latency strictly under 4.5 microseconds.',
        architecture: 'UDP Multicast Feed → Ring Buffer Ingestion → Lock-Free B-Tree Order Book → FIFO Match Engine → Trade Drop-Copy Logger.',
        outcomes: ['Zero dynamic heap allocation during active trading loop execution', 'Benchmark telemetry validated with Google Benchmark and Linux perf counters']
      },
      {
        title: 'High-Frequency Statistical Arbitrage Engine with Transaction Cost Analysis',
        description: 'Build an event-driven backtesting and paper-trading harness for multi-asset cointegrated pairs, incorporating bid-ask spread crossing penalties, queue position estimation, and real-time Sharpe ratio risk guards.',
        architecture: 'Historical Tick Data (Polars) → Cointegration Filter (Engle-Granger) → Signal Generator → Position Risk Sizer → Execution Simulator.',
        outcomes: ['Simulated annualized Sharpe ratio >2.4 across 3 years of NSE/BSE tick feeds', 'Full risk management suite with automatic circuit breaker drawdown halts']
      }
    ],
    recommendedVenues: ['Journal of Financial Data Science', 'QuantConnect Alpha Community', 'ACM International Conference on AI in Finance']
  }
};

// Universal default generator for all other STEAM careers
const getCareerDomainIntel = (career: any): CareerDomainIntel => {
  const cId = (career?.id || '').toLowerCase().replace(/[-_]/g, '_');
  if (DOMAIN_INTEL_CATALOG[cId]) {
    return DOMAIN_INTEL_CATALOG[cId];
  }

  // Smart heuristic based on career attributes
  const primarySkill = career?.requiredSkills?.[0] || 'Core Engineering';
  const secSkill = career?.requiredSkills?.[1] || 'Applied Systems';
  const tertSkill = career?.requiredSkills?.[2] || 'Data Architecture';

  return {
    tools: [
      primarySkill,
      secSkill,
      tertSkill,
      'Git & Modern DevSecOps',
      'Docker / Linux Systems',
      'Telemetry & Benchmarking Tools'
    ],
    certifications: [
      { name: `${career?.domain || 'Industry'} Certified Professional Associate`, issuer: 'National Sector Council', level: 'Industry Standard' },
      { name: `Advanced ${primarySkill} Practitioner Certification`, issuer: 'Accredited Engineering Institute', level: 'Advanced' }
    ],
    capstones: [
      {
        title: `Production-Grade End-to-End ${career?.title || 'System'} Architecture`,
        description: `Design, simulate, and deploy a full-scale capstone resolving real-world challenges in ${career?.domain || 'applied engineering'}, demonstrating mastery of ${primarySkill} and ${secSkill}.`,
        architecture: `Problem Formulation → Theoretical Simulation → Prototype Implementation (${primarySkill}) → Rigorous Benchmarking & Verification.`,
        outcomes: [
          `Achieved top-tier technical benchmarks aligned with industry standards`,
          `Production code repository with documentation and reproducible test harness`
        ]
      },
      {
        title: `Autonomous Optimization & Deployment Framework for ${career?.domain || 'Engineering Systems'}`,
        description: `Implement scalable automation pipelines reducing operational friction, integrating ${tertSkill} and standard industry compliance specifications.`,
        architecture: `Telemetry Ingestion → Automated Optimization Engine → Verification Pipeline → Executive Reporting.`,
        outcomes: [
          `Documented 30%+ efficiency gains in controlled testing trials`,
          `Complete portfolio artifact ready for campus recruitment and investor review`
        ]
      }
    ],
    recommendedVenues: ['IEEE Xplore Digital Library', 'ACM Digital Library', 'National Technical Society Archives']
  };
};

export const RoadmapModule: React.FC<RoadmapModuleProps> = ({
  careerId = 'ai_ml_engineer',
  sessionProgress,
  onSelectCareer,
  onBackToDashboard,
  onBackToTwin,
  onOpenWhatIf
}) => {
  const normalizeSlug = (slug?: string) => (slug || '').toLowerCase().replace(/[-_]/g, '');

  // Career state: finds from ALL_AUTHENTIC_CAREERS or INITIAL_CAREERS
  const [career, setCareer] = useState(() => {
    const matched =
      ALL_AUTHENTIC_CAREERS.find(c => normalizeSlug(c.id) === normalizeSlug(careerId)) ||
      INITIAL_CAREERS.find(c => normalizeSlug(c.id) === normalizeSlug(careerId)) ||
      INITIAL_CAREERS[0];
    return matched;
  });

  const [roadmapBackendData, setRoadmapBackendData] = useState<any>(null);
  const [isLoadingBackend, setIsLoadingBackend] = useState<boolean>(false);

  // Life Stage selection state: initialized from sessionProgress studentProfile.stage or 'ug'
  const initialStage: LifeStage = sessionProgress?.studentProfile?.stage || 'ug';
  const [activeStage, setActiveStage] = useState<LifeStage>(initialStage);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'timeline' | 'stack' | 'exams'>('timeline');

  // Milestone completion tracking (persisted via localStorage per career & stage)
  const storageKey = `alignx_roadmap_completed_${career.id}_${activeStage}`;
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync career when careerId prop changes
  useEffect(() => {
    const matched =
      ALL_AUTHENTIC_CAREERS.find(c => normalizeSlug(c.id) === normalizeSlug(careerId)) ||
      INITIAL_CAREERS.find(c => normalizeSlug(c.id) === normalizeSlug(careerId)) ||
      INITIAL_CAREERS[0];
    setCareer(matched);
  }, [careerId]);

  // Load completion state whenever career or stage changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`alignx_roadmap_completed_${career.id}_${activeStage}`);
      setCompletedMilestones(saved ? JSON.parse(saved) : {});
    } catch {
      setCompletedMilestones({});
    }
  }, [career.id, activeStage]);

  // Persist milestone checkboxes
  const toggleMilestone = (milestoneId: string) => {
    setCompletedMilestones(prev => {
      const updated = { ...prev, [milestoneId]: !prev[milestoneId] };
      try {
        localStorage.setItem(`alignx_roadmap_completed_${career.id}_${activeStage}`, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to persist milestone state:', err);
      }
      return updated;
    });
  };

  const resetProgress = () => {
    setCompletedMilestones({});
    try {
      localStorage.removeItem(`alignx_roadmap_completed_${career.id}_${activeStage}`);
    } catch {
      // ignore
    }
  };

  // Fetch backend roadmap data with graceful fallback
  useEffect(() => {
    let isMounted = true;
    setIsLoadingBackend(true);

    ApiService.generateRoadmap(career.id)
      .then(res => {
        if (res?.data && isMounted) {
          setRoadmapBackendData(res.data);
        }
      })
      .catch(err => {
        console.warn('[ALIGNX Roadmap] Backend roadmap call completed with client fallback:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingBackend(false);
      });

    return () => { isMounted = false; };
  }, [career.id]);

  // Domain intelligence
  const domainIntel = useMemo(() => getCareerDomainIntel(career), [career]);

  // Dynamic life-stage phased milestones generator
  const dynamicPhases = useMemo(() => {
    const skills = career.requiredSkills || ['Core Systems', 'Applied Frameworks', 'Algorithms'];
    const gaps = career.studentSkillGaps || [];
    const exams = career.entranceExams || ['GATE', 'Specialized Entrance Test'];
    const scholarships = career.scholarships || ['Merit Scholarship', 'Research Fellowship'];
    const tools = domainIntel.tools;

    if (activeStage === 'class10') {
      return [
        {
          phaseNumber: 1,
          timeWindow: 'MONTHS 1–6 (CLASS 10 BOARD SPRINT & APTITUDE FOUNDATION)',
          focus: `FOUNDATION IN MATHEMATICAL LOGIC & ${career.domain.toUpperCase()}`,
          difficulty: 'Foundational',
          summary: `Establish top-percentile academic standing in high-school STEM disciplines while testing aptitude affinity for ${career.title}.`,
          milestones: [
            {
              id: 'c10_m1',
              title: `Core STEM Mastery: Higher Secondary Math & Physical Sciences`,
              description: `Achieve 90%+ in Class 10 Board Mathematics and Science, focusing on algebraic structures, kinematics, and geometric problem solving required for ${career.domain}.`,
              skills: ['Algebra & Coordinate Geometry', 'Basic Physics', 'Analytical Reasoning'],
              resources: 'NCERT Exemplars & State Board Advanced Problem Sets',
              duration: '12 Weeks'
            },
            {
              id: 'c10_m2',
              title: `Exploratory Hands-On Lab: Introductory ${tools[0] || 'Programming'}`,
              description: `Complete an introductory project utilizing ${tools[0] || 'Python'} or basic circuit/logic simulation to cultivate early engineering intuition.`,
              skills: [skills[0] || 'Algorithmic Thinking', 'Computational Logic'],
              resources: 'Harvard CS50 / Khan Academy Computing / Scratch to Python Bridge',
              duration: '6 Weeks'
            },
            {
              id: 'c10_m3',
              title: `Cognitive Diagnostics & Foundation Olympiad Participation`,
              description: `Participate in national aptitude benchmarks (SOF NSO, IMO, or SilverZone) to calibrate competitive test-taking speed and numerical fluency.`,
              skills: ['Time Management', 'Pattern Recognition', 'Mental Math'],
              resources: 'National Science Olympiad Past 5-Year Papers',
              duration: '4 Weeks'
            }
          ]
        },
        {
          phaseNumber: 2,
          timeWindow: 'MONTHS 7–18 (CLASS 11 STREAM SELECTION & RIGOROUS PREREQUISITES)',
          focus: `PCM STREAM ENROLLMENT & GATEWAY EXAM SYLLABUS MAPPING`,
          difficulty: 'Intermediate',
          summary: `Select the optimal 11th grade stream and initiate systematic prep for target entrances (${exams.slice(0, 2).join(', ')}).`,
          milestones: [
            {
              id: 'c10_m4',
              title: `Stream Selection: Physics, Chemistry & Mathematics (PCM) + Computer Science`,
              description: `Commit to the senior secondary PCM track with Computer Science/Informatics Practices to meet eligibility for ${career.educationPath}.`,
              skills: ['Calculus Foundations', 'Mechanics', 'Electrostatics'],
              resources: 'CBSE / ISC / State Higher Secondary Curriculum',
              duration: 'Ongoing'
            },
            {
              id: 'c10_m5',
              title: `Entrance Exam Foundation: ${exams[0] || 'Competitive Entrance'} Concept Sprint`,
              description: `Begin systematic problem-solving cycles for ${exams[0] || 'Tier-1 Entrance Exams'}, covering 60% of the Class 11 competitive syllabus.`,
              skills: ['Differential Calculus', 'Vectors', 'Rotational Dynamics'],
              resources: 'Standard Entrance Reference Manuals & Chapterwise Mock Banks',
              duration: '24 Weeks'
            },
            {
              id: 'c10_m6',
              title: `Bridging Initial Domain Gap: Fundamentals of ${skills[0] || 'Core Domain'}`,
              description: `Address initial conceptual gap: ${gaps[0] || skills[0]}. Complete 3 verified micro-projects or code repositories.`,
              skills: [skills[0] || 'Foundational Computing', tools[0] || 'Python'],
              resources: 'MIT OpenCourseWare (6.0001) / Interactive Online Labs',
              duration: '8 Weeks'
            }
          ]
        },
        {
          phaseNumber: 3,
          timeWindow: 'MONTHS 19–30 (CLASS 12 COMPETITIVE TEST SERIES & COLLEGE SHORTLIST)',
          focus: `HIGH-INTENSITY TEST CALIBRATION FOR ${exams[0]?.toUpperCase() || 'ENTRANCE EXAMS'}`,
          difficulty: 'High-Stakes Validation',
          summary: `Complete comprehensive test series, balance 12th Board examinations, and align target institutions offering ${career.educationPath}.`,
          milestones: [
            {
              id: 'c10_m7',
              title: `Full-Length Mock Series: Target 98th+ Percentile in ${exams[0] || 'National Entrance'}`,
              description: `Execute 25+ timed computer-based test simulations with detailed error-log analysis and concept remediation.`,
              skills: ['High-Velocity Problem Solving', 'Exam Psychology', 'Accuracy Optimization'],
              resources: 'National Testing Agency CBT Simulation Portal',
              duration: '16 Weeks'
            },
            {
              id: 'c10_m8',
              title: `Class 12 Board Exam Defense: Aggregate Score Target >85%`,
              description: `Secure high cumulative score in Senior Secondary Boards to satisfy institutional cutoff rules across premier engineering institutes.`,
              skills: ['Written Exposition', 'Laboratory Practicals', 'Core Subject Precision'],
              resources: 'Official Sample Papers and Marking Schemes',
              duration: '8 Weeks'
            },
            {
              id: 'c10_m9',
              title: `Institutional Shortlisting & Merit Funding Dossier: ${scholarships[0] || 'Scholarship'}`,
              description: `Map institutional choices for ${career.educationPath} against annual family budget and prepare application papers for ${scholarships[0] || 'Government Merit Scholarships'}.`,
              skills: ['Institutional Evaluation', 'Financial Planning', 'Dossier Assembly'],
              resources: 'National Institutional Ranking Framework (NIRF) Engineering Hub',
              duration: '4 Weeks'
            }
          ]
        },
        {
          phaseNumber: 4,
          timeWindow: 'MONTHS 31–48 (COLLEGE ADMISSION & FIRST-YEAR EXCELLENCE IN DEGREE)',
          focus: `MATRICULATION IN ${career.educationPath.toUpperCase()} & EARLY LAB ONBOARDING`,
          difficulty: 'Placement / Capstone',
          summary: `Transition smoothly into accredited undergraduate degree, secure scholarship disbursement, and join university research collectives.`,
          milestones: [
            {
              id: 'c10_m10',
              title: `Admission & Branch Counseling: Secure ${career.educationPath}`,
              description: `Complete centralized counseling (JoSAA / State CET / Institutional) securing preferred branch aligned with ${career.title}.`,
              skills: ['Counseling Choice Filling', 'Document Verification'],
              resources: 'Official Counseling Portals',
              duration: '4 Weeks'
            },
            {
              id: 'c10_m11',
              title: `First-Year Academic Distinction: Target CGPA > 8.5/10`,
              description: `Master first-year foundational coursework in engineering mathematics, data structures, and physical sciences.`,
              skills: ['Linear Algebra', 'Discrete Math', 'Object-Oriented Architecture'],
              resources: 'University Academic Core Syllabus & Course Modules',
              duration: '32 Weeks'
            },
            {
              id: 'c10_m12',
              title: `Join Student Technical Chapter / Domain Research Lab`,
              description: `Enroll in campus chapters (IEEE, ACM, Robotics Society) focused on ${career.domain} to commence peer engineering projects.`,
              skills: ['Team Engineering', 'Technical Presentation', 'Project Delivery'],
              resources: 'Campus Technical Societies & Open-Source Working Groups',
              duration: 'Ongoing'
            }
          ]
        }
      ];
    }

    if (activeStage === 'class12') {
      return [
        {
          phaseNumber: 1,
          timeWindow: 'MONTHS 1–4 (ENTRANCE EXAM SPRINT & RANK OPTIMIZATION)',
          focus: `HIGH-INTENSITY DRILL FOR ${exams.slice(0, 2).join(' & ').toUpperCase()}`,
          difficulty: 'High-Stakes Validation',
          summary: `Maximize composite percentiles in primary engineering and domain gateway examinations to unlock Tier-1 colleges.`,
          milestones: [
            {
              id: 'c12_m1',
              title: `Intensive Mock Testing Series: ${exams[0] || 'Target Entrance Exam'}`,
              description: `Complete 20+ full-length 3-hour mock tests with negative marking calibration, targeting top-percentile cutoffs required for ${career.educationPath}.`,
              skills: ['Speed & Accuracy', 'Negative Marking Control', 'High-Yield Physics/Math'],
              resources: 'Standard CBT Test Engines & Previous 10-Year Question Banks',
              duration: '10 Weeks'
            },
            {
              id: 'c12_m2',
              title: `Weakness Remediation: Class 11-12 Backlog Clearing`,
              description: `Eliminate identified cognitive blockers in high-weightage topics like Electromagnetism, Integral Calculus, and Organic Chemistry.`,
              skills: ['Calculus Mastery', 'Physical Problem Solving'],
              resources: 'Chapterwise Diagnostic Quizzes',
              duration: '6 Weeks'
            },
            {
              id: 'c12_m3',
              title: `Board Exam Buffer: Achieve Board Aggregate > 85%`,
              description: `Ensure Class 12 board marks satisfy minimum eligibility thresholds across IITs, NITs, BITS, and premier central universities.`,
              skills: ['Theoretical Derivations', 'Practical Viva Defense'],
              resources: 'Board Exemplars & Official Marking Schemes',
              duration: '4 Weeks'
            }
          ]
        },
        {
          phaseNumber: 2,
          timeWindow: 'MONTHS 5–8 (COUNSELING, COLLEGE SELECTION & SCHOLARSHIP CAPTURE)',
          focus: `BRANCH ADMISSION: ${career.educationPath.toUpperCase()}`,
          difficulty: 'Intermediate',
          summary: `Execute strategic seat counseling, evaluate tuition vs annual family budget, and apply for high-value merit scholarships.`,
          milestones: [
            {
              id: 'c12_m4',
              title: `Centralized Counseling Strategy (JoSAA / State CET / BITSAT)`,
              description: `Submit prioritized seat choices ensuring optimal balance between institutional brand reputation and curriculum focus in ${career.domain}.`,
              skills: ['Seat Matrix Analysis', 'Branch vs College ROI Evaluation'],
              resources: 'Previous Year Opening & Closing Ranks (OR-CR Data)',
              duration: '4 Weeks'
            },
            {
              id: 'c12_m5',
              title: `Scholarship Application: ${scholarships[0] || 'Merit Grant'}`,
              description: `Submit credentials for ${scholarships[0] || 'Undergraduate Merit Scholarships'} to offset substantial tuition and boarding fees.`,
              skills: ['Grant Application', 'Income & Merit Documentation'],
              resources: 'National Scholarship Portal (NSP) / Corporate Trust Hubs',
              duration: '3 Weeks'
            },
            {
              id: 'c12_m6',
              title: `Pre-College Tooling Booting: Setup ${tools[0] || 'Core Stack'}`,
              description: `Install development environments (Linux, VS Code, Git, ${tools[0] || 'Python'}) and build your first GitHub repository before Day 1 of college.`,
              skills: ['Git & Version Control', 'Linux Command Line', tools[0] || 'Python'],
              resources: 'The Missing Semester of Your CS Education (MIT)',
              duration: '4 Weeks'
            }
          ]
        },
        {
          phaseNumber: 3,
          timeWindow: 'MONTHS 9–16 (YEAR 1 DEGREE FOUNDATIONS & SKILL GAP RESOLUTION)',
          focus: `CORE ALGORITHMIC COMPETENCIES & ${skills[0]?.toUpperCase() || 'FOUNDATIONS'}`,
          difficulty: 'Foundational',
          summary: `Build rock-solid engineering fundamentals in Year 1 of college while systematically closing diagnosed skill gaps.`,
          milestones: [
            {
              id: 'c12_m7',
              title: `Academics & CGPA Anchor: Target Year 1 CGPA > 8.5/10`,
              description: `Excel in fundamental coursework: Engineering Mathematics, Data Structures & Algorithms, Physics, and Digital Systems.`,
              skills: ['Data Structures', 'Discrete Mathematics', 'Computer Architecture'],
              resources: 'University Core Syllabus & GeeksforGeeks / LeetCode (Easy/Medium)',
              duration: '28 Weeks'
            },
            {
              id: 'c12_m8',
              title: `Resolve Critical Skill Gap: ${gaps[0] || skills[0]}`,
              description: `Dedicate 5 hours weekly to eliminate identified deficit in ${gaps[0] || skills[0]}, completing 150+ structured implementation problems.`,
              skills: [gaps[0] || skills[0], 'Algorithmic Optimization'],
              resources: 'CS50 / FreeCodeCamp / Domain Coursera Specialization',
              duration: '12 Weeks'
            },
            {
              id: 'c12_m9',
              title: `First Verifiable Open-Source Technical Portfolio`,
              description: `Publish 3 well-documented projects to GitHub with README walkthroughs, automated tests, and live demonstrations.`,
              skills: ['Technical Documentation', 'Clean Code Architecture', 'Git Workflows'],
              resources: 'GitHub Pages & Markdown Documentation Standards',
              duration: '6 Weeks'
            }
          ]
        },
        {
          phaseNumber: 4,
          timeWindow: 'MONTHS 17–24 (YEAR 2 ADVANCED LABS & FIRST INDUSTRY INTERNSHIP SPRINT)',
          focus: `APPLIED SPECIALIZATION IN ${career.domain.toUpperCase()}`,
          difficulty: 'Placement / Capstone',
          summary: `Engage with advanced domain tools (${tools[1] || 'Frameworks'}) and compete for competitive summer research fellowships.`,
          milestones: [
            {
              id: 'c12_m10',
              title: `Mastery of Industry Tooling: ${tools.slice(1, 3).join(' & ')}`,
              description: `Transition from toy problems to production workflows using ${tools[1] || 'Industrial Tools'} and ${tools[2] || 'Frameworks'}.`,
              skills: [skills[1] || 'System Tools', skills[2] || 'Frameworks'],
              resources: 'Official Framework Documentation & Benchmark Tutorials',
              duration: '16 Weeks'
            },
            {
              id: 'c12_m11',
              title: `Capstone Architecture: ${domainIntel.capstones[0]?.title || 'Core Project'}`,
              description: domainIntel.capstones[0]?.description || `Construct a real-world project demonstrating end-to-end competence in ${career.domain}.`,
              skills: skills.slice(0, 3),
              resources: domainIntel.capstones[0]?.architecture || 'Open Architecture Guide',
              duration: '10 Weeks'
            },
            {
              id: 'c12_m12',
              title: `Summer Research / Industry Internship Application Pipeline`,
              description: `Submit targeted applications to labs and tech hubs across ${career.topLocations.slice(0, 3).join(', ')} for paid summer apprenticeships.`,
              skills: ['Resume Formulation', 'Technical Interviewing', 'Cold Outreach'],
              resources: 'AngelList / LinkedIn / University Industry Placement Cell',
              duration: '8 Weeks'
            }
          ]
        }
      ];
    }

    if (activeStage === 'ug') {
      return [
        {
          phaseNumber: 1,
          timeWindow: 'YEAR 1 / SEMESTER 1–2 (FOUNDATIONAL THEORIES & ALGORITHMIC CORE)',
          focus: `FOUNDATIONS OF ${skills[0]?.toUpperCase() || 'CORE ENGINEERING'} & CGPA EXCELLENCE`,
          difficulty: 'Foundational',
          summary: `Anchor first-year undergraduate academic standing (target CGPA > 8.5) and eliminate the primary diagnosed skill gap.`,
          milestones: [
            {
              id: 'ug_m1',
              title: `Mastery of Core Programming & Data Structures: ${tools[0] || 'Python/C++'}`,
              description: `Master asymptotic complexity, memory management, and standard data structures (trees, graphs, dynamic programming). Solve 150+ problems.`,
              skills: [skills[0] || 'Data Structures', 'Algorithmic Analysis'],
              resources: 'LeetCode Medium Track / NeetCode 150 / Coursera Algorithms Part I',
              duration: '14 Weeks'
            },
            {
              id: 'ug_m2',
              title: `Bridge Diagnosed Skill Gap: ${gaps[0] || 'Domain Core'}`,
              description: `Address student skill gap: ${gaps[0] || skills[0]}. Complete an end-to-end coursework project with peer code review.`,
              skills: [gaps[0] || skills[0], 'Applied Engineering'],
              resources: 'Specialized MOOCs / Academic Textbook Problem Sets',
              duration: '8 Weeks'
            },
            {
              id: 'ug_m3',
              title: `DevSecOps Foundations: Git, Linux Toolchain & Containerization`,
              description: `Establish professional developer hygiene: Linux terminal proficiency, Git branching strategies, and basic Docker container packaging.`,
              skills: ['Linux Shell', 'Git Flow', 'Docker Containers'],
              resources: 'The Linux Command Line (William Shotts) / Docker Getting Started',
              duration: '6 Weeks'
            }
          ]
        },
        {
          phaseNumber: 2,
          timeWindow: 'YEAR 2 / SEMESTER 3–4 (DOMAIN ARCHITECTURE & OPEN SOURCE LABS)',
          focus: `DEEP SPECIALIZATION IN ${skills[1]?.toUpperCase() || 'SYSTEM IMPLEMENTATION'} & ${tools[1]?.toUpperCase() || 'TOOLS'}`,
          difficulty: 'Intermediate',
          summary: `Transition into upper-division domain coursework, master professional toolchains, and publish open-source codebases.`,
          milestones: [
            {
              id: 'ug_m4',
              title: `Hands-on Toolchain Mastery: ${tools.slice(0, 3).join(', ')}`,
              description: `Build functional systems using industrial-grade frameworks: ${tools.slice(0, 3).join(', ')}.`,
              skills: [skills[1] || 'Applied Systems', skills[2] || 'Domain Architecture'],
              resources: 'Official Developer Guides & Industry Reference Implementations',
              duration: '16 Weeks'
            },
            {
              id: 'ug_m5',
              title: `Intermediate Capstone: ${domainIntel.capstones[1]?.title || 'Production System'}`,
              description: domainIntel.capstones[1]?.description || `Build a multi-component application or hardware design demonstrating domain competence.`,
              skills: [skills[1] || 'Architecture', skills[2] || 'Applied Tools'],
              resources: domainIntel.capstones[1]?.architecture || 'Engineering Guide',
              duration: '10 Weeks'
            },
            {
              id: 'ug_m6',
              title: `Target Industry Credential: ${domainIntel.certifications[0]?.name || 'Certification'}`,
              description: `Prepare and pass industry-recognized examination: ${domainIntel.certifications[0]?.name || 'Certification'} issued by ${domainIntel.certifications[0]?.issuer || 'Accreditation Body'}.`,
              skills: ['Accreditation Standards', 'Domain Best Practices'],
              resources: 'Official Certification Exam Prep Guide',
              duration: '8 Weeks'
            }
          ]
        },
        {
          phaseNumber: 3,
          timeWindow: 'YEAR 3 / SEMESTER 5–6 (HIGH-STAKES SUMMER INTERNSHIP & RESEARCH)',
          focus: `SUMMER INTERNSHIP IN ${career.topLocations[0]?.toUpperCase() || 'TECH HUB'} & PRE-PLACEMENT PIPELINE`,
          difficulty: 'High-Stakes Validation',
          summary: `Secure and execute a 10–12 week high-impact industrial internship targeting compensation in the ${career.salaryRange} bracket.`,
          milestones: [
            {
              id: 'ug_m7',
              title: `Internship Recruitment Sprint: System Design & Algorithmic Rounds`,
              description: `Complete 50+ mock interview rounds covering system design, live coding, and technical domain architecture for Tier-1 employers.`,
              skills: ['System Design', 'Behavioral Interviewing', 'Live Coding Sprints'],
              resources: 'Grokking the System Design Interview / Pramp Mock Rounds',
              duration: '12 Weeks'
            },
            {
              id: 'ug_m8',
              title: `Execute Summer Internship / Research Fellowship in ${career.domain}`,
              description: `Deliver measurable business or research outcomes during a 10-week summer tenure, positioning for a Pre-Placement Offer (PPO).`,
              skills: ['Production Deployment', 'Cross-Functional Engineering', 'Agile Delivery'],
              resources: 'Company Onboarding Dossier & Mentor Review Framework',
              duration: '10 Weeks'
            },
            {
              id: 'ug_m9',
              title: `Publish Technical Research Paper or Open-Source Benchmark`,
              description: `Author a conference paper (IEEE / ACM) or publish an open-source technical benchmark repository with 100+ stars on GitHub.`,
              skills: ['Research Methodology', 'LaTeX Composition', 'Empirical Benchmarking'],
              resources: domainIntel.recommendedVenues[0] || 'IEEE Xplore',
              duration: '12 Weeks'
            }
          ]
        },
        {
          phaseNumber: 4,
          timeWindow: 'YEAR 4 / SEMESTER 7–8 (CAPSTONE DEFENSE & SENIOR PLACEMENT SPRINT)',
          focus: `ENTERPRISE CAPSTONE DEFENSE & CAREER LAUNCH AT ₹${career.salaryRange}`,
          difficulty: 'Placement / Capstone',
          summary: `Defend senior design project, negotiate optimal compensation package, and secure merit fellowship funding.`,
          milestones: [
            {
              id: 'ug_m10',
              title: `Grand Capstone Defense: ${domainIntel.capstones[0]?.title || 'Enterprise Solution'}`,
              description: domainIntel.capstones[0]?.description || `Full production deployment simulating enterprise constraints.`,
              skills: skills,
              resources: domainIntel.capstones[0]?.architecture || 'System Specification',
              duration: '16 Weeks'
            },
            {
              id: 'ug_m11',
              title: `Campus / Off-Campus Placement Defense: Target ${career.salaryRange}`,
              description: `Participate in premier recruitment drives across ${career.topLocations.slice(0, 3).join(', ')}, leveraging portfolio proofs of work.`,
              skills: ['Compensation Negotiation', 'Architecture Defense'],
              resources: 'Offer Letter Evaluation & Placement Cell Dossier',
              duration: '8 Weeks'
            },
            {
              id: 'ug_m12',
              title: `Fellowship / Post-Degree Funding: ${scholarships.slice(0, 2).join(' & ')}`,
              description: `Apply for graduate research fellowships or employer educational sponsorship to fund advanced technical degrees without personal debt.`,
              skills: ['Proposal Writing', 'Grant Defense'],
              resources: 'Council of Scientific & Industrial Research / Corporate Grants',
              duration: '6 Weeks'
            }
          ]
        }
      ];
    }

    if (activeStage === 'pg') {
      return [
        {
          phaseNumber: 1,
          timeWindow: 'SEMESTER 1 (ADVANCED THEORETICAL RIGOR & THESIS DEFINITION)',
          focus: `RESEARCH METHODOLOGY & ADVANCED MATHEMATICAL MODELS IN ${career.domain.toUpperCase()}`,
          difficulty: 'Foundational',
          summary: `Establish research problem statement, complete literature reviews, and master advanced doctoral-level theories.`,
          milestones: [
            {
              id: 'pg_m1',
              title: `Comprehensive Literature Survey across 50+ Recent Papers`,
              description: `Synthesize current state-of-the-art limitations in ${career.domain} from top venues (${domainIntel.recommendedVenues.slice(0, 2).join(', ')}).`,
              skills: ['Literature Synthesis', 'Critical Evaluation', 'LaTeX'],
              resources: domainIntel.recommendedVenues[0] || 'Academic Library',
              duration: '14 Weeks'
            },
            {
              id: 'pg_m2',
              title: `Advanced Mathematical Foundations & Statistical Modeling`,
              description: `Master measure-theoretic probability, convex optimization, or quantum field mathematics underpinning ${career.title}.`,
              skills: ['Convex Optimization', 'Stochastic Modeling', 'Matrix Calculus'],
              resources: 'Graduate Course Textbooks & Proof-Oriented Problem Sets',
              duration: '14 Weeks'
            },
            {
              id: 'pg_m3',
              title: `Thesis Proposal Defense before Departmental Advisory Committee`,
              description: `Present formal research proposal outlining novel architectural hypotheses, baseline methodologies, and timeline.`,
              skills: ['Formal Defense', 'Research Ethics', 'Hypothesis Testing'],
              resources: 'University Graduate Committee Guidelines',
              duration: '4 Weeks'
            }
          ]
        },
        {
          phaseNumber: 2,
          timeWindow: 'SEMESTER 2 (LABORATORY PROTOTYPE & SPONSORED FELLOWSHIPS)',
          focus: `EMPIRICAL BENCHMARKING & NOVEL ARCHITECTURE IMPLEMENTATION`,
          difficulty: 'Intermediate',
          summary: `Implement research proof-of-concept, secure research assistantship stipend, and submit early draft to workshops.`,
          milestones: [
            {
              id: 'pg_m4',
              title: `Design Novel Architectural Prototype using ${tools.slice(0, 3).join(', ')}`,
              description: `Build reproducible experimental codebase outperforming current baseline implementations by at least 15% on standardized datasets.`,
              skills: skills.slice(0, 3),
              resources: 'High-Performance GPU / Compute Cluster Facilities',
              duration: '16 Weeks'
            },
            {
              id: 'pg_m5',
              title: `Submit Paper to Tier-1 Workshop or Peer-Reviewed Journal`,
              description: `Draft and submit experimental results adhering strictly to IEEE / ACM double-blind review criteria.`,
              skills: ['Empirical Reporting', 'Statistical Significance Testing'],
              resources: domainIntel.recommendedVenues[0] || 'IEEE Transactions',
              duration: '8 Weeks'
            },
            {
              id: 'pg_m6',
              title: `Activate Research Grant / Scholarship: ${scholarships[0] || 'Fellowship'}`,
              description: `Ensure full monthly stipend coverage through institutional assistantships or ${scholarships[0] || 'National Research Fellowships'}.`,
              skills: ['Grant Compliance', 'Milestone Reporting'],
              resources: 'Institutional Research & Development Office',
              duration: '4 Weeks'
            }
          ]
        },
        {
          phaseNumber: 3,
          timeWindow: 'SEMESTER 3 (INDUSTRIAL R&D INTERNSHIP & GLOBAL LAB COLLABORATION)',
          focus: `CORPORATE RESEARCH FELLOWSHIP IN ${career.topLocations[0]?.toUpperCase() || 'RESEARCH LAB'}`,
          difficulty: 'High-Stakes Validation',
          summary: `Collaborate directly with global industrial research labs (Google Research, Microsoft Research, Bell Labs, etc.).`,
          milestones: [
            {
              id: 'pg_m7',
              title: `Industrial Research Scientist Internship (12–16 Weeks)`,
              description: `Tackle production-scale applied challenges inside corporate research teams, filing invention disclosures where applicable.`,
              skills: ['Production-Scale R&D', 'Patent Formulation', 'Cross-Team Collaboration'],
              resources: 'Corporate Research Fellowship Program Guidelines',
              duration: '14 Weeks'
            },
            {
              id: 'pg_m8',
              title: `File Provisional Patent or Open Source Landmark Library`,
              description: `Protect intellectual property or release benchmark library under permissive Apache 2.0 / MIT licensing.`,
              skills: ['IP Claims Drafting', 'Open Source Stewardship'],
              resources: 'University Technology Transfer Office',
              duration: '8 Weeks'
            },
            {
              id: 'pg_m9',
              title: `International Conference Presentation`,
              description: `Deliver oral or poster presentation of accepted paper at premier international gathering.`,
              skills: ['Keynote Delivery', 'Scientific Networking'],
              resources: 'Conference Travel Grants & Faculty Sponsorship',
              duration: '2 Weeks'
            }
          ]
        },
        {
          phaseNumber: 4,
          timeWindow: 'SEMESTER 4 (MASTER’S THESIS DEFENSE & SENIOR R&D PLACEMENT)',
          focus: `FINAL DISSERTATION DEFENSE & CAREER PLACEMENT AT ₹${career.salaryRange}`,
          difficulty: 'Placement / Capstone',
          summary: `Complete oral defense of thesis, graduate with honors, and transition into senior R&D Scientist or Staff Engineer roles.`,
          milestones: [
            {
              id: 'pg_m10',
              title: `Final Thesis Manuscript Submission & External Peer Review`,
              description: `Complete comprehensive 100+ page dissertation incorporating external reviewer revisions.`,
              skills: ['Scientific Writing', 'Document Assembly'],
              resources: 'Graduate School Dissertation Archive',
              duration: '10 Weeks'
            },
            {
              id: 'pg_m11',
              title: `Oral Defense before Faculty & External Examiners`,
              description: `Successfully defend algorithmic contributions, theoretical guarantees, and empirical benchmarks.`,
              skills: ['Oral Defense', 'Q&A Resilience'],
              resources: 'Departmental Colloquium Defense Room',
              duration: '3 Weeks'
            },
            {
              id: 'pg_m12',
              title: `Transition into Senior R&D / Lead Engineering Role`,
              description: `Accept competitive offer from leading tech / deep-tech enterprise with premium compensation (${career.salaryRange}).`,
              skills: ['Contract Negotiation', 'Relocation Logistics'],
              resources: 'Alumni Network & Corporate Placement Cells',
              duration: '4 Weeks'
            }
          ]
        }
      ];
    }

    // Professional stage (Lateral Transition & Upskilling)
    return [
      {
        phaseNumber: 1,
        timeWindow: 'QUARTER 1 / MONTHS 1–3 (SKILL GAP AUDIT & PARALLEL FOUNDATIONAL PIVOT)',
        focus: `DIAGNOSTIC AUDIT & CORE RE-TOOLING IN ${skills[0]?.toUpperCase() || 'CORE DOMAIN'}`,
        difficulty: 'Foundational',
        summary: `Execute focused after-hours upskilling (12–15 hours/week) bridging critical deficits between your current field and ${career.title}.`,
        milestones: [
          {
            id: 'pro_m1',
            title: `Zero-In on Highest-Yield Skill Gap: ${gaps[0] || skills[0]}`,
            description: `Complete intensive curriculum addressing ${gaps[0] || skills[0]}, benchmarking skills against senior industry standards.`,
            skills: [gaps[0] || skills[0], tools[0] || 'Core Stack'],
            resources: 'Targeted Executive Masterclasses & Code Review Bootcamps',
            duration: '8 Weeks'
          },
          {
            id: 'pro_m2',
            title: `Tooling & Cloud Environment Modernization: ${tools.slice(0, 3).join(', ')}`,
            description: `Configure enterprise workstation with modern dev environments, automated CI/CD runners, and cloud infrastructure.`,
            skills: ['Modern Toolchains', 'Cloud Infrastructure'],
            resources: 'Official Cloud Provider Architect Training Tracks',
            duration: '4 Weeks'
          },
          {
            id: 'pro_m3',
            title: `Earn Gold-Standard Credential: ${domainIntel.certifications[0]?.name || 'Professional Certification'}`,
            description: `Obtain verified industry credential from ${domainIntel.certifications[0]?.issuer || 'Industry Body'} to validate lateral capability to hiring managers.`,
            skills: ['Standardized Proficiency', 'Architecture Best Practices'],
            resources: 'Official Certification Exam Sandbox',
            duration: '6 Weeks'
          }
        ]
      },
      {
        phaseNumber: 2,
        timeWindow: 'QUARTER 2 / MONTHS 4–6 (PRODUCTION-GRADE PROOF-OF-CONCEPT & REPO)',
        focus: `BUILD ENTERPRISE BENCHMARK CAPSTONE: ${domainIntel.capstones[0]?.title || 'CAPSTONE'}`,
        difficulty: 'Intermediate',
        summary: `Create public verifiable proof of competence solving realistic enterprise scale problems in ${career.domain}.`,
        milestones: [
          {
            id: 'pro_m4',
            title: domainIntel.capstones[0]?.title || 'Enterprise Capstone',
            description: domainIntel.capstones[0]?.description || `Build scalable production-grade application or architecture.`,
            skills: skills.slice(0, 3),
            resources: domainIntel.capstones[0]?.architecture || 'System Blueprint',
            duration: '10 Weeks'
          },
          {
            id: 'pro_m5',
            title: `Publish In-Depth Technical Architecture Breakdown on LinkedIn / Substack`,
            description: `Author a high-signal 2,500-word engineering breakdown detailing architectural trade-offs, benchmarks, and learnings.`,
            skills: ['Technical Thought Leadership', 'System Exposition'],
            resources: 'Substack / Medium / Engineering Blogs',
            duration: '3 Weeks'
          },
          {
            id: 'pro_m6',
            title: `Open Source Contributions to Upstream Domain Repositories`,
            description: `Submit 3 merged pull requests to widely-used open source tools in the ${career.domain} ecosystem.`,
            skills: ['Upstream Code Reviews', 'Distributed Collaboration'],
            resources: 'GitHub Topic Exploration Hub',
            duration: '6 Weeks'
          }
        ]
      },
      {
        phaseNumber: 3,
        timeWindow: 'QUARTER 3 / MONTHS 7–9 (TARGETED RECRUITER PIPELINE & PORTFOLIO DEFENSE)',
        focus: `EXECUTIVE HEADHUNTER OUTREACH ACROSS ${career.topLocations.slice(0, 2).join(' & ').toUpperCase()}`,
        difficulty: 'High-Stakes Validation',
        summary: `Bypass automated Applicant Tracking Systems (ATS) through direct engineering leadership networking and technical defense.`,
        milestones: [
          {
            id: 'pro_m7',
            title: `Refactor Resume & LinkedIn to Highlight Transferable Impact in ${career.domain}`,
            description: `Quantify past professional engineering achievements mapped directly to the problems solved by a ${career.title}.`,
            skills: ['Resume Positioning', 'Executive Pitching'],
            resources: 'Executive Career Transition Playbooks',
            duration: '3 Weeks'
          },
          {
            id: 'pro_m8',
            title: `Targeted Outreach to 40 Engineering Directors & Founders`,
            description: `Conduct warm informational interviews and share your capstone architecture directly with hiring managers in ${career.topLocations[0]}.`,
            skills: ['Executive Networking', 'Portfolio Pitching'],
            resources: 'LinkedIn Recruiter & Specialized Tech Communities',
            duration: '8 Weeks'
          },
          {
            id: 'pro_m9',
            title: `System Architecture & Domain Whiteboard Interview Mastery`,
            description: `Practice 20 mock system design rounds tailored to senior ${career.title} roles (scalability, failure recovery, trade-offs).`,
            skills: ['System Design Under Pressure', 'Live Architectural Defense'],
            resources: 'Interviewing.io / Senior Peer Circles',
            duration: '6 Weeks'
          }
        ]
      },
      {
        phaseNumber: 4,
        timeWindow: 'QUARTER 4 / MONTHS 10–12 (TRANSITION SPRINT & COMPENSATION ARBITRAGE)',
        focus: `SECURE TARGET ROLE AT ₹${career.salaryRange} & 90-DAY IMPACT PLAN`,
        difficulty: 'Placement / Capstone',
        summary: `Evaluate multiple competing offers, negotiate lateral equity/sign-on bonuses, and construct your 90-day onboarding strategy.`,
        milestones: [
          {
            id: 'pro_m10',
            title: `Manage Multi-Offer Pipeline with Competitive Compensation Leverage`,
            description: `Leverage competing offers across hubs to negotiate maximum CTC within the ${career.salaryRange} bracket.`,
            skills: ['Compensation Negotiation', 'Equity & Bonus Structuring'],
            resources: 'Levels.fyi / AmbitionBox Benchmarking Guides',
            duration: '6 Weeks'
          },
          {
            id: 'pro_m11',
            title: `Formulate 30-60-90 Day Impact Blueprint for New Role`,
            description: `Establish clear onboarding milestones to demonstrate high-value engineering impact within your first business quarter.`,
            skills: ['Strategic Execution', 'Stakeholder Management'],
            resources: 'First 90 Days Framework (Michael Watkins)',
            duration: '3 Weeks'
          },
          {
            id: 'pro_m12',
            title: `Maintain Ongoing Continuing Education & Peer Mentorship`,
            description: `Join exclusive specialist groups and begin mentoring junior entrants into ${career.domain} to solidify industry standing.`,
            skills: ['Mentorship', 'Continuous Upskilling'],
            resources: 'ACM / IEEE Senior Membership Track',
            duration: 'Ongoing'
          }
        ]
      }
    ];
  }, [career, activeStage, domainIntel]);

  // Total milestones count & completed calculation
  const allMilestoneIds = useMemo(() => {
    return dynamicPhases.flatMap(p => p.milestones.map(m => m.id));
  }, [dynamicPhases]);

  const completedCount = useMemo(() => {
    return allMilestoneIds.filter(id => !!completedMilestones[id]).length;
  }, [allMilestoneIds, completedMilestones]);

  const progressPercent = allMilestoneIds.length > 0
    ? Math.round((completedCount / allMilestoneIds.length) * 100)
    : 0;

  // Life stage info helper
  const stageLabels: Record<LifeStage, { label: string; desc: string; horizon: string }> = {
    class10: { label: 'Class 10', desc: 'Stream selection & foundational math/science', horizon: '48 Months' },
    class12: { label: 'Class 12', desc: 'Entrance exam sprint & degree admission', horizon: '24 Months' },
    ug: { label: 'Undergraduate', desc: 'Semester-by-semester specialization & internship', horizon: '48 Months' },
    pg: { label: 'Postgraduate', desc: 'Research specialization, thesis & R&D fellowships', horizon: '24 Months' },
    professional: { label: 'Professional', desc: 'Quarterly lateral pivot & executive upskilling', horizon: '12 Months' }
  };

  // Student profile budget info
  const userBudget = sessionProgress?.studentProfile?.budgetAnnualLakhs ?? 12;
  const userName = sessionProgress?.studentProfile?.name || 'Aspiring Specialist';

  return (
    <div style={{ maxWidth: '1240px', margin: '32px auto', padding: '0 24px', color: 'var(--text-primary)' }}>
      {/* ----------------- Top Navigation & Actions Bar ----------------- */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-hairline)'
        }}
        className="roadmap-nav-bar"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="btn-alignx-ghost"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '0.74rem',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={14} />
              <span>← BACK TO 5D HUB</span>
            </button>
          )}

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            / EXECUTION ROADMAP
          </span>
        </div>

        {/* Companion Module Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {onBackToTwin && (
            <button
              onClick={onBackToTwin}
              className="btn-alignx-ghost"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.72rem',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              <Compass size={14} color="var(--accent)" />
              <span>CAREER TWIN</span>
            </button>
          )}

          {onOpenWhatIf && (
            <button
              onClick={onOpenWhatIf}
              className="btn-alignx-ghost"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.72rem',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              <Sliders size={14} color="var(--accent)" />
              <span>WHAT-IF LAB</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="btn-alignx-ghost"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              fontSize: '0.72rem',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)'
            }}
            title="Print or save as PDF"
          >
            <Printer size={14} />
            <span>EXPORT BLUEPRINT</span>
          </button>
        </div>
      </div>

      {/* ----------------- Header & Career Quick-Switcher ----------------- */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <Calendar size={18} color="var(--accent)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--accent)', fontWeight: 600 }}>
                PHASE 10 / STRATEGIC EXECUTION BLUEPRINT
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '0px',
                  backgroundColor: 'rgba(45, 90, 67, 0.08)',
                  color: 'var(--accent)',
                  fontSize: '0.66rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  border: '1px solid rgba(45, 90, 67, 0.25)'
                }}
              >
                ● 100% DETERMINISTIC ALIGNX ENGINE
              </span>
              {isLoadingBackend ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '0px',
                    backgroundColor: 'rgba(245, 166, 35, 0.12)',
                    color: '#c05621',
                    fontSize: '0.66rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    border: '1px solid rgba(245, 166, 35, 0.25)'
                  }}
                >
                  ● SYNCHRONIZING...
                </span>
              ) : roadmapBackendData ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '0px',
                    backgroundColor: 'rgba(52, 199, 89, 0.12)',
                    color: '#28cd41',
                    fontSize: '0.66rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    border: '1px solid rgba(52, 199, 89, 0.25)'
                  }}
                >
                  ● AI SYNCHRONIZED
                </span>
              ) : null}
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                margin: '6px 0 10px',
                lineHeight: 1.15
              }}
            >
              EXECUTION BLUEPRINT: {career.title.toUpperCase()}
            </h1>

            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '820px', lineHeight: 1.55 }}>
              {career.tagline || 'Comprehensive multi-phase roadmap mapping skill-gap remediation, entrance tests, degree credentials, and high-value scholarships.'}
            </p>
          </div>

          {/* Quick Career Switcher */}
          <div
            style={{
              border: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-surface)',
              padding: '16px 20px',
              minWidth: '280px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '8px' }}>
              SWITCH TARGET CAREER
            </div>
            <select
              value={career.id}
              onChange={(e) => {
                const targetId = e.target.value;
                if (onSelectCareer) {
                  onSelectCareer(targetId);
                } else {
                  const found = ALL_AUTHENTIC_CAREERS.find(c => c.id === targetId) || INITIAL_CAREERS.find(c => c.id === targetId);
                  if (found) setCareer(found);
                }
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: 'var(--bg-deep)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                borderRadius: '0px'
              }}
            >
              {ALL_AUTHENTIC_CAREERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.scores.overallScore}% Fit)
                </option>
              ))}
            </select>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              <span>Domain: {career.domain.split('&')[0]}</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{career.scores.overallScore}% Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- User Life-Stage Selector & Progress Bar ----------------- */}
      <div
        style={{
          border: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-surface)',
          padding: '24px 28px',
          marginBottom: '32px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.14em', fontWeight: 600 }}>
              TAILORED FOR: {userName.toUpperCase()} • STAGE ADAPTIVE PIPELINE
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, marginTop: '2px' }}>
              Select Your Current Life Stage to Recalibrate Roadmap
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {completedCount} of {allMilestoneIds.length} MILESTONES DONE ({progressPercent}%)
            </span>
            {completedCount > 0 && (
              <button
                onClick={resetProgress}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
                title="Reset completed milestones"
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Life Stage Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          {(['class10', 'class12', 'ug', 'pg', 'professional'] as LifeStage[]).map((stg) => {
            const isSelected = activeStage === stg;
            const meta = stageLabels[stg];
            return (
              <button
                key={stg}
                onClick={() => setActiveStage(stg)}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-hairline)',
                  backgroundColor: isSelected ? 'rgba(45, 90, 67, 0.05)' : 'var(--bg-deep)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  borderRadius: '0px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.92rem', color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {meta.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: isSelected ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {meta.horizon}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  {meta.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Milestone Progress Bar */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', marginBottom: '6px', color: 'var(--text-secondary)' }}>
            <span>ROADMAP COMPLETION PROGRESS</span>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{progressPercent}% COMPLETE</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-hairline)', position: 'relative' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: 'var(--accent)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* ----------------- Degree & Key Metrics Ribbon ----------------- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        {/* Education Degree Card */}
        <div style={{ border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <GraduationCap size={16} color="var(--accent)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
              PRIMARY DEGREE PATHWAY
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>
            {career.educationPath}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Validated against all Tier-1 campus hiring registries and research fellowship gates.
          </div>
        </div>

        {/* Financial & ROI Feasibility Card */}
        <div style={{ border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <DollarSign size={16} color="var(--accent)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
              FINANCIAL FEASIBILITY
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>
            Annual Budget: ₹{userBudget}L / yr
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Target Starting Compensation: <strong style={{ color: 'var(--accent)' }}>{career.salaryRange}</strong>. High ROI profile.
          </div>
        </div>

        {/* Primary Entrance Gate Card */}
        <div style={{ border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <BookOpen size={16} color="var(--accent)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
              KEY GATEWAY EXAMS
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>
            {career.entranceExams.slice(0, 2).join(' • ')}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Pre-requisites for premier institutional cohorts and subsidized fee tiers.
          </div>
        </div>

        {/* Top Scholarship Offset Card */}
        <div style={{ border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Award size={16} color="var(--accent)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
              TARGET SCHOLARSHIP
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>
            {career.scholarships[0] || 'Central Sector Scheme'}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Offsets 50%–100% of educational tuition and research expenses upon qualification.
          </div>
        </div>
      </div>

      {/* ----------------- Navigation Tabs (Timeline, Tech Stack, Exams) ----------------- */}
      <div style={{ display: 'flex', gap: '0px', borderBottom: '1px solid var(--border-hairline)', marginBottom: '32px' }}>
        <button
          onClick={() => setActiveTab('timeline')}
          style={{
            padding: '12px 24px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            letterSpacing: '0.1em',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'timeline' ? 'var(--bg-surface)' : 'transparent',
            border: '1px solid',
            borderColor: activeTab === 'timeline' ? 'var(--border-hairline) var(--border-hairline) transparent' : 'transparent',
            borderBottom: activeTab === 'timeline' ? '2px solid var(--accent)' : 'none',
            color: activeTab === 'timeline' ? 'var(--accent)' : 'var(--text-secondary)',
            marginBottom: '-1px'
          }}
        >
          1. EXECUTION TIMELINE ({stageLabels[activeStage].label})
        </button>

        <button
          onClick={() => setActiveTab('stack')}
          style={{
            padding: '12px 24px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            letterSpacing: '0.1em',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'stack' ? 'var(--bg-surface)' : 'transparent',
            border: '1px solid',
            borderColor: activeTab === 'stack' ? 'var(--border-hairline) var(--border-hairline) transparent' : 'transparent',
            borderBottom: activeTab === 'stack' ? '2px solid var(--accent)' : 'none',
            color: activeTab === 'stack' ? 'var(--accent)' : 'var(--text-secondary)',
            marginBottom: '-1px'
          }}
        >
          2. TECH STACK & CAPSTONES
        </button>

        <button
          onClick={() => setActiveTab('exams')}
          style={{
            padding: '12px 24px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            letterSpacing: '0.1em',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'exams' ? 'var(--bg-surface)' : 'transparent',
            border: '1px solid',
            borderColor: activeTab === 'exams' ? 'var(--border-hairline) var(--border-hairline) transparent' : 'transparent',
            borderBottom: activeTab === 'exams' ? '2px solid var(--accent)' : 'none',
            color: activeTab === 'exams' ? 'var(--accent)' : 'var(--text-secondary)',
            marginBottom: '-1px'
          }}
        >
          3. GATEWAY EXAMS & FUNDING
        </button>
      </div>

      {/* ----------------- TAB 1: PHROW-BY-PHASE TIMELINE ----------------- */}
      {activeTab === 'timeline' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-secondary)', letterSpacing: '0.12em' }}>
              PHASED ROADMAP FOR {career.title.toUpperCase()} • STAGE: {stageLabels[activeStage].label.toUpperCase()}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              CLICK CHECKBOXES TO RECORD PROGRESS
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {dynamicPhases.map((phase) => {
              const phaseMilestoneIds = phase.milestones.map(m => m.id);
              const phaseDoneCount = phaseMilestoneIds.filter(id => !!completedMilestones[id]).length;
              const isPhaseComplete = phaseDoneCount === phaseMilestoneIds.length && phaseMilestoneIds.length > 0;

              return (
                <div
                  key={phase.phaseNumber}
                  style={{
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: 'var(--bg-surface)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  {/* Phase Header */}
                  <div
                    style={{
                      padding: '20px 28px',
                      backgroundColor: 'var(--bg-deep)',
                      borderBottom: '1px solid var(--border-hairline)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.12em' }}>
                          PHASE {phase.phaseNumber}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          • {phase.timeWindow}
                        </span>
                        <span
                          style={{
                            padding: '1px 8px',
                            fontSize: '0.64rem',
                            fontFamily: 'var(--font-mono)',
                            backgroundColor:
                              phase.difficulty === 'Foundational' ? 'rgba(74, 144, 226, 0.1)' :
                              phase.difficulty === 'Intermediate' ? 'rgba(245, 166, 35, 0.1)' :
                              phase.difficulty === 'High-Stakes Validation' ? 'rgba(235, 87, 87, 0.1)' :
                              'rgba(45, 90, 67, 0.1)',
                            color:
                              phase.difficulty === 'Foundational' ? '#2B6CB0' :
                              phase.difficulty === 'Intermediate' ? '#C05621' :
                              phase.difficulty === 'High-Stakes Validation' ? '#C53030' :
                              'var(--accent)',
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          {phase.difficulty.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600 }}>
                        {phase.focus}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: isPhaseComplete ? '#28cd41' : 'var(--text-muted)', fontWeight: 600 }}>
                        {isPhaseComplete ? '✓ PHASE COMPLETE' : `${phaseDoneCount} / ${phaseMilestoneIds.length} COMPLETED`}
                      </span>
                    </div>
                  </div>

                  {/* Phase Summary */}
                  <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}>
                    {phase.summary}
                  </div>

                  {/* Milestones List */}
                  <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {phase.milestones.map((m, idx) => {
                      const isDone = !!completedMilestones[m.id];
                      return (
                        <div
                          key={m.id}
                          onClick={() => toggleMilestone(m.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '14px',
                            padding: '16px 20px',
                            border: '1px solid',
                            borderColor: isDone ? 'rgba(45, 90, 67, 0.3)' : 'var(--border-subtle)',
                            backgroundColor: isDone ? 'rgba(45, 90, 67, 0.03)' : 'var(--bg-deep)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMilestone(m.id);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              color: isDone ? 'var(--accent)' : 'var(--text-muted)',
                              marginTop: '2px'
                            }}
                          >
                            {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
                          </button>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                              <span
                                style={{
                                  fontFamily: 'var(--font-display)',
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                  color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)',
                                  textDecoration: isDone ? 'line-through' : 'none'
                                }}
                              >
                                {idx + 1}. {m.title}
                              </span>
                              <span
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.68rem',
                                  color: 'var(--text-muted)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Clock size={11} />
                                {m.duration}
                              </span>
                            </div>

                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '4px 0 10px' }}>
                              {m.description}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {m.skills.map((sk, sIdx) => (
                                  <span
                                    key={sIdx}
                                    style={{
                                      fontFamily: 'var(--font-mono)',
                                      fontSize: '0.65rem',
                                      padding: '2px 8px',
                                      backgroundColor: 'var(--bg-surface)',
                                      border: '1px solid var(--border-hairline)',
                                      color: 'var(--text-secondary)'
                                    }}
                                  >
                                    {sk}
                                  </span>
                                ))}
                              </div>

                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                Resource: {m.resources}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: TECH STACK & CAPSTONES ----------------- */}
      {activeTab === 'stack' && (
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-secondary)', letterSpacing: '0.12em', marginBottom: '20px' }}>
            AUTHENTIC DOMAIN ARSENAL & GRADUATION CAPSTONE SPECIFICATIONS
          </div>

          {/* Tools & Frameworks Grid */}
          <div style={{ border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', padding: '28px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Code size={18} color="var(--accent)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
                PRIMARY INDUSTRY TOOLS & ECOSYSTEM FRAMEWORKS
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {domainIntel.tools.map((tool, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px 16px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-deep)'
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', marginBottom: '4px' }}>
                    TOOL #{idx + 1}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600 }}>
                    {tool}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Certifications */}
          <div style={{ border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', padding: '28px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <ShieldCheck size={18} color="var(--accent)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
                RECOMMENDED PROFESSIONAL CERTIFICATIONS & ACCREDITATIONS
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {domainIntel.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '18px 20px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-deep)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {cert.issuer}
                    </span>
                    <span
                      style={{
                        padding: '1px 6px',
                        fontSize: '0.62rem',
                        fontFamily: 'var(--font-mono)',
                        backgroundColor: 'rgba(45, 90, 67, 0.08)',
                        color: 'var(--accent)',
                        border: '1px solid rgba(45, 90, 67, 0.2)'
                      }}
                    >
                      {cert.level}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>
                    {cert.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Accredited industry verification demonstrating competency to campus and lateral recruiters.
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Production-Grade Capstones */}
          <div style={{ border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Layers size={18} color="var(--accent)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
                INDUSTRY BENCHMARK CAPSTONE SPECIFICATIONS
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {domainIntel.capstones.map((cap, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-deep)',
                    padding: '22px 24px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.1em', fontWeight: 600 }}>
                      CAPSTONE PROJECT SPECIFICATION #{idx + 1}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      PRODUCTION PORTFOLIO ARTIFACT
                    </span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>
                    {cap.title}
                  </div>

                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '14px' }}>
                    {cap.description}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '12px', marginTop: '12px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      ARCHITECTURE FLOW
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
                      {cap.architecture}
                    </div>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      VERIFIABLE DELIVERABLES & OUTCOMES
                    </div>
                    <ul style={{ paddingLeft: '18px', margin: 0, fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {cap.outcomes.map((oc, oIdx) => (
                        <li key={oIdx}>{oc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 3: GATEWAY EXAMS & FUNDING ----------------- */}
      {activeTab === 'exams' && (
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-secondary)', letterSpacing: '0.12em', marginBottom: '20px' }}>
            COMPETITIVE ENTRANCE MATRIX & HIGH-VALUE SCHOLARSHIP OPPORTUNITIES
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }} className="roadmap-support-grid">
            {/* Entrance Exams */}
            <div style={{ border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <BookOpen size={18} color="var(--accent)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
                  GATEWAY EXAMINATIONS
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {career.entranceExams.map((exam, i) => (
                  <div key={i} style={{ border: '1px solid var(--border-subtle)', padding: '16px 20px', backgroundColor: 'var(--bg-deep)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)' }}>
                        GATE #{i + 1}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        TIER-1 CUTOFF ELIGIBLE
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600 }}>
                      {exam}
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.45 }}>
                      Required gateway for admissions into premier universities offering {career.educationPath}. Focus on speed and negative-marking accuracy.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scholarships */}
            <div style={{ border: '1px solid var(--border-hairline)', backgroundColor: 'var(--bg-surface)', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Award size={18} color="var(--accent)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.12em' }}>
                  MERIT SCHOLARSHIPS & RESEARCH GRANTS
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {career.scholarships.map((sch, i) => (
                  <div key={i} style={{ border: '1px solid var(--border-subtle)', padding: '16px 20px', backgroundColor: 'var(--bg-deep)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#28cd41' }}>
                        FUNDING STREAM #{i + 1}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 600 }}>
                        OFFSETS 50%–100%
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600 }}>
                      {sch}
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.45 }}>
                      Competitive financial grant awarded on composite merit. Designed to offset tuition, hostelry, and lab research stipends.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- Footer Action Bar ----------------- */}
      <div
        style={{
          borderTop: '1px solid var(--border-hairline)',
          paddingTop: '28px',
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          ALIGNX ROADMAP ID: {career.id.toUpperCase()}-{activeStage.toUpperCase()} • DETERMINISTIC EXECUTION
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="btn-alignx-ghost"
              style={{ padding: '10px 18px', fontSize: '0.74rem' }}
            >
              ← RETURN TO 5D HUB
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="btn-alignx-primary"
            style={{ padding: '10px 22px', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Printer size={14} />
            <span>EXPORT ROADMAP BLUEPRINT</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .roadmap-support-grid {
            grid-template-columns: 1fr !important;
          }
          .roadmap-nav-bar {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .roadmap-nav-bar, button, select {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
